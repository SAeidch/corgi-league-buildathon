import { useMemo, useState } from "react";
import { TEAMS } from "../data/players";
import { predictMatch } from "../lib/prediction";
import PlayerCard from "../components/PlayerCard";
import { PageTitle } from "./SimilarityPage";

export default function PredictorPage() {
  const [homeId, setHomeId] = useState("mutt");
  const [awayId, setAwayId] = useState("bark");

  const pred = useMemo(() => predictMatch(homeId, awayId), [homeId, awayId]);
  const sameTeam = homeId === awayId;

  const pct = (x: number) => `${(x * 100).toFixed(0)}%`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <PageTitle
        title="Match Predictor"
        subtitle="An Elo rating feeds a two-sided Poisson goals model built from each squad's attack and defence strength. We simulate the full scoreline distribution, then read off win/draw/loss and the single most-likely result."
      />

      <div className="mb-6 grid grid-cols-1 items-center gap-3 rounded-2xl bg-white p-5 shadow-card sm:grid-cols-[1fr_auto_1fr]">
        <TeamSelect label="Home" value={homeId} onChange={setHomeId} />
        <div className="text-center font-display text-lg font-extrabold text-corgi-navy/40">vs</div>
        <TeamSelect label="Away" value={awayId} onChange={setAwayId} align="right" />
      </div>

      {sameTeam ? (
        <div className="rounded-2xl bg-white p-8 text-center text-sm font-semibold text-corgi-navy/60 shadow-card">
          Pick two different teams — even corgis can't play themselves. 🐾
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-[1fr_260px]">
          <div className="space-y-4">
            {/* Probability bar */}
            <div className="rounded-2xl bg-white p-5 shadow-card">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="font-display text-sm font-bold text-corgi-navy">
                  {pred.home.name}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-corgi-navy/40">
                  Win probability
                </span>
                <span className="font-display text-sm font-bold text-corgi-navy">
                  {pred.away.name}
                </span>
              </div>
              <div className="flex h-9 w-full overflow-hidden rounded-lg text-xs font-bold text-white">
                <div
                  className="flex items-center justify-center transition-all"
                  style={{ width: pct(pred.pHome), backgroundColor: pred.home.color }}
                  title={`${pred.home.name} win`}
                >
                  {pred.pHome > 0.08 && pct(pred.pHome)}
                </div>
                <div
                  className="flex items-center justify-center bg-corgi-navy/30 transition-all"
                  style={{ width: pct(pred.pDraw) }}
                  title="Draw"
                >
                  {pred.pDraw > 0.08 && pct(pred.pDraw)}
                </div>
                <div
                  className="flex items-center justify-center transition-all"
                  style={{ width: pct(pred.pAway), backgroundColor: pred.away.color }}
                  title={`${pred.away.name} win`}
                >
                  {pred.pAway > 0.08 && pct(pred.pAway)}
                </div>
              </div>
              <div className="mt-2 flex justify-between text-xs font-semibold text-corgi-navy/50">
                <span>Home win</span>
                <span>Draw {pct(pred.pDraw)}</span>
                <span>Away win</span>
              </div>
            </div>

            {/* Scoreline + xG */}
            <div className="grid grid-cols-3 gap-4">
              <Stat label="Predicted score" big>
                {pred.scoreline.home} – {pred.scoreline.away}
              </Stat>
              <Stat label={`${pred.home.short} expected goals`}>
                {pred.lambdaHome.toFixed(2)}
              </Stat>
              <Stat label={`${pred.away.short} expected goals`}>
                {pred.lambdaAway.toFixed(2)}
              </Stat>
            </div>

            <div className="rounded-2xl bg-corgi-navy p-5 text-white shadow-card">
              <div className="mb-1 text-xs font-bold uppercase tracking-wide text-white/50">
                Tactical preview
              </div>
              <p className="text-sm leading-relaxed text-white/90">
                {previewLine(pred)}
              </p>
            </div>
          </div>

          <div>
            <div className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-corgi-navy/60">
              Predicted key player
            </div>
            <PlayerCard player={pred.keyPlayer} />
          </div>
        </div>
      )}
    </div>
  );
}

function previewLine(pred: ReturnType<typeof predictMatch>) {
  const fav =
    pred.pHome > pred.pAway ? pred.home : pred.pAway > pred.pHome ? pred.away : null;
  const edge = Math.abs(pred.pHome - pred.pAway);
  const tightness =
    edge < 0.12 ? "a genuine coin-flip" : edge < 0.28 ? "a slight edge" : "a clear favourite";
  return `${
    fav ? `${fav.name} go in as ${tightness}` : "Dead level on the numbers — pure coin-flip"
  }. Expect around ${(pred.lambdaHome + pred.lambdaAway).toFixed(
    1,
  )} goals total, with ${pred.keyPlayer.name} the corgi most likely to decide it.`;
}

function TeamSelect({
  label,
  value,
  onChange,
  align = "left",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <div className="mb-1 text-xs font-bold uppercase tracking-wide text-corgi-navy/40">
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-corgi-navy/15 bg-corgi-cream px-3 py-2 font-display text-base font-bold text-corgi-navy"
      >
        {TEAMS.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name} · {t.elo}
          </option>
        ))}
      </select>
    </div>
  );
}

function Stat({
  label,
  children,
  big = false,
}: {
  label: string;
  children: React.ReactNode;
  big?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center shadow-card">
      <div
        className={`font-display font-extrabold text-corgi-orange ${big ? "text-3xl" : "text-2xl"}`}
      >
        {children}
      </div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-corgi-navy/50">
        {label}
      </div>
    </div>
  );
}
