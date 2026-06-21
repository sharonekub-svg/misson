import type { Mob, Accessory } from "./types";

/** Catalogue of mobs/accessories. Prices + perks live here; ownership lives
 *  in Supabase. The `id`s must match what the backend stores. */
export const MOBS: Omit<Mob, "owned">[] = [
  { id: "cat", name: "Pixel Cat", emoji: "🐱", price: 0, perk: null },
  { id: "dog", name: "Sunny Pup", emoji: "🐶", price: 150, perk: null },
  { id: "fox", name: "Ember Fox", emoji: "🦊", price: 220, perk: "bonusCoins" },
  { id: "bear", name: "Cozy Bear", emoji: "🐻", price: 400, perk: "streakShield" },
  { id: "panda", name: "Bamboo Panda", emoji: "🐼", price: 320, perk: null },
  { id: "elephant", name: "Grand Elephant", emoji: "🐘", price: 600, perk: "bonusCoins" },
  { id: "frog", name: "Lily Frog", emoji: "🐸", price: 180, perk: null },
  { id: "penguin", name: "Frost Penguin", emoji: "🐧", price: 260, perk: null },
];

export const ACCESSORIES: Omit<Accessory, "owned">[] = [
  { id: "headphones", name: "Headphones", emoji: "🎧", price: 80 },
  { id: "sunglasses", name: "Sunglasses", emoji: "🕶️", price: 70 },
  { id: "crown", name: "Crown", emoji: "👑", price: 200 },
  { id: "party", name: "Party Hat", emoji: "🎉", price: 90 },
  { id: "bow", name: "Bow Tie", emoji: "🎀", price: 60 },
];

export function emojiForMob(id: string): string {
  return MOBS.find((m) => m.id === id)?.emoji ?? "🐱";
}

export function accessoryById(id: string | null): Omit<Accessory, "owned"> | null {
  if (!id) return null;
  return ACCESSORIES.find((a) => a.id === id) ?? null;
}
