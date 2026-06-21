"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as api from "./api";
import { MOBS, ACCESSORIES } from "./catalog";
import { XP_FOR } from "./brand";
import { extractFrameBase64 } from "./frame";
import {
  Accessory,
  ActivityKind,
  ChestReward,
  difficultyForWeekday,
  Difficulty,
  Friend,
  FriendActivity,
  FriendRequest,
  Mob,
  QuestNode,
  Rarity,
  VerifyKind,
} from "./types";

interface State {
  status: "loading" | "ready" | "error";
  errorMessage: string | null;
  username: string;
  coins: number;
  xp: number;
  streak: number;
  freezesLeft: number;
  path: QuestNode[];
  todayQuestId: string | null;
  todayDate: string;
  todayCompleted: boolean;
  mobs: Mob[];
  accessories: Accessory[];
  equippedMobId: string;
  equippedAccessoryId: string | null;
  friends: Friend[];
  requests: FriendRequest[];
  activity: FriendActivity[];
}

export interface SubmitResult {
  verified: boolean;
  reason: string;
  reward?: ChestReward;
}

interface Store extends State {
  bootstrap: () => Promise<void>;
  refresh: () => Promise<void>;
  submitTodayQuest: (file: File) => Promise<SubmitResult>;
  buyMob: (mob: Mob) => Promise<string | null>;
  buyAccessory: (acc: Accessory) => Promise<string | null>;
  equipMob: (id: string) => Promise<void>;
  toggleAccessory: (id: string) => Promise<void>;
  addFriend: (username: string) => Promise<string | null>;
  acceptRequest: (req: FriendRequest) => Promise<void>;
  declineRequest: (req: FriendRequest) => Promise<void>;
}

const initialState: State = {
  status: "loading",
  errorMessage: null,
  username: "",
  coins: 0,
  xp: 0,
  streak: 0,
  freezesLeft: 3,
  path: [],
  todayQuestId: null,
  todayDate: "",
  todayCompleted: false,
  mobs: [],
  accessories: [],
  equippedMobId: "cat",
  equippedAccessoryId: null,
  friends: [],
  requests: [],
  activity: [],
};

const Ctx = createContext<Store | null>(null);

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

function errMsg(e: unknown): string {
  if (e && typeof e === "object" && "message" in e) return String((e as any).message);
  return String(e);
}

function activityKind(s: string): ActivityKind {
  if (s === "passed_you" || s === "milestone" || s === "added_you") return s;
  return "finished";
}

function minutesAgo(iso: string | null): number {
  if (!iso) return 0;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 0;
  const m = Math.floor((Date.now() - then) / 60000);
  return m < 0 ? 0 : m;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const ref = useRef<State>(state);
  ref.current = state;

  const refresh = useCallback(async () => {
    const [profile, ownedMobs, ownedAcc, completed, today, board, reqs, acts] = await Promise.all([
      api.fetchProfile(),
      api.fetchOwnedMobs(),
      api.fetchOwnedAccessories(),
      api.fetchCompletedQuests(),
      api.ensureTodayQuest(),
      api.fetchLeaderboard(),
      api.fetchRequests(),
      api.fetchActivity(),
    ]);

    const ownedMobSet = new Set(ownedMobs);
    const ownedAccSet = new Set(ownedAcc);

    const mobs: Mob[] = MOBS.map((m) => ({
      ...m,
      owned: ownedMobSet.has(m.id) || m.price === 0,
    }));
    const accessories: Accessory[] = ACCESSORIES.map((a) => ({
      ...a,
      owned: ownedAccSet.has(a.id),
    }));

    // Build the Trail + tally XP from every felled beast.
    const path: QuestNode[] = [];
    let day = 1;
    let xp = 0;
    for (const q of completed) {
      const diff = q.difficulty as Difficulty;
      xp += XP_FOR[diff] ?? 0;
      path.push({
        day: day++,
        title: q.title,
        seed: q.title,
        difficulty: diff,
        verify: q.verify as VerifyKind,
        status: "completed",
      });
    }
    const todayCompleted = today.status === "completed";
    if (!todayCompleted) {
      path.push({
        day: day++,
        title: today.title,
        seed: today.title,
        difficulty: today.difficulty as Difficulty,
        verify: today.verify as VerifyKind,
        status: "current",
      });
    }
    const base = new Date();
    for (let i = 1; i <= 6; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      path.push({
        day: day++,
        title: "Unknown beast",
        seed: `locked-${day}`,
        difficulty: difficultyForWeekday(d.getDay()),
        verify: "ai",
        status: "locked",
      });
    }

    const friends: Friend[] = board.map((r) => {
      const you = r.is_you === true;
      return {
        name: you ? "You" : r.display_name ?? "Player",
        seed: r.equipped_mob_id ?? "cat",
        streak: r.streak ?? 0,
        finishedToday: r.finished_today === true,
        isYou: you,
      };
    });

    const requests: FriendRequest[] = reqs.map((r) => ({
      id: r.id,
      name: r.name ?? "Someone",
      seed: r.mob ?? "cat",
    }));

    const activity: FriendActivity[] = acts.map((a) => ({
      name: a.actor_name ?? "Friend",
      seed: a.actor_name ?? "Friend",
      kind: activityKind(a.kind ?? "finished"),
      detail: a.detail ?? "",
      minutesAgo: minutesAgo(a.created_at ?? null),
    }));

    setState((s) => ({
      ...s,
      username: profile.username ?? "",
      coins: profile.coins,
      xp: typeof profile.xp === "number" ? profile.xp : xp,
      streak: profile.streak,
      freezesLeft: profile.freezes_left,
      equippedMobId: profile.equipped_mob_id ?? "cat",
      equippedAccessoryId: profile.equipped_accessory_id ?? null,
      mobs,
      accessories,
      path,
      todayQuestId: today.id ?? null,
      todayDate: today.quest_date,
      todayCompleted,
      friends,
      requests,
      activity,
    }));
  }, []);

  const bootstrap = useCallback(async () => {
    setState((s) => ({ ...s, status: "loading", errorMessage: null }));
    try {
      await api.ensureSignedIn();
      await refresh();
      setState((s) => ({ ...s, status: "ready" }));
    } catch (e) {
      setState((s) => ({ ...s, status: "error", errorMessage: errMsg(e) }));
    }
  }, [refresh]);

  const submitTodayQuest = useCallback(
    async (file: File): Promise<SubmitResult> => {
      const cur = ref.current;
      const node = cur.path.find((n) => n.status === "current");
      const videoPath = await api.uploadVideo(cur.todayDate, file);

      let verified: boolean;
      let reason: string;
      if (node && node.verify === "ai") {
        const frame = await extractFrameBase64(file);
        if (frame) {
          const r = await api.verifyQuest(node.title, frame);
          verified = r.verified;
          reason = r.reason;
        } else {
          verified = true;
          reason = "Couldn't read a frame — accepted.";
        }
      } else {
        verified = true;
        reason = "Confirmed by a friend";
      }

      if (!verified) return { verified: false, reason };

      const row = await api.completeQuest(cur.todayQuestId!, videoPath, true, reason);
      const gainedXp = node ? XP_FOR[node.difficulty] ?? 0 : 0;
      const reward: ChestReward = {
        rarity: row.rarity as Rarity,
        coins: row.coins_awarded,
        xp: typeof row.xp_awarded === "number" ? row.xp_awarded : gainedXp,
      };
      await refresh();
      return { verified: true, reason, reward };
    },
    [refresh],
  );

  const buyMob = useCallback(
    async (mob: Mob): Promise<string | null> => {
      try {
        await api.buyMob(mob.id, mob.price);
        await refresh();
        return null;
      } catch (e) {
        return errMsg(e);
      }
    },
    [refresh],
  );

  const buyAccessory = useCallback(
    async (acc: Accessory): Promise<string | null> => {
      try {
        await api.buyAccessory(acc.id, acc.price);
        await refresh();
        return null;
      } catch (e) {
        return errMsg(e);
      }
    },
    [refresh],
  );

  const equipMob = useCallback(async (id: string) => {
    setState((s) => ({ ...s, equippedMobId: id }));
    try {
      await api.equipMob(id);
    } catch {
      /* keep optimistic value */
    }
  }, []);

  const toggleAccessory = useCallback(async (id: string) => {
    const next = ref.current.equippedAccessoryId === id ? null : id;
    setState((s) => ({ ...s, equippedAccessoryId: next }));
    try {
      await api.setEquippedAccessory(next);
    } catch {
      /* ignore */
    }
  }, []);

  const addFriend = useCallback(
    async (username: string): Promise<string | null> => {
      try {
        await api.sendFriendRequest(username.trim());
        await refresh();
        return null;
      } catch (e) {
        return errMsg(e);
      }
    },
    [refresh],
  );

  const acceptRequest = useCallback(
    async (req: FriendRequest) => {
      await api.respondRequest(req.id, true);
      await refresh();
    },
    [refresh],
  );

  const declineRequest = useCallback(
    async (req: FriendRequest) => {
      await api.respondRequest(req.id, false);
      await refresh();
    },
    [refresh],
  );

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const value = useMemo<Store>(
    () => ({
      ...state,
      bootstrap,
      refresh,
      submitTodayQuest,
      buyMob,
      buyAccessory,
      equipMob,
      toggleAccessory,
      addFriend,
      acceptRequest,
      declineRequest,
    }),
    [state, bootstrap, refresh, submitTodayQuest, buyMob, buyAccessory, equipMob, toggleAccessory, addFriend, acceptRequest, declineRequest],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
