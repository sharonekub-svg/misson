"use client";

import { useStore } from "@/lib/store";
import { DIFFICULTY_META } from "@/lib/types";
import { SquishyButton, StatPill } from "./ui";
import { TilePath } from "./TilePath";

export function Home({ onStartQuest }: { onStartQuest: () => void }) {
  const s = useStore();
  const today = s.path.find((n) => n.status === "current") ?? s.path[s.path.length - 1];
  const mob = s.mobs.find((m) => m.id === s.equippedMobId)?.emoji ?? "🐱";
  const acc = s.accessories.find((a) => a.id === s.equippedAccessoryId)?.emoji ?? null;
  const diff = today?.difficulty ?? "easy";

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#EFFCF6] to-bg">
      <header className="flex items-center gap-2 px-5 pb-2 pt-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-extrabold text-ink">Up Mission</h1>
          <p className="truncate text-sm font-semibold text-inkSoft">
            Today • {DIFFICULTY_META[diff].label} quest
          </p>
        </div>
        <StatPill icon="🔥" value={`${s.streak}`} color="#FF7A45" />
        <StatPill icon="🪙" value={`${s.coins}`} color="#E0911A" />
        <StatPill icon="❄️" value={`${s.freezesLeft}`} color="#3B82F6" />
      </header>

      <div className="relative min-h-0 flex-1">
        <TilePath
          nodes={s.path}
          mobEmoji={mob}
          accessory={acc}
          onTapCurrent={() => {
            if (!s.todayCompleted) onStartQuest();
          }}
        />
        <div className="absolute inset-x-6 bottom-4">
          <SquishyButton
            label={s.todayCompleted ? "DONE FOR TODAY 🎉" : "DUELING GO"}
            disabled={s.todayCompleted}
            onClick={s.todayCompleted ? undefined : onStartQuest}
            icon={s.todayCompleted ? null : <span className="text-lg leading-none">▶</span>}
          />
        </div>
      </div>
    </div>
  );
}
