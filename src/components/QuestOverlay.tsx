"use client";

import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { ChestReward, DIFFICULTY_META } from "@/lib/types";
import { DifficultyChip, SquishyButton } from "./ui";

export function QuestOverlay({
  onClose,
  onChest,
}: {
  onClose: () => void;
  onChest: (reward: ChestReward) => void;
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

  async function submit() {
    if (!file || busy) return;
    setBusy(true);
    setMsg(null);
    try {
      const r = await s.submitTodayQuest(file);
      if (r.verified && r.reward) {
        onChest(r.reward);
      } else {
        setBusy(false);
        setMsg(`Not quite — ${r.reason}`);
      }
    } catch (e) {
      setBusy(false);
      setMsg("Something went wrong. Please try again.");
    }
  }

  const verifyLabel = node.verify === "ai" ? "🤖 AI checks your video" : "👥 A friend confirms it";

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-bg">
      <div className="flex items-center gap-3 px-5 pb-1 pt-4">
        <button onClick={onClose} className="text-2xl text-ink" aria-label="Back">
          ←
        </button>
        <h2 className="text-lg font-extrabold text-ink">Today’s Quest</h2>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-5 pb-5">
        {/* Quest card */}
        <div className="rounded-3xl bg-surface p-6 text-center shadow-soft">
          <div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-4xl"
            style={{ background: `${DIFFICULTY_META[node.difficulty].color}24` }}
          >
            {node.emoji}
          </div>
          <h3 className="mt-4 text-xl font-extrabold text-ink">{node.title}</h3>
          <div className="mt-3 flex justify-center">
            <DifficultyChip difficulty={node.difficulty} />
          </div>
          <div className="mt-4 inline-block rounded-xl bg-surfaceAlt px-3 py-2 text-sm font-semibold text-inkSoft">
            {verifyLabel}
          </div>
        </div>

        <p className="mt-4 text-center text-sm font-semibold text-inkSoft">
          🎁 Finish to open a chest — up to {DIFFICULTY_META[node.difficulty].baseCoins * 3} 🪙
        </p>

        <div className="flex-1" />

        {/* Video zone */}
        <input
          ref={camRef}
          type="file"
          accept="video/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
        />
        <input
          ref={galRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
        />

        {file ? (
          <div className="flex h-28 flex-col items-center justify-center rounded-3xl border-2 border-primary bg-primarySoft">
            <span className="text-2xl">✅</span>
            <span className="mt-1 text-sm font-extrabold text-ink">Video ready</span>
            <button onClick={() => setFile(null)} className="mt-1 text-xs font-bold text-primaryDark underline">
              Replace
            </button>
          </div>
        ) : (
          <div className="flex h-28 items-center justify-center gap-10 rounded-3xl border-2 border-nodeLockedRing bg-surface">
            <button onClick={() => camRef.current?.click()} className="flex flex-col items-center">
              <span className="text-3xl">🎥</span>
              <span className="mt-1 text-sm font-extrabold text-ink">Film it</span>
            </button>
            <button onClick={() => galRef.current?.click()} className="flex flex-col items-center">
              <span className="text-3xl">🖼️</span>
              <span className="mt-1 text-sm font-extrabold text-ink">Upload</span>
            </button>
          </div>
        )}

        {msg && <p className="mt-3 text-center text-sm font-bold text-hard">{msg}</p>}

        <div className="mt-4">
          <SquishyButton
            label={file ? "COMPLETE QUEST" : "ADD YOUR VIDEO FIRST"}
            disabled={!file}
            onClick={file ? submit : undefined}
          />
        </div>
      </div>

      {busy && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
          <p className="mt-4 font-extrabold text-white">
            {node.verify === "ai" ? "Checking your video with AI…" : "Uploading your video…"}
          </p>
        </div>
      )}
    </div>
  );
}
