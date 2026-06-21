import 'package:flutter/material.dart';

import '../models/models.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

/// Little rounded "stat pill" used in the top bar (coins, streak, freezes).
class StatPill extends StatelessWidget {
  const StatPill({
    super.key,
    required this.icon,
    required this.value,
    required this.color,
  });

  final String icon; // emoji
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(40),
        boxShadow: const [
          BoxShadow(color: AppColors.shadow, blurRadius: 10, offset: Offset(0, 4)),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(icon, style: const TextStyle(fontSize: 16)),
          const SizedBox(width: 6),
          Text(value, style: AppText.label.copyWith(color: color)),
        ],
      ),
    );
  }
}

/// Coloured capsule that names a quest's difficulty.
class DifficultyChip extends StatelessWidget {
  const DifficultyChip({super.key, required this.difficulty, this.compact = false});

  final Difficulty difficulty;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: compact ? 10 : 14, vertical: compact ? 5 : 7),
      decoration: BoxDecoration(
        color: difficulty.color.withValues(alpha: 0.16),
        borderRadius: BorderRadius.circular(40),
      ),
      child: Text(
        difficulty.label.toUpperCase(),
        style: AppText.caption.copyWith(
          color: difficulty.color == AppColors.medium
              ? AppColors.goldDark
              : difficulty.color,
          fontWeight: FontWeight.w800,
          fontSize: compact ? 10 : 12,
        ),
      ),
    );
  }
}
