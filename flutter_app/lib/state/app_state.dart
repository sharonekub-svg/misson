import 'dart:convert';

import 'package:flutter/foundation.dart';

import '../data/api.dart';
import '../data/catalog.dart';
import '../models/models.dart';

enum LoadStatus { loading, ready, error }

/// Result of submitting today's quest video.
class QuestSubmitResult {
  QuestSubmitResult({required this.verified, required this.reason, this.reward});
  final bool verified;
  final String reason;
  final ChestReward? reward;
}

/// App-wide state, hydrated from Supabase. The UI reads these fields; actions
/// write to the backend and then [refresh].
class AppState extends ChangeNotifier {
  final Api _api = Api();

  LoadStatus status = LoadStatus.loading;
  String? errorMessage;

  // Wallet & streak
  int coins = 0;
  int streak = 0;
  int freezesLeft = 3;

  // Path
  final List<QuestNode> path = [];
  String? todayQuestId;
  String todayDateStr = '';
  bool todayCompleted = false;

  // Cosmetics
  final List<Mob> mobs = [];
  final List<Accessory> accessories = [];
  String equippedMobId = 'cat';
  String? equippedAccessoryId;

  // Social
  final List<Friend> friends = [];
  final List<FriendRequest> requests = [];
  final List<FriendActivity> activity = [];

  // ── Derived ──
  Mob get equippedMob => Catalog.mobById(equippedMobId);
  Accessory? get equippedAccessory => Catalog.accessoryById(equippedAccessoryId);
  QuestNode get todayNode => path.firstWhere(
        (n) => n.status == NodeStatus.current,
        orElse: () => path.isNotEmpty ? path.last : _placeholder(1),
      );
  int get pendingRequests => requests.length;

  // ───────────────────────── Lifecycle ─────────────────────────
  Future<void> bootstrap() async {
    status = LoadStatus.loading;
    notifyListeners();
    try {
      await _api.ensureSignedIn();
      await refresh();
      status = LoadStatus.ready;
    } catch (e) {
      errorMessage = _msg(e);
      status = LoadStatus.error;
    }
    notifyListeners();
  }

  Future<void> refresh() async {
    final results = await Future.wait([
      _api.fetchProfile(),
      _api.fetchOwnedMobs(),
      _api.fetchOwnedAccessories(),
      _api.fetchCompletedQuests(),
      _api.ensureTodayQuest(),
      _api.fetchLeaderboard(),
      _api.fetchRequests(),
      _api.fetchActivity(),
    ]);

    final profile = results[0] as Map<String, dynamic>;
    final ownedMobs = (results[1] as List).cast<String>().toSet();
    final ownedAcc = (results[2] as List).cast<String>().toSet();
    final completed = (results[3] as List).cast<Map<String, dynamic>>();
    final today = results[4] as Map<String, dynamic>;
    final board = (results[5] as List).cast<Map<String, dynamic>>();
    final reqs = (results[6] as List).cast<Map<String, dynamic>>();
    final acts = (results[7] as List).cast<Map<String, dynamic>>();

    // Profile
    coins = profile['coins'] as int;
    streak = profile['streak'] as int;
    freezesLeft = profile['freezes_left'] as int;
    equippedMobId = profile['equipped_mob_id'] as String? ?? 'cat';
    equippedAccessoryId = profile['equipped_accessory_id'] as String?;

    // Cosmetics (catalogue + ownership)
    mobs
      ..clear()
      ..addAll(Catalog.mobs.map((m) => Mob(
            id: m.id, name: m.name, emoji: m.emoji, price: m.price,
            perk: m.perk, owned: ownedMobs.contains(m.id) || m.price == 0,
          )));
    accessories
      ..clear()
      ..addAll(Catalog.accessories.map((a) => Accessory(
            id: a.id, name: a.name, emoji: a.emoji, price: a.price,
            owned: ownedAcc.contains(a.id),
          )));

    _buildPath(completed, today);
    _buildSocial(board, reqs, acts);

    notifyListeners();
  }

  // ───────────────────────── Path ─────────────────────────
  void _buildPath(List<Map<String, dynamic>> completed, Map<String, dynamic> today) {
    path.clear();
    todayQuestId = today['id'] as String?;
    todayDateStr = today['quest_date'] as String;
    todayCompleted = today['status'] == 'completed';

    var day = 1;
    for (final q in completed) {
      path.add(QuestNode(
        day: day++,
        title: q['title'] as String,
        emoji: q['emoji'] as String,
        difficulty: Difficulty.values.byName(q['difficulty'] as String),
        verify: VerifyKind.values.byName(q['verify'] as String),
        status: NodeStatus.completed,
      ));
    }

    if (!todayCompleted) {
      path.add(QuestNode(
        day: day++,
        title: today['title'] as String,
        emoji: today['emoji'] as String,
        difficulty: Difficulty.values.byName(today['difficulty'] as String),
        verify: VerifyKind.values.byName(today['verify'] as String),
        status: NodeStatus.current,
      ));
    }

    // A few locked previews of the days ahead (visual only).
    final base = DateTime.now();
    for (var i = 1; i <= 6; i++) {
      path.add(QuestNode(
        day: day++,
        title: 'Locked',
        emoji: '❔',
        difficulty: difficultyForWeekday(base.add(Duration(days: i)).weekday),
        verify: VerifyKind.ai,
        status: NodeStatus.locked,
      ));
    }
  }

  QuestNode _placeholder(int day) => QuestNode(
        day: day, title: 'Loading…', emoji: '⏳',
        difficulty: Difficulty.easy, verify: VerifyKind.ai,
        status: NodeStatus.locked,
      );

  // ───────────────────────── Social ─────────────────────────
  void _buildSocial(
    List<Map<String, dynamic>> board,
    List<Map<String, dynamic>> reqs,
    List<Map<String, dynamic>> acts,
  ) {
    friends
      ..clear()
      ..addAll(board.map((r) {
        final you = r['is_you'] == true;
        return Friend(
          name: you ? 'You' : (r['display_name'] as String? ?? 'Player'),
          emoji: Catalog.emojiForMob(r['equipped_mob_id'] as String? ?? 'cat'),
          streak: r['streak'] as int? ?? 0,
          finishedToday: r['finished_today'] == true,
          isYou: you,
        );
      }));

    requests
      ..clear()
      ..addAll(reqs.map((r) => FriendRequest(
            id: r['id'] as String,
            name: r['name'] as String? ?? 'Someone',
            emoji: Catalog.emojiForMob(r['mob'] as String? ?? 'cat'),
          )));

    activity
      ..clear()
      ..addAll(acts.map((a) => FriendActivity(
            name: a['actor_name'] as String? ?? 'Friend',
            emoji: a['actor_emoji'] as String? ?? '🐱',
            kind: _activityKind(a['kind'] as String? ?? 'finished'),
            detail: a['detail'] as String? ?? '',
            minutesAgo: _minutesAgo(a['created_at'] as String?),
          )));
  }

  ActivityKind _activityKind(String s) => switch (s) {
        'passed_you' => ActivityKind.passedYou,
        'milestone' => ActivityKind.milestone,
        'added_you' => ActivityKind.addedYou,
        _ => ActivityKind.finished,
      };

  int _minutesAgo(String? iso) {
    if (iso == null) return 0;
    final then = DateTime.tryParse(iso)?.toLocal();
    if (then == null) return 0;
    final m = DateTime.now().difference(then).inMinutes;
    return m < 0 ? 0 : m;
  }

  // ───────────────────────── Quest submission ─────────────────────────
  Future<QuestSubmitResult> submitTodayQuest(
      Uint8List videoBytes, Uint8List? thumbBytes) async {
    final node = todayNode;
    final videoPath = await _api.uploadVideo(todayDateStr, videoBytes);

    bool verified;
    String reason;
    if (node.verify == VerifyKind.ai && thumbBytes != null) {
      final r = await _api.verifyQuest(node.title, base64Encode(thumbBytes));
      verified = r.verified;
      reason = r.reason;
    } else {
      verified = true;
      reason = 'Confirmed by a friend';
    }

    if (!verified) {
      return QuestSubmitResult(verified: false, reason: reason);
    }

    final row = await _api.completeQuest(todayQuestId!, videoPath, true, reason);
    final reward = ChestReward(
      rarity: Rarity.values.byName(row['rarity'] as String),
      coins: row['coins_awarded'] as int,
    );
    await refresh();
    return QuestSubmitResult(verified: true, reason: reason, reward: reward);
  }

  // ───────────────────────── Shop ─────────────────────────
  Future<String?> buyMob(Mob mob) async {
    try {
      await _api.buyMob(mob.id, mob.price);
      await refresh();
      return null;
    } catch (e) {
      return _msg(e);
    }
  }

  Future<String?> buyAccessory(Accessory acc) async {
    try {
      await _api.buyAccessory(acc.id, acc.price);
      await refresh();
      return null;
    } catch (e) {
      return _msg(e);
    }
  }

  Future<void> equipMob(String id) async {
    equippedMobId = id;
    notifyListeners();
    try {
      await _api.equipMob(id);
    } catch (_) {/* keep optimistic value */}
  }

  Future<void> toggleAccessory(String id) async {
    equippedAccessoryId = equippedAccessoryId == id ? null : id;
    notifyListeners();
    try {
      await _api.setEquippedAccessory(equippedAccessoryId);
    } catch (_) {}
  }

  // ───────────────────────── Friends ─────────────────────────
  Future<String?> addFriendByName(String username) async {
    try {
      await _api.sendFriendRequest(username.trim());
      await refresh();
      return null;
    } catch (e) {
      return _msg(e);
    }
  }

  Future<void> acceptRequest(FriendRequest req) async {
    await _api.respondRequest(req.id, true);
    await refresh();
  }

  Future<void> declineRequest(FriendRequest req) async {
    await _api.respondRequest(req.id, false);
    await refresh();
  }

  String _msg(Object e) {
    final s = e.toString();
    return s.replaceFirst('Exception: ', '');
  }
}
