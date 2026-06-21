import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/models.dart';
import '../../state/app_state.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_text_styles.dart';
import '../../widgets/badges.dart';
import '../../widgets/squishy_button.dart';
import '../quest/quest_detail_screen.dart';
import 'tile_path.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  void _openToday(BuildContext context) {
    final state = context.read<AppState>();
    if (state.todayCompleted) return;
    Navigator.of(context).push(MaterialPageRoute(
      builder: (_) => QuestDetailScreen(node: state.todayNode),
    ));
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();

    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: AppColors.skyGradient,
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Stack(
          children: [
            Column(
              children: [
                _Header(state: state),
                Expanded(
                  child: TilePath(
                    nodes: state.path,
                    mobEmoji: state.equippedMob.emoji,
                    accessoryEmoji: state.equippedAccessory?.emoji,
                    onTapCurrent: () => _openToday(context),
                  ),
                ),
              ],
            ),
            // Floating "DUELING GO" call-to-action
            Positioned(
              left: 24,
              right: 24,
              bottom: 18,
              child: SquishyButton(
                label: state.todayCompleted ? 'DONE FOR TODAY 🎉' : 'DUELING GO',
                icon: state.todayCompleted
                    ? Icons.celebration_rounded
                    : Icons.play_arrow_rounded,
                onPressed: state.todayCompleted ? null : () => _openToday(context),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({required this.state});
  final AppState state;

  @override
  Widget build(BuildContext context) {
    final node = state.todayNode;
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Up Mission', style: AppText.title),
                    Text('Today • ${node.difficulty.label} quest',
                        style: AppText.body),
                  ],
                ),
              ),
              StatPill(icon: '🔥', value: '${state.streak}', color: AppColors.streak),
              const SizedBox(width: 8),
              StatPill(icon: '🪙', value: '${state.coins}', color: AppColors.goldDark),
              const SizedBox(width: 8),
              StatPill(icon: '❄️', value: '${state.freezesLeft}', color: AppColors.rare),
            ],
          ),
        ],
      ),
    );
  }
}
