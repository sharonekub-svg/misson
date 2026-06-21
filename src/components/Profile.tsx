"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { PERK_LABEL } from "@/lib/types";
import { MobAvatar } from "./ui";

export function Profile() {
  const s = useStore();
  const mob = s.mobs.find((m) => m.id === s.equippedMobId);
  const acc = s.accessories.find((a) => a.id === s.equippedAccessoryId)?.emoji ?? null;
  const [copied, setCopied] = useState(false);

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
    <div className="no-scrollbar h-full overflow-y-auto bg-bg px-5 pb-24 pt-3">
      <h1 className="text-xl font-extrabold text-ink">Your Mob</h1>

      <div className="mt-5 flex justify-center">
        <MobAvatar emoji={mob?.emoji ?? "🐱"} accessory={acc} size={150} />
      </div>
      <h2 className="mt-3 text-center text-xl font-extrabold text-ink">{mob?.name ?? "Pixel Cat"}</h2>
      {mob?.perk && (
        <div className="mt-1.5 flex justify-center">
          <span className="rounded-full bg-[#A855F724] px-3 py-1 text-xs font-bold text-mega">
            Perk: {PERK_LABEL[mob.perk]}
          </span>
        </div>
      )}

      {/* Username share */}
      <button
        onClick={copyUsername}
        className="mx-auto mt-4 flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-bold text-inkSoft shadow-soft"
      >
        <span className="text-inkFaint">@{s.username}</span>
        <span className="text-primaryDark">{copied ? "Copied!" : "Tap to copy"}</span>
      </button>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat icon="🔥" value={`${s.streak}`} label="Day streak" color="#FF7A45" />
        <Stat icon="🪙" value={`${s.coins}`} label="Coins" color="#E0911A" />
        <Stat icon="❄️" value={`${s.freezesLeft}`} label="Freezes" color="#3B82F6" />
      </div>

      <div className="mt-6 flex items-center gap-4 rounded-3xl bg-surface p-5 shadow-soft">
        <span className="text-2xl">❄️</span>
        <div>
          <div className="text-sm font-extrabold text-ink">Streak freezes</div>
          <p className="text-sm font-semibold text-inkSoft">
            You get 3 every month. Use one to save your streak on a missed day.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-surface py-4 shadow-soft">
      <span className="text-xl">{icon}</span>
      <span style={{ color }} className="mt-1 text-lg font-extrabold">
        {value}
      </span>
      <span className="text-xs font-bold text-inkFaint">{label}</span>
    </div>
  );
}
