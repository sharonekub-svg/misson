import 'dart:math';

import 'package:flutter/material.dart';

import '../../models/models.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_text_styles.dart';
import '../../widgets/mob_avatar.dart';

/// The winding quest path. Nodes zig-zag down the screen connected by a soft
/// ribbon; the current day pulses and the player's mob bobs on top of it.
class TilePath extends StatefulWidget {
  const TilePath({
    super.key,
    required this.nodes,
    required this.mobEmoji,
    this.accessoryEmoji,
    required this.onTapCurrent,
  });

  final List<QuestNode> nodes;
  final String mobEmoji;
  final String? accessoryEmoji;
  final VoidCallback onTapCurrent;

  @override
  State<TilePath> createState() => _TilePathState();
}

class _TilePathState extends State<TilePath> with SingleTickerProviderStateMixin {
  late final AnimationController _c =
      AnimationController(vsync: this, duration: const Duration(milliseconds: 2200))
        ..repeat(reverse: true);

  static const double _spacing = 132;
  static const double _amplitude = 74;
  static const double _topPad = 36;
  static const double _bottomPad = 150;
  static const double _radius = 38;

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  double _x(int i, double width) => width / 2 + _amplitude * sin(i * 0.95);
  double _y(int i) => _topPad + i * _spacing;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final width = constraints.maxWidth;
        final n = widget.nodes.length;
        final points = [for (var i = 0; i < n; i++) Offset(_x(i, width), _y(i))];
        final height = _topPad + (n - 1) * _spacing + _bottomPad;

        return SingleChildScrollView(
          padding: EdgeInsets.zero,
          child: SizedBox(
            width: width,
            height: height,
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                // Soft connecting ribbon behind the nodes.
                Positioned.fill(
                  child: CustomPaint(painter: _RibbonPainter(points)),
                ),
                for (var i = 0; i < n; i++)
                  Positioned(
                    left: points[i].dx - _radius,
                    top: points[i].dy - _radius,
                    child: _Node(
                      node: widget.nodes[i],
                      pulse: _c,
                      mobEmoji: widget.mobEmoji,
                      accessoryEmoji: widget.accessoryEmoji,
                      onTap: widget.nodes[i].status == NodeStatus.current
                          ? widget.onTapCurrent
                          : null,
                    ),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _RibbonPainter extends CustomPainter {
  _RibbonPainter(this.points);
  final List<Offset> points;

  @override
  void paint(Canvas canvas, Size size) {
    if (points.length < 2) return;
    final path = Path()..moveTo(points.first.dx, points.first.dy);
    for (var i = 1; i < points.length; i++) {
      final prev = points[i - 1];
      final curr = points[i];
      final mid = Offset((prev.dx + curr.dx) / 2, (prev.dy + curr.dy) / 2);
      path.quadraticBezierTo(prev.dx, mid.dy, mid.dx, mid.dy);
      path.quadraticBezierTo(curr.dx, mid.dy, curr.dx, curr.dy);
    }
    final paint = Paint()
      ..color = AppColors.pathLine
      ..style = PaintingStyle.stroke
      ..strokeWidth = 12
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant _RibbonPainter old) => old.points != points;
}

class _Node extends StatelessWidget {
  const _Node({
    required this.node,
    required this.pulse,
    required this.mobEmoji,
    required this.accessoryEmoji,
    required this.onTap,
  });

  final QuestNode node;
  final Animation<double> pulse;
  final String mobEmoji;
  final String? accessoryEmoji;
  final VoidCallback? onTap;

  static const double _d = 76; // diameter

  @override
  Widget build(BuildContext context) {
    switch (node.status) {
      case NodeStatus.completed:
        return _circle(
          fill: node.difficulty.color,
          base: _darken(node.difficulty.color),
          child: const Icon(Icons.check_rounded, color: Colors.white, size: 34),
        );
      case NodeStatus.locked:
        return _circle(
          fill: AppColors.nodeLocked,
          base: AppColors.nodeLockedRing,
          child: const Icon(Icons.lock_rounded, color: AppColors.inkFaint, size: 26),
        );
      case NodeStatus.current:
        return _current(context);
    }
  }

  Widget _current(BuildContext context) {
    return SizedBox(
      width: _d,
      height: _d,
      child: AnimatedBuilder(
        animation: pulse,
        builder: (context, _) {
          final t = pulse.value; // 0..1
          return Stack(
            clipBehavior: Clip.none,
            alignment: Alignment.center,
            children: [
              // Pulsing halo
              Container(
                width: _d + 26 * t,
                height: _d + 26 * t,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.primary.withValues(alpha: 0.18 * (1 - t)),
                ),
              ),
              GestureDetector(
                onTap: onTap,
                child: _circle(
                  fill: AppColors.primary,
                  base: AppColors.primaryDark,
                  child: Text(node.emoji, style: const TextStyle(fontSize: 30)),
                ),
              ),
              // Bobbing mob + GO bubble floating above
              Positioned(
                top: -64 - 6 * sin(t * pi),
                child: Column(
                  children: [
                    _goBubble(),
                    const SizedBox(height: 4),
                    MobAvatar(
                      emoji: mobEmoji,
                      accessoryEmoji: accessoryEmoji,
                      size: 46,
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _goBubble() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(30),
        boxShadow: const [
          BoxShadow(color: AppColors.shadow, blurRadius: 10, offset: Offset(0, 4)),
        ],
      ),
      child: Text('GO',
          style: AppText.caption.copyWith(
              color: AppColors.primaryDark, fontSize: 13, fontWeight: FontWeight.w800)),
    );
  }

  Widget _circle({required Color fill, required Color base, required Widget child}) {
    return SizedBox(
      width: _d,
      height: _d,
      child: Stack(
        alignment: Alignment.topCenter,
        children: [
          // darker base (3D)
          Positioned(
            top: 6,
            child: Container(
              width: _d,
              height: _d - 6,
              decoration: BoxDecoration(color: base, shape: BoxShape.circle),
            ),
          ),
          Container(
            width: _d,
            height: _d - 6,
            alignment: Alignment.center,
            decoration: BoxDecoration(color: fill, shape: BoxShape.circle),
            child: child,
          ),
        ],
      ),
    );
  }

  static Color _darken(Color c) =>
      Color.lerp(c, Colors.black, 0.22) ?? c;
}
