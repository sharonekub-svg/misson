export type Difficulty = "easy" | "medium" | "hard";
export type VerifyKind = "ai" | "friend";
export type NodeStatus = "completed" | "current" | "locked";
export type Rarity = "rare" | "mega" | "ultra";
export type MobPerk = "bonusCoins" | "streakShield" | null;

/** A stop on the path. `seed` drives its buddy illustration (no emoji). */
export interface QuestNode {
  day: number;
  title: string;
  seed: string;
  difficulty: Difficulty;
  verify: VerifyKind;
  status: NodeStatus;
}

/** A buddy you can unlock in the Shop. Its look is drawn from `id`. */
export interface Mob {
  id: string;
  name: string;
  price: number;
  perk: MobPerk;
  owned: boolean;
}

/** A cosmetic sticker. Its look is drawn from `id`. */
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

/** Difficulty → friendly label + soft colour. */
export const TIER_META: Record<
  Difficulty,
  { tier: string; color: string; baseCoins: number }
> = {
  easy: { tier: "Easy", color: "#2DBE7E", baseCoins: 20 },
  medium: { tier: "Medium", color: "#F5A524", baseCoins: 35 },
  hard: { tier: "Hard", color: "#FF6B6B", baseCoins: 55 },
};

export const RARITY_META: Record<Rarity, { label: string; color: string }> = {
  rare: { label: "RARE", color: "#3B6EF6" },
  mega: { label: "EPIC", color: "#8B5CF6" },
  ultra: { label: "LEGENDARY", color: "#F5A524" },
};

export const PERK_LABEL: Record<NonNullable<MobPerk>, string> = {
  bonusCoins: "+10% coins",
  streakShield: "1 free freeze / wk",
};

/** Weekday → difficulty. JS getDay(): 0=Sun … 6=Sat. */
export function difficultyForWeekday(day: number): Difficulty {
  if (day === 0 || day === 1 || day === 2) return "easy";
  if (day === 3 || day === 4) return "medium";
  return "hard";
}
