import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/models.dart';
import '../../state/app_state.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_text_styles.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final friends = state.friends; // already sorted by streak desc

    return SafeArea(
      bottom: false,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 0),
            child: Text('Friends League', style: AppText.title),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 2, 20, 12),
            child: Text('Longest streaks this week 🔥', style: AppText.body),
          ),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 100),
              itemCount: friends.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, i) => _Row(rank: i + 1, friend: friends[i]),
            ),
          ),
        ],
      ),
    );
  }
}

class _Row extends StatelessWidget {
  const _Row({required this.rank, required this.friend});
  final int rank;
  final Friend friend;

  @override
  Widget build(BuildContext context) {
    final podium = rank <= 3;
    final medal = switch (rank) { 1 => '🥇', 2 => '🥈', 3 => '🥉', _ => '$rank' };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: friend.isYou ? AppColors.primarySoft : AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: friend.isYou ? AppColors.primary : Colors.transparent,
          width: 2,
        ),
        boxShadow: const [
          BoxShadow(color: AppColors.shadow, blurRadius: 10, offset: Offset(0, 4)),
        ],
      ),
      child: Row(
        children: [
          SizedBox(
            width: 30,
            child: Text(medal,
                textAlign: TextAlign.center,
                style: podium
                    ? const TextStyle(fontSize: 20)
                    : AppText.label.copyWith(color: AppColors.inkFaint)),
          ),
          const SizedBox(width: 6),
          CircleAvatar(
            radius: 20,
            backgroundColor: AppColors.surfaceAlt,
            child: Text(friend.emoji, style: const TextStyle(fontSize: 20)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(friend.isYou ? '${friend.name} (you)' : friend.name,
                    style: AppText.label),
                Text(
                  friend.finishedToday ? 'Done today ✓' : 'Not yet today',
                  style: AppText.caption.copyWith(
                    color: friend.finishedToday ? AppColors.primary : AppColors.inkFaint,
                  ),
                ),
              ],
            ),
          ),
          Row(
            children: [
              Text('${friend.streak}', style: AppText.headline.copyWith(color: AppColors.streak)),
              const SizedBox(width: 4),
              const Text('🔥', style: TextStyle(fontSize: 16)),
            ],
          ),
        ],
      ),
    );
  }
}
