import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_colors.dart';

/// Rounded, friendly typography (Nunito) — playful but still calm and legible,
/// in the spirit of Duolingo's feathery type.
class AppText {
  AppText._();

  static TextStyle get display => GoogleFonts.nunito(
        fontSize: 30,
        fontWeight: FontWeight.w800,
        color: AppColors.ink,
        height: 1.1,
      );

  static TextStyle get title => GoogleFonts.nunito(
        fontSize: 22,
        fontWeight: FontWeight.w800,
        color: AppColors.ink,
      );

  static TextStyle get headline => GoogleFonts.nunito(
        fontSize: 18,
        fontWeight: FontWeight.w800,
        color: AppColors.ink,
      );

  static TextStyle get body => GoogleFonts.nunito(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        color: AppColors.inkSoft,
        height: 1.4,
      );

  static TextStyle get label => GoogleFonts.nunito(
        fontSize: 14,
        fontWeight: FontWeight.w800,
        color: AppColors.ink,
        letterSpacing: 0.2,
      );

  static TextStyle get button => GoogleFonts.nunito(
        fontSize: 16,
        fontWeight: FontWeight.w800,
        letterSpacing: 0.6,
        color: Colors.white,
      );

  static TextStyle get caption => GoogleFonts.nunito(
        fontSize: 12,
        fontWeight: FontWeight.w700,
        color: AppColors.inkFaint,
      );
}
