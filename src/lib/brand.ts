// ─────────────────────────────────────────────────────────────────────────
// Brand + copy + progression. One friendly daily-mission game.
//
// You get one mission a day, film yourself doing it, a friendly AI gives you
// the ✓ (and it's generous — close counts), you keep your streak alive and
// grow your buddy. Everything player-facing lives here so the tone stays
// consistent and the name is a one-line swap.
// ─────────────────────────────────────────────────────────────────────────

import { Difficulty } from "./types";

/** The brand. Friendly, light, "today's mission" energy. */
export const APP_NAME = "Quest";
export const APP_TAGLINE = "One mission a day.";

/** Every mechanic gets a permanent, plain-language line in the UI. */
export const CODEX = {
  coins: "Spend them in the Shop to unlock new buddies.",
  streak: "Days in a row. Keep it going for bigger rewards!",
  freeze: "Saves your streak on a day you miss. You get 3 a month.",
  xp: "Earned every mission. Harder missions give more.",
  level: "Level up to unlock tougher missions and new buddies.",
  rewards: "Every mission gives coins + XP — and a chance at something rare.",
  mission: "Your mission for today. Finish it before midnight!",
  // The thing the user was confused about — spelled out, friendly, reassuring.
  howAiWorks:
    "Just film yourself doing it. Our friendly AI peeks at a few moments from your clip and gives you the ✓. It's generous — if you clearly gave it a go, it counts. 😊",
} as const;

/** XP awarded for finishing a mission of each difficulty. */
export const XP_FOR: Record<Difficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 35,
};

/** Friendly level titles that climb as XP accrues. */
const LEVEL_TITLES = [
  "Newbie",
  "Rookie",
  "Explorer",
  "Achiever",
  "Champion",
  "Hero",
  "Legend",
  "Superstar",
];

/** XP needed to clear level n (1-indexed): grows so later levels cost more. */
function spanForLevel(level: number): number {
  return 80 + (level - 1) * 40;
}

export interface LevelInfo {
  level: number;
  title: string;
  intoLevel: number;
  span: number;
  nextTitle: string;
  pct: number;
}

/** Derive level from total XP. Pure + deterministic. */
export function levelFromXp(totalXp: number): LevelInfo {
  let level = 1;
  let remaining = Math.max(0, Math.floor(totalXp));
  while (remaining >= spanForLevel(level)) {
    remaining -= spanForLevel(level);
    level += 1;
  }
  const span = spanForLevel(level);
  const titleFor = (lvl: number) => LEVEL_TITLES[Math.min(lvl - 1, LEVEL_TITLES.length - 1)];
  return {
    level,
    title: titleFor(level),
    intoLevel: remaining,
    span,
    nextTitle: titleFor(level + 1),
    pct: span > 0 ? remaining / span : 0,
  };
}
