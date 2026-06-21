"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Accessory, Mob, PERK_LABEL } from "@/lib/types";
import { StatPill } from "./ui";

export function Shop() {
  const s = useStore();
  const [tab, setTab] = useState<"mobs" | "designs">("mobs");
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);

  function flash(ok: boolean, text: string) {
    setToast({ ok, text });
    setTimeout(() => setToast(null), 2200);
  }

  async function tapMob(mob: Mob) {
    if (!mob.owned) {
      const err = await s.buyMob(mob);
      flash(!err, err ?? `Unlocked ${mob.name}! 🎉`);
    } else {
      s.equipMob(mob.id);
    }
  }

  async function tapAcc(acc: Accessory) {
    if (!acc.owned) {
      const err = await s.buyAccessory(acc);
      flash(!err, err ?? `Unlocked ${acc.name}! 🎉`);
    } else {
      s.toggleAccessory(acc.id);
    }
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <div className="flex items-center px-5 pb-1 pt-3">
        <h1 className="flex-1 text-xl font-extrabold text-ink">Shop</h1>
        <StatPill icon="🪙" value={`${s.coins}`} color="#E0911A" />
      </div>

      <div className="flex gap-6 px-5 pt-2">
        <Tab label="Mobs" active={tab === "mobs"} onClick={() => setTab("mobs")} />
        <Tab label="Designs" active={tab === "designs"} onClick={() => setTab("designs")} />
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-24 pt-3">
        <div className="grid grid-cols-2 gap-3.5">
          {tab === "mobs"
            ? s.mobs.map((mob) => (
                <Card
                  key={mob.id}
                  emoji={mob.emoji}
                  name={mob.name}
                  price={mob.price}
                  owned={mob.owned}
                  equipped={s.equippedMobId === mob.id}
                  perk={mob.perk ? PERK_LABEL[mob.perk] : null}
                  onClick={() => tapMob(mob)}
                />
              ))
            : s.accessories.map((acc) => (
                <Card
                  key={acc.id}
                  emoji={acc.emoji}
                  name={acc.name}
                  price={acc.price}
                  owned={acc.owned}
                  equipped={s.equippedAccessoryId === acc.id}
                  perk={null}
                  onClick={() => tapAcc(acc)}
                />
              ))}
        </div>
      </div>

      {toast && (
        <div
          className="absolute inset-x-6 bottom-24 rounded-2xl px-4 py-3 text-center text-sm font-bold text-white shadow-soft"
          style={{ background: toast.ok ? "#10A982" : "#FB7185" }}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`border-b-[3px] pb-2 text-sm font-extrabold ${
        active ? "border-primary text-ink" : "border-transparent text-inkFaint"
      }`}
    >
      {label}
    </button>
  );
}

function Card({
  emoji,
  name,
  price,
  owned,
  equipped,
  perk,
  onClick,
}: {
  emoji: string;
  name: string;
  price: number;
  owned: boolean;
  equipped: boolean;
  perk: string | null;
  onClick: () => void;
}) {
  let pill: { text: string; bg: string; fg: string };
  if (equipped) pill = { text: "Equipped", bg: "#E3FBF3", fg: "#10A982" };
  else if (owned) pill = { text: "Equip", bg: "#EFF1F7", fg: "#1F2330" };
  else pill = { text: price === 0 ? "Free" : `🪙 ${price}`, bg: "#FFB02029", fg: "#E0911A" };

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center rounded-3xl bg-surface p-3.5 shadow-soft"
      style={{ border: equipped ? "2.5px solid #1FC99B" : "2.5px solid transparent" }}
    >
      <div className="py-2 text-5xl">{emoji}</div>
      <div className="text-center text-sm font-extrabold text-ink">{name}</div>
      {perk && (
        <div className="mt-1 rounded-full bg-[#A855F724] px-2 py-0.5 text-[11px] font-bold text-mega">{perk}</div>
      )}
      <div
        className="mt-2.5 w-full rounded-full py-2 text-center text-sm font-extrabold"
        style={{ background: pill.bg, color: pill.fg }}
      >
        {pill.text}
      </div>
    </button>
  );
}
