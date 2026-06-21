"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Beast } from "./Beast";
import { Icon } from "./Icon";

export function Friends() {
  const s = useStore();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const realFriends = s.friends.filter((f) => !f.isYou);

  async function add() {
    if (!name.trim()) return;
    const e = await s.addFriend(name);
    if (e) setErr(e);
    else {
      setAdding(false);
      setName("");
      setErr(null);
    }
  }

  return (
    <div className="sky relative flex h-full flex-col">
      <div className="relative z-10 flex items-center px-4 pb-2 pt-3">
        <h1 className="flex-1 font-display text-xl font-extrabold text-ink">Friends</h1>
        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-sm font-extrabold text-white shadow-soft">
          <Icon name="plus" size={16} strokeWidth={2.4} /> Add
        </button>
      </div>

      <div className="no-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pb-24">
        {s.requests.length > 0 && (
          <>
            <SectionTitle text="Friend requests" count={s.requests.length} />
            {s.requests.map((r) => (
              <div key={r.id} className="mb-2.5 flex items-center gap-3 rounded-2xl bg-surface px-3.5 py-3 shadow-soft">
                <Avatar seed={r.seed} />
                <div className="flex-1">
                  <div className="text-sm font-extrabold text-ink">{r.name}</div>
                  <div className="text-xs text-inkFaint">wants to be friends</div>
                </div>
                <button onClick={() => s.acceptRequest(r)} className="text-easy" aria-label="Accept">
                  <Icon name="check" size={22} strokeWidth={2.4} />
                </button>
                <button onClick={() => s.declineRequest(r)} className="text-inkFaint" aria-label="Decline">
                  <Icon name="x" size={20} strokeWidth={2.4} />
                </button>
              </div>
            ))}
            <div className="h-4" />
          </>
        )}

        <SectionTitle text="Activity" />
        {s.activity.length === 0 && <Empty text="No activity yet — add a friend to get started!" />}
        {s.activity.map((a, i) => (
          <div key={i} className="mb-2.5 flex items-center gap-3 rounded-2xl bg-surface px-3.5 py-3 shadow-soft">
            <Avatar seed={a.seed} />
            <div className="flex-1 text-sm text-inkSoft">
              <span className="font-extrabold text-ink">{a.name}</span> {a.detail}
            </div>
            <span className="text-xs font-medium text-inkFaint">{a.minutesAgo}m</span>
          </div>
        ))}

        <div className="h-4" />
        <SectionTitle text="Your friends" count={realFriends.length} />
        {realFriends.length === 0 && <Empty text="You haven’t added anyone yet." />}
        {realFriends.map((f, i) => (
          <div key={i} className="mb-2.5 flex items-center gap-3 rounded-2xl bg-surface px-3.5 py-3 shadow-soft">
            <Avatar seed={f.seed} />
            <div className="flex-1 text-sm font-extrabold text-ink">{f.name}</div>
            <span className="font-display text-sm font-extrabold text-streak tabular-nums">{f.streak}</span>
            <span className="text-streak"><Icon name="flame" size={15} /></span>
          </div>
        ))}
      </div>

      {adding && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-navy/45 px-8 backdrop-blur-sm">
          <div className="w-full rounded-3xl bg-surface p-5 shadow-card">
            <h3 className="font-display text-lg font-extrabold text-ink">Add a friend</h3>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Username (e.g. player_1a2b3c4d)"
              className="edge mt-3 w-full rounded-xl bg-bg px-3 py-2.5 text-sm font-medium text-ink outline-none placeholder:text-inkFaint focus:border-primary"
            />
            {err && <p className="mt-2 text-sm font-bold text-hard">{err}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => { setAdding(false); setErr(null); }} className="rounded-xl px-4 py-2 text-sm font-extrabold text-inkSoft">
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
    <div className="flex items-center gap-2 px-1 pb-2.5 pt-3">
      <h2 className="text-xs font-extrabold uppercase tracking-[0.14em] text-inkFaint">{text}</h2>
      {count !== undefined && count > 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">{count}</span>}
    </div>
  );
}

function Avatar({ seed }: { seed: string }) {
  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-soft">
      <Beast seed={seed} size={36} />
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="px-1 pb-3 text-sm font-medium text-inkFaint">{text}</p>;
}
