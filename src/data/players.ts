// ---------------------------------------------------------------------------
// Corgi League — seed data
// A fictional 6-team league where every player is a corgi. Stats are synthetic
// but internally consistent (keepers don't shoot, forwards do) so the
// similarity graph and match predictor produce believable output.
// ---------------------------------------------------------------------------

export type Position = "GK" | "DEF" | "MID" | "FWD";

/** The 8-dimensional feature vector every player is embedded in. */
export interface Stats {
  pace: number;
  dribbling: number;
  passing: number;
  shooting: number;
  stamina: number;
  boopAccuracy: number; // finishing / shot-stopping precision
  tailWag: number; // flair
  goodBoy: number; // composure / intangibles
}

export interface Team {
  id: string;
  name: string;
  short: string;
  color: string;
  elo: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: Position;
  stats: Stats;
  overall: number;
}

/** Ordered stat keys — used everywhere we treat stats as a vector. */
export const STAT_KEYS: (keyof Stats)[] = [
  "pace",
  "dribbling",
  "passing",
  "shooting",
  "stamina",
  "boopAccuracy",
  "tailWag",
  "goodBoy",
];

export const STAT_LABELS: Record<keyof Stats, string> = {
  pace: "Pace",
  dribbling: "Dribbling",
  passing: "Passing",
  shooting: "Shooting",
  stamina: "Stamina",
  boopAccuracy: "Boop Accuracy",
  tailWag: "Tail Wag",
  goodBoy: "Good Boy",
};

export const TEAMS: Team[] = [
  { id: "bark", name: "Barkelona", short: "BAR", color: "#A50044", elo: 1885 },
  { id: "mutt", name: "Real Muttrid", short: "MUT", color: "#1E6FBA", elo: 1902 },
  { id: "corg", name: "Corgi-nthians", short: "COR", color: "#0E9F6E", elo: 1760 },
  { id: "fetch", name: "Fetch City", short: "FET", color: "#6CABDD", elo: 1848 },
  { id: "woof", name: "Wooferpool", short: "WOO", color: "#C8102E", elo: 1834 },
  { id: "pawis", name: "Pawis SG", short: "PAW", color: "#0B4C7C", elo: 1795 },
];

export const TEAMS_BY_ID: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.id, t]),
);

// Helper: build a player, deriving `overall` as a position-weighted mean.
function mk(
  id: string,
  name: string,
  teamId: string,
  position: Position,
  v: [number, number, number, number, number, number, number, number],
): Player {
  const stats: Stats = {
    pace: v[0],
    dribbling: v[1],
    passing: v[2],
    shooting: v[3],
    stamina: v[4],
    boopAccuracy: v[5],
    tailWag: v[6],
    goodBoy: v[7],
  };
  // Position-specific weighting so `overall` reflects what matters per role.
  const w: Record<Position, Partial<Record<keyof Stats, number>>> = {
    FWD: { shooting: 2, dribbling: 1.6, pace: 1.4, boopAccuracy: 1.4 },
    MID: { passing: 2, dribbling: 1.5, stamina: 1.4, tailWag: 1.2 },
    DEF: { stamina: 1.8, passing: 1.3, goodBoy: 1.4, pace: 1.2 },
    GK: { boopAccuracy: 2.4, goodBoy: 1.8, passing: 1.1 },
  };
  const weights = w[position];
  let num = 0;
  let den = 0;
  for (const k of STAT_KEYS) {
    const weight = weights[k] ?? 1;
    num += stats[k] * weight;
    den += weight;
  }
  return { id, name, teamId, position, stats, overall: Math.round(num / den) };
}

// v = [pace, dribbling, passing, shooting, stamina, boopAccuracy, tailWag, goodBoy]
export const PLAYERS: Player[] = [
  // Barkelona
  mk("bar1", "Leo Woofi", "bark", "FWD", [88, 96, 84, 92, 78, 93, 97, 90]),
  mk("bar2", "Pedri Pup", "bark", "MID", [80, 88, 92, 74, 88, 76, 90, 86]),
  mk("bar3", "Sergi Robarko", "bark", "DEF", [82, 70, 82, 55, 90, 62, 68, 84]),
  mk("bar4", "Ter Sniffen", "bark", "GK", [58, 55, 84, 40, 74, 90, 60, 88]),
  // Real Muttrid
  mk("mut1", "Vini Woof Jr", "mutt", "FWD", [96, 92, 80, 86, 82, 85, 94, 84]),
  mk("mut2", "Jude Belly-Rubbingham", "mutt", "MID", [86, 86, 88, 84, 90, 82, 84, 88]),
  mk("mut3", "Antonio Rüff-diger", "mutt", "DEF", [84, 66, 78, 58, 92, 60, 72, 82]),
  mk("mut4", "Thibark Cornois", "mutt", "GK", [56, 52, 82, 38, 72, 93, 55, 90]),
  // Corgi-nthians
  mk("cor1", "Ronaldogo", "corg", "FWD", [82, 90, 78, 94, 80, 91, 92, 85]),
  mk("cor2", "Paulinho Pup", "corg", "MID", [78, 82, 86, 80, 86, 74, 82, 80]),
  mk("cor3", "Fabinho Fetch", "corg", "DEF", [76, 68, 84, 60, 88, 58, 66, 82]),
  mk("cor4", "Cássio Corg", "corg", "GK", [54, 50, 78, 36, 70, 87, 52, 84]),
  // Fetch City
  mk("fet1", "Erling Haa-Fetch", "fetch", "FWD", [90, 78, 72, 97, 84, 95, 80, 88]),
  mk("fet2", "Kevin De Bark-ne", "fetch", "MID", [76, 88, 96, 86, 84, 82, 88, 90]),
  mk("fet3", "Ruben Dig-az", "fetch", "DEF", [80, 70, 86, 56, 90, 60, 70, 86]),
  mk("fet4", "Eder-woof", "fetch", "GK", [60, 62, 90, 44, 74, 91, 64, 86]),
  // Wooferpool
  mk("woo1", "Mo Wagsalah", "woof", "FWD", [93, 90, 80, 90, 84, 88, 91, 86]),
  mk("woo2", "Alexis Mac Ah-Lickster", "woof", "MID", [80, 84, 90, 82, 92, 78, 82, 84]),
  mk("woo3", "Virgil van Digk", "woof", "DEF", [82, 72, 84, 60, 90, 64, 74, 92]),
  mk("woo4", "Ali-Sniff", "woof", "GK", [58, 58, 86, 42, 74, 92, 60, 88]),
  // Pawis SG
  mk("paw1", "Ousmane Dig-bélé", "pawis", "FWD", [95, 91, 78, 82, 80, 80, 93, 78]),
  mk("paw2", "Vi-Treatinha", "pawis", "MID", [82, 86, 88, 78, 88, 76, 86, 82]),
  mk("paw3", "Barkinhos", "pawis", "DEF", [80, 68, 82, 56, 88, 58, 68, 84]),
  mk("paw4", "Gigio Dog-narumma", "pawis", "GK", [55, 54, 80, 40, 72, 90, 56, 86]),
];

export const PLAYERS_BY_ID: Record<string, Player> = Object.fromEntries(
  PLAYERS.map((p) => [p.id, p]),
);

export const POSITION_COLORS: Record<Position, string> = {
  GK: "#8B5CF6",
  DEF: "#3B82F6",
  MID: "#10B981",
  FWD: "#F15A22",
};
