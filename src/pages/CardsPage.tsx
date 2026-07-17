import { useMemo, useState } from "react";
import { PLAYERS, TEAMS, type Position } from "../data/players";
import PlayerCard from "../components/PlayerCard";
import { PageTitle } from "./SimilarityPage";

const POSITIONS: (Position | "ALL")[] = ["ALL", "GK", "DEF", "MID", "FWD"];

export default function CardsPage() {
  const [team, setTeam] = useState("all");
  const [pos, setPos] = useState<Position | "ALL">("ALL");
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      PLAYERS.filter(
        (p) =>
          (team === "all" || p.teamId === team) &&
          (pos === "ALL" || p.position === pos) &&
          p.name.toLowerCase().includes(q.toLowerCase()),
      ).sort((a, b) => b.overall - a.overall),
    [team, pos, q],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <PageTitle
        title="Player Cards"
        subtitle="The full squad as collectible cards. Tap any card to flip it and reveal the player's radar. Filter by team, position or search — sorted by overall rating."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl bg-white p-3 shadow-card">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search corgis…"
          className="min-w-[160px] flex-1 rounded-lg border border-corgi-navy/15 px-3 py-1.5 text-sm"
        />
        <select
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          className="rounded-lg border border-corgi-navy/15 bg-white px-2 py-1.5 text-sm font-semibold text-corgi-navy"
        >
          <option value="all">All teams</option>
          {TEAMS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <div className="flex gap-1">
          {POSITIONS.map((p) => (
            <button
              key={p}
              onClick={() => setPos(p)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                pos === p
                  ? "bg-corgi-navy text-white"
                  : "bg-corgi-navy/5 text-corgi-navy/60 hover:bg-corgi-navy/10"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-sm font-semibold text-corgi-navy/50 shadow-card">
          No corgis match that filter. 🐕
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((p) => (
            <PlayerCard key={p.id} player={p} />
          ))}
        </div>
      )}
    </div>
  );
}
