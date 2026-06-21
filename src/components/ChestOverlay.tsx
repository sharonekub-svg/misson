"use client";

import { useState } from "react";
import { ChestReward, RARITY_META } from "@/lib/types";
import { SquishyButton } from "./ui";

export function ChestOverlay({
  reward,
  onCollect,
}: {
  reward: ChestReward;
  onCollect: () => void;
}) {
  const [opened, setOpened] = useState(false);
  const meta = RARITY_META[reward.rarity];

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-ink px-6">
      <div className="flex flex-1 flex-col items-center justify-center">
        {opened && (
          <div
            className="mb-6 animate-popIn rounded-full border-2 px-6 py-2 text-lg font-extrabold tracking-widest"
            style={{ color: meta.color, borderColor: meta.color, background: `${meta.color}22` }}
          >
            {meta.label} CHEST
          </div>
        )}

        <button
          onClick={() => setOpened(true)}
          className="flex h-52 w-52 items-center justify-center rounded-full"
          style={{
            background: `radial-gradient(circle, ${meta.color}${opened ? "88" : "33"} 0%, transparent 70%)`,
          }}
        >
          <span className={opened ? "text-8xl animate-popIn" : "text-8xl"}>{opened ? "🎉" : "🎁"}</span>
        </button>

        {opened ? (
          <div className="mt-6 text-center animate-popIn">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl">🪙</span>
              <span className="text-4xl font-extrabold text-gold">+{reward.coins}</span>
            </div>
            <p className="mt-1 font-semibold text-white/70">Streak extended! 🔥</p>
          </div>
        ) : (
          <p className="mt-6 font-semibold text-white/70">Tap the chest to open it</p>
        )}
      </div>

      {opened && (
        <div className="w-full pb-8">
          <SquishyButton label="COLLECT" onClick={onCollect} icon={<span>✓</span>} />
        </div>
      )}
    </div>
  );
}
