import { useState } from "react";
import Nav, { type TabId } from "./components/Nav";
import SimilarityPage from "./pages/SimilarityPage";
import PredictorPage from "./pages/PredictorPage";
import CardsPage from "./pages/CardsPage";
import CommentaryPage from "./pages/CommentaryPage";

export default function App() {
  const [tab, setTab] = useState<TabId>("similarity");

  return (
    <div className="min-h-full">
      <Nav active={tab} onChange={setTab} />

      {/* Hero band */}
      <section className="pitch-lines border-b border-corgi-navy/10 bg-gradient-to-br from-corgi-cream to-corgi-sand">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-6 md:flex-row md:justify-between md:py-8">
          <div className="max-w-xl">
            <span className="inline-block rounded-full bg-corgi-orange/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-corgi-orange">
              Soccer × Corgi · Buildathon
            </span>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-corgi-navy sm:text-4xl">
              Where every good boy <br className="hidden sm:block" />
              is a <span className="text-corgi-orange">baller</span>.
            </h1>
            <p className="mt-2 text-sm text-corgi-navy/60">
              A fictional league of corgi footballers — explored through a similarity graph,
              a Poisson match predictor, collectible cards, and a three-corgi commentary booth.
            </p>
          </div>
          <img
            src="/hero.png"
            alt="Corgi footballer"
            className="w-full max-w-sm rounded-2xl object-contain md:max-w-md"
          />
        </div>
      </section>

      <main>
        {tab === "similarity" && <SimilarityPage />}
        {tab === "predictor" && <PredictorPage />}
        {tab === "cards" && <CardsPage />}
        {tab === "commentary" && <CommentaryPage />}
      </main>

      <footer className="mt-8 border-t border-corgi-navy/10 py-6 text-center text-xs text-corgi-navy/40">
        Corgi League · built for the Lovable × Corgi Buildathon · data science + art, colliding
        soccer and corgi 🐕⚽
      </footer>
    </div>
  );
}
