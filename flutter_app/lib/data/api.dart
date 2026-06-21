import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter/foundation.dart';

/// Thin wrapper around the Supabase client. All game reads/writes go through
/// here so the rest of the app never touches raw queries.
class Api {
  SupabaseClient get _c => Supabase.instance.client;

  String get uid => _c.auth.currentUser!.id;
  bool get isSignedIn => _c.auth.currentUser != null;

  /// Anonymous sign-in. Requires "Anonymous sign-ins" to be enabled in the
  /// Supabase dashboard (Authentication → Providers).
  Future<void> ensureSignedIn() async {
    if (_c.auth.currentSession == null) {
      await _c.auth.signInAnonymously();
    }
  }

  // ── Profile & inventory ──
  Future<Map<String, dynamic>> fetchProfile() async {
    return await _c.from('profiles').select().eq('id', uid).single();
  }

  Future<List<String>> fetchOwnedMobs() async {
    final rows = await _c.from('inventory_mobs').select('mob_id').eq('user_id', uid);
    return [for (final r in rows as List) r['mob_id'] as String];
  }

  Future<List<String>> fetchOwnedAccessories() async {
    final rows =
        await _c.from('inventory_accessories').select('accessory_id').eq('user_id', uid);
    return [for (final r in rows as List) r['accessory_id'] as String];
  }

  Future<void> setUsername(String username, String displayName) async {
    await _c.from('profiles').update({
      'username': username,
      'display_name': displayName,
    }).eq('id', uid);
  }

  Future<void> equipMob(String id) async {
    await _c.from('profiles').update({'equipped_mob_id': id}).eq('id', uid);
  }

  Future<void> setEquippedAccessory(String? id) async {
    await _c.from('profiles').update({'equipped_accessory_id': id}).eq('id', uid);
  }

  /// Buy a mob: check coins, deduct, grant. (Good enough for an MVP; a real
  /// app would do this in a single RPC to be fully atomic.)
  Future<void> buyMob(String mobId, int price) async {
    final prof = await fetchProfile();
    final coins = prof['coins'] as int;
    if (coins < price) throw 'Not enough coins';
    await _c.from('profiles').update({'coins': coins - price}).eq('id', uid);
    await _c.from('inventory_mobs').insert({'user_id': uid, 'mob_id': mobId});
  }

  Future<void> buyAccessory(String accId, int price) async {
    final prof = await fetchProfile();
    final coins = prof['coins'] as int;
    if (coins < price) throw 'Not enough coins';
    await _c.from('profiles').update({'coins': coins - price}).eq('id', uid);
    await _c.from('inventory_accessories').insert({'user_id': uid, 'accessory_id': accId});
  }

  // ── Quests ──
  Future<Map<String, dynamic>> ensureTodayQuest() async {
    final res = await _c.rpc('ensure_today_quest');
    return _singleRow(res);
  }

  Future<List<Map<String, dynamic>>> fetchCompletedQuests() async {
    final rows = await _c
        .from('user_quests')
        .select()
        .eq('user_id', uid)
        .eq('status', 'completed')
        .order('quest_date', ascending: true);
    return [for (final r in rows as List) r as Map<String, dynamic>];
  }

  Future<String> uploadVideo(String questDate, Uint8List bytes) async {
    final path = '$uid/$questDate.mp4';
    await _c.storage.from('quest-videos').uploadBinary(
          path,
          bytes,
          fileOptions: const FileOptions(upsert: true, contentType: 'video/mp4'),
        );
    return path;
  }

  /// Calls the verify-quest Edge Function (Claude vision) on a single frame.
  Future<({bool verified, String reason})> verifyQuest(
      String questTitle, String imageBase64) async {
    final res = await _c.functions.invoke('verify-quest', body: {
      'questTitle': questTitle,
      'imageBase64': imageBase64,
      'mimeType': 'image/jpeg',
    });
    final data = (res.data as Map?) ?? const {};
    return (
      verified: data['verified'] == true,
      reason: (data['reason'] ?? '').toString(),
    );
  }

  Future<Map<String, dynamic>> completeQuest(
      String questId, String videoPath, bool verified, String reason) async {
    final res = await _c.rpc('complete_quest', params: {
      'p_quest_id': questId,
      'p_video_path': videoPath,
      'p_verified': verified,
      'p_verify_reason': reason,
    });
    return _singleRow(res);
  }

  // ── Social ──
  Future<List<Map<String, dynamic>>> fetchLeaderboard() async {
    final rows = await _c.rpc('get_leaderboard');
    return [for (final r in rows as List) r as Map<String, dynamic>];
  }

  Future<List<Map<String, dynamic>>> fetchRequests() async {
    final reqs = await _c
        .from('friendships')
        .select('id, requester')
        .eq('addressee', uid)
        .eq('status', 'pending');
    final list = [for (final r in reqs as List) r as Map<String, dynamic>];
    if (list.isEmpty) return [];
    final ids = [for (final r in list) r['requester'] as String];
    final profs = await _c
        .from('profiles')
        .select('id, display_name, equipped_mob_id')
        .inFilter('id', ids);
    final byId = {for (final p in profs as List) p['id'] as String: p};
    return [
      for (final r in list)
        {
          'id': r['id'],
          'name': byId[r['requester']]?['display_name'] ?? 'Someone',
          'mob': byId[r['requester']]?['equipped_mob_id'] ?? 'cat',
        }
    ];
  }

  Future<List<Map<String, dynamic>>> fetchActivity() async {
    final rows = await _c
        .from('activity')
        .select()
        .eq('user_id', uid)
        .order('created_at', ascending: false)
        .limit(30);
    return [for (final r in rows as List) r as Map<String, dynamic>];
  }

  Future<void> sendFriendRequest(String username) async {
    await _c.rpc('send_friend_request', params: {'p_username': username});
  }

  Future<void> respondRequest(String requestId, bool accept) async {
    await _c.rpc('respond_friend_request',
        params: {'p_request_id': requestId, 'p_accept': accept});
  }

  /// RPCs that `returns <rowtype>` come back as a single object, but depending
  /// on the PostgREST shape can arrive wrapped in a list — normalise both.
  Map<String, dynamic> _singleRow(dynamic res) {
    if (res is List) return res.first as Map<String, dynamic>;
    return res as Map<String, dynamic>;
  }
}
