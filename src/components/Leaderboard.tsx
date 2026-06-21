"use client";

import { useStore } from "@/lib/store";
import { Friend } from "@/lib/types";
import { Beast } from "./Beast";
import { Icon } from "./Icon";

export function Rivals() {
  const s = useStore();
  return (
    <div className="grain relative flex h-full flex-col bg-bg">
      <div className="relative z-10 px-4 pt-3">
        <h1 className="font-display text-xl font-black tracking-[0.18em] text-ink">Rivals</h1>
        <p className="text-xs font-medium uppercase tracking-wider text-inkFaint">Longest Flame on the hunt</p>
      </div>
      <div className="no-scrollbar relative z-10 min-h-0 flex-1 space-y-2.5 overflow-y-auto px-4 pb-24 pt-3">
        {s.friends.map((f, i) => (
          <Row key={i} rank={i + 1} friend={f} />
        ))}
      </div>
    </div>
  );
}

function Row({ rank, friend }: { rank: number; friend: Friend }) {
  const top = rank <= 3;
  const medal = ["#E2B53C", "#B9C0CC", "#C08457"][rank - 1];
  return (
    <div
      className="edge flex items-center gap-3 rounded-2xl bg-panel px-3.5 py-3"
      style={friend.isYou ? { borderColor: "#FF6A2B", boxShadow: "0 0 0 1px rgba(255,106,43,0.35)" } : undefined}
    >
      <div
        className="w-6 text-center font-display text-lg font-black"
        style={{ color: top ? medal : "#6B7384" }}
      >
        {rank}
      </div>
      <div className="grid h-11 w-11 place-items-center rounded-full bg-raised ring-1 ring-line">
        <Beast seed={friend.seed} size={38} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-ink">
          {friend.isYou ? `${friend.name} (you)` : friend.name}
        </div>
        <div className={`text-xs font-medium ${friend.finishedToday ? "text-lesser" : "text-inkFaint"}`}>
          {friend.finishedToday ? "Felled today" : "Still hunting"}
        </div>
      </div>
      <div className="flex items-center gap-1 text-ember">
        <span className="font-display text-lg font-black tabular-nums">{friend.streak}</span>
        <Icon name="flame" size={16} />
      </div>
    </div>
  );
}
