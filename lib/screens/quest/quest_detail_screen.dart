import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/models.dart';
import '../../state/app_state.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_text_styles.dart';
import '../../widgets/badges.dart';
import '../../widgets/squishy_button.dart';
import '../chest/chest_open_screen.dart';

class QuestDetailScreen extends StatefulWidget {
  const QuestDetailScreen({super.key, required this.node});
  final QuestNode node;

  @override
  State<QuestDetailScreen> createState() => _QuestDetailScreenState();
}

class _QuestDetailScreenState extends State<QuestDetailScreen> {
  bool _hasVideo = false;

  void _complete() {
    final state = context.read<AppState>();
    final reward = state.rollChest(widget.node.difficulty);
    Navigator.of(context).pushReplacement(MaterialPageRoute(
      builder: (_) => ChestOpenScreen(reward: reward),
    ));
  }

  @override
  Widget build(BuildContext context) {
    final node = widget.node;
    return Scaffold(
      appBar: AppBar(
        leading: const BackButton(color: AppColors.ink),
        title: Text('Today’s Quest', style: AppText.headline),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Quest card
              Container(
                padding: const EdgeInsets.all(22),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(26),
                  boxShadow: const [
                    BoxShadow(color: AppColors.shadow, blurRadius: 18, offset: Offset(0, 8)),
                  ],
                ),
                child: Column(
                  children: [
                    Container(
                      width: 84,
                      height: 84,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: node.difficulty.color.withValues(alpha: 0.14),
                        shape: BoxShape.circle,
                      ),
                      child: Text(node.emoji, style: const TextStyle(fontSize: 42)),
                    ),
                    const SizedBox(height: 16),
                    Text(node.title,
                        textAlign: TextAlign.center, style: AppText.title),
                    const SizedBox(height: 12),
                    DifficultyChip(difficulty: node.difficulty),
                    const SizedBox(height: 16),
                    _verifyRow(node.verify),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              _rewardPreview(node.difficulty),
              const Spacer(),
              // Film / upload
              _videoZone(),
              const SizedBox(height: 14),
              SquishyButton(
                label: _hasVideo ? 'COMPLETE QUEST' : 'ADD YOUR VIDEO FIRST',
                icon: _hasVideo ? Icons.check_rounded : Icons.lock_rounded,
                onPressed: _hasVideo ? _complete : null,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _verifyRow(VerifyKind verify) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.surfaceAlt,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(verify.icon, size: 18, color: AppColors.inkSoft),
          const SizedBox(width: 8),
          Flexible(child: Text(verify.label, style: AppText.body)),
        ],
      ),
    );
  }

  Widget _rewardPreview(Difficulty difficulty) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text('🎁', style: TextStyle(fontSize: 18)),
        const SizedBox(width: 8),
        Text('Finish to open a chest — up to ${(difficulty.baseCoins * 3)} 🪙',
            style: AppText.body),
      ],
    );
  }

  Widget _videoZone() {
    return GestureDetector(
      onTap: () => setState(() => _hasVideo = true),
      child: Container(
        height: 120,
        decoration: BoxDecoration(
          color: _hasVideo ? AppColors.primarySoft : AppColors.surface,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(
            color: _hasVideo ? AppColors.primary : AppColors.nodeLockedRing,
            width: 2,
            style: BorderStyle.solid,
          ),
        ),
        child: Center(
          child: _hasVideo
              ? Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.check_circle_rounded,
                        color: AppColors.primary, size: 34),
                    const SizedBox(height: 6),
                    Text('Video ready', style: AppText.label),
                    Text('(demo — camera wires up next)', style: AppText.caption),
                  ],
                )
              : Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _videoOption(Icons.videocam_rounded, 'Film it'),
                    const SizedBox(width: 28),
                    _videoOption(Icons.photo_library_rounded, 'Upload'),
                  ],
                ),
        ),
      ),
    );
  }

  Widget _videoOption(IconData icon, String label) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, color: AppColors.primary, size: 30),
        const SizedBox(height: 6),
        Text(label, style: AppText.label),
      ],
    );
  }
}
