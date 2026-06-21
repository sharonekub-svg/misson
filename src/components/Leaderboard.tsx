"use client";

import { useStore } from "@/lib/store";
import { Friend } from "@/lib/types";
import { Beast } from "./Beast";
import { Icon } from "./Icon";

export function League() {
  const s = useStore();
  return (
    <div className="sky relative flex h-full flex-col">
      <div className="relative z-10 px-4 pt-3">
        <h1 className="font-display text-xl font-extrabold text-ink">League</h1>
        <p className="text-xs font-semibold text-inkFaint">Longest streaks this week 🔥</p>
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
  const medal = ["#F5A524", "#AAB4CC", "#C8895B"][rank - 1];
  return (
    <div className="flex items-center gap-3 rounded-3xl bg-surface px-3.5 py-3 shadow-soft" style={friend.isYou ? { border: "2px solid #3B6EF6" } : { border: "2px solid transparent" }}>
      <div className="w-6 text-center font-display text-lg font-extrabold" style={{ color: top ? medal : "#9AA7C7" }}>
        {rank}
      </div>
      <div className="grid h-11 w-11 place-items-center rounded-full bg-soft">
        <Beast seed={friend.seed} size={40} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-extrabold text-ink">{friend.isYou ? `${friend.name} (you)` : friend.name}</div>
        <div className={`text-xs font-semibold ${friend.finishedToday ? "text-easy" : "text-inkFaint"}`}>
          {friend.finishedToday ? "Done today ✓" : "Not yet today"}
        </div>
      </div>
      <div className="flex items-center gap-1 text-streak">
        <span className="font-display text-lg font-extrabold tabular-nums">{friend.streak}</span>
        <Icon name="flame" size={16} />
      </div>
    </div>
  );
}
