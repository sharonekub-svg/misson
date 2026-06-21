import type { Mob, Accessory } from "./types";

// The buddy roster. Each buddy's look is drawn deterministically from its `id`,
// so the id is the visual seed — keep it stable (the backend stores it in
// inventory_mobs / profiles.equipped_mob_id). Only the friendly names changed.

export const MOBS: Omit<Mob, "owned">[] = [
  { id: "cat", name: "Pip", price: 0, perk: null },
  { id: "frog", name: "Sprout", price: 120, perk: null },
  { id: "dog", name: "Biscuit", price: 150, perk: null },
  { id: "hollowmark", name: "Pebble", price: 200, perk: null },
  { id: "fox", name: "Sunny", price: 220, perk: "bonusCoins" },
  { id: "penguin", name: "Frosty", price: 260, perk: null },
  { id: "snarejaw", name: "Nibbles", price: 290, perk: null },
  { id: "panda", name: "Bamboo", price: 320, perk: null },
  { id: "nocturne", name: "Twinkle", price: 360, perk: null },
  { id: "bear", name: "Honey", price: 400, perk: "streakShield" },
  { id: "direling", name: "Comet", price: 500, perk: null },
  { id: "elephant", name: "Peanut", price: 600, perk: "bonusCoins" },
  { id: "gloamwyrm", name: "Noodle", price: 660, perk: null },
  { id: "mawborne", name: "Mochi", price: 720, perk: "streakShield" },
  { id: "grimhold", name: "Rocky", price: 820, perk: null },
  { id: "vantamark", name: "Inky", price: 900, perk: "bonusCoins" },
  { id: "embermaw", name: "Blaze", price: 1100, perk: "bonusCoins" },
  { id: "wrathe", name: "Zippy", price: 1500, perk: "streakShield" },
];

export const ACCESSORIES: Omit<Accessory, "owned">[] = [
  { id: "bow", name: "Bow", price: 60 },
  { id: "sunglasses", name: "Cool Shades", price: 70 },
  { id: "headphones", name: "Headphones", price: 80 },
  { id: "party", name: "Party Hat", price: 90 },
  { id: "crown", name: "Crown", price: 200 },
];

export function buddyName(id: string): string {
  return MOBS.find((m) => m.id === id)?.name ?? "Buddy";
}
