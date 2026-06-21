import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'data/supabase_config.dart';
import 'screens/root_scaffold.dart';
import 'state/app_state.dart';
import 'theme/app_colors.dart';
import 'theme/app_text_styles.dart';
import 'theme/app_theme.dart';
import 'widgets/squishy_button.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Supabase.initialize(url: kSupabaseUrl, publishableKey: kSupabasePublishableKey);
  runApp(const UpMissionApp());
}

class UpMissionApp extends StatelessWidget {
  const UpMissionApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AppState()..bootstrap(),
      child: MaterialApp(
        title: 'Up Mission',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        home: const AuthGate(),
      ),
    );
  }
}

/// Shows a splash while we sign in + load, an error screen if something's off,
/// then the app itself.
class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    return switch (state.status) {
      LoadStatus.loading => const _Splash(),
      LoadStatus.error => _ErrorScreen(
          message: state.errorMessage ?? 'Something went wrong',
          onRetry: () => context.read<AppState>().bootstrap(),
        ),
      LoadStatus.ready => const RootScaffold(),
    };
  }
}

class _Splash extends StatelessWidget {
  const _Splash();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('🎯', style: TextStyle(fontSize: 64)),
            SizedBox(height: 16),
            CircularProgressIndicator(color: AppColors.primary),
          ],
        ),
      ),
    );
  }
}

class _ErrorScreen extends StatelessWidget {
  const _ErrorScreen({required this.message, required this.onRetry});
  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('😿', style: TextStyle(fontSize: 56)),
              const SizedBox(height: 16),
              Text("Couldn't connect", style: AppText.title),
              const SizedBox(height: 8),
              Text(message, textAlign: TextAlign.center, style: AppText.body),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.surfaceAlt,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Text(
                  'Tip: in the Supabase dashboard, enable Authentication → '
                  'Providers → Anonymous sign-ins.',
                  textAlign: TextAlign.center,
                  style: AppText.caption,
                ),
              ),
              const SizedBox(height: 24),
              SquishyButton(label: 'TRY AGAIN', icon: Icons.refresh_rounded, onPressed: onRetry),
            ],
          ),
        ),
      ),
    );
  }
}
