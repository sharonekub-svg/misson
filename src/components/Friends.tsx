"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

export function Friends() {
  const s = useStore();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const realFriends = s.friends.filter((f) => !f.isYou);

  async function add() {
    if (!name.trim()) return;
    const e = await s.addFriend(name);
    if (e) {
      setErr(e);
    } else {
      setAdding(false);
      setName("");
      setErr(null);
    }
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <div className="flex items-center px-5 pb-2 pt-3">
        <h1 className="flex-1 text-xl font-extrabold text-ink">Friends</h1>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-sm font-extrabold text-white shadow-soft"
        >
          <span>＋</span> Add
        </button>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-24">
        {s.requests.length > 0 && (
          <>
            <SectionTitle text="Friend requests" count={s.requests.length} />
            {s.requests.map((r) => (
              <div key={r.id} className="mb-2.5 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-soft">
                <Avatar emoji={r.emoji} />
                <div className="flex-1">
                  <div className="text-sm font-extrabold text-ink">{r.name}</div>
                  <div className="text-xs font-bold text-inkFaint">wants to be your friend</div>
                </div>
                <button onClick={() => s.acceptRequest(r)} className="text-2xl text-primary" aria-label="Accept">
                  ✓
                </button>
                <button onClick={() => s.declineRequest(r)} className="text-2xl text-inkFaint" aria-label="Decline">
                  ✕
                </button>
              </div>
            ))}
            <div className="h-4" />
          </>
        )}

        <SectionTitle text="Activity" />
        {s.activity.length === 0 && <Empty text="No activity yet — add a friend to get started!" />}
        {s.activity.map((a, i) => (
          <div key={i} className="mb-2.5 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-soft">
            <Avatar emoji={a.emoji} />
            <div className="flex-1 text-sm font-semibold text-inkSoft">
              <span className="font-extrabold text-ink">{a.name}</span> {a.detail}
            </div>
            <span className="text-xs font-bold text-inkFaint">{a.minutesAgo}m</span>
          </div>
        ))}

        <div className="h-4" />
        <SectionTitle text="Your friends" count={realFriends.length} />
        {realFriends.length === 0 && <Empty text="You haven't added anyone yet." />}
        {realFriends.map((f, i) => (
          <div key={i} className="mb-2.5 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-soft">
            <Avatar emoji={f.emoji} />
            <div className="flex-1 text-sm font-extrabold text-ink">{f.name}</div>
            <span className="text-sm font-extrabold text-streak">{f.streak}</span>
            <span>🔥</span>
          </div>
        ))}
      </div>

      {adding && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 px-8">
          <div className="w-full rounded-3xl bg-surface p-5 shadow-soft">
            <h3 className="text-lg font-extrabold text-ink">Add a friend</h3>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Username (e.g. player_1a2b3c4d)"
              className="mt-3 w-full rounded-xl border border-nodeLockedRing px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary"
            />
            {err && <p className="mt-2 text-sm font-bold text-hard">{err}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setAdding(false);
                  setErr(null);
                }}
                className="rounded-xl px-4 py-2 text-sm font-extrabold text-inkSoft"
              >
                Cancel
              </button>
              <button onClick={add} className="rounded-xl bg-primary px-4 py-2 text-sm font-extrabold text-white">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ text, count }: { text: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 px-1 pb-2.5 pt-1">
      <h2 className="text-base font-extrabold text-ink">{text}</h2>
      {count !== undefined && count > 0 && (
        <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">{count}</span>
      )}
    </div>
  );
}

function Avatar({ emoji }: { emoji: string }) {
  return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surfaceAlt text-xl">{emoji}</div>;
}

function Empty({ text }: { text: string }) {
  return <p className="px-1 pb-3 text-sm font-semibold text-inkFaint">{text}</p>;
}
