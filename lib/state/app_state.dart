import 'dart:math';

import 'package:flutter/foundation.dart';

import '../models/models.dart';

/// In-memory game state so the whole app is playable while we design it.
/// Later this gets backed by Supabase (accounts, friends, streaks, videos).
class AppState extends ChangeNotifier {
  AppState() {
    _seed();
  }

  // ── Player wallet & streak ──
  int coins = 240;
  int streak = 6;
  int freezesLeft = 3; // 3 per month

  // ── Path ──
  final List<QuestNode> path = [];

  // ── Cosmetics ──
  final List<Mob> mobs = [];
  final List<Accessory> accessories = [];
  String equippedMobId = 'cat';
  String? equippedAccessoryId;

  // ── Social ──
  final List<Friend> friends = [];
  final List<FriendRequest> requests = [];
  final List<FriendActivity> activity = [];

  final _rng = Random();

  // ───────────────────────── Derived ─────────────────────────
  Mob get equippedMob => mobs.firstWhere((m) => m.id == equippedMobId);
  Accessory? get equippedAccessory => equippedAccessoryId == null
      ? null
      : accessories.firstWhere((a) => a.id == equippedAccessoryId);

  QuestNode get todayNode =>
      path.firstWhere((n) => n.status == NodeStatus.current, orElse: () => path.last);

  int get unreadActivity => activity.length;
  int get pendingRequests => requests.length;

  // ───────────────────────── Actions ─────────────────────────

  /// Roll a chest. Higher difficulty quests tilt the odds toward better rarities.
  ChestReward rollChest(Difficulty difficulty) {
    final r = _rng.nextDouble();
    final bonus = switch (difficulty) {
      Difficulty.easy => 0.0,
      Difficulty.medium => 0.08,
      Difficulty.hard => 0.18,
    };
    final Rarity rarity;
    if (r < 0.06 + bonus) {
      rarity = Rarity.ultra;
    } else if (r < 0.30 + bonus * 1.5) {
      rarity = Rarity.mega;
    } else {
      rarity = Rarity.rare;
    }

    var coinsWon = (difficulty.baseCoins * rarity.multiplier).round();
    if (equippedMob.perk == MobPerk.bonusCoins) {
      coinsWon = (coinsWon * 1.10).round();
    }
    return ChestReward(rarity: rarity, coins: coinsWon);
  }

  /// Apply a finished quest: bank coins, advance the path, bump the streak.
  void completeQuest(ChestReward reward) {
    coins += reward.coins;
    streak += 1;

    final i = path.indexWhere((n) => n.status == NodeStatus.current);
    if (i != -1) {
      path[i].status = NodeStatus.completed;
      if (i + 1 < path.length) path[i + 1].status = NodeStatus.current;
    }
    notifyListeners();
  }

  bool buyMob(Mob mob) {
    if (mob.owned || coins < mob.price) return false;
    coins -= mob.price;
    mob.owned = true;
    notifyListeners();
    return true;
  }

  bool buyAccessory(Accessory acc) {
    if (acc.owned || coins < acc.price) return false;
    coins -= acc.price;
    acc.owned = true;
    notifyListeners();
    return true;
  }

  void equipMob(String id) {
    equippedMobId = id;
    notifyListeners();
  }

  void toggleAccessory(String id) {
    equippedAccessoryId = equippedAccessoryId == id ? null : id;
    notifyListeners();
  }

  void acceptRequest(FriendRequest req) {
    requests.remove(req);
    friends.add(Friend(name: req.name, emoji: req.emoji, streak: 1));
    _sortFriends();
    notifyListeners();
  }

  void declineRequest(FriendRequest req) {
    requests.remove(req);
    notifyListeners();
  }

  void addFriendByName(String name) {
    if (name.trim().isEmpty) return;
    final emoji = ['🐶', '🐻', '🐘', '🐱', '🦊'][_rng.nextInt(5)];
    friends.add(Friend(name: name.trim(), emoji: emoji, streak: _rng.nextInt(20)));
    _sortFriends();
    notifyListeners();
  }

  void _sortFriends() => friends.sort((a, b) => b.streak.compareTo(a.streak));

  // ───────────────────────── Seed data ─────────────────────────
  void _seed() {
    // A winding path of upcoming quests. Difficulty follows the weekly rhythm
    // starting from today.
    const titles = [
      ('Touch something blue', '🔵'),
      ('Do 10 jumping jacks', '🤸'),
      ('Smile at the camera', '😄'),
      ('Find a green leaf', '🍃'),
      ('Balance on one foot', '🦩'),
      ('Draw a star', '⭐'),
      ('High-five someone', '✋'),
      ('Make a paper plane', '✈️'),
      ('Do a silly dance', '🕺'),
      ('Shoot a ball in a basket', '🏀'),
      ('Stack 5 cups', '🥤'),
      ('Pet an animal', '🐾'),
    ];

    final today = DateTime.now();
    for (var i = 0; i < titles.length; i++) {
      final diff = difficultyForWeekday(today.add(Duration(days: i)).weekday);
      // Harder / action quests get friend verification; the rest are AI.
      final verify = (diff == Difficulty.hard && i.isOdd)
          ? VerifyKind.friend
          : VerifyKind.ai;
      path.add(QuestNode(
        day: i + 1,
        title: titles[i].$1,
        emoji: titles[i].$2,
        difficulty: diff,
        verify: verify,
        status: i == 0 ? NodeStatus.current : NodeStatus.locked,
      ));
    }

    mobs.addAll([
      Mob(id: 'cat', name: 'Pixel Cat', emoji: '🐱', price: 0, owned: true),
      Mob(id: 'dog', name: 'Sunny Pup', emoji: '🐶', price: 150),
      Mob(id: 'fox', name: 'Ember Fox', emoji: '🦊', price: 220, perk: MobPerk.bonusCoins),
      Mob(id: 'bear', name: 'Cozy Bear', emoji: '🐻', price: 400, perk: MobPerk.streakShield),
      Mob(id: 'panda', name: 'Bamboo Panda', emoji: '🐼', price: 320),
      Mob(id: 'elephant', name: 'Grand Elephant', emoji: '🐘', price: 600, perk: MobPerk.bonusCoins),
      Mob(id: 'frog', name: 'Lily Frog', emoji: '🐸', price: 180),
      Mob(id: 'penguin', name: 'Frost Penguin', emoji: '🐧', price: 260),
    ]);

    accessories.addAll([
      Accessory(id: 'headphones', name: 'Headphones', emoji: '🎧', price: 80),
      Accessory(id: 'sunglasses', name: 'Sunglasses', emoji: '🕶️', price: 70),
      Accessory(id: 'crown', name: 'Crown', emoji: '👑', price: 200),
      Accessory(id: 'party', name: 'Party Hat', emoji: '🎉', price: 90),
      Accessory(id: 'bow', name: 'Bow Tie', emoji: '🎀', price: 60),
    ]);

    friends.addAll([
      Friend(name: 'You', emoji: '🐱', streak: streak, finishedToday: false, isYou: true),
      Friend(name: 'Maya', emoji: '🦊', streak: 14, finishedToday: true),
      Friend(name: 'Leo', emoji: '🐻', streak: 9, finishedToday: true),
      Friend(name: 'Sam', emoji: '🐶', streak: 4, finishedToday: false),
      Friend(name: 'Aria', emoji: '🐼', streak: 21, finishedToday: true),
    ]);
    _sortFriends();

    requests.addAll([
      FriendRequest(name: 'Noah', emoji: '🐧', mutuals: 3),
      FriendRequest(name: 'Zoe', emoji: '🐸', mutuals: 1),
    ]);

    activity.addAll([
      FriendActivity(name: 'Aria', emoji: '🐼', kind: ActivityKind.finished, detail: "finished today's quest", minutesAgo: 4),
      FriendActivity(name: 'Maya', emoji: '🦊', kind: ActivityKind.passedYou, detail: 'passed you on the leaderboard', minutesAgo: 22),
      FriendActivity(name: 'Leo', emoji: '🐻', kind: ActivityKind.milestone, detail: 'hit a 9-day streak 🔥', minutesAgo: 60),
      FriendActivity(name: 'Noah', emoji: '🐧', kind: ActivityKind.addedYou, detail: 'sent you a friend request', minutesAgo: 90),
    ]);
  }
}
