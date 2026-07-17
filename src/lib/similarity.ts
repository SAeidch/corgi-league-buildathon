// ---------------------------------------------------------------------------
// Similarity engine
// Treats each player's 8 stats as a vector and measures how alike two players
// are with cosine similarity. This powers the "Squad Similarity" network graph
// and the "statistical twins" panel — a real embedding-style visualization.
// ---------------------------------------------------------------------------

import { PLAYERS, STAT_KEYS, type Player } from "../data/players";

/** Extract a player's stats as an ordered numeric vector. */
export function toVector(p: Player): number[] {
  return STAT_KEYS.map((k) => p.stats[k]);
}

/** Cosine similarity between two equal-length vectors. Range ~[0, 1] here. */
export function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/** Similarity between two players by id-less objects. */
export function playerSimilarity(a: Player, b: Player): number {
  return cosine(toVector(a), toVector(b));
}

export interface SimEdge {
  source: string;
  target: string;
  weight: number;
}

/**
 * All unique player pairs with similarity >= threshold.
 * Because every corgi is a strong athlete, raw cosine values cluster high
 * (~0.95+), so the graph reads best with a threshold slider in that band.
 */
export function buildEdges(threshold: number): SimEdge[] {
  const edges: SimEdge[] = [];
  for (let i = 0; i < PLAYERS.length; i++) {
    for (let j = i + 1; j < PLAYERS.length; j++) {
      const w = playerSimilarity(PLAYERS[i], PLAYERS[j]);
      if (w >= threshold) {
        edges.push({ source: PLAYERS[i].id, target: PLAYERS[j].id, weight: w });
      }
    }
  }
  return edges;
}

export interface Twin {
  player: Player;
  similarity: number;
}

/** The n most statistically-similar players to a given player. */
export function statisticalTwins(player: Player, n = 5): Twin[] {
  return PLAYERS.filter((p) => p.id !== player.id)
    .map((p) => ({ player: p, similarity: playerSimilarity(player, p) }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, n);
}
