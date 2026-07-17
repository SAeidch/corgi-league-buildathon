export default function StatBar({
  label,
  value,
  color = "#F15A22",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-xs font-semibold text-corgi-navy/70">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-corgi-navy/10">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-7 shrink-0 text-right text-xs font-bold tabular-nums text-corgi-navy">
        {value}
      </span>
    </div>
  );
}
