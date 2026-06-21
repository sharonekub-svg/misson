import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'screens/root_scaffold.dart';
import 'state/app_state.dart';
import 'theme/app_theme.dart';

void main() => runApp(const UpMissionApp());

class UpMissionApp extends StatelessWidget {
  const UpMissionApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AppState(),
      child: MaterialApp(
        title: 'Up Mission',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        home: const RootScaffold(),
      ),
    );
  }
}
