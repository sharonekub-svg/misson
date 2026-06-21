import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../state/app_state.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_text_styles.dart';
import '../../widgets/mob_avatar.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final mob = state.equippedMob;

    return SafeArea(
      bottom: false,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 100),
        children: [
          Text('Your Mob', style: AppText.title),
          const SizedBox(height: 20),
          Center(
            child: MobAvatar(
              emoji: mob.emoji,
              accessoryEmoji: state.equippedAccessory?.emoji,
              size: 150,
            ),
          ),
          const SizedBox(height: 14),
          Center(child: Text(mob.name, style: AppText.title)),
          if (mob.perk.label != null)
            Center(
              child: Padding(
                padding: const EdgeInsets.only(top: 6),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                  decoration: BoxDecoration(
                    color: AppColors.mega.withValues(alpha: 0.14),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text('Perk: ${mob.perk.label}',
                      style: AppText.caption.copyWith(color: AppColors.mega)),
                ),
              ),
            ),
          const SizedBox(height: 28),
          Row(
            children: [
              _stat('🔥', '${state.streak}', 'Day streak', AppColors.streak),
              const SizedBox(width: 12),
              _stat('🪙', '${state.coins}', 'Coins', AppColors.goldDark),
              const SizedBox(width: 12),
              _stat('❄️', '${state.freezesLeft}', 'Freezes', AppColors.rare),
            ],
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(22),
              boxShadow: const [
                BoxShadow(color: AppColors.shadow, blurRadius: 12, offset: Offset(0, 5)),
              ],
            ),
            child: Row(
              children: [
                const Text('❄️', style: TextStyle(fontSize: 26)),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Streak freezes', style: AppText.label),
                      Text('You get 3 every month. Use one to save your streak on a missed day.',
                          style: AppText.body),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _stat(String icon, String value, String label, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          boxShadow: const [
            BoxShadow(color: AppColors.shadow, blurRadius: 10, offset: Offset(0, 4)),
          ],
        ),
        child: Column(
          children: [
            Text(icon, style: const TextStyle(fontSize: 22)),
            const SizedBox(height: 6),
            Text(value, style: AppText.headline.copyWith(color: color)),
            Text(label, style: AppText.caption),
          ],
        ),
      ),
    );
  }
}
