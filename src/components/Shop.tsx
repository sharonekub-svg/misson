"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Accessory, Mob, PERK_LABEL } from "@/lib/types";
import { CODEX } from "@/lib/brand";
import { StatPill, CodexLine } from "./ui";
import { Beast } from "./Beast";
import { Icon } from "./Icon";

export function Shop() {
  const s = useStore();
  const [tab, setTab] = useState<"buddies" | "stickers">("buddies");
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);

  function flash(ok: boolean, text: string) {
    setToast({ ok, text });
    setTimeout(() => setToast(null), 2200);
  }

  async function tapMob(mob: Mob) {
    if (!mob.owned) {
      const err = await s.buyMob(mob);
      flash(!err, err ?? `Unlocked ${mob.name}! 🎉`);
    } else s.equipMob(mob.id);
  }
  async function tapAcc(acc: Accessory) {
    if (!acc.owned) {
      const err = await s.buyAccessory(acc);
      flash(!err, err ?? `Got ${acc.name}! 🎉`);
    } else s.toggleAccessory(acc.id);
  }

  return (
    <div className="sky relative flex h-full flex-col">
      <div className="relative z-10 flex items-center px-4 pb-2 pt-3">
        <h1 className="flex-1 font-display text-xl font-extrabold text-ink">Shop</h1>
        <StatPill icon="coin" value={`${s.coins}`} tone="#D88A12" />
      </div>

      <div className="relative z-10 px-4">
        <CodexLine icon="coin" term="Coins" text={CODEX.coins} />
      </div>

      <div className="relative z-10 flex gap-6 px-5 pt-3">
        <Tab label="Buddies" active={tab === "buddies"} onClick={() => setTab("buddies")} />
        <Tab label="Stickers" active={tab === "stickers"} onClick={() => setTab("stickers")} />
      </div>

      <div className="no-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pb-24 pt-3">
        <div className="grid grid-cols-2 gap-3">
          {tab === "buddies"
            ? s.mobs.map((mob) => (
                <Card key={mob.id} seed={mob.id} name={mob.name} price={mob.price} owned={mob.owned} equipped={s.equippedMobId === mob.id} perk={mob.perk ? PERK_LABEL[mob.perk] : null} onClick={() => tapMob(mob)} />
              ))
            : s.accessories.map((acc) => (
                <Card key={acc.id} seed={acc.id} kind="mark" name={acc.name} price={acc.price} owned={acc.owned} equipped={s.equippedAccessoryId === acc.id} perk={null} onClick={() => tapAcc(acc)} />
              ))}
        </div>
      </div>

      {toast && (
        <div className="absolute inset-x-6 bottom-24 z-20 rounded-2xl px-4 py-3 text-center text-sm font-bold text-white shadow-card" style={{ background: toast.ok ? "#2DBE7E" : "#FF6B6B" }}>
          {toast.text}
        </div>
      )}
    </div>
  );
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`border-b-[3px] pb-2 text-sm font-extrabold ${active ? "border-primary text-ink" : "border-transparent text-inkFaint"}`}>
      {label}
    </button>
  );
}

function Card({
  seed,
  kind = "beast",
  name,
  price,
  owned,
  equipped,
  perk,
  onClick,
}: {
  seed: string;
  kind?: "beast" | "mark";
  name: string;
  price: number;
  owned: boolean;
  equipped: boolean;
  perk: string | null;
  onClick: () => void;
}) {
  let pill: { text: string; bg: string; fg: string; coin?: boolean };
  if (equipped) pill = { text: "Equipped", bg: "#E7EEFF", fg: "#2B57D4" };
  else if (owned) pill = { text: "Equip", bg: "#EAF0FF", fg: "#16224A" };
  else pill = { text: price === 0 ? "Free" : `${price}`, bg: "#FFF1DC", fg: "#D88A12", coin: price !== 0 };

  return (
    <button onClick={onClick} className="flex flex-col items-center rounded-3xl bg-surface p-3 shadow-soft" style={{ border: equipped ? "2.5px solid #3B6EF6" : "2.5px solid transparent" }}>
      <Beast seed={seed} kind={kind} size={74} dim={!owned} />
      <div className="mt-1.5 text-center font-display text-sm font-extrabold text-ink">{name}</div>
      {perk ? (
        <div className="mt-1 rounded-full bg-primarySoft px-2 py-0.5 text-[10px] font-bold text-primary">{perk}</div>
      ) : (
        <div className="mt-1 h-[18px]" />
      )}
      <div className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl py-2 text-sm font-extrabold" style={{ background: pill.bg, color: pill.fg }}>
        {pill.coin && <Icon name="coin" size={14} />}
        {pill.text}
      </div>
    </button>
  );
}
