import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import type { Stats } from "../data/players";

const AXES: { key: keyof Stats; label: string }[] = [
  { key: "pace", label: "Pace" },
  { key: "dribbling", label: "Drib" },
  { key: "passing", label: "Pass" },
  { key: "shooting", label: "Shot" },
  { key: "stamina", label: "Stam" },
  { key: "boopAccuracy", label: "Boop" },
];

export default function RadarStats({
  stats,
  color = "#F15A22",
  height = 220,
}: {
  stats: Stats;
  color?: string;
  height?: number;
}) {
  const data = AXES.map((a) => ({ axis: a.label, value: stats[a.key] }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="rgba(21,34,56,0.15)" />
        <PolarAngleAxis
          dataKey="axis"
          tick={{ fill: "#152238", fontSize: 11, fontWeight: 600 }}
        />
        <Radar dataKey="value" stroke={color} fill={color} fillOpacity={0.35} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
