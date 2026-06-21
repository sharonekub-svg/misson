"use client";

import { useStore } from "@/lib/store";
import { TIER_META } from "@/lib/types";
import { APP_NAME, CODEX } from "@/lib/brand";
import { Button, StatPill } from "./ui";
import { Beast } from "./Beast";
import { Rune } from "./Rune";
import { TilePath } from "./TilePath";

export function Trail({ onFace }: { onFace: () => void }) {
  const s = useStore();
  const today = s.path.find((n) => n.status === "current");
  const felled = s.todayCompleted || !today;
  const tier = today ? TIER_META[today.difficulty] : TIER_META.easy;

  return (
    <div className="grain relative flex h-full flex-col bg-bg">
      <header className="relative z-10 flex items-center gap-2 px-4 pb-3 pt-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl font-black tracking-[0.22em] text-ink">{APP_NAME}</h1>
          <p className="truncate text-xs font-medium uppercase tracking-wider text-inkFaint">The Trail</p>
        </div>
        <StatPill icon="flame" value={`${s.streak}`} tone="#FF6A2B" />
        <StatPill icon="coin" value={`${s.coins}`} tone="#E2B53C" />
        <StatPill icon="ward" value={`${s.freezesLeft}`} tone="#5B8CFF" />
      </header>

      <div className="fog relative min-h-0 flex-1">
        <TilePath nodes={s.path} mobSeed={s.equippedMobId} onTapCurrent={() => !felled && onFace()} />
      </div>

      {/* Mission of the Day — the awake beast. */}
      <div className="relative z-10 px-3 pb-3">
        <div
          className="edge animate-rise rounded-2xl bg-panel p-3 shadow-panel"
          style={felled ? undefined : { boxShadow: "0 0 0 1px rgba(255,106,43,0.35), 0 10px 30px rgba(0,0,0,0.5)" }}
        >
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <Beast seed={today?.seed ?? "cinder"} size={56} tint={tier.color} glow={!felled} dim={felled} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-inkFaint">
                <Rune difficulty={today?.difficulty ?? "easy"} size={12} />
                {tier.tier} · Mission of the Day
              </div>
              <h2 className="truncate font-display text-base font-bold text-ink">
                {felled ? "All beasts felled today" : today?.title}
              </h2>
              <p className="truncate text-[11px] text-inkFaint">{CODEX.mission}</p>
            </div>
          </div>
          <div className="mt-3">
            <Button
              label={felled ? "Come back tomorrow" : "Face the beast"}
              icon={felled ? "check" : "play"}
              disabled={felled}
              onClick={felled ? undefined : onFace}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
