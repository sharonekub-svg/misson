import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/app_state.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import 'friends/friends_screen.dart';
import 'home/home_screen.dart';
import 'leaderboard/leaderboard_screen.dart';
import 'profile/profile_screen.dart';
import 'shop/shop_screen.dart';

class RootScaffold extends StatefulWidget {
  const RootScaffold({super.key});

  @override
  State<RootScaffold> createState() => _RootScaffoldState();
}

class _RootScaffoldState extends State<RootScaffold> {
  int _index = 0;

  static const _pages = [
    HomeScreen(),
    ShopScreen(),
    LeaderboardScreen(),
    FriendsScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    return Scaffold(
      body: IndexedStack(index: _index, children: _pages),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: AppColors.surface,
          boxShadow: [
            BoxShadow(color: AppColors.shadow, blurRadius: 16, offset: Offset(0, -2)),
          ],
        ),
        child: SafeArea(
          top: false,
          child: NavigationBarTheme(
            data: NavigationBarThemeData(
              backgroundColor: AppColors.surface,
              indicatorColor: AppColors.primarySoft,
              labelTextStyle: WidgetStatePropertyAll(AppText.caption),
              height: 66,
            ),
            child: NavigationBar(
              selectedIndex: _index,
              onDestinationSelected: (i) => setState(() => _index = i),
              destinations: [
                const NavigationDestination(
                  icon: Icon(Icons.flag_outlined, color: AppColors.inkFaint),
                  selectedIcon: Icon(Icons.flag_rounded, color: AppColors.primary),
                  label: 'Quest',
                ),
                const NavigationDestination(
                  icon: Icon(Icons.storefront_outlined, color: AppColors.inkFaint),
                  selectedIcon: Icon(Icons.storefront_rounded, color: AppColors.primary),
                  label: 'Shop',
                ),
                const NavigationDestination(
                  icon: Icon(Icons.leaderboard_outlined, color: AppColors.inkFaint),
                  selectedIcon: Icon(Icons.leaderboard_rounded, color: AppColors.primary),
                  label: 'League',
                ),
                NavigationDestination(
                  icon: _badged(const Icon(Icons.people_outline_rounded, color: AppColors.inkFaint),
                      state.pendingRequests),
                  selectedIcon: const Icon(Icons.people_rounded, color: AppColors.primary),
                  label: 'Friends',
                ),
                const NavigationDestination(
                  icon: Icon(Icons.person_outline_rounded, color: AppColors.inkFaint),
                  selectedIcon: Icon(Icons.person_rounded, color: AppColors.primary),
                  label: 'You',
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _badged(Widget icon, int count) {
    if (count <= 0) return icon;
    return Stack(
      clipBehavior: Clip.none,
      children: [
        icon,
        Positioned(
          right: -6,
          top: -4,
          child: Container(
            padding: const EdgeInsets.all(4),
            constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
            decoration: const BoxDecoration(color: AppColors.hard, shape: BoxShape.circle),
            child: Text('$count',
                textAlign: TextAlign.center,
                style: AppText.caption.copyWith(color: Colors.white, fontSize: 10)),
          ),
        ),
      ],
    );
  }
}
