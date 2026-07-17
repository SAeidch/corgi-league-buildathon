# Lovable Build Prompt — "Corgi League" ⚽🐕

> Paste this into Lovable. First **upload these images** in the Lovable chat and reference them by name:
> `Corgi Logo Vector.svg` (brand logo), `ChatGPT Image ... 07_19_35 PM.png` (hero art),
> `1_corgi.png` (analyst), `2_corgi.png` (anchor), `5_corgi.webp` (Italian pundit).

---

## THE PROMPT (paste everything below)

Build a polished, playful single-page web app called **Corgi League** — a fictional soccer (football) universe where every player is a corgi. It fuses real sports-analytics with whimsical corgi branding. This is for a 3-hour buildathon; prioritize a **beautiful, demo-ready, fully-working** app over feature sprawl. Everything must run client-side with seeded mock data (no login, no external DB) so it always works in a live demo.

### Brand & Visual Identity
- **Colors:** primary orange `#F15A22`, deep navy `#152238`, off-white background `#FAF8F5`, with soft grey card borders. Use orange for accents/CTAs/active states, navy for headings/text.
- **Logo:** use the uploaded corgi logo in the top-left of the nav. App name "Corgi League" in a bold geometric sans (e.g. Poppins/Sora), navy with an orange "League".
- **Style:** clean modern dashboard cards (rounded-2xl, soft shadows) mixed with the warm watercolor corgi illustrations. Playful but credible — think "sports analytics product designed by a design studio." Subtle dashed-line and small "×" tick accents like the hero image. Fully responsive; looks great on a projector.
- Use the uploaded corgi character illustrations throughout as mascots/avatars.

### App Structure (top nav, 4 sections)
`Squad Similarity` · `Match Predictor` · `Player Cards` · `Commentary Booth`

### Data Model (seed in-app, ~24 corgi players across 6 teams)
Teams (corgi-pun names, e.g. *Barkelona, Corg-inthians, Real Muttrid, Woofalo, Fetch City, Pawis SG*), each with a color and an **Elo rating**.
Each player: `id, name (corgi pun), team, position (GK/DEF/MID/FWD), portrait`, and a **feature vector** of 0–100 stats:
`pace, dribbling, passing, shooting, stamina, boopAccuracy, tailWagRating, goodBoyIndex`, plus a derived `overall`.
Make the data realistic and internally consistent (forwards shoot high, keepers low, etc.). Put it in a clean typed `data/` module.

### 1. Squad Similarity (the data-science centerpiece)
- Compute **cosine similarity** between every pair of players' feature vectors (real formula, in a `lib/similarity.ts` service).
- Render an **interactive force-directed network graph** (use `react-force-graph-2d` or d3-force): nodes = players (color by team, size by `overall`, small corgi avatar), edges drawn where similarity > an adjustable threshold slider.
- Click a node → highlight its top-5 most-similar players and open a side panel with that player's radar chart + "statistical twins" list.
- Include the threshold slider and a team filter. This should feel like a real ML embedding visualization.

### 2. Match Predictor (the modeling piece)
- Pick two teams. Compute **win / draw / loss probabilities** from the Elo difference using the logistic expected-score formula `E = 1 / (1 + 10^(-ΔElo/400))`, split into W/D/L with a draw band. Show as an animated horizontal probability bar (navy/grey/orange).
- Predict a **scoreline** (Poisson-style from team attack/defense strength derived from squad stats) and name the **predicted key player** (highest goal-contribution score).
- Show a short auto-generated "tactical preview" line. Keep the math in a `lib/prediction.ts` service with clear comments — this is a data-scientist's showcase.

### 3. Player Cards (the art piece)
- FIFA-Ultimate-Team-style **collectible cards**: corgi portrait, position badge, team crest color, `overall` big in the corner, and the 6 core stats as small bars. Orange/navy gradient card frame, subtle shine on hover, flip animation to reveal the radar chart on the back.
- Grid of all players with team/position filters and a search box.

### 4. Commentary Booth (the creative showstopper) 🎙️
An **AI-style football pundit desk** with **three corgi commentators**, each a distinct persona with its own voice, avatar, and style. The user asks about a famous football moment (or picks one from suggested chips), and all three corgis respond **in sequence**, each in-character:

- **Sir Baxter Waggington** — posh British studio anchor (uploaded blazer+tie corgi). Dry, witty, tactical. Accent voice `en-GB`.
- **Nonna Bella** — passionate Italian pundit (uploaded red-sweater corgi). Dramatic, emotional, hand-on-heart, sprinkles Italian ("Mamma mia!", "che disastro!"). Accent voice `it-IT`.
- **Dr. Data Pupkins** — analytics nerd (uploaded glasses+hoodie corgi). Cites xG, probabilities, heatmaps, expected-boops. Accent voice `en-US`.

**Pre-seed these iconic moments** with hand-written, in-character responses for each of the three corgis (so the demo is bulletproof — these must work with zero API):
1. **2006 World Cup Final — Zidane's headbutt on Materazzi (red card).**
2. **1986 — Maradona's "Hand of God".**
3. **2005 Champions League Final — Liverpool's Istanbul comeback.**
4. **2014 World Cup — Germany 7–1 Brazil.**
5. **1999 — Man United's injury-time treble.**

Show each corgi's reply appearing one-by-one in a chat/broadcast layout with their avatar and a colored name tag. Add a **"🔊 Hear them"** button that uses the browser **Web Speech API (`speechSynthesis`)** with a different `lang`/voice per persona so they literally speak with different accents — free, offline, and a great live-demo moment.

Wire the free-text box to gracefully handle unlisted questions: if a moment isn't pre-seeded, each corgi gives a witty in-character generic reaction (and leave a clearly-marked `// TODO: optional live LLM call` hook in the service so we can plug in an AI model later).

### Engineering / Architecture notes (do this cleanly)
- React + TypeScript + Tailwind. Organized structure: `data/` (seed), `lib/` (similarity, prediction, personas services — pure functions, unit-testable), `components/`, `pages/`.
- Keep all analytics logic in typed pure functions separated from UI. Add concise comments explaining the formulas.
- Use `recharts` for radar/bar charts. Smooth framer-motion transitions. Accessible color contrast.
- Deploy target: Lovable `.app` subdomain.

Make it feel finished: nice empty states, a short tagline in the hero ("Where every good boy is a baller"), and consistent spacing. Ship it.

---

## Post-build modification ideas (later)
- Plug a live LLM into the Commentary Booth `TODO` hook for arbitrary questions.
- Swap synthetic stats for a real dataset.
- Add a "build your own XI" drag-and-drop lineup with predicted team chemistry (another similarity use).
- Live match simulator that animates a predicted game minute-by-minute.
