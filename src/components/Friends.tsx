"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Beast } from "./Beast";
import { Icon } from "./Icon";

export function Allies() {
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
    <div className="grain relative flex h-full flex-col bg-bg">
      <div className="relative z-10 flex items-center px-4 pb-2 pt-3">
        <h1 className="flex-1 font-display text-xl font-black tracking-[0.18em] text-ink">Allies</h1>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 rounded-full bg-ember px-3.5 py-2 text-sm font-bold text-black"
        >
          <Icon name="plus" size={16} strokeWidth={2.4} /> Recruit
        </button>
      </div>

      <div className="no-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pb-24">
        {s.requests.length > 0 && (
          <>
            <SectionTitle text="War-band requests" count={s.requests.length} />
            {s.requests.map((r) => (
              <div key={r.id} className="edge mb-2.5 flex items-center gap-3 rounded-xl bg-panel px-3.5 py-3">
                <Avatar seed={r.seed} />
                <div className="flex-1">
                  <div className="text-sm font-bold text-ink">{r.name}</div>
                  <div className="text-xs text-inkFaint">wants to hunt with you</div>
                </div>
                <button onClick={() => s.acceptRequest(r)} className="text-lesser" aria-label="Accept">
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
        {s.activity.length === 0 && <Empty text="No tracks yet — recruit an ally to begin." />}
        {s.activity.map((a, i) => (
          <div key={i} className="edge mb-2.5 flex items-center gap-3 rounded-xl bg-panel px-3.5 py-3">
            <Avatar seed={a.seed} />
            <div className="flex-1 text-sm text-inkSoft">
              <span className="font-bold text-ink">{a.name}</span> {a.detail}
            </div>
            <span className="text-xs font-medium text-inkFaint">{a.minutesAgo}m</span>
          </div>
        ))}

        <div className="h-4" />
        <SectionTitle text="Your war-band" count={realFriends.length} />
        {realFriends.length === 0 && <Empty text="You hunt alone for now." />}
        {realFriends.map((f, i) => (
          <div key={i} className="edge mb-2.5 flex items-center gap-3 rounded-xl bg-panel px-3.5 py-3">
            <Avatar seed={f.seed} />
            <div className="flex-1 text-sm font-bold text-ink">{f.name}</div>
            <span className="font-display text-sm font-black text-ember tabular-nums">{f.streak}</span>
            <span className="text-ember"><Icon name="flame" size={15} /></span>
          </div>
        ))}
      </div>

      {adding && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 px-8 backdrop-blur-sm">
          <div className="edge w-full rounded-2xl bg-panel p-5 shadow-panel">
            <h3 className="font-display text-lg font-bold text-ink">Recruit an ally</h3>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Their handle (e.g. player_1a2b3c4d)"
              className="edge mt-3 w-full rounded-lg bg-bg px-3 py-2.5 text-sm font-medium text-ink outline-none placeholder:text-inkFaint focus:border-ember"
            />
            {err && <p className="mt-2 text-sm font-bold text-dire">{err}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setAdding(false);
                  setErr(null);
                }}
                className="rounded-lg px-4 py-2 text-sm font-bold text-inkSoft"
              >
                Cancel
              </button>
              <button onClick={add} className="rounded-lg bg-ember px-4 py-2 text-sm font-bold text-black">
                Recruit
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
      <h2 className="font-display text-xs font-bold uppercase tracking-[0.22em] text-inkFaint">{text}</h2>
      {count !== undefined && count > 0 && (
        <span className="rounded-full bg-ember px-2 py-0.5 text-[10px] font-bold text-black">{count}</span>
      )}
    </div>
  );
}

function Avatar({ seed }: { seed: string }) {
  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-raised ring-1 ring-line">
      <Beast seed={seed} size={34} />
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="px-1 pb-3 text-sm font-medium text-inkFaint">{text}</p>;
}
