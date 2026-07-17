# Corgi League 🐕⚽ — Build the Cup: Lovable × Corgi Buildathon

A 3-hour soccer-themed buildathon hosted by **Corgi** in partnership with **Lovable**, at Corgi Cafe SF — **July 16, 2026**.

**🔗 Live app:** https://saeidch.github.io/corgi-league-buildathon/
**📦 Repo:** https://github.com/SAeidch/corgi-league-buildathon

> A fictional league of corgi footballers, explored through four lenses: a **similarity graph**, a **Poisson match predictor**, **collectible player cards**, and a **three-corgi commentary booth** that talks in different accents.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build
```

Stack: **React + TypeScript + Vite + Tailwind**, with `recharts` (radar/charts), `react-force-graph-2d` (network graph), and `framer-motion`. All data is seeded client-side (`src/data/`), analytics live in pure functions (`src/lib/similarity.ts`, `src/lib/prediction.ts`, `src/lib/personas.ts`).

## Deploy to a lovable.app subdomain

Lovable can't import an existing repo (one-way GitHub sync only), so to host on `lovable.app`:
paste `LOVABLE_PROMPT.md` into a new Lovable project and upload the brand images. This repo
doubles as the exact spec + a deployable reference build (currently live via GitHub Pages).

---


---

## 📋 The Assignment (verbatim from the event slides)

- **Build something that collides soccer (football!) and Corgi** — you have 3 hours.
- **Host using the `lovable.app` subdomain** (you can change the domain name after the buildathon).
- **Submit your work through the Google Form** (QR code shown at 9:15 PM). **No submissions accepted after 9:45 PM.**
- **Top 5 teams / solo hackers** will need to **demo their project** live.
- Have a BLAST!

## ⏱️ Timeline

| Time | What |
|------|------|
| 6:00 PM | Check-in — WiFi + Lovable credits |
| 6:30 PM | Intro to Lovable |
| 6:40–9:40 PM | **3-hour build period** |
| 9:15 PM | Submission Google Form QR shown |
| 9:45 PM | **Hard submission cutoff** |
| 9:40–10:00 PM | Judging intermission |
| 10:00–10:20 PM | Top 5 finalists demo live |
| 10:20 PM | Winners announced |

## 🏆 Judges & Prizes

**Judges:** Leo Fu (Head of Design, Corgi), Ella Schlaghecke (Startup Partnerships, Corgi), Evelyn Miao (Founding GTM, Corgi), Neel Majmudar (Imagine AI), Henry Marks (Wordware).

> Note: the panel skews **design + go-to-market**. Visual polish, clarity of concept, and "would I share this" matter as much as technical depth.

**Prizes:**
- 🥇 1st — 20-min coffee chat with Corgi leadership + merch
- 🥈 2nd — $100 Corgi Cafe gift card + photoshoot
- 🥉 3rd — merch + a drink

## 🛠️ Tools

- **Lovable** ([lovable.dev](https://lovable.dev)) — AI app builder (React + Tailwind + Vite frontend, Supabase backend, one-click deploy).
- Lovable Pro Plan claim: Settings → Plans & Credits → **Pro Plan 1 (100 credits)**, monthly, discount code **`COMM-BUILD-K56U`**.
- All attendees get $25 in free Lovable credits + pizza. Dress code: soccer jersey.

---

## 💡 Our Concept: "Corgi League"

A soccer league where the players are **corgis** — fusing data science + art.

### Data-science layer
- **Player/team similarity graph** — force-directed network; nodes = corgi-players, edges connect similar players via cosine similarity on a stat vector (pace, dribbling, "boop" accuracy, stamina, tail-wag rating).
- **Team & player pages** — radar/spider charts, league table, xG-style "expected boops."
- Optional: AI-generated "scout report" per corgi (one LLM call).

### Art layer
- Corgi brand identity (logo + colors) with a soccer motif.
- **Player cards** (FUT-style): corgi portrait, position, stat bars.
- Playful, clean visual design.

### Build strategy
1. Lock scope early.
2. Deploy an ugly-but-working version by hour 1.
3. Spend the rest polishing the demo + the live link.
4. **A working live link at 9:45 beats an ambitious idea that never deployed.**

## 📥 Assets needed
- [ ] Corgi logo / brand assets (distributed at the event)
- [ ] Brand colors (or derive from logo)
- [ ] Corgi photos for player portraits (optional — can be AI-generated)
- [ ] Any real dataset to drive the similarity graph (optional — synthetic stats otherwise)

---

*Built at the Lovable × Corgi Buildathon.*
