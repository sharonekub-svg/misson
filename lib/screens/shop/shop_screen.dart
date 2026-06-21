import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/models.dart';
import '../../state/app_state.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_text_styles.dart';
import '../../widgets/badges.dart';

class ShopScreen extends StatelessWidget {
  const ShopScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    return DefaultTabController(
      length: 2,
      child: SafeArea(
        bottom: false,
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 4),
              child: Row(
                children: [
                  Expanded(child: Text('Shop', style: AppText.title)),
                  StatPill(icon: '🪙', value: '${state.coins}', color: AppColors.goldDark),
                ],
              ),
            ),
            TabBar(
              indicatorColor: AppColors.primary,
              indicatorWeight: 3,
              labelColor: AppColors.ink,
              unselectedLabelColor: AppColors.inkFaint,
              labelStyle: AppText.label,
              tabs: const [Tab(text: 'Mobs'), Tab(text: 'Designs')],
            ),
            Expanded(
              child: TabBarView(
                children: [
                  _MobGrid(state: state),
                  _AccessoryGrid(state: state),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MobGrid extends StatelessWidget {
  const _MobGrid({required this.state});
  final AppState state;

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 100),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 14,
        crossAxisSpacing: 14,
        childAspectRatio: 0.78,
      ),
      itemCount: state.mobs.length,
      itemBuilder: (context, i) {
        final mob = state.mobs[i];
        final equipped = state.equippedMobId == mob.id;
        return _ShopCard(
          emoji: mob.emoji,
          name: mob.name,
          price: mob.price,
          owned: mob.owned,
          equipped: equipped,
          perk: mob.perk.label,
          onTap: () {
            if (!mob.owned) {
              _buy(context, () => state.buyMob(mob), mob.name);
            } else {
              state.equipMob(mob.id);
            }
          },
        );
      },
    );
  }
}

class _AccessoryGrid extends StatelessWidget {
  const _AccessoryGrid({required this.state});
  final AppState state;

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 100),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 14,
        crossAxisSpacing: 14,
        childAspectRatio: 0.78,
      ),
      itemCount: state.accessories.length,
      itemBuilder: (context, i) {
        final acc = state.accessories[i];
        final equipped = state.equippedAccessoryId == acc.id;
        return _ShopCard(
          emoji: acc.emoji,
          name: acc.name,
          price: acc.price,
          owned: acc.owned,
          equipped: equipped,
          onTap: () {
            if (!acc.owned) {
              _buy(context, () => state.buyAccessory(acc), acc.name);
            } else {
              state.toggleAccessory(acc.id);
            }
          },
        );
      },
    );
  }
}

void _buy(BuildContext context, bool Function() action, String name) {
  final ok = action();
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(
      behavior: SnackBarBehavior.floating,
      backgroundColor: ok ? AppColors.primaryDark : AppColors.hard,
      content: Text(ok ? 'Unlocked $name! 🎉' : 'Not enough coins yet'),
    ));
}

class _ShopCard extends StatelessWidget {
  const _ShopCard({
    required this.emoji,
    required this.name,
    required this.price,
    required this.owned,
    required this.equipped,
    required this.onTap,
    this.perk,
  });

  final String emoji;
  final String name;
  final int price;
  final bool owned;
  final bool equipped;
  final VoidCallback onTap;
  final String? perk;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(
            color: equipped ? AppColors.primary : Colors.transparent,
            width: 2.5,
          ),
          boxShadow: const [
            BoxShadow(color: AppColors.shadow, blurRadius: 12, offset: Offset(0, 5)),
          ],
        ),
        child: Column(
          children: [
            const Spacer(),
            Text(emoji, style: const TextStyle(fontSize: 52)),
            const Spacer(),
            Text(name, style: AppText.label, textAlign: TextAlign.center),
            if (perk != null) ...[
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.mega.withValues(alpha: 0.14),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(perk!,
                    style: AppText.caption.copyWith(color: AppColors.mega)),
              ),
            ],
            const SizedBox(height: 10),
            _actionPill(),
          ],
        ),
      ),
    );
  }

  Widget _actionPill() {
    final String text;
    final Color bg;
    final Color fg;
    if (equipped) {
      text = 'Equipped';
      bg = AppColors.primarySoft;
      fg = AppColors.primaryDark;
    } else if (owned) {
      text = 'Equip';
      bg = AppColors.surfaceAlt;
      fg = AppColors.ink;
    } else {
      text = price == 0 ? 'Free' : '🪙 $price';
      bg = AppColors.gold.withValues(alpha: 0.16);
      fg = AppColors.goldDark;
    }
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 9),
      alignment: Alignment.center,
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(40)),
      child: Text(text, style: AppText.label.copyWith(color: fg)),
    );
  }
}
