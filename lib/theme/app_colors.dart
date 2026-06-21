import 'package:flutter/material.dart';

/// Up Mission palette.
///
/// The mood we want: **calm + alive**. Soft cloudy backgrounds, lots of
/// breathing room, with one lively emerald-mint as the "energy" colour and
/// warm gold for rewards. Difficulty and chest rarity each get their own
/// readable accent so the screen always tells you what's going on at a glance.
class AppColors {
  AppColors._();

  // Surfaces & ink
  static const Color background = Color(0xFFF6F7FB); // soft cloud
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceAlt = Color(0xFFEFF1F7);
  static const Color ink = Color(0xFF1F2330); // primary text (dark slate)
  static const Color inkSoft = Color(0xFF6B7280); // secondary text
  static const Color inkFaint = Color(0xFFAEB4C2); // hints / locked

  // Brand — the "alive" energy colour (emerald / mint)
  static const Color primary = Color(0xFF1FC99B);
  static const Color primaryDark = Color(0xFF10A982); // 3D button base / pressed
  static const Color primarySoft = Color(0xFFE3FBF3); // tinted backgrounds

  // Rewards (coins, gold)
  static const Color gold = Color(0xFFFFB020);
  static const Color goldDark = Color(0xFFE0911A);

  // Difficulty
  static const Color easy = Color(0xFF34D399);
  static const Color medium = Color(0xFFFBBF24);
  static const Color hard = Color(0xFFFB7185);

  // Chest rarity
  static const Color rare = Color(0xFF3B82F6); // blue
  static const Color mega = Color(0xFFA855F7); // purple
  static const Color ultra = Color(0xFFF59E0B); // gold

  // Streak / fire
  static const Color streak = Color(0xFFFF7A45);

  // Path
  static const Color nodeLocked = Color(0xFFE3E6EE);
  static const Color nodeLockedRing = Color(0xFFCFD4E0);
  static const Color pathLine = Color(0xFFE0E4EE);

  // Shadows
  static const Color shadow = Color(0x1A2A2F45);

  // Calm header gradient
  static const List<Color> skyGradient = [Color(0xFFEFFCF6), Color(0xFFF6F7FB)];
  static const List<Color> primaryGradient = [Color(0xFF2BD9AB), Color(0xFF12B488)];
}
