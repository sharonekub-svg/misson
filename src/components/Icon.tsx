"use client";

// Custom line-icon set. stroke = currentColor so each glyph inherits text colour.

export type IconName =
  | "home"
  | "bag"
  | "trophy"
  | "people"
  | "profile"
  | "flame"
  | "coin"
  | "snow"
  | "star"
  | "camera"
  | "upload"
  | "check"
  | "x"
  | "plus"
  | "back"
  | "lock"
  | "play"
  | "copy"
  | "sparkle"
  | "heart";

const P: Record<IconName, React.ReactNode> = {
  home: <path d="M4 11l8-6 8 6M6 10v9h12v-9M10 19v-5h4v5" />,
  bag: (
    <>
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6a3 3 0 016 0v2" />
    </>
  ),
  trophy: (
    <>
      <path d="M7 4h10v4a5 5 0 01-10 0V4z" />
      <path d="M7 5H4v2a3 3 0 003 3M17 5h3v2a3 3 0 01-3 3" />
      <path d="M12 13v4M9 20h6M10 20l.5-3h3l.5 3" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <path d="M16 5.5a3 3 0 010 5.5M21 20c0-2.6-1.4-4.4-3.4-5.2" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </>
  ),
  flame: <path d="M12 3c1 3-2 4-2 7a3 3 0 006 0c0-1-.3-2-.8-2.7C16 10 18 12 18 15a6 6 0 11-12 0c0-4 4-6 6-12z" />,
  coin: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
    </>
  ),
  snow: <path d="M12 3v18M5 7l14 10M19 7L5 17M4 12h16M8.5 4.5L12 7l3.5-2.5M8.5 19.5L12 17l3.5 2.5" />,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z" />,
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
      <rect x="5" y="11" width="14" height="9" rx="2.5" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </>
  ),
  play: <path d="M8 5l11 7-11 7z" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M5 15V5a2 2 0 012-2h8" />
    </>
  ),
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" />,
  heart: <path d="M12 20C5 15.5 4 11 6.5 8.5 8.2 6.8 11 7 12 9c1-2 3.8-2.2 5.5-.5C20 11 19 15.5 12 20z" />,
};

export function Icon({
  name,
  size = 20,
  className,
  strokeWidth = 1.9,
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
