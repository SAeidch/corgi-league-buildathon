export type TabId = "similarity" | "predictor" | "cards" | "commentary";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "similarity", label: "Squad Similarity", icon: "🕸️" },
  { id: "predictor", label: "Match Predictor", icon: "🔮" },
  { id: "cards", label: "Player Cards", icon: "🃏" },
  { id: "commentary", label: "Commentary Booth", icon: "🎙️" },
];

export default function Nav({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (t: TabId) => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-corgi-navy/10 bg-corgi-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Corgi League" className="h-9 w-9" />
          <span className="font-display text-xl font-extrabold text-corgi-navy">
            Corgi<span className="text-corgi-orange">League</span>
          </span>
        </div>
        <nav className="flex flex-1 flex-wrap items-center gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                active === t.id
                  ? "bg-corgi-orange text-white shadow-sm"
                  : "text-corgi-navy/60 hover:bg-corgi-navy/5 hover:text-corgi-navy"
              }`}
            >
              <span className="mr-1">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
