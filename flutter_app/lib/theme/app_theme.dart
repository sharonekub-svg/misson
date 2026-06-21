import 'package:flutter/material.dart';

import 'app_colors.dart';
import 'app_text_styles.dart';

class AppTheme {
  AppTheme._();

  static ThemeData get light {
    final base = ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        primary: AppColors.primary,
        surface: AppColors.surface,
        brightness: Brightness.light,
      ),
    );

    return base.copyWith(
      textTheme: base.textTheme.copyWith(
        displaySmall: AppText.display,
        titleLarge: AppText.title,
        titleMedium: AppText.headline,
        bodyMedium: AppText.body,
        labelLarge: AppText.button,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
      ),
      splashFactory: InkRipple.splashFactory,
    );
  }
}
