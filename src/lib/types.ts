export type Difficulty = "easy" | "medium" | "hard";
export type VerifyKind = "ai" | "friend";
export type NodeStatus = "completed" | "current" | "locked";
export type Rarity = "rare" | "mega" | "ultra";
export type MobPerk = "bonusCoins" | "streakShield" | null;

/** A node on the Trail. `seed` drives its sigil-beast (no emoji). */
export interface QuestNode {
  day: number;
  title: string;
  seed: string;
  difficulty: Difficulty;
  verify: VerifyKind;
  status: NodeStatus;
}

/** A recruitable creature in the Bestiary. Its sigil is drawn from `id`. */
export interface Mob {
  id: string;
  name: string;
  price: number;
  perk: MobPerk;
  owned: boolean;
}

/** A cosmetic Mark. Its sigil glyph is drawn from `id`. */
export interface Accessory {
  id: string;
  name: string;
  price: number;
  owned: boolean;
}

export interface ChestReward {
  rarity: Rarity;
  coins: number;
  xp: number;
}

export interface Friend {
  name: string;
  seed: string;
  streak: number;
  finishedToday: boolean;
  isYou: boolean;
}

export interface FriendRequest {
  id: string;
  name: string;
  seed: string;
}

export type ActivityKind = "finished" | "passed_you" | "milestone" | "added_you";

export interface FriendActivity {
  name: string;
  seed: string;
  kind: ActivityKind;
  detail: string;
  minutesAgo: number;
}

/** Difficulty → tier identity (rune colour + name). The danger language. */
export const TIER_META: Record<
  Difficulty,
  { tier: string; color: string; baseCoins: number }
> = {
  easy: { tier: "Lesser", color: "#46C26A", baseCoins: 20 },
  medium: { tier: "Greater", color: "#E2B53C", baseCoins: 35 },
  hard: { tier: "Dire", color: "#E5484D", baseCoins: 55 },
};

export const RARITY_META: Record<Rarity, { label: string; color: string }> = {
  rare: { label: "RARE", color: "#5B8CFF" },
  mega: { label: "MEGA", color: "#B06BFF" },
  ultra: { label: "ULTRA", color: "#FF6A2B" },
};

export const PERK_LABEL: Record<NonNullable<MobPerk>, string> = {
  bonusCoins: "+10% spoils",
  streakShield: "1 free Ward / wk",
};

/** Weekday → difficulty. JS getDay(): 0=Sun … 6=Sat. */
export function difficultyForWeekday(day: number): Difficulty {
  if (day === 0 || day === 1 || day === 2) return "easy";
  if (day === 3 || day === 4) return "medium";
  return "hard";
}
