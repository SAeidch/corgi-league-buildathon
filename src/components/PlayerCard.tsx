import { useState } from "react";
import {
  POSITION_COLORS,
  STAT_LABELS,
  TEAMS_BY_ID,
  type Player,
} from "../data/players";
import RadarStats from "./RadarStats";

const CARD_STATS: (keyof Player["stats"])[] = [
  "pace",
  "dribbling",
  "passing",
  "shooting",
  "stamina",
  "boopAccuracy",
];

export default function PlayerCard({ player }: { player: Player }) {
  const [flipped, setFlipped] = useState(false);
  const team = TEAMS_BY_ID[player.teamId];
  const posColor = POSITION_COLORS[player.position];

  return (
    <div className="flip-card h-[340px] w-full" onClick={() => setFlipped((f) => !f)}>
      <div className={`flip-inner h-full w-full cursor-pointer ${flipped ? "is-flipped" : ""}`}>
        {/* FRONT */}
        <div
          className="flip-face flex flex-col overflow-hidden rounded-2xl shadow-card ring-1 ring-black/5"
          style={{
            background: `linear-gradient(160deg, ${team.color} 0%, #152238 120%)`,
          }}
        >
          <div className="flex items-start justify-between p-3 text-white">
            <div className="text-center leading-tight">
              <div className="font-display text-3xl font-extrabold">{player.overall}</div>
              <div
                className="mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: posColor }}
              >
                {player.position}
              </div>
            </div>
            <div
              className="rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide"
              style={{ backgroundColor: "rgba(255,255,255,0.16)" }}
            >
              {team.short}
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <img
              src="/logo-dog.svg"
              alt=""
              className="h-20 w-20 opacity-90 drop-shadow"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>

          <div className="bg-white/95 px-3 pb-3 pt-2">
            <div className="mb-2 truncate text-center font-display text-sm font-bold text-corgi-navy">
              {player.name}
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {CARD_STATS.map((k) => (
                <div key={k} className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-corgi-navy/60">
                    {STAT_LABELS[k].slice(0, 4)}
                  </span>
                  <span className="font-bold tabular-nums text-corgi-navy">{player.stats[k]}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-center text-[9px] font-medium uppercase tracking-wider text-corgi-orange">
              tap to flip
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className="flip-face flip-back flex flex-col rounded-2xl bg-white p-3 shadow-card ring-1 ring-black/5">
          <div className="mb-1 text-center font-display text-sm font-bold text-corgi-navy">
            {player.name}
          </div>
          <div className="mb-1 text-center text-[11px] font-semibold text-corgi-navy/50">
            {team.name} · {player.position}
          </div>
          <div className="flex-1">
            <RadarStats stats={player.stats} color={team.color} height={200} />
          </div>
          <div className="text-center text-[9px] font-medium uppercase tracking-wider text-corgi-orange">
            tap to flip back
          </div>
        </div>
      </div>
    </div>
  );
}
