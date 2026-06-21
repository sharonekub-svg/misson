import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

/// The signature "3D" pill button — a chunky face that sits on a darker base
/// and squishes down when pressed. This is what makes the UI feel *alive*.
class SquishyButton extends StatefulWidget {
  const SquishyButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.color = AppColors.primary,
    this.baseColor = AppColors.primaryDark,
    this.textColor = Colors.white,
    this.icon,
    this.expand = true,
    this.enabled = true,
  });

  final String label;
  final VoidCallback? onPressed;
  final Color color;
  final Color baseColor;
  final Color textColor;
  final IconData? icon;
  final bool expand;
  final bool enabled;

  @override
  State<SquishyButton> createState() => _SquishyButtonState();
}

class _SquishyButtonState extends State<SquishyButton> {
  bool _down = false;

  bool get _active => widget.enabled && widget.onPressed != null;
  static const double _depth = 6;

  @override
  Widget build(BuildContext context) {
    final color = _active ? widget.color : AppColors.inkFaint;
    final base = _active ? widget.baseColor : AppColors.nodeLockedRing;

    final child = AnimatedContainer(
      duration: const Duration(milliseconds: 70),
      curve: Curves.easeOut,
      transform: Matrix4.translationValues(0, _down ? _depth : 0, 0),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 15),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Row(
        mainAxisSize: widget.expand ? MainAxisSize.max : MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          if (widget.icon != null) ...[
            Icon(widget.icon, color: widget.textColor, size: 20),
            const SizedBox(width: 8),
          ],
          Text(widget.label,
              style: AppText.button.copyWith(color: widget.textColor)),
        ],
      ),
    );

    return GestureDetector(
      onTapDown: _active ? (_) => setState(() => _down = true) : null,
      onTapCancel: _active ? () => setState(() => _down = false) : null,
      onTapUp: _active
          ? (_) {
              setState(() => _down = false);
              widget.onPressed!.call();
            }
          : null,
      child: Container(
        // The darker "base" that the face lifts off of.
        decoration: BoxDecoration(
          color: base,
          borderRadius: BorderRadius.circular(18),
        ),
        margin: const EdgeInsets.only(bottom: _depth),
        child: child,
      ),
    );
  }
}
