"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Accessory, Mob, PERK_LABEL } from "@/lib/types";
import { CODEX } from "@/lib/brand";
import { StatPill, CodexLine } from "./ui";
import { Beast } from "./Beast";
import { Icon } from "./Icon";

export function Bestiary() {
  const s = useStore();
  const [tab, setTab] = useState<"beasts" | "marks">("beasts");
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);

  function flash(ok: boolean, text: string) {
    setToast({ ok, text });
    setTimeout(() => setToast(null), 2200);
  }

  async function tapMob(mob: Mob) {
    if (!mob.owned) {
      const err = await s.buyMob(mob);
      flash(!err, err ?? `Recruited ${mob.name}`);
    } else {
      s.equipMob(mob.id);
    }
  }

  async function tapAcc(acc: Accessory) {
    if (!acc.owned) {
      const err = await s.buyAccessory(acc);
      flash(!err, err ?? `Claimed ${acc.name}`);
    } else {
      s.toggleAccessory(acc.id);
    }
  }

  return (
    <div className="grain relative flex h-full flex-col bg-bg">
      <div className="relative z-10 flex items-center px-4 pb-2 pt-3">
        <h1 className="flex-1 font-display text-xl font-black tracking-[0.18em] text-ink">Bestiary</h1>
        <StatPill icon="coin" value={`${s.coins}`} tone="#E2B53C" />
      </div>

      <div className="relative z-10 px-4">
        <CodexLine icon="coin" term="Spoils" text={CODEX.spoils} />
      </div>

      <div className="relative z-10 flex gap-6 px-5 pt-3">
        <Tab label="Beasts" active={tab === "beasts"} onClick={() => setTab("beasts")} />
        <Tab label="Marks" active={tab === "marks"} onClick={() => setTab("marks")} />
      </div>

      <div className="no-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pb-24 pt-3">
        <div className="grid grid-cols-2 gap-3">
          {tab === "beasts"
            ? s.mobs.map((mob) => (
                <Card
                  key={mob.id}
                  seed={mob.id}
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
                  seed={acc.id}
                  kind="mark"
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
          className="absolute inset-x-6 bottom-24 z-20 rounded-xl px-4 py-3 text-center text-sm font-bold text-black shadow-panel"
          style={{ background: toast.ok ? "#FF6A2B" : "#E5484D" }}
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
      className={`border-b-2 pb-2 text-sm font-bold uppercase tracking-wider ${
        active ? "border-ember text-ink" : "border-transparent text-inkFaint"
      }`}
    >
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
  let pill: { text: string; bg: string; fg: string; icon?: boolean };
  if (equipped) pill = { text: "Equipped", bg: "#2A1A12", fg: "#FF6A2B" };
  else if (owned) pill = { text: "Equip", bg: "#222732", fg: "#ECEEF2" };
  else pill = { text: price === 0 ? "Free" : `${price}`, bg: "#1E2530", fg: "#E2B53C", icon: true };

  return (
    <button
      onClick={onClick}
      className="edge flex flex-col items-center rounded-2xl bg-panel p-3"
      style={equipped ? { borderColor: "#FF6A2B", boxShadow: "0 0 0 1px rgba(255,106,43,0.4)" } : undefined}
    >
      <Beast seed={seed} kind={kind} size={72} dim={!owned} />
      <div className="mt-1.5 text-center font-display text-sm font-bold text-ink">{name}</div>
      {perk ? (
        <div className="mt-1 rounded-full bg-[#2A1A12] px-2 py-0.5 text-[10px] font-bold text-ember">{perk}</div>
      ) : (
        <div className="mt-1 h-[18px]" />
      )}
      <div
        className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-sm font-bold"
        style={{ background: pill.bg, color: pill.fg }}
      >
        {pill.icon && <Icon name="coin" size={14} />}
        {pill.text}
      </div>
    </button>
  );
}
