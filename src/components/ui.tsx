"use client";

import { useState } from "react";
import { Icon, IconName } from "./Icon";

type ButtonVariant = "primary" | "soft" | "success";

/** Bouncy, tactile press-button. */
export function Button({
  label,
  onClick,
  icon,
  disabled = false,
  variant = "primary",
}: {
  label: string;
  onClick?: () => void;
  icon?: IconName;
  disabled?: boolean;
  variant?: ButtonVariant;
}) {
  const [down, setDown] = useState(false);
  const active = !disabled && !!onClick;

  const faces: Record<ButtonVariant, { face: string; base: string; text: string }> = {
    primary: { face: "#3B6EF6", base: "#2B57D4", text: "#FFFFFF" },
    soft: { face: "#EAF0FF", base: "#D2DEFB", text: "#2B57D4" },
    success: { face: "#2DBE7E", base: "#1E9A63", text: "#FFFFFF" },
  };
  const f = faces[variant];
  const face = active ? f.face : "#E3E9F6";
  const base = active ? f.base : "#CFD8EC";
  const text = active ? f.text : "#9AA7C7";

  return (
    <div style={{ background: base, borderRadius: 18, paddingBottom: 5 }} className="w-full select-none">
      <button
        disabled={!active}
        onPointerDown={() => active && setDown(true)}
        onPointerUp={() => setDown(false)}
        onPointerLeave={() => setDown(false)}
        onClick={() => active && onClick?.()}
        style={{ background: face, color: text, transform: `translateY(${down ? 5 : 0}px)`, borderRadius: 18 }}
        className="flex w-full items-center justify-center gap-2 py-3.5 text-base font-extrabold tracking-wide transition-transform duration-75"
      >
        {icon && <Icon name={icon} size={19} strokeWidth={2.2} />}
        {label}
      </button>
    </div>
  );
}

export function StatPill({ icon, value, tone = "#16224A" }: { icon: IconName; value: string; tone?: string }) {
  return (
    <div className="edge flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1.5 shadow-soft">
      <span style={{ color: tone }}>
        <Icon name={icon} size={15} strokeWidth={2.1} />
      </span>
      <span style={{ color: tone }} className="text-sm font-extrabold tabular-nums">
        {value}
      </span>
    </div>
  );
}

/** Always-visible, plain-language explainer for a mechanic. */
export function CodexLine({ icon, term, text }: { icon: IconName; term: string; text: string }) {
  return (
    <div className="edge flex items-start gap-3 rounded-2xl bg-surface px-3.5 py-3 shadow-soft">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primarySoft text-primary">
        <Icon name={icon} size={17} strokeWidth={2.1} />
      </span>
      <p className="text-[13px] leading-snug text-inkSoft">
        <span className="font-bold text-ink">{term}.</span> {text}
      </p>
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs font-extrabold uppercase tracking-[0.16em] text-inkFaint">{children}</h2>;
}
