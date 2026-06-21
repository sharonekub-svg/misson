import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:video_thumbnail/video_thumbnail.dart';

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
  XFile? _video;
  bool _busy = false;
  final _picker = ImagePicker();

  Future<void> _pick(ImageSource source) async {
    try {
      final file = await _picker.pickVideo(
        source: source,
        maxDuration: const Duration(seconds: 30),
      );
      if (file != null) setState(() => _video = file);
    } catch (e) {
      _snack('Could not get the video: $e');
    }
  }

  Future<void> _submit() async {
    if (_video == null || _busy) return;
    setState(() => _busy = true);
    final state = context.read<AppState>();
    try {
      final bytes = await _video!.readAsBytes();

      // For AI-checked quests, grab a frame to send to the verifier.
      Uint8List? thumb;
      if (widget.node.verify == VerifyKind.ai) {
        thumb = await VideoThumbnail.thumbnailData(
          video: _video!.path,
          imageFormat: ImageFormat.JPEG,
          maxWidth: 512,
          quality: 60,
        );
      }

      final result = await state.submitTodayQuest(bytes, thumb);
      if (!mounted) return;

      if (result.verified && result.reward != null) {
        Navigator.of(context).pushReplacement(MaterialPageRoute(
          builder: (_) => ChestOpenScreen(reward: result.reward!),
        ));
      } else {
        setState(() => _busy = false);
        _snack('Not quite: ${result.reason}', error: true);
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => _busy = false);
      _snack('Something went wrong: $e', error: true);
    }
  }

  void _snack(String msg, {bool error = false}) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(
        behavior: SnackBarBehavior.floating,
        backgroundColor: error ? AppColors.hard : AppColors.primaryDark,
        content: Text(msg),
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
        child: Stack(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _questCard(node),
                  const SizedBox(height: 18),
                  _rewardPreview(node.difficulty),
                  const Spacer(),
                  _videoZone(),
                  const SizedBox(height: 14),
                  SquishyButton(
                    label: _video != null ? 'COMPLETE QUEST' : 'ADD YOUR VIDEO FIRST',
                    icon: _video != null ? Icons.check_rounded : Icons.lock_rounded,
                    onPressed: (_video != null && !_busy) ? _submit : null,
                  ),
                ],
              ),
            ),
            if (_busy) _busyOverlay(node.verify),
          ],
        ),
      ),
    );
  }

  Widget _questCard(QuestNode node) {
    return Container(
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
          Text(node.title, textAlign: TextAlign.center, style: AppText.title),
          const SizedBox(height: 12),
          DifficultyChip(difficulty: node.difficulty),
          const SizedBox(height: 16),
          _verifyRow(node.verify),
        ],
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
        Text('Finish to open a chest — up to ${difficulty.baseCoins * 3} 🪙',
            style: AppText.body),
      ],
    );
  }

  Widget _videoZone() {
    final hasVideo = _video != null;
    return RepaintBoundary(
      child: Container(
        height: 120,
        decoration: BoxDecoration(
          color: hasVideo ? AppColors.primarySoft : AppColors.surface,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(
            color: hasVideo ? AppColors.primary : AppColors.nodeLockedRing,
            width: 2,
          ),
        ),
        child: Center(
          child: hasVideo
              ? Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.check_circle_rounded,
                        color: AppColors.primary, size: 34),
                    const SizedBox(height: 6),
                    Text('Video ready', style: AppText.label),
                    TextButton(
                      onPressed: () => setState(() => _video = null),
                      child: const Text('Replace'),
                    ),
                  ],
                )
              : Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _videoOption(Icons.videocam_rounded, 'Film it',
                        () => _pick(ImageSource.camera)),
                    const SizedBox(width: 28),
                    _videoOption(Icons.photo_library_rounded, 'Upload',
                        () => _pick(ImageSource.gallery)),
                  ],
                ),
        ),
      ),
    );
  }

  Widget _videoOption(IconData icon, String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: AppColors.primary, size: 30),
          const SizedBox(height: 6),
          Text(label, style: AppText.label),
        ],
      ),
    );
  }

  Widget _busyOverlay(VerifyKind verify) {
    return Positioned.fill(
      child: Container(
        color: Colors.black.withValues(alpha: 0.45),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircularProgressIndicator(color: Colors.white),
              const SizedBox(height: 16),
              Text(
                verify == VerifyKind.ai
                    ? 'Checking your video with AI…'
                    : 'Uploading your video…',
                style: AppText.label.copyWith(color: Colors.white),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
