"use client";

import { useStore } from "@/lib/store";
import { TIER_META } from "@/lib/types";
import { APP_NAME, APP_TAGLINE, CODEX } from "@/lib/brand";
import { Button, StatPill } from "./ui";
import { Beast } from "./Beast";
import { Rune } from "./Rune";
import { TilePath } from "./TilePath";

export function Today({ onStart }: { onStart: () => void }) {
  const s = useStore();
  const today = s.path.find((n) => n.status === "current");
  const done = s.todayCompleted || !today;
  const tier = today ? TIER_META[today.difficulty] : TIER_META.easy;

  return (
    <div className="sky relative flex h-full flex-col">
      <header className="relative z-10 flex items-center gap-2 px-4 pb-2 pt-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl font-extrabold text-ink">{APP_NAME}</h1>
          <p className="truncate text-xs font-semibold text-inkFaint">{APP_TAGLINE}</p>
        </div>
        <StatPill icon="flame" value={`${s.streak}`} tone="#FF8A3D" />
        <StatPill icon="coin" value={`${s.coins}`} tone="#D88A12" />
        <StatPill icon="snow" value={`${s.freezesLeft}`} tone="#59C3F5" />
      </header>

      <div className="relative min-h-0 flex-1">
        <TilePath nodes={s.path} mobSeed={s.equippedMobId} onTapCurrent={() => !done && onStart()} />
      </div>

      {/* Today's mission card */}
      <div className="relative z-10 px-3 pb-3">
        <div
          className="animate-countUp rounded-3xl bg-surface p-3 shadow-card"
          style={done ? { border: "1px solid #E3E9F6" } : { border: "2px solid #3B6EF6" }}
        >
          <div className="flex items-center gap-3">
            <Beast seed={today?.seed ?? "buddy"} size={56} tint={tier.color} glow={!done} dim={done} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-inkFaint">
                <Rune difficulty={today?.difficulty ?? "easy"} size={14} />
                {tier.tier} · Today’s mission
              </div>
              <h2 className="truncate font-display text-base font-extrabold text-ink">
                {done ? "All done for today! 🎉" : today?.title}
              </h2>
              <p className="truncate text-[11px] text-inkFaint">{CODEX.mission}</p>
            </div>
          </div>
          <div className="mt-3">
            <Button
              label={done ? "See you tomorrow" : "Start mission"}
              icon={done ? "check" : "play"}
              variant={done ? "soft" : "primary"}
              disabled={done}
              onClick={done ? undefined : onStart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
