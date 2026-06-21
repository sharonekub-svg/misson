"use client";

import { useState } from "react";
import { DIFFICULTY_META, Difficulty } from "@/lib/types";

export function SquishyButton({
  label,
  onClick,
  color = "#1FC99B",
  base = "#10A982",
  textColor = "#FFFFFF",
  icon,
  disabled = false,
}: {
  label: string;
  onClick?: () => void;
  color?: string;
  base?: string;
  textColor?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  const [down, setDown] = useState(false);
  const active = !disabled && !!onClick;
  const faceColor = active ? color : "#AEB4C2";
  const baseColor = active ? base : "#CFD4E0";

  return (
    <div
      style={{ background: baseColor, borderRadius: 18, paddingBottom: 6 }}
      className="w-full select-none"
    >
      <button
        disabled={!active}
        onPointerDown={() => active && setDown(true)}
        onPointerUp={() => setDown(false)}
        onPointerLeave={() => setDown(false)}
        onClick={() => active && onClick?.()}
        style={{
          background: faceColor,
          color: textColor,
          transform: `translateY(${down ? 6 : 0}px)`,
          borderRadius: 18,
        }}
        className="flex w-full items-center justify-center gap-2 py-3.5 text-base font-extrabold tracking-wide transition-transform duration-75"
      >
        {icon}
        {label}
      </button>
    </div>
  );
}

export function MobAvatar({
  emoji,
  accessory,
  size = 64,
  ring = "#1FC99B",
  bg = "#E3FBF3",
}: {
  emoji: string;
  accessory?: string | null;
  size?: number;
  ring?: string;
  bg?: string;
}) {
  return (
    <div style={{ width: size, height: size }} className="relative">
      <div
        style={{
          borderColor: ring,
          background: bg,
          fontSize: size * 0.5,
          borderWidth: Math.max(2, size * 0.05),
          boxShadow: `0 ${size * 0.08}px ${size * 0.18}px ${ring}2e`,
        }}
        className="flex h-full w-full items-center justify-center rounded-full border"
      >
        {emoji}
      </div>
      {accessory && (
        <div
          style={{ fontSize: size * 0.26 }}
          className="absolute -right-1 -top-1 rounded-full bg-surface p-1 shadow-soft"
        >
          {accessory}
        </div>
      )}
    </div>
  );
}

export function StatPill({ icon, value, color }: { icon: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 shadow-soft">
      <span className="text-base">{icon}</span>
      <span style={{ color }} className="text-sm font-extrabold">
        {value}
      </span>
    </div>
  );
}

export function DifficultyChip({ difficulty }: { difficulty: Difficulty }) {
  const m = DIFFICULTY_META[difficulty];
  const textColor = difficulty === "medium" ? "#E0911A" : m.color;
  return (
    <span
      style={{ background: `${m.color}29`, color: textColor }}
      className="rounded-full px-3 py-1 text-[11px] font-extrabold tracking-wide"
    >
      {m.label.toUpperCase()}
    </span>
  );
}
