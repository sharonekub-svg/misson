export type Difficulty = "easy" | "medium" | "hard";
export type VerifyKind = "ai" | "friend";
export type NodeStatus = "completed" | "current" | "locked";
export type Rarity = "rare" | "mega" | "ultra";
export type MobPerk = "bonusCoins" | "streakShield" | null;

export interface QuestNode {
  day: number;
  title: string;
  emoji: string;
  difficulty: Difficulty;
  verify: VerifyKind;
  status: NodeStatus;
}

export interface Mob {
  id: string;
  name: string;
  emoji: string;
  price: number;
  perk: MobPerk;
  owned: boolean;
}

export interface Accessory {
  id: string;
  name: string;
  emoji: string;
  price: number;
  owned: boolean;
}

export interface ChestReward {
  rarity: Rarity;
  coins: number;
}

export interface Friend {
  name: string;
  emoji: string;
  streak: number;
  finishedToday: boolean;
  isYou: boolean;
}

export interface FriendRequest {
  id: string;
  name: string;
  emoji: string;
}

export type ActivityKind = "finished" | "passed_you" | "milestone" | "added_you";

export interface FriendActivity {
  name: string;
  emoji: string;
  kind: ActivityKind;
  detail: string;
  minutesAgo: number;
}

export const DIFFICULTY_META: Record<
  Difficulty,
  { label: string; color: string; baseCoins: number }
> = {
  easy: { label: "Easy", color: "#34D399", baseCoins: 20 },
  medium: { label: "Medium", color: "#FBBF24", baseCoins: 35 },
  hard: { label: "Hard", color: "#FB7185", baseCoins: 55 },
};

export const RARITY_META: Record<Rarity, { label: string; color: string }> = {
  rare: { label: "RARE", color: "#3B82F6" },
  mega: { label: "MEGA", color: "#A855F7" },
  ultra: { label: "ULTRA", color: "#F59E0B" },
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
