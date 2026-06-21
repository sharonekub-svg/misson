"use client";

import { useState } from "react";
import { Icon, IconName } from "./Icon";

type ButtonVariant = "ember" | "ghost" | "danger";

/** Tactile press-button. Ember = the one dangerous accent, used for the act of
 *  facing a beast; ghost/danger for secondary actions. */
export function Button({
  label,
  onClick,
  icon,
  disabled = false,
  variant = "ember",
}: {
  label: string;
  onClick?: () => void;
  icon?: IconName;
  disabled?: boolean;
  variant?: ButtonVariant;
}) {
  const [down, setDown] = useState(false);
  const active = !disabled && !!onClick;

  const faces: Record<ButtonVariant, { face: string; base: string; text: string; ring: string }> = {
    ember: { face: "#FF6A2B", base: "#9C3A12", text: "#170B05", ring: "#FF6A2B" },
    ghost: { face: "#222732", base: "#10131A", text: "#ECEEF2", ring: "#2C313C" },
    danger: { face: "#E5484D", base: "#8E2A2D", text: "#1A0809", ring: "#E5484D" },
  };
  const f = faces[variant];
  const face = active ? f.face : "#1B1F27";
  const base = active ? f.base : "#0F1116";
  const text = active ? f.text : "#5A6172";

  return (
    <div style={{ background: base, borderRadius: 14, paddingBottom: 5 }} className="w-full select-none">
      <button
        disabled={!active}
        onPointerDown={() => active && setDown(true)}
        onPointerUp={() => setDown(false)}
        onPointerLeave={() => setDown(false)}
        onClick={() => active && onClick?.()}
        style={{
          background: face,
          color: text,
          transform: `translateY(${down ? 5 : 0}px)`,
          borderRadius: 14,
        }}
        className="flex w-full items-center justify-center gap-2 py-3.5 text-[15px] font-extrabold uppercase tracking-[0.14em] transition-transform duration-75"
      >
        {icon && <Icon name={icon} size={18} strokeWidth={2.2} />}
        {label}
      </button>
    </div>
  );
}

export function StatPill({
  icon,
  value,
  tone = "#ECEEF2",
}: {
  icon: IconName;
  value: string;
  tone?: string;
}) {
  return (
    <div className="edge flex items-center gap-1.5 rounded-full bg-panel px-2.5 py-1.5">
      <Icon name={icon} size={15} className="shrink-0" strokeWidth={2} />
      <span style={{ color: tone }} className="text-sm font-bold tabular-nums">
        {value}
      </span>
    </div>
  );
}

/** Always-visible explainer for a mechanic — the "codex" line. */
export function CodexLine({
  icon,
  term,
  text,
}: {
  icon: IconName;
  term: string;
  text: string;
}) {
  return (
    <div className="edge flex items-start gap-3 rounded-xl bg-panel/60 px-3.5 py-3">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emberSoft text-ember">
        <Icon name={icon} size={16} strokeWidth={2} />
      </span>
      <p className="text-[13px] leading-snug text-inkSoft">
        <span className="font-bold text-ink">{term}.</span> {text}
      </p>
    </div>
  );
}

/** Small section heading in the display face. */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xs font-bold uppercase tracking-[0.28em] text-inkFaint">
      {children}
    </h2>
  );
}
