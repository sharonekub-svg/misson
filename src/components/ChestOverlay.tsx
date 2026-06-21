"use client";

import { useState } from "react";
import { ChestReward, RARITY_META } from "@/lib/types";
import { CODEX } from "@/lib/brand";
import { Button } from "./ui";
import { Beast } from "./Beast";
import { Icon } from "./Icon";

export function Spoils({
  reward,
  onCollect,
}: {
  reward: ChestReward;
  onCollect: () => void;
}) {
  const [opened, setOpened] = useState(false);
  const meta = RARITY_META[reward.rarity];

  return (
    <div className="grain absolute inset-0 z-40 flex flex-col items-center justify-center bg-bg px-6">
      <div className="flex flex-1 flex-col items-center justify-center">
        {opened && (
          <div
            className="mb-6 animate-pop rounded-full border px-6 py-2 font-display text-lg font-bold tracking-[0.3em]"
            style={{ color: meta.color, borderColor: meta.color, background: `${meta.color}1a` }}
          >
            {meta.label} KILL
          </div>
        )}

        <button
          onClick={() => setOpened(true)}
          className="grid h-56 w-56 place-items-center rounded-full"
          style={{ background: `radial-gradient(circle, ${meta.color}${opened ? "33" : "14"} 0%, transparent 70%)` }}
        >
          <span className={opened ? "animate-pop" : "animate-float"}>
            <Beast seed={`spoils-${reward.rarity}`} size={opened ? 160 : 132} tint={meta.color} glow={opened} dim={!opened} />
          </span>
        </button>

        {opened ? (
          <div className="mt-7 flex animate-rise items-center gap-7">
            <Tally icon="coin" value={`+${reward.coins}`} label="Spoils" tone="#E2B53C" />
            <div className="h-10 w-px bg-line" />
            <Tally icon="xp" value={`+${reward.xp}`} label="XP" tone="#FF6A2B" />
          </div>
        ) : (
          <p className="mt-7 text-sm font-medium text-inkFaint">Tap to claim the spoils</p>
        )}

        {opened && (
          <p className="mt-5 flex items-center gap-1.5 text-sm font-bold text-ember">
            <Icon name="flame" size={16} /> Flame extended
          </p>
        )}
      </div>

      {opened && (
        <div className="w-full pb-8">
          <p className="mb-3 text-center text-[11px] text-inkFaint">{CODEX.rewards}</p>
          <Button label="Collect" onClick={onCollect} icon="check" />
        </div>
      )}
    </div>
  );
}

function Tally({ icon, value, label, tone }: { icon: "coin" | "xp"; value: string; label: string; tone: string }) {
  return (
    <div className="flex flex-col items-center">
      <span style={{ color: tone }}>
        <Icon name={icon} size={26} />
      </span>
      <span style={{ color: tone }} className="mt-1 font-display text-3xl font-black tabular-nums">
        {value}
      </span>
      <span className="text-[11px] font-bold uppercase tracking-wider text-inkFaint">{label}</span>
    </div>
  );
}
