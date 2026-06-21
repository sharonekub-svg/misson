import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

/// ───────────────────────── Difficulty ─────────────────────────
/// Weekly rhythm: Sun/Mon/Tue = easy, Wed/Thu = medium, Fri/Sat = hard.
enum Difficulty { easy, medium, hard }

extension DifficultyX on Difficulty {
  String get label => switch (this) {
        Difficulty.easy => 'Easy',
        Difficulty.medium => 'Medium',
        Difficulty.hard => 'Hard',
      };

  Color get color => switch (this) {
        Difficulty.easy => AppColors.easy,
        Difficulty.medium => AppColors.medium,
        Difficulty.hard => AppColors.hard,
      };

  /// Base coins a quest of this difficulty is worth before the chest multiplier.
  int get baseCoins => switch (this) {
        Difficulty.easy => 20,
        Difficulty.medium => 35,
        Difficulty.hard => 55,
      };
}

/// Map a weekday (DateTime.weekday: Mon=1 … Sun=7) to the daily difficulty.
Difficulty difficultyForWeekday(int weekday) {
  switch (weekday) {
    case DateTime.sunday:
    case DateTime.monday:
    case DateTime.tuesday:
      return Difficulty.easy;
    case DateTime.wednesday:
    case DateTime.thursday:
      return Difficulty.medium;
    default: // Friday, Saturday
      return Difficulty.hard;
  }
}

/// How a quest's video is checked.
enum VerifyKind { ai, friend }

extension VerifyKindX on VerifyKind {
  String get label =>
      this == VerifyKind.ai ? 'AI checks your video' : 'A friend confirms it';
  IconData get icon =>
      this == VerifyKind.ai ? Icons.auto_awesome_rounded : Icons.group_rounded;
}

/// ───────────────────────── Quest node ─────────────────────────
enum NodeStatus { completed, current, locked }

class QuestNode {
  QuestNode({
    required this.day,
    required this.title,
    required this.emoji,
    required this.difficulty,
    required this.verify,
    this.status = NodeStatus.locked,
  });

  final int day; // 1-based position on the path
  final String title;
  final String emoji;
  final Difficulty difficulty;
  final VerifyKind verify;
  NodeStatus status;
}

/// ───────────────────────── Mobs & cosmetics ─────────────────────────
/// A "perk" some premium mobs carry.
enum MobPerk { none, bonusCoins, streakShield }

extension MobPerkX on MobPerk {
  String? get label => switch (this) {
        MobPerk.none => null,
        MobPerk.bonusCoins => '+10% coins',
        MobPerk.streakShield => '1 free freeze / wk',
      };
}

class Mob {
  Mob({
    required this.id,
    required this.name,
    required this.emoji,
    required this.price,
    this.perk = MobPerk.none,
    this.owned = false,
  });

  final String id;
  final String name;
  final String emoji;
  final int price; // coins; 0 = default/free
  final MobPerk perk;
  bool owned;
}

class Accessory {
  Accessory({
    required this.id,
    required this.name,
    required this.emoji,
    required this.price,
    this.owned = false,
  });

  final String id;
  final String name;
  final String emoji;
  final int price;
  bool owned;
}

/// ───────────────────────── Chests ─────────────────────────
enum Rarity { rare, mega, ultra }

extension RarityX on Rarity {
  String get label => switch (this) {
        Rarity.rare => 'RARE',
        Rarity.mega => 'MEGA',
        Rarity.ultra => 'ULTRA',
      };

  Color get color => switch (this) {
        Rarity.rare => AppColors.rare,
        Rarity.mega => AppColors.mega,
        Rarity.ultra => AppColors.ultra,
      };

  /// Coin multiplier applied to the quest's base coins.
  double get multiplier => switch (this) {
        Rarity.rare => 1.0,
        Rarity.mega => 1.8,
        Rarity.ultra => 3.0,
      };
}

class ChestReward {
  ChestReward({required this.rarity, required this.coins});
  final Rarity rarity;
  final int coins;
}

/// ───────────────────────── Social ─────────────────────────
class Friend {
  Friend({
    required this.name,
    required this.emoji,
    required this.streak,
    this.finishedToday = false,
    this.isYou = false,
  });

  final String name;
  final String emoji; // their equipped mob
  final int streak;
  final bool finishedToday;
  final bool isYou;
}

class FriendRequest {
  FriendRequest({required this.id, required this.name, required this.emoji});
  final String id;
  final String name;
  final String emoji;
}

enum ActivityKind { finished, passedYou, milestone, addedYou }

class FriendActivity {
  FriendActivity({
    required this.name,
    required this.emoji,
    required this.kind,
    required this.detail,
    required this.minutesAgo,
  });

  final String name;
  final String emoji;
  final ActivityKind kind;
  final String detail;
  final int minutesAgo;
}
