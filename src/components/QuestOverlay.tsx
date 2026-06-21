"use client";

import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { ChestReward, TIER_META } from "@/lib/types";
import { CODEX, XP_FOR } from "@/lib/brand";
import { Button } from "./ui";
import { Beast } from "./Beast";
import { Rune } from "./Rune";
import { Icon } from "./Icon";

export function MissionOverlay({
  onClose,
  onReward,
}: {
  onClose: () => void;
  onReward: (reward: ChestReward) => void;
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
      if (r.verified && r.reward) onReward(r.reward);
      else {
        setBusy(false);
        setMsg(`Almost! ${r.reason} Give it another go 💪`);
      }
    } catch {
      setBusy(false);
      setMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="sky absolute inset-0 z-20 flex flex-col">
      <div className="relative z-10 flex items-center gap-3 px-4 pb-1 pt-4">
        <button onClick={onClose} className="text-ink" aria-label="Back">
          <Icon name="back" size={24} />
        </button>
        <h2 className="font-display text-lg font-extrabold text-ink">Today’s mission</h2>
      </div>

      <div className="no-scrollbar relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-5">
        {/* Mission card */}
        <div className="rounded-3xl bg-surface p-6 text-center shadow-card">
          <div className="flex justify-center">
            <Beast seed={node.seed} size={120} tint={tier.color} glow />
          </div>
          <h3 className="mt-3 font-display text-2xl font-extrabold text-ink">{node.title}</h3>
          <div className="mt-2 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold" style={{ background: `${tier.color}1f`, color: tier.color }}>
              <Rune difficulty={node.difficulty} size={15} /> {tier.tier}
            </span>
          </div>
        </div>

        {/* How the AI check works — the thing people were confused about */}
        <div className="mt-3 flex items-start gap-3 rounded-2xl bg-primarySoft px-4 py-3">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-white">
            <Icon name="sparkle" size={18} />
          </span>
          <p className="text-[13px] leading-snug text-ink">
            <span className="font-bold">How it works.</span> {CODEX.howAiWorks}
          </p>
        </div>

        {/* Reward preview */}
        <div className="mt-3 flex items-center justify-center gap-5 text-sm font-bold">
          <span className="flex items-center gap-1.5 text-coinDark"><Icon name="coin" size={16} /> up to {tier.baseCoins * 3}</span>
          <span className="flex items-center gap-1.5 text-primary"><Icon name="star" size={16} /> {XP_FOR[node.difficulty]} XP</span>
        </div>

        <div className="flex-1" />

        {/* Capture */}
        <input ref={camRef} type="file" accept="video/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
        <input ref={galRef} type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />

        {file ? (
          <div className="flex h-24 flex-col items-center justify-center rounded-3xl border-2 border-primary bg-primarySoft">
            <span className="text-primary"><Icon name="check" size={26} strokeWidth={2.6} /></span>
            <span className="mt-1 text-sm font-extrabold text-ink">Video ready!</span>
            <button onClick={() => setFile(null)} className="mt-0.5 text-xs font-bold text-primary underline">Replace</button>
          </div>
        ) : (
          <div className="edge flex h-24 items-center justify-center gap-12 rounded-3xl bg-surface shadow-soft">
            <button onClick={() => camRef.current?.click()} className="flex flex-col items-center text-inkSoft">
              <Icon name="camera" size={26} />
              <span className="mt-1 text-sm font-extrabold text-ink">Film it</span>
            </button>
            <div className="h-10 w-px bg-line" />
            <button onClick={() => galRef.current?.click()} className="flex flex-col items-center text-inkSoft">
              <Icon name="upload" size={26} />
              <span className="mt-1 text-sm font-extrabold text-ink">Upload</span>
            </button>
          </div>
        )}

        {msg && <p className="mt-3 text-center text-sm font-bold text-hard">{msg}</p>}

        <div className="mt-4">
          <Button label={file ? "Check my mission" : "Add a video first"} disabled={!file} onClick={file ? submit : undefined} icon={file ? "check" : undefined} />
        </div>
      </div>

      {busy && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-navy/55 backdrop-blur-sm">
          <Beast seed={node.seed} size={92} tint={tier.color} glow />
          <div className="mt-5 h-9 w-9 animate-spin rounded-full border-[3px] border-white border-t-transparent" />
          <p className="mt-4 font-display font-extrabold text-white">Checking your video… 🔍</p>
        </div>
      )}
    </div>
  );
}
