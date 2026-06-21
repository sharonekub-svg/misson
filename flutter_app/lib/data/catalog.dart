import '../models/models.dart';

/// The canonical catalogue of mobs and accessories. Prices and perks live here
/// in the client; *ownership* and the equipped selection live in Supabase.
/// The `id`s must match what the backend stores (inventory + profile).
class Catalog {
  Catalog._();

  static final List<Mob> mobs = [
    Mob(id: 'cat', name: 'Pixel Cat', emoji: '🐱', price: 0),
    Mob(id: 'dog', name: 'Sunny Pup', emoji: '🐶', price: 150),
    Mob(id: 'fox', name: 'Ember Fox', emoji: '🦊', price: 220, perk: MobPerk.bonusCoins),
    Mob(id: 'bear', name: 'Cozy Bear', emoji: '🐻', price: 400, perk: MobPerk.streakShield),
    Mob(id: 'panda', name: 'Bamboo Panda', emoji: '🐼', price: 320),
    Mob(id: 'elephant', name: 'Grand Elephant', emoji: '🐘', price: 600, perk: MobPerk.bonusCoins),
    Mob(id: 'frog', name: 'Lily Frog', emoji: '🐸', price: 180),
    Mob(id: 'penguin', name: 'Frost Penguin', emoji: '🐧', price: 260),
  ];

  static final List<Accessory> accessories = [
    Accessory(id: 'headphones', name: 'Headphones', emoji: '🎧', price: 80),
    Accessory(id: 'sunglasses', name: 'Sunglasses', emoji: '🕶️', price: 70),
    Accessory(id: 'crown', name: 'Crown', emoji: '👑', price: 200),
    Accessory(id: 'party', name: 'Party Hat', emoji: '🎉', price: 90),
    Accessory(id: 'bow', name: 'Bow Tie', emoji: '🎀', price: 60),
  ];

  static Mob mobById(String id) =>
      mobs.firstWhere((m) => m.id == id, orElse: () => mobs.first);

  static String emojiForMob(String id) => mobById(id).emoji;

  static Accessory? accessoryById(String? id) {
    if (id == null) return null;
    for (final a in accessories) {
      if (a.id == id) return a;
    }
    return null;
  }
}
