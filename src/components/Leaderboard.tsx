"use client";

import { useStore } from "@/lib/store";
import { Friend } from "@/lib/types";

export function Leaderboard() {
  const s = useStore();
  return (
    <div className="flex h-full flex-col bg-bg">
      <div className="px-5 pt-3">
        <h1 className="text-xl font-extrabold text-ink">Friends League</h1>
        <p className="text-sm font-semibold text-inkSoft">Longest streaks this week 🔥</p>
      </div>
      <div className="no-scrollbar min-h-0 flex-1 space-y-2.5 overflow-y-auto px-4 pb-24 pt-3">
        {s.friends.map((f, i) => (
          <Row key={i} rank={i + 1} friend={f} />
        ))}
      </div>
    </div>
  );
}

function Row({ rank, friend }: { rank: number; friend: Friend }) {
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}`;
  return (
    <div
      className="flex items-center gap-3 rounded-3xl px-4 py-3 shadow-soft"
      style={{
        background: friend.isYou ? "#E3FBF3" : "#FFFFFF",
        border: friend.isYou ? "2px solid #1FC99B" : "2px solid transparent",
      }}
    >
      <div className="w-7 text-center text-lg font-extrabold text-inkFaint">{medal}</div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surfaceAlt text-xl">
        {friend.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-extrabold text-ink">
          {friend.isYou ? `${friend.name} (you)` : friend.name}
        </div>
        <div className={`text-xs font-bold ${friend.finishedToday ? "text-primary" : "text-inkFaint"}`}>
          {friend.finishedToday ? "Done today ✓" : "Not yet today"}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-lg font-extrabold text-streak">{friend.streak}</span>
        <span>🔥</span>
      </div>
    </div>
  );
}
