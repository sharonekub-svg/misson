"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { PERK_LABEL } from "@/lib/types";
import { CODEX, levelFromXp } from "@/lib/brand";
import { CodexLine, SectionLabel } from "./ui";
import { Beast } from "./Beast";
import { Icon, IconName } from "./Icon";

export function You() {
  const s = useStore();
  const mob = s.mobs.find((m) => m.id === s.equippedMobId);
  const [copied, setCopied] = useState(false);
  const lvl = levelFromXp(s.xp);

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
    <div className="sky relative h-full">
      <div className="no-scrollbar relative z-10 h-full overflow-y-auto px-4 pb-24 pt-3">
        <h1 className="font-display text-xl font-extrabold text-ink">You</h1>

        <div className="mt-4 flex justify-center">
          <Beast seed={s.equippedMobId} size={148} glow />
        </div>
        <h2 className="mt-3 text-center font-display text-2xl font-extrabold text-ink">{mob?.name ?? "Buddy"}</h2>
        {mob?.perk && (
          <div className="mt-1.5 flex justify-center">
            <span className="rounded-full bg-primarySoft px-3 py-1 text-xs font-bold text-primary">Perk: {PERK_LABEL[mob.perk]}</span>
          </div>
        )}

        <button onClick={copyUsername} className="edge mx-auto mt-4 flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-medium shadow-soft">
          <span className="text-inkFaint">@{s.username}</span>
          <span className="text-primary">{copied ? "Copied!" : <Icon name="copy" size={14} />}</span>
        </button>

        {/* Level bar */}
        <div className="edge mt-6 rounded-3xl bg-surface p-4 shadow-soft">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-inkFaint">Level {lvl.level}</div>
              <div className="font-display text-lg font-extrabold text-ink">{lvl.title}</div>
            </div>
            <div className="text-right text-[11px] font-bold text-inkFaint">
              {lvl.intoLevel}/{lvl.span} XP
              <div className="text-primary">to {lvl.nextTitle}</div>
            </div>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-soft">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.round(lvl.pct * 100)}%` }} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat icon="flame" value={`${s.streak}`} label="Streak" tone="#FF8A3D" />
          <Stat icon="coin" value={`${s.coins}`} label="Coins" tone="#D88A12" />
          <Stat icon="snow" value={`${s.freezesLeft}`} label="Freezes" tone="#59C3F5" />
        </div>

        <div className="mt-6 space-y-2.5">
          <SectionLabel>How it works</SectionLabel>
          <CodexLine icon="flame" term="Streak" text={CODEX.streak} />
          <CodexLine icon="snow" term="Freeze" text={CODEX.freeze} />
          <CodexLine icon="star" term="XP" text={CODEX.xp} />
          <CodexLine icon="trophy" term="Level" text={CODEX.level} />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label, tone }: { icon: IconName; value: string; label: string; tone: string }) {
  return (
    <div className="edge flex flex-col items-center rounded-2xl bg-surface py-4 shadow-soft">
      <span style={{ color: tone }}>
        <Icon name={icon} size={20} />
      </span>
      <span style={{ color: tone }} className="mt-1 font-display text-lg font-extrabold tabular-nums">
        {value}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wide text-inkFaint">{label}</span>
    </div>
  );
}
