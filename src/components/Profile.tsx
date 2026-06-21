"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { PERK_LABEL } from "@/lib/types";
import { CODEX, rankFromXp } from "@/lib/brand";
import { CodexLine, SectionLabel } from "./ui";
import { Beast } from "./Beast";
import { Icon, IconName } from "./Icon";

export function Den() {
  const s = useStore();
  const mob = s.mobs.find((m) => m.id === s.equippedMobId);
  const [copied, setCopied] = useState(false);
  const rank = rankFromXp(s.xp);

  function copyUsername() {
    navigator.clipboard?.writeText(s.username).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => {},
    );
  }

  return (
    <div className="grain relative h-full">
      <div className="no-scrollbar relative z-10 h-full overflow-y-auto px-4 pb-24 pt-3">
        <h1 className="font-display text-xl font-black tracking-[0.18em] text-ink">The Den</h1>

        <div className="mt-4 flex justify-center">
          <div className="relative">
            <Beast seed={s.equippedMobId} size={148} glow />
          </div>
        </div>
        <h2 className="mt-3 text-center font-display text-2xl font-bold text-ink">{mob?.name ?? "Cinderpaw"}</h2>
        {mob?.perk && (
          <div className="mt-1.5 flex justify-center">
            <span className="rounded-full bg-[#2A1A12] px-3 py-1 text-xs font-bold text-ember">
              Boon: {PERK_LABEL[mob.perk]}
            </span>
          </div>
        )}

        <button
          onClick={copyUsername}
          className="edge mx-auto mt-4 flex items-center gap-2 rounded-full bg-panel px-4 py-2 text-sm font-medium"
        >
          <span className="text-inkFaint">@{s.username}</span>
          <span className="text-ember">
            {copied ? "Copied" : <Icon name="copy" size={14} />}
          </span>
        </button>

        {/* Rank bar */}
        <div className="edge mt-6 rounded-2xl bg-panel p-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-inkFaint">Rank {rank.level}</div>
              <div className="font-display text-lg font-bold text-ink">{rank.title}</div>
            </div>
            <div className="text-right text-[11px] font-bold text-inkFaint">
              {rank.intoLevel}/{rank.span} XP
              <div className="text-ember">to {rank.nextTitle}</div>
            </div>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-raised">
            <div
              className="h-full rounded-full bg-ember transition-all"
              style={{ width: `${Math.round(rank.pct * 100)}%`, boxShadow: "0 0 10px rgba(255,106,43,0.6)" }}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat icon="flame" value={`${s.streak}`} label="Flame" tone="#FF6A2B" />
          <Stat icon="coin" value={`${s.coins}`} label="Spoils" tone="#E2B53C" />
          <Stat icon="ward" value={`${s.freezesLeft}`} label="Wards" tone="#5B8CFF" />
        </div>

        <div className="mt-6 space-y-2.5">
          <SectionLabel>Codex</SectionLabel>
          <CodexLine icon="flame" term="Flame" text={CODEX.flame} />
          <CodexLine icon="ward" term="Ward" text={CODEX.ward} />
          <CodexLine icon="xp" term="XP" text={CODEX.xp} />
          <CodexLine icon="den" term="Rank" text={CODEX.rank} />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label, tone }: { icon: IconName; value: string; label: string; tone: string }) {
  return (
    <div className="edge flex flex-col items-center rounded-xl bg-panel py-4">
      <span style={{ color: tone }}>
        <Icon name={icon} size={20} />
      </span>
      <span style={{ color: tone }} className="mt-1 font-display text-lg font-black tabular-nums">
        {value}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider text-inkFaint">{label}</span>
    </div>
  );
}
