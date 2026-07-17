import { useEffect, useRef, useState } from "react";
import { MOMENTS, PERSONAS, askTheBooth, type BoothReply } from "../lib/personas";
import { PageTitle } from "./SimilarityPage";

export default function CommentaryPage() {
  const [query, setQuery] = useState("");
  const [replies, setReplies] = useState<BoothReply[]>([]);
  const [revealed, setRevealed] = useState(0);
  const [title, setTitle] = useState<string>("");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function ask(q: string) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    window.speechSynthesis?.cancel();

    const { moment, replies } = askTheBooth(q);
    setQuery(q);
    setTitle(moment ? moment.title : "");
    setReplies(replies);
    setRevealed(0);
    // Reveal each corgi one-by-one, like a broadcast panel handing over.
    replies.forEach((_, i) => {
      const t = window.setTimeout(() => setRevealed(i + 1), 550 * (i + 1));
      timers.current.push(t);
    });
  }

  function speak(reply: BoothReply) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(reply.text);
    u.lang = reply.persona.lang;
    const voices = window.speechSynthesis.getVoices();
    const match =
      voices.find((v) => v.lang === reply.persona.lang) ||
      voices.find((v) => v.lang.startsWith(reply.persona.lang.split("-")[0]));
    if (match) u.voice = match;
    u.rate = reply.persona.id === "bella" ? 1.05 : reply.persona.id === "baxter" ? 0.95 : 1.0;
    u.pitch = reply.persona.id === "data" ? 1.1 : 1.0;
    window.speechSynthesis.speak(u);
  }

  function speakAll() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    replies.forEach((r) => {
      const u = new SpeechSynthesisUtterance(r.text);
      u.lang = r.persona.lang;
      const voices = window.speechSynthesis.getVoices();
      const match =
        voices.find((v) => v.lang === r.persona.lang) ||
        voices.find((v) => v.lang.startsWith(r.persona.lang.split("-")[0]));
      if (match) u.voice = match;
      u.rate = r.persona.id === "bella" ? 1.05 : r.persona.id === "baxter" ? 0.95 : 1.0;
      window.speechSynthesis.speak(u);
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <PageTitle
        title="Commentary Booth"
        subtitle="Ask about any famous football moment. Three corgi pundits — a posh British anchor, a passionate Italian, and an analytics nerd — each give you their take, in character. Hit 🔊 and they'll say it out loud in their own accent."
      />

      {/* Persona strip */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {PERSONAS.map((p) => (
          <div
            key={p.id}
            className="flex flex-col items-center rounded-2xl bg-white p-3 text-center shadow-card ring-1 ring-black/5"
          >
            <img src={p.avatar} alt={p.name} className="h-16 w-16 object-contain" />
            <div className="mt-1 font-display text-sm font-bold leading-tight text-corgi-navy">
              {p.name}
            </div>
            <div className="text-[11px] font-semibold" style={{ color: p.color }}>
              {p.role}
            </div>
            <div className="mt-1 hidden text-[11px] text-corgi-navy/50 sm:block">{p.blurb}</div>
          </div>
        ))}
      </div>

      {/* Ask box */}
      <div className="mb-3 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask(query)}
          placeholder="e.g. Zidane's headbutt in the 2006 final"
          className="flex-1 rounded-xl border border-corgi-navy/15 bg-white px-4 py-2.5 text-sm shadow-card"
        />
        <button
          onClick={() => ask(query)}
          className="rounded-xl bg-corgi-orange px-5 py-2.5 text-sm font-bold text-white shadow-card transition hover:brightness-105"
        >
          Ask the booth
        </button>
      </div>

      {/* Suggestion chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {MOMENTS.map((m) => (
          <button
            key={m.id}
            onClick={() => ask(m.chip)}
            className="rounded-full border border-corgi-navy/15 bg-white px-3 py-1 text-xs font-semibold text-corgi-navy/70 transition hover:border-corgi-orange hover:text-corgi-orange"
          >
            {m.chip}
          </button>
        ))}
      </div>

      {/* Broadcast */}
      {replies.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="font-display text-sm font-bold text-corgi-navy">
              {title || `On the record: “${query}”`}
            </div>
            <button
              onClick={speakAll}
              className="rounded-full bg-corgi-navy px-3 py-1.5 text-xs font-bold text-white transition hover:bg-corgi-navy-soft"
            >
              🔊 Hear them all
            </button>
          </div>
          <div className="space-y-3">
            {replies.slice(0, revealed).map((r) => (
              <div
                key={r.persona.id}
                className="flex gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5"
                style={{ animation: "fadeUp 0.4s ease" }}
              >
                <img
                  src={r.persona.avatar}
                  alt={r.persona.name}
                  className="h-14 w-14 shrink-0 object-contain"
                />
                <div className="flex-1">
                  <div className="mb-0.5 flex items-center gap-2">
                    <span
                      className="rounded px-1.5 py-0.5 text-[11px] font-bold text-white"
                      style={{ backgroundColor: r.persona.color }}
                    >
                      {r.persona.name}
                    </span>
                    <button
                      onClick={() => speak(r)}
                      className="text-xs font-semibold text-corgi-navy/40 transition hover:text-corgi-orange"
                      title={`Hear in ${r.persona.lang}`}
                    >
                      🔊 Hear
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed text-corgi-navy/90">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}
