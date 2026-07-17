// ---------------------------------------------------------------------------
// The Commentary Booth
// Three corgi pundits, each with a distinct voice, avatar and accent. Iconic
// football moments are pre-scripted per persona so the live demo is bulletproof
// with zero API dependency. A `// TODO` hook is left for an optional live LLM.
// ---------------------------------------------------------------------------

export interface Persona {
  id: "baxter" | "bella" | "data";
  name: string;
  role: string;
  avatar: string; // public/ asset
  color: string;
  lang: string; // BCP-47 tag for the Web Speech API accent
  blurb: string;
}

export const PERSONAS: Persona[] = [
  {
    id: "baxter",
    name: "Sir Baxter Waggington",
    role: "Studio Anchor",
    avatar: "/anchor.png",
    color: "#1E6FBA",
    lang: "en-GB",
    blurb: "Posh, dry-witted and relentlessly tactical.",
  },
  {
    id: "bella",
    name: "Nonna Bella",
    role: "Passionate Pundit",
    avatar: "/italian.webp",
    color: "#0E9F6E",
    lang: "it-IT",
    blurb: "All heart, all drama, hand permanently on chest.",
  },
  {
    id: "data",
    name: "Dr. Data Pupkins",
    role: "Head of Analytics",
    avatar: "/analyst.png",
    color: "#F15A22",
    lang: "en-US",
    blurb: "Speaks fluent xG, heatmaps and expected-boops.",
  },
];

export interface Moment {
  id: string;
  chip: string; // short label for the suggestion chip
  title: string;
  keywords: string[];
  responses: Record<Persona["id"], string>;
}

export const MOMENTS: Moment[] = [
  {
    id: "zidane-2006",
    chip: "Zidane's headbutt (2006)",
    title: "2006 World Cup Final — Zidane's headbutt on Materazzi",
    keywords: ["zidane", "headbutt", "materazzi", "2006", "france", "italy", "red card"],
    responses: {
      baxter:
        "Extra time, the biggest stage in the sport, and Zizou decides to conduct a chest examination with his forehead. Magnificent footballer, catastrophic decision — a straight red, and France's talisman walks past the trophy he'll never lift. Sublime and absurd in the same breath.",
      bella:
        "Mamma mia! I cannot look, but I cannot look AWAY! Materazzi, he say something — nobody knows what — and Zidane, BOOM, like a bull! My heart, it break for both! Che disastro, che dramma, che... beautiful tragedy!",
      data:
        "Pre-incident, France's win probability sat around 46% and climbing. The red card swung expected points by roughly 0.4 and collapsed their penalty-shootout leverage. One headbutt, a measurable -0.4 xPoints. The model does not have a feature for 'provoked pride,' but perhaps it should.",
    },
  },
  {
    id: "maradona-1986",
    chip: "Hand of God (1986)",
    title: "1986 World Cup — Maradona's 'Hand of God'",
    keywords: ["maradona", "hand of god", "1986", "argentina", "england", "handball"],
    responses: {
      baxter:
        "Four minutes later he'd score the goal of the century, so let's call it a balanced portfolio: one act of daylight robbery, one moment of genius. The referee saw neither clearly. Football, as ever, refusing to be tidy.",
      bella:
        "The little number ten, he JUMP, and the hand — no no NO, the HEAD, he says! Ay, the cheek, the audacity! I should be angry but instead I clap. This is football with the spice, with the sauce!",
      data:
        "Expected-goal value of that shot? Effectively zero from a defensive header contest — call it 0.03 xG. Converted anyway, via an illegal appendage. Our tracking model flagged an anomalous upper-limb trajectory. We now call that metric 'xHand.'",
    },
  },
  {
    id: "istanbul-2005",
    chip: "Istanbul comeback (2005)",
    title: "2005 Champions League Final — Liverpool 3-3 Milan (Istanbul)",
    keywords: ["istanbul", "2005", "liverpool", "milan", "comeback", "champions league", "3-3"],
    responses: {
      baxter:
        "Three down at the interval, thoroughly outclassed, and then six second-half minutes that rewrote the whole evening. I've watched it forty times and I still don't believe the second half happened. Utterly, gloriously irrational.",
      bella:
        "Three-zero! My Milan, they are already dancing! And then — pfft — the sky, it fall down! Six minutes! I was crying happy, then crying sad, all my tissues gone. Football, you cruel, cruel bellissima game!",
      data:
        "Half-time win probability for Milan was north of 98%. Liverpool's live model bottomed out near 1.2%. Three goals in six minutes is a ~4-sigma event. If you dashboard that comeback it looks like a broken sensor. It wasn't.",
    },
  },
  {
    id: "germany-brazil-2014",
    chip: "Germany 7-1 Brazil (2014)",
    title: "2014 World Cup Semi-Final — Germany 7-1 Brazil",
    keywords: ["germany", "brazil", "7-1", "2014", "semi", "mineirazo"],
    responses: {
      baxter:
        "Five goals in eighteen first-half minutes, on home soil, in a World Cup semi-final. I ran out of adjectives and simply started apologising to the viewers. A collapse of almost architectural completeness.",
      bella:
        "Seven! SEVEN! The whole of Brazil, they weep — I weep WITH them! I don't even support Brazil and my sofa is soaked! Each goal like another slice off my heart. Basta! Enough! ...one more? Okay, one more.",
      data:
        "Germany posted roughly 3.2 xG and finished with seven — clinical overperformance meeting total defensive disintegration. Brazil's mid-block compactness metric fell off a cliff around minute 23. That's not a slump; that's free-fall.",
    },
  },
  {
    id: "man-utd-1999",
    chip: "United's '99 injury time",
    title: "1999 Champions League Final — Man United's injury-time comeback",
    keywords: ["1999", "united", "manchester", "bayern", "injury time", "treble", "sheringham", "solskjaer"],
    responses: {
      baxter:
        "Bayern had the trophy ribbons in their colours and one hand on the cup. Then two corners in stoppage time and the whole narrative simply... inverted. Ninety minutes of one story, ninety seconds of another. Sport at its most theatrically unfair.",
      bella:
        "Bayern, they are celebrating already, poor lambs! And then — one goal, TWO goal, in the little extra minutes! I jump so high I frighten the cat! The joy, the heartbreak, all in one breath — questo è calcio!",
      data:
        "Bayern's win probability at the 90th minute was ~97%. Two set-piece conversions in stoppage time is a combined sub-3% path. Expected-goals said 'draw at best.' The scoreboard said 'treble.' Sometimes the tail wags the distribution.",
    },
  },
];

/** Generic in-character reactions when a moment isn't in the seeded set. */
function generic(query: string): Record<Persona["id"], string> {
  const q = query.trim() || "that moment";
  return {
    baxter: `Ah, "${q}" — a fine talking point. Tactically fascinating, emotionally reckless, and precisely the sort of thing this sport serves up when you least expect it.`,
    bella: `"${q}"?! Ohh, you touch my heart! I remember, I cry, I shout at the television, I love it all! Bellissimo!`,
    data: `Interesting. Without the tracking data on "${q}" I'll estimate: high variance, meaningful swing in win probability, and at least one metric nobody has invented yet.`,
    // TODO: optional live LLM call — replace `generic()` with a fetch to your
    // model of choice, prompting each persona with its `role`/voice for
    // arbitrary, unseeded questions. Keep this fallback for offline demos.
  };
}

export interface BoothReply {
  persona: Persona;
  text: string;
}

/** Match a free-text query to a seeded moment (keyword overlap) or fall back. */
export function askTheBooth(query: string): { moment?: Moment; replies: BoothReply[] } {
  const q = query.toLowerCase();
  const moment = MOMENTS.find((m) => m.keywords.some((k) => q.includes(k)));
  const responses = moment ? moment.responses : generic(query);
  const replies = PERSONAS.map((p) => ({ persona: p, text: responses[p.id] }));
  return { moment, replies };
}
