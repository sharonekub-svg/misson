import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

/// A round, friendly avatar that shows the player's mob (an emoji animal) with
/// an optional accessory tucked in the corner. Asset-free, so it just works.
class MobAvatar extends StatelessWidget {
  const MobAvatar({
    super.key,
    required this.emoji,
    this.accessoryEmoji,
    this.size = 64,
    this.ringColor = AppColors.primary,
    this.background = AppColors.primarySoft,
  });

  final String emoji;
  final String? accessoryEmoji;
  final double size;
  final Color ringColor;
  final Color background;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              color: background,
              shape: BoxShape.circle,
              border: Border.all(color: ringColor, width: size * 0.05),
              boxShadow: [
                BoxShadow(
                  color: ringColor.withValues(alpha: 0.18),
                  blurRadius: size * 0.18,
                  offset: Offset(0, size * 0.08),
                ),
              ],
            ),
            alignment: Alignment.center,
            child: Text(emoji, style: TextStyle(fontSize: size * 0.5)),
          ),
          if (accessoryEmoji != null)
            Positioned(
              right: -size * 0.06,
              top: -size * 0.06,
              child: Container(
                padding: EdgeInsets.all(size * 0.06),
                decoration: const BoxDecoration(
                  color: AppColors.surface,
                  shape: BoxShape.circle,
                ),
                child: Text(accessoryEmoji!,
                    style: TextStyle(fontSize: size * 0.26)),
              ),
            ),
        ],
      ),
    );
  }
}
