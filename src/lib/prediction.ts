// ---------------------------------------------------------------------------
// Match prediction model
// Two layers, deliberately kept as pure, commented functions:
//   1. Elo  -> expected match result (classic chess/football rating math)
//   2. Poisson goals model -> a full W/D/L probability distribution + scoreline
// Squad stats feed the attack/defence strengths that drive the goal rates.
// ---------------------------------------------------------------------------

import { PLAYERS, PLAYERS_BY_ID, TEAMS_BY_ID, type Player, type Team } from "../data/players";

/** Elo expected score for A vs B (probability-of-points, 0..1). */
export function eloExpected(eloA: number, eloB: number): number {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

function squad(teamId: string): Player[] {
  return PLAYERS.filter((p) => p.teamId === teamId);
}

/** Attack strength ~1.0 == league-average, derived from the outfield squad. */
export function attackStrength(teamId: string): number {
  const outfield = squad(teamId).filter((p) => p.position !== "GK");
  const avg =
    outfield.reduce(
      (s, p) => s + (p.stats.shooting * 0.5 + p.stats.dribbling * 0.3 + p.stats.pace * 0.2),
      0,
    ) / outfield.length;
  return avg / 78; // 78 ≈ league mean → ratio around 1
}

/** Defence strength ~1.0 == league-average (higher = harder to score against). */
export function defenceStrength(teamId: string): number {
  const s = squad(teamId);
  const gk = s.find((p) => p.position === "GK");
  const def = s.filter((p) => p.position === "DEF");
  const gkScore = gk ? gk.stats.boopAccuracy * 0.7 + gk.stats.goodBoy * 0.3 : 75;
  const lineScore =
    def.reduce((a, p) => a + (p.stats.stamina * 0.5 + p.stats.goodBoy * 0.3 + p.stats.pace * 0.2), 0) /
    Math.max(def.length, 1);
  return (gkScore * 0.5 + lineScore * 0.5) / 78;
}

const BASE_GOALS = 1.35; // league-average goals per team per match
const HOME_BOOST = 1.12;

/** Expected goals (Poisson rate λ) for each side, blending strengths + Elo. */
export function expectedGoals(homeId: string, awayId: string): { home: number; away: number } {
  const home = TEAMS_BY_ID[homeId];
  const away = TEAMS_BY_ID[awayId];
  // Elo nudges the goal rate multiplicatively (soft, ^0.5 dampened).
  const eloFactor = Math.pow(10, (home.elo - away.elo) / 800);
  const lambdaHome =
    BASE_GOALS * attackStrength(homeId) * (1 / defenceStrength(awayId)) * HOME_BOOST * eloFactor;
  const lambdaAway =
    BASE_GOALS * attackStrength(awayId) * (1 / defenceStrength(homeId)) * (1 / eloFactor);
  return { home: clamp(lambdaHome, 0.2, 4.5), away: clamp(lambdaAway, 0.2, 4.5) };
}

function clamp(x: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, x));
}

/** Poisson probability mass P(X = k) for rate λ. */
function poissonPmf(k: number, lambda: number): number {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}
function factorial(n: number): number {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

export interface Prediction {
  home: Team;
  away: Team;
  lambdaHome: number;
  lambdaAway: number;
  pHome: number;
  pDraw: number;
  pAway: number;
  scoreline: { home: number; away: number };
  keyPlayer: Player;
}

/**
 * Full prediction: builds the joint distribution over scorelines from two
 * independent Poisson goal counts, then aggregates into win/draw/loss and
 * reads off the single most-likely scoreline.
 */
export function predictMatch(homeId: string, awayId: string): Prediction {
  const { home: lambdaHome, away: lambdaAway } = expectedGoals(homeId, awayId);
  const MAX = 8;
  let pHome = 0;
  let pDraw = 0;
  let pAway = 0;
  let best = { home: 0, away: 0, p: -1 };

  for (let h = 0; h <= MAX; h++) {
    for (let a = 0; a <= MAX; a++) {
      const p = poissonPmf(h, lambdaHome) * poissonPmf(a, lambdaAway);
      if (h > a) pHome += p;
      else if (h === a) pDraw += p;
      else pAway += p;
      if (p > best.p) best = { home: h, away: a, p };
    }
  }
  const total = pHome + pDraw + pAway;

  return {
    home: TEAMS_BY_ID[homeId],
    away: TEAMS_BY_ID[awayId],
    lambdaHome,
    lambdaAway,
    pHome: pHome / total,
    pDraw: pDraw / total,
    pAway: pAway / total,
    scoreline: { home: best.home, away: best.away },
    keyPlayer: keyPlayer(homeId, awayId),
  };
}

/** Goal-threat score used to surface the match's likely key player. */
export function goalContribution(p: Player): number {
  if (p.position === "GK") return p.stats.boopAccuracy * 0.6 + p.stats.goodBoy * 0.4;
  return p.stats.shooting * 0.45 + p.stats.dribbling * 0.3 + p.stats.pace * 0.15 + p.stats.boopAccuracy * 0.1;
}

function keyPlayer(homeId: string, awayId: string): Player {
  const pool = PLAYERS.filter((p) => p.teamId === homeId || p.teamId === awayId);
  return pool.reduce((best, p) => (goalContribution(p) > goalContribution(best) ? p : best), pool[0]);
}

export { PLAYERS_BY_ID };
