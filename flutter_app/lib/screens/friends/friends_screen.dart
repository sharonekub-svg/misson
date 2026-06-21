import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/models.dart';
import '../../state/app_state.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_text_styles.dart';

class FriendsScreen extends StatelessWidget {
  const FriendsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();

    return SafeArea(
      bottom: false,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 12),
            child: Row(
              children: [
                Expanded(child: Text('Friends', style: AppText.title)),
                _AddButton(onAdd: state.addFriendByName),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 100),
              children: [
                if (state.requests.isNotEmpty) ...[
                  _sectionTitle('Friend requests', state.requests.length),
                  ...state.requests.map((r) => _RequestTile(request: r, state: state)),
                  const SizedBox(height: 18),
                ],
                _sectionTitle('Activity', null),
                ...state.activity.map((a) => _ActivityTile(activity: a)),
                const SizedBox(height: 18),
                _sectionTitle('Your friends', state.friends.where((f) => !f.isYou).length),
                ...state.friends.where((f) => !f.isYou).map((f) => _FriendTile(friend: f)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _sectionTitle(String text, int? count) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(4, 4, 4, 10),
      child: Row(
        children: [
          Text(text, style: AppText.headline),
          if (count != null && count > 0) ...[
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text('$count',
                  style: AppText.caption.copyWith(color: Colors.white)),
            ),
          ],
        ],
      ),
    );
  }
}

class _AddButton extends StatelessWidget {
  const _AddButton({required this.onAdd});
  final void Function(String) onAdd;

  Future<void> _prompt(BuildContext context) async {
    final controller = TextEditingController();
    final name = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
        title: Text('Add a friend', style: AppText.headline),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: const InputDecoration(
            hintText: 'Username',
            prefixIcon: Icon(Icons.alternate_email_rounded),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: AppColors.primary),
            onPressed: () => Navigator.pop(context, controller.text),
            child: const Text('Add'),
          ),
        ],
      ),
    );
    if (name != null && name.trim().isNotEmpty) onAdd(name);
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _prompt(context),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
        decoration: BoxDecoration(
          color: AppColors.primary,
          borderRadius: BorderRadius.circular(40),
          boxShadow: const [
            BoxShadow(color: AppColors.shadow, blurRadius: 10, offset: Offset(0, 4)),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.person_add_alt_1_rounded, color: Colors.white, size: 18),
            const SizedBox(width: 6),
            Text('Add', style: AppText.label.copyWith(color: Colors.white)),
          ],
        ),
      ),
    );
  }
}

class _RequestTile extends StatelessWidget {
  const _RequestTile({required this.request, required this.state});
  final FriendRequest request;
  final AppState state;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: _cardDecoration(),
      child: Row(
        children: [
          CircleAvatar(
            radius: 20,
            backgroundColor: AppColors.surfaceAlt,
            child: Text(request.emoji, style: const TextStyle(fontSize: 20)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(request.name, style: AppText.label),
                Text('wants to be your friend', style: AppText.caption),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.check_circle_rounded, color: AppColors.primary),
            onPressed: () => state.acceptRequest(request),
          ),
          IconButton(
            icon: const Icon(Icons.cancel_rounded, color: AppColors.inkFaint),
            onPressed: () => state.declineRequest(request),
          ),
        ],
      ),
    );
  }
}

class _ActivityTile extends StatelessWidget {
  const _ActivityTile({required this.activity});
  final FriendActivity activity;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: _cardDecoration(),
      child: Row(
        children: [
          CircleAvatar(
            radius: 20,
            backgroundColor: AppColors.surfaceAlt,
            child: Text(activity.emoji, style: const TextStyle(fontSize: 20)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: RichText(
              text: TextSpan(
                style: AppText.body.copyWith(color: AppColors.ink),
                children: [
                  TextSpan(
                      text: '${activity.name} ',
                      style: AppText.label),
                  TextSpan(text: activity.detail),
                ],
              ),
            ),
          ),
          Text('${activity.minutesAgo}m', style: AppText.caption),
        ],
      ),
    );
  }
}

class _FriendTile extends StatelessWidget {
  const _FriendTile({required this.friend});
  final Friend friend;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: _cardDecoration(),
      child: Row(
        children: [
          CircleAvatar(
            radius: 20,
            backgroundColor: AppColors.surfaceAlt,
            child: Text(friend.emoji, style: const TextStyle(fontSize: 20)),
          ),
          const SizedBox(width: 12),
          Expanded(child: Text(friend.name, style: AppText.label)),
          Text('${friend.streak}', style: AppText.label.copyWith(color: AppColors.streak)),
          const SizedBox(width: 4),
          const Text('🔥', style: TextStyle(fontSize: 15)),
        ],
      ),
    );
  }
}

BoxDecoration _cardDecoration() => BoxDecoration(
      color: AppColors.surface,
      borderRadius: BorderRadius.circular(18),
      boxShadow: const [
        BoxShadow(color: AppColors.shadow, blurRadius: 10, offset: Offset(0, 4)),
      ],
    );
