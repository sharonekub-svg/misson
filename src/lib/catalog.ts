import type { Mob, Accessory } from "./types";

// The Bestiary roster. Each beast's sigil is drawn deterministically from its
// `id`, so the id is the visual seed — it must stay stable (the backend stores
// it in inventory_mobs / profiles.equipped_mob_id). Original ids are preserved;
// only the names changed when the world became a field bestiary.

export const MOBS: Omit<Mob, "owned">[] = [
  { id: "cat", name: "Cinderpaw", price: 0, perk: null },
  { id: "frog", name: "Mirefang", price: 120, perk: null },
  { id: "dog", name: "Hollowhound", price: 150, perk: null },
  { id: "hollowmark", name: "Gloamcur", price: 200, perk: null },
  { id: "fox", name: "Emberfox", price: 220, perk: "bonusCoins" },
  { id: "penguin", name: "Frostmark", price: 260, perk: null },
  { id: "snarejaw", name: "Snarejaw", price: 290, perk: null },
  { id: "panda", name: "Gloampand", price: 320, perk: null },
  { id: "nocturne", name: "Nocturne", price: 360, perk: null },
  { id: "bear", name: "Grimursa", price: 400, perk: "streakShield" },
  { id: "direling", name: "Direling", price: 500, perk: null },
  { id: "elephant", name: "Tuskbane", price: 600, perk: "bonusCoins" },
  { id: "gloamwyrm", name: "Gloamwyrm", price: 660, perk: null },
  { id: "mawborne", name: "Mawborne", price: 720, perk: "streakShield" },
  { id: "grimhold", name: "Grimhold", price: 820, perk: null },
  { id: "vantamark", name: "Vantamark", price: 900, perk: "bonusCoins" },
  { id: "embermaw", name: "Embermaw", price: 1100, perk: "bonusCoins" },
  { id: "wrathe", name: "Wrathe", price: 1500, perk: "streakShield" },
];

export const ACCESSORIES: Omit<Accessory, "owned">[] = [
  { id: "bow", name: "Hunter's Knot", price: 60 },
  { id: "sunglasses", name: "Ash Visor", price: 70 },
  { id: "headphones", name: "Warhorn", price: 80 },
  { id: "party", name: "Ember Plume", price: 90 },
  { id: "crown", name: "Dread Crown", price: 200 },
];

export function beastName(id: string): string {
  return MOBS.find((m) => m.id === id)?.name ?? "Beast";
}
