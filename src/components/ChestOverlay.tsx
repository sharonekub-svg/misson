"use client";

import { useMemo } from "react";
import { ChestReward, RARITY_META } from "@/lib/types";
import { CODEX } from "@/lib/brand";
import { Button } from "./ui";
import { Icon } from "./Icon";

const CONFETTI = ["#3B6EF6", "#2DBE7E", "#F5A524", "#FF6B6B", "#8B5CF6", "#59C3F5"];

export function RewardOverlay({
  reward,
  streak,
  onCollect,
}: {
  reward: ChestReward;
  streak: number;
  onCollect: () => void;
}) {
  const meta = RARITY_META[reward.rarity];
  const pieces = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        left: `${(i * 6.2 + (i % 3) * 4) % 100}%`,
        bg: CONFETTI[i % CONFETTI.length],
        delay: `${(i % 6) * 0.08}s`,
        round: i % 2 === 0,
      })),
    [],
  );

  return (
    <div className="sky absolute inset-0 z-40 flex flex-col items-center justify-center overflow-hidden px-6">
      {/* confetti */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2">
        {pieces.map((p, i) => (
          <span
            key={i}
            className="absolute top-0 h-2.5 w-2.5 animate-confetti"
            style={{ left: p.left, background: p.bg, borderRadius: p.round ? "9999px" : "2px", animationDelay: p.delay }}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        {/* Duolingo-style streak moment */}
        <div className="relative flex flex-col items-center">
          <div className="text-streak animate-flicker">
            <Icon name="flame" size={120} strokeWidth={1.6} />
          </div>
          <div className="animate-bounceIn font-display text-6xl font-extrabold text-streak tabular-nums" style={{ marginTop: -8 }}>
            {streak}
          </div>
        </div>
        <p className="mt-1 animate-countUp font-display text-xl font-extrabold text-ink">
          {streak === 1 ? "Streak started!" : `${streak} day streak!`}
        </p>

        {/* rarity + rewards */}
        <div
          className="mt-6 animate-pop rounded-full px-4 py-1.5 text-sm font-extrabold tracking-wide"
          style={{ background: `${meta.color}1f`, color: meta.color }}
        >
          {meta.label} REWARD
        </div>

        <div className="mt-5 flex animate-countUp items-center gap-8">
          <Tally icon="coin" value={`+${reward.coins}`} label="Coins" tone="#D88A12" />
          <div className="h-10 w-px bg-line" />
          <Tally icon="star" value={`+${reward.xp}`} label="XP" tone="#3B6EF6" />
        </div>
      </div>

      <div className="w-full pb-8">
        <p className="mb-3 text-center text-[11px] text-inkFaint">{CODEX.rewards}</p>
        <Button label="Collect" onClick={onCollect} icon="check" variant="success" />
      </div>
    </div>
  );
}

function Tally({ icon, value, label, tone }: { icon: "coin" | "star"; value: string; label: string; tone: string }) {
  return (
    <div className="flex flex-col items-center">
      <span style={{ color: tone }}>
        <Icon name={icon} size={26} />
      </span>
      <span style={{ color: tone }} className="mt-1 font-display text-3xl font-extrabold tabular-nums">
        {value}
      </span>
      <span className="text-[11px] font-bold text-inkFaint">{label}</span>
    </div>
  );
}
