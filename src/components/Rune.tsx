"use client";

import { Difficulty, TIER_META } from "@/lib/types";

// A friendly difficulty indicator: soft "signal bars" (1 = Easy, 2 = Medium,
// 3 = Hard) in the difficulty colour. Always visible on every mission so you
// know how tough it is at a glance.

const LEVEL: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 };

export function Rune({
  difficulty,
  size = 22,
  glow = false,
}: {
  difficulty: Difficulty;
  size?: number;
  glow?: boolean;
}) {
  const m = TIER_META[difficulty];
  const lit = LEVEL[difficulty];
  const heights = [8, 13, 18];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ filter: glow ? `drop-shadow(0 0 4px ${m.color}aa)` : undefined }}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="7" fill={`${m.color}22`} />
      {heights.map((h, i) => (
        <rect
          key={i}
          x={5 + i * 5}
          y={20 - h}
          width="3.4"
          height={h}
          rx="1.7"
          fill={i < lit ? m.color : `${m.color}40`}
        />
      ))}
    </svg>
  );
}

export function RuneTag({ difficulty }: { difficulty: Difficulty }) {
  const m = TIER_META[difficulty];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{ background: `${m.color}1f`, color: m.color }}
    >
      <Rune difficulty={difficulty} size={14} />
      {m.tier}
    </span>
  );
}
