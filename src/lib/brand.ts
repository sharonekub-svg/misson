// ─────────────────────────────────────────────────────────────────────────
// BOUNTY — central brand + copy + progression logic.
//
// The whole identity is anchored here. The app is a *field bestiary*: you are a
// Warden, and every day a beast surfaces (your "Mission of the Day"). You face
// it by completing a real-world challenge on camera, fell it, and claim spoils.
//
// One constant owns the brand name — swap it here and it changes everywhere.
// ─────────────────────────────────────────────────────────────────────────

import { Difficulty } from "./types";

/** The brand. Mission framing kept; sounds like a game, not an edu-app. */
export const APP_NAME = "BOUNTY";
export const APP_TAGLINE = "Hunt the day.";

/** Every mechanic gets a permanent, 10-second-readable line in the UI. */
export const CODEX = {
  spoils: "Spoils. Spend them in the Bestiary to recruit new beasts.",
  flame: "Days hunted in a row. Keep it lit for bigger spoils.",
  ward: "Protects your Flame for one missed day. You get 3 a month.",
  xp: "Earned by felling beasts. Harder beasts give more.",
  rank: "Raises your rank and unlocks tougher beasts.",
  rewards: "Every felled beast drops coins + XP. Dire beasts drop rarer kin.",
  mission: "The beast that surfaced today. Fell it before midnight.",
  verifyAi: "The Warden's eye reads your footage to confirm the kill.",
  verifyFriend: "An ally must witness and confirm this kill.",
} as const;

/** XP awarded for felling a beast of each tier. Harder beasts give more. */
export const XP_FOR: Record<Difficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 35,
};

/** Rank titles climb as XP accrues. The last entry covers everything beyond. */
const RANK_TITLES = [
  "Novice",
  "Tracker",
  "Hunter",
  "Ranger",
  "Warden",
  "Beastbound",
  "Dread Warden",
  "Mythic Warden",
];

/** XP needed to clear level n (1-indexed): grows so later ranks cost more. */
function spanForLevel(level: number): number {
  return 80 + (level - 1) * 40;
}

export interface RankInfo {
  level: number;
  title: string;
  /** XP earned inside the current level. */
  intoLevel: number;
  /** XP span of the current level. */
  span: number;
  /** Title of the next rank (what the bar is climbing toward). */
  nextTitle: string;
  /** 0..1 progress through the current level. */
  pct: number;
}

/** Derive rank/level from a total XP figure. Pure + deterministic. */
export function rankFromXp(totalXp: number): RankInfo {
  let level = 1;
  let remaining = Math.max(0, Math.floor(totalXp));
  while (remaining >= spanForLevel(level)) {
    remaining -= spanForLevel(level);
    level += 1;
  }
  const span = spanForLevel(level);
  const titleFor = (lvl: number) =>
    RANK_TITLES[Math.min(lvl - 1, RANK_TITLES.length - 1)];
  return {
    level,
    title: titleFor(level),
    intoLevel: remaining,
    span,
    nextTitle: titleFor(level + 1),
    pct: span > 0 ? remaining / span : 0,
  };
}
