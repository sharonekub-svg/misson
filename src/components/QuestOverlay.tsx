"use client";

import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { ChestReward, TIER_META } from "@/lib/types";
import { CODEX, XP_FOR } from "@/lib/brand";
import { Button } from "./ui";
import { Beast } from "./Beast";
import { Rune } from "./Rune";
import { Icon } from "./Icon";

export function Encounter({
  onClose,
  onSpoils,
}: {
  onClose: () => void;
  onSpoils: (reward: ChestReward) => void;
}) {
  const s = useStore();
  const node = s.path.find((n) => n.status === "current");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const camRef = useRef<HTMLInputElement>(null);
  const galRef = useRef<HTMLInputElement>(null);

  if (!node) {
    onClose();
    return null;
  }

  const tier = TIER_META[node.difficulty];

  async function submit() {
    if (!file || busy || !node) return;
    setBusy(true);
    setMsg(null);
    try {
      const r = await s.submitTodayQuest(file);
      if (r.verified && r.reward) {
        onSpoils(r.reward);
      } else {
        setBusy(false);
        setMsg(`It escaped — ${r.reason}`);
      }
    } catch {
      setBusy(false);
      setMsg("Something went wrong. Try the strike again.");
    }
  }

  return (
    <div className="grain absolute inset-0 z-20 flex flex-col bg-bg">
      <div className="relative z-10 flex items-center gap-3 px-4 pb-1 pt-4">
        <button onClick={onClose} className="text-ink" aria-label="Back">
          <Icon name="back" size={24} />
        </button>
        <h2 className="font-display text-lg font-bold tracking-wide text-ink">The Encounter</h2>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-4 pb-5">
        {/* Beast portrait */}
        <div className="edge relative overflow-hidden rounded-3xl bg-panel p-6 text-center shadow-panel">
          <div
            className="absolute inset-0 opacity-40"
            style={{ background: `radial-gradient(60% 50% at 50% 30%, ${tier.color}22, transparent 70%)` }}
          />
          <div className="relative flex justify-center">
            <Beast seed={node.seed} size={132} tint={tier.color} glow />
          </div>
          <h3 className="relative mt-3 font-display text-2xl font-bold text-ink">{node.title}</h3>
          <div className="relative mt-2 flex items-center justify-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]"
              style={{ background: `${tier.color}1f`, color: tier.color }}
            >
              <Rune difficulty={node.difficulty} size={14} /> {tier.tier} beast
            </span>
          </div>
        </div>

        {/* Verify + spoils preview */}
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <Info icon={node.verify === "ai" ? "skull" : "allies"} title={node.verify === "ai" ? "Warden's Eye" : "Ally witness"}>
            {node.verify === "ai" ? CODEX.verifyAi : CODEX.verifyFriend}
          </Info>
          <Info icon="coin" title="Spoils">
            up to {tier.baseCoins * 3} coins · {XP_FOR[node.difficulty]} XP
          </Info>
        </div>

        <div className="flex-1" />

        {/* Capture */}
        <input ref={camRef} type="file" accept="video/*" capture="environment" className="hidden"
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
        <input ref={galRef} type="file" accept="video/*" className="hidden"
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />

        {file ? (
          <div className="edge flex h-24 flex-col items-center justify-center rounded-2xl bg-emberSoft" style={{ borderColor: "#FF6A2B" }}>
            <span className="text-ember"><Icon name="check" size={26} strokeWidth={2.4} /></span>
            <span className="mt-1 text-sm font-bold text-ink">Footage ready</span>
            <button onClick={() => setFile(null)} className="mt-0.5 text-xs font-bold text-ember underline">
              Replace
            </button>
          </div>
        ) : (
          <div className="edge flex h-24 items-center justify-center gap-12 rounded-2xl bg-panel">
            <button onClick={() => camRef.current?.click()} className="flex flex-col items-center text-inkSoft">
              <Icon name="camera" size={26} />
              <span className="mt-1 text-sm font-bold text-ink">Film it</span>
            </button>
            <div className="h-10 w-px bg-line" />
            <button onClick={() => galRef.current?.click()} className="flex flex-col items-center text-inkSoft">
              <Icon name="upload" size={26} />
              <span className="mt-1 text-sm font-bold text-ink">Upload</span>
            </button>
          </div>
        )}

        {msg && <p className="mt-3 text-center text-sm font-bold text-dire">{msg}</p>}

        <div className="mt-4">
          <Button label={file ? "Strike" : "Add footage first"} disabled={!file} onClick={file ? submit : undefined} icon={file ? "skull" : undefined} />
        </div>
      </div>

      {busy && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
          <Beast seed={node.seed} size={88} tint={tier.color} glow />
          <div className="mt-5 h-9 w-9 animate-spin rounded-full border-2 border-ember border-t-transparent" />
          <p className="mt-4 font-display font-bold tracking-wide text-ink">
            {node.verify === "ai" ? "The Warden's Eye is reading your footage…" : "Sealing the kill…"}
          </p>
        </div>
      )}
    </div>
  );
}

function Info({ icon, title, children }: { icon: React.ComponentProps<typeof Icon>["name"]; title: string; children: React.ReactNode }) {
  return (
    <div className="edge rounded-xl bg-panel p-3">
      <div className="flex items-center gap-1.5 text-ember">
        <Icon name={icon} size={15} />
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink">{title}</span>
      </div>
      <p className="mt-1 text-[11px] leading-snug text-inkFaint">{children}</p>
    </div>
  );
}
