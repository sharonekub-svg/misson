"use client";

import { Difficulty, TIER_META } from "@/lib/types";

// A faceted difficulty rune — a hand-cut gem whose colour and tier name encode
// the challenge's danger. Easy = Lesser (green) · Medium = Greater (amber) ·
// Hard = Dire (red). Shown on every Trail node so danger is never hidden.

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
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ filter: glow ? `drop-shadow(0 0 5px ${m.color}cc)` : undefined }}
      aria-hidden
    >
      <polygon points="12,1.5 21,8 12,22.5 3,8" fill={m.color} opacity={0.92} />
      <polygon points="12,1.5 21,8 12,9.5 3,8" fill="#fff" opacity={0.28} />
      <polygon points="3,8 12,9.5 12,22.5" fill="#000" opacity={0.18} />
      <polygon points="12,1.5 21,8 12,22.5 3,8" fill="none" stroke={shade(m.color, -0.3)} strokeWidth={1} />
    </svg>
  );
}

export function RuneTag({ difficulty }: { difficulty: Difficulty }) {
  const m = TIER_META[difficulty];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em]"
      style={{ background: `${m.color}1f`, color: m.color }}
    >
      <Rune difficulty={difficulty} size={13} />
      {m.tier}
    </span>
  );
}

function shade(hex: string, amt: number): string {
  const c = hex.replace("#", "");
  const f = (i: number) => {
    const v = parseInt(c.slice(i, i + 2), 16);
    return Math.max(0, Math.min(255, Math.round(v * (1 + amt))));
  };
  return `rgb(${f(0)},${f(2)},${f(4)})`;
}
