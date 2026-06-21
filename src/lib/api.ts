import { supabase } from "./supabase";
import { difficultyForWeekday } from "./types";

let _uid: string | null = null;

export async function ensureSignedIn(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    _uid = data.session.user.id;
  } else {
    const { data: d2, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    _uid = d2.user?.id ?? null;
  }
  if (!_uid) throw new Error("Could not sign in");
  return _uid;
}

function uid(): string {
  if (!_uid) throw new Error("Not signed in");
  return _uid;
}

type Row = Record<string, any>;

function singleRow(res: any): Row {
  if (Array.isArray(res)) return res[0] as Row;
  return res as Row;
}

// ── Profile & inventory ──
export async function fetchProfile(): Promise<Row> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", uid()).single();
  if (error) throw error;
  return data;
}

export async function fetchOwnedMobs(): Promise<string[]> {
  const { data, error } = await supabase.from("inventory_mobs").select("mob_id").eq("user_id", uid());
  if (error) throw error;
  return (data ?? []).map((r) => r.mob_id as string);
}

export async function fetchOwnedAccessories(): Promise<string[]> {
  const { data, error } = await supabase
    .from("inventory_accessories")
    .select("accessory_id")
    .eq("user_id", uid());
  if (error) throw error;
  return (data ?? []).map((r) => r.accessory_id as string);
}

export async function equipMob(id: string): Promise<void> {
  const { error } = await supabase.from("profiles").update({ equipped_mob_id: id }).eq("id", uid());
  if (error) throw error;
}

export async function setEquippedAccessory(id: string | null): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ equipped_accessory_id: id })
    .eq("id", uid());
  if (error) throw error;
}

export async function buyMob(mobId: string, price: number): Promise<void> {
  const prof = await fetchProfile();
  if ((prof.coins as number) < price) throw new Error("Not enough coins");
  await supabase.from("profiles").update({ coins: (prof.coins as number) - price }).eq("id", uid());
  const { error } = await supabase.from("inventory_mobs").insert({ user_id: uid(), mob_id: mobId });
  if (error) throw error;
}

export async function buyAccessory(accId: string, price: number): Promise<void> {
  const prof = await fetchProfile();
  if ((prof.coins as number) < price) throw new Error("Not enough coins");
  await supabase.from("profiles").update({ coins: (prof.coins as number) - price }).eq("id", uid());
  const { error } = await supabase
    .from("inventory_accessories")
    .insert({ user_id: uid(), accessory_id: accId });
  if (error) throw error;
}

// ── Quests ──

/** Ask the server-side AI to invent today's mission — one it can verify with
 *  confidence from a short video. Returns a short imperative title. */
export async function generateQuest(difficulty: string): Promise<string | null> {
  const { data, error } = await supabase.functions.invoke("generate-quest", {
    body: { difficulty },
  });
  if (error) throw error;
  const title = data?.title;
  return typeof title === "string" && title.trim() ? title.trim() : null;
}

async function rpcOrThrow(fn: string, args: Record<string, any>): Promise<any> {
  const { data, error } = await supabase.rpc(fn, args);
  if (error) throw error;
  return data;
}

export async function ensureTodayQuest(): Promise<Row> {
  try {
    // 1. Do we already have today's mission? (AI-aware RPC; null if not yet.)
    const existing = singleRow(await rpcOrThrow("ensure_today_quest_ai", { p_title: null }));
    if (existing && existing.id) return existing;

    // 2. Have the AI invent a mission it can verify, then store it.
    const difficulty = difficultyForWeekday(new Date().getDay());
    const title = await generateQuest(difficulty);
    if (!title) throw new Error("no generated title");
    const created = singleRow(await rpcOrThrow("ensure_today_quest_ai", { p_title: title }));
    if (created && created.id) return created;
    throw new Error("could not create quest");
  } catch {
    // Fallback so the app always works (older DB or no AI key): legacy picker.
    const { data, error } = await supabase.rpc("ensure_today_quest");
    if (error) throw error;
    return singleRow(data);
  }
}

export async function fetchCompletedQuests(): Promise<Row[]> {
  const { data, error } = await supabase
    .from("user_quests")
    .select("*")
    .eq("user_id", uid())
    .eq("status", "completed")
    .order("quest_date", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function uploadVideo(questDate: string, file: Blob): Promise<string> {
  const path = `${uid()}/${questDate}.mp4`;
  const { error } = await supabase.storage
    .from("quest-videos")
    .upload(path, file, { upsert: true, contentType: "video/mp4" });
  if (error) throw error;
  return path;
}

export async function verifyQuest(
  questTitle: string,
  imagesBase64: string[],
): Promise<{ verified: boolean; reason: string }> {
  const { data, error } = await supabase.functions.invoke("verify-quest", {
    body: { questTitle, imagesBase64, mimeType: "image/jpeg" },
  });
  if (error) throw error;
  return { verified: data?.verified === true, reason: String(data?.reason ?? "") };
}

export async function completeQuest(
  questId: string,
  videoPath: string,
  verified: boolean,
  reason: string,
): Promise<Row> {
  const { data, error } = await supabase.rpc("complete_quest", {
    p_quest_id: questId,
    p_video_path: videoPath,
    p_verified: verified,
    p_verify_reason: reason,
  });
  if (error) throw error;
  return singleRow(data);
}

// ── Social ──
export async function fetchLeaderboard(): Promise<Row[]> {
  const { data, error } = await supabase.rpc("get_leaderboard");
  if (error) throw error;
  return data ?? [];
}

export async function fetchRequests(): Promise<Row[]> {
  const { data: reqs, error } = await supabase
    .from("friendships")
    .select("id, requester")
    .eq("addressee", uid())
    .eq("status", "pending");
  if (error) throw error;
  const list = reqs ?? [];
  if (list.length === 0) return [];
  const ids = list.map((r) => r.requester as string);
  const { data: profs } = await supabase
    .from("profiles")
    .select("id, display_name, equipped_mob_id")
    .in("id", ids);
  const byId = new Map((profs ?? []).map((p) => [p.id as string, p]));
  return list.map((r) => ({
    id: r.id,
    name: byId.get(r.requester)?.display_name ?? "Someone",
    mob: byId.get(r.requester)?.equipped_mob_id ?? "cat",
  }));
}

export async function fetchActivity(): Promise<Row[]> {
  const { data, error } = await supabase
    .from("activity")
    .select("*")
    .eq("user_id", uid())
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw error;
  return data ?? [];
}

export async function sendFriendRequest(username: string): Promise<void> {
  const { error } = await supabase.rpc("send_friend_request", { p_username: username });
  if (error) throw error;
}

export async function respondRequest(requestId: string, accept: boolean): Promise<void> {
  const { error } = await supabase.rpc("respond_friend_request", {
    p_request_id: requestId,
    p_accept: accept,
  });
  if (error) throw error;
}
