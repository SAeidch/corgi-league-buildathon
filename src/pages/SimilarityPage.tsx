import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import {
  PLAYERS,
  PLAYERS_BY_ID,
  TEAMS,
  TEAMS_BY_ID,
  type Player,
} from "../data/players";
import { buildEdges, statisticalTwins } from "../lib/similarity";
import RadarStats from "../components/RadarStats";

interface GNode {
  id: string;
  name: string;
  team: string;
  color: string;
  val: number;
}
interface GLink {
  source: string;
  target: string;
  weight: number;
}

export default function SimilarityPage() {
  const [threshold, setThreshold] = useState(0.985);
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Player | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 520 });

  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const ro = new ResizeObserver(() => {
      setDims({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setDims({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const graph = useMemo(() => {
    const visible = PLAYERS.filter(
      (p) => teamFilter === "all" || p.teamId === teamFilter,
    );
    const visibleIds = new Set(visible.map((p) => p.id));
    const nodes: GNode[] = visible.map((p) => ({
      id: p.id,
      name: p.name,
      team: p.teamId,
      color: TEAMS_BY_ID[p.teamId].color,
      val: p.overall,
    }));
    const links: GLink[] = buildEdges(threshold).filter(
      (e) => visibleIds.has(e.source) && visibleIds.has(e.target),
    );
    return { nodes, links };
  }, [threshold, teamFilter]);

  const twins = useMemo(
    () => (selected ? statisticalTwins(selected, 5) : []),
    [selected],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <PageTitle
        title="Squad Similarity"
        subtitle="Every corgi is embedded as an 8-dimensional stat vector. Edges connect players whose cosine similarity clears the threshold — a living map of statistical twins across the league."
      />

      <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl bg-white p-3 shadow-card">
        <div className="flex min-w-[220px] flex-1 items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wide text-corgi-navy/60">
            Similarity ≥
          </span>
          <input
            type="range"
            min={0.95}
            max={0.999}
            step={0.001}
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="flex-1 accent-corgi-orange"
          />
          <span className="w-14 text-right font-mono text-sm font-bold text-corgi-orange">
            {threshold.toFixed(3)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-corgi-navy/60">Team</span>
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="rounded-lg border border-corgi-navy/15 bg-white px-2 py-1 text-sm font-semibold text-corgi-navy"
          >
            <option value="all">All teams</option>
            {TEAMS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs font-semibold text-corgi-navy/50">
          {graph.links.length} connections
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div
          ref={wrapRef}
          className="pitch-lines relative h-[520px] overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5"
        >
          <ForceGraph2D
            graphData={graph}
            width={dims.w}
            height={dims.h}
            backgroundColor="rgba(0,0,0,0)"
            cooldownTicks={120}
            linkColor={() => "rgba(21,34,56,0.12)"}
            linkWidth={(l: any) => (l.weight - 0.95) * 40}
            nodeRelSize={5}
            nodeVal={(n: any) => (n.val - 70) / 3}
            onNodeClick={(n: any) => setSelected(PLAYERS_BY_ID[n.id])}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const r = Math.max(4, (node.val - 70) / 2.5);
              ctx.beginPath();
              ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
              ctx.fillStyle = node.color;
              ctx.fill();
              ctx.lineWidth = selected?.id === node.id ? 2.5 : 1;
              ctx.strokeStyle = selected?.id === node.id ? "#F15A22" : "rgba(255,255,255,0.9)";
              ctx.stroke();
              if (globalScale > 1.3) {
                const label = node.name.split(" ")[0];
                ctx.font = `${11 / globalScale}px Inter, sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillStyle = "#152238";
                ctx.fillText(label, node.x, node.y + r + 1);
              }
            }}
          />
          <div className="pointer-events-none absolute bottom-2 left-3 text-[11px] font-medium text-corgi-navy/40">
            drag to explore · scroll to zoom · click a node
          </div>
        </div>

        <aside className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5">
          {selected ? (
            <div>
              <div className="mb-1 font-display text-lg font-bold text-corgi-navy">
                {selected.name}
              </div>
              <div className="mb-3 text-xs font-semibold text-corgi-navy/50">
                {TEAMS_BY_ID[selected.teamId].name} · {selected.position} · OVR {selected.overall}
              </div>
              <RadarStats stats={selected.stats} color={TEAMS_BY_ID[selected.teamId].color} height={180} />
              <div className="mt-3 mb-1.5 text-xs font-bold uppercase tracking-wide text-corgi-navy/60">
                Statistical twins
              </div>
              <ul className="space-y-1.5">
                {twins.map((t) => (
                  <li key={t.player.id}>
                    <button
                      onClick={() => setSelected(t.player)}
                      className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-left text-sm hover:bg-corgi-navy/5"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: TEAMS_BY_ID[t.player.teamId].color }}
                        />
                        <span className="font-semibold text-corgi-navy">{t.player.name}</span>
                      </span>
                      <span className="font-mono text-xs font-bold text-corgi-orange">
                        {(t.similarity * 100).toFixed(1)}%
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <img src="/analyst.png" alt="" className="mb-3 h-24 w-24 object-contain" />
              <p className="text-sm font-semibold text-corgi-navy">Click any node</p>
              <p className="mt-1 text-xs text-corgi-navy/50">
                to reveal a player's radar and their five closest statistical twins.
              </p>
            </div>
          )}
        </aside>
      </div>

      <Legend />
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-4 flex flex-wrap gap-3 rounded-xl bg-white p-3 shadow-card">
      {TEAMS.map((t) => (
        <span key={t.id} className="flex items-center gap-1.5 text-xs font-semibold text-corgi-navy/70">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: t.color }} />
          {t.name}
        </span>
      ))}
    </div>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <h1 className="font-display text-2xl font-extrabold text-corgi-navy sm:text-3xl">{title}</h1>
      <p className="mt-1 max-w-3xl text-sm text-corgi-navy/60">{subtitle}</p>
    </div>
  );
}
