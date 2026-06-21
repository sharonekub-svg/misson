"use client";

// Custom line-icon set. Hand-built, stroke = currentColor, so every glyph
// inherits the surrounding text colour. This replaces all emoji iconography.

export type IconName =
  | "flame"
  | "coin"
  | "ward"
  | "xp"
  | "camera"
  | "upload"
  | "check"
  | "x"
  | "plus"
  | "back"
  | "lock"
  | "play"
  | "trail"
  | "bestiary"
  | "rivals"
  | "allies"
  | "den"
  | "skull"
  | "copy";

const P: Record<IconName, React.ReactNode> = {
  flame: <path d="M12 3c1 3-2 4-2 7a3 3 0 006 0c0-1-.3-2-.8-2.7C16 10 18 12 18 15a6 6 0 11-12 0c0-4 4-6 6-12z" />,
  coin: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
    </>
  ),
  ward: <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />,
  xp: <path d="M5 6l4 6-4 6M19 6l-4 6 4 6M11 5l2 14" />,
  camera: (
    <>
      <path d="M3 8.5A1.5 1.5 0 014.5 7H7l1.2-2h7.6L17 7h2.5A1.5 1.5 0 0121 8.5v9A1.5 1.5 0 0119.5 19h-15A1.5 1.5 0 013 17.5z" />
      <circle cx="12" cy="13" r="3.2" />
    </>
  ),
  upload: <path d="M12 16V5m0 0l-4 4m4-4l4 4M5 19h14" />,
  check: <path d="M5 13l4 4L19 7" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  back: <path d="M15 5l-7 7 7 7" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </>
  ),
  play: <path d="M8 5l11 7-11 7z" />,
  trail: <path d="M7 21c0-4 10-4 10-9s-10-5-10-9" />,
  bestiary: (
    <>
      <path d="M5 4h12a2 2 0 012 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 012-2z" />
      <path d="M9 9h6M9 13h6" />
    </>
  ),
  rivals: <path d="M6 21V10m6 11V4m6 17v-7" />,
  allies: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.5 3-5.5 6-5.5s6 2 6 5.5" />
      <path d="M16 5.5a3 3 0 010 5.5M21 20c0-2.6-1.5-4.4-3.5-5.2" />
    </>
  ),
  den: (
    <>
      <path d="M4 11l8-6 8 6" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-4h4v4" />
    </>
  ),
  skull: (
    <>
      <path d="M5 11a7 7 0 1114 0v3l-1.5 1V19h-3v-2h-5v2h-3v-3.5L5 14z" />
      <circle cx="9" cy="11" r="1.4" />
      <circle cx="15" cy="11" r="1.4" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 012-2h8" />
    </>
  ),
};

export function Icon({
  name,
  size = 20,
  className,
  strokeWidth = 1.8,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {P[name]}
    </svg>
  );
}
