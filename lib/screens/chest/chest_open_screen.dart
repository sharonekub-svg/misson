import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/models.dart';
import '../../state/app_state.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_text_styles.dart';
import '../../widgets/squishy_button.dart';

/// Tap the chest → it pops open and reveals the rarity + coins won.
class ChestOpenScreen extends StatefulWidget {
  const ChestOpenScreen({super.key, required this.reward});
  final ChestReward reward;

  @override
  State<ChestOpenScreen> createState() => _ChestOpenScreenState();
}

class _ChestOpenScreenState extends State<ChestOpenScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _c =
      AnimationController(vsync: this, duration: const Duration(milliseconds: 650));
  bool _opened = false;

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  void _open() {
    if (_opened) return;
    setState(() => _opened = true);
    _c.forward();
    // Bank the reward + advance the streak/path.
    context.read<AppState>().completeQuest(widget.reward);
  }

  @override
  Widget build(BuildContext context) {
    final rarity = widget.reward.rarity;
    return Scaffold(
      backgroundColor: AppColors.ink,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const Spacer(),
              if (_opened) _rarityBanner(rarity),
              const SizedBox(height: 24),
              GestureDetector(
                onTap: _open,
                child: AnimatedBuilder(
                  animation: _c,
                  builder: (context, _) {
                    final glow = 0.25 + 0.55 * _c.value;
                    final lift = -18 * _c.value;
                    return Container(
                      width: 200,
                      height: 200,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: RadialGradient(colors: [
                          rarity.color.withValues(alpha: _opened ? glow : 0.25),
                          Colors.transparent,
                        ]),
                      ),
                      child: Transform.translate(
                        offset: Offset(0, _opened ? lift : 0),
                        child: Text(
                          _opened ? '🎉' : '🎁',
                          style: const TextStyle(fontSize: 96),
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),
              if (_opened)
                _coinReveal()
              else
                Text('Tap the chest to open it',
                    style: AppText.body.copyWith(color: Colors.white70)),
              const Spacer(),
              if (_opened)
                SquishyButton(
                  label: 'COLLECT',
                  icon: Icons.check_rounded,
                  onPressed: () =>
                      Navigator.of(context).popUntil((r) => r.isFirst),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _rarityBanner(Rarity rarity) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 10),
      decoration: BoxDecoration(
        color: rarity.color.withValues(alpha: 0.18),
        borderRadius: BorderRadius.circular(40),
        border: Border.all(color: rarity.color, width: 2),
      ),
      child: Text('${rarity.label} CHEST',
          style: AppText.headline.copyWith(
              color: rarity.color, letterSpacing: 1.5)),
    );
  }

  Widget _coinReveal() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('🪙', style: TextStyle(fontSize: 30)),
            const SizedBox(width: 8),
            Text('+${widget.reward.coins}',
                style: AppText.display.copyWith(color: AppColors.gold, fontSize: 40)),
          ],
        ),
        const SizedBox(height: 4),
        Text('Streak extended! 🔥',
            style: AppText.body.copyWith(color: Colors.white70)),
      ],
    );
  }
}
