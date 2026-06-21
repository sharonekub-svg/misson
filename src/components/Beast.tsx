"use client";

// ─────────────────────────────────────────────────────────────────────────
// Buddy — friendly, cute creature illustrations, drawn from scratch in SVG and
// fully parametric: the body shape, ears, eyes, smile and colour are all
// derived deterministically from a seed string. Same seed → same buddy, so a
// mission or a shop creature "owns" a consistent look everywhere. No emoji.
//
// (Component is still named `Beast` so imports don't churn — but these are
// soft, round, big-eyed and smiley, not scary.)
// ─────────────────────────────────────────────────────────────────────────

const NAVY = "#16224A";
const OUTLINE = "#2A3556";

function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(rng: () => number, arr: T[]): T => arr[Math.floor(rng() * arr.length)];

export type BeastKind = "beast" | "mark";

export function Beast({
  seed,
  size = 64,
  tint,
  glow = false,
  dim = false,
  kind = "beast",
  className,
}: {
  seed: string;
  size?: number;
  /** Override the body colour (else a soft pastel is derived from the seed). */
  tint?: string;
  /** Friendly blue halo — used for today's / the active buddy. */
  glow?: boolean;
  /** Render muted (not-yet-unlocked / locked). */
  dim?: boolean;
  kind?: BeastKind;
  className?: string;
}) {
  const rng = mulberry32(hashString(seed));
  const uid = `q${hashString(seed).toString(36)}`;

  const hue = Math.floor(rng() * 360);
  const body = tint ? softer(tint) : `hsl(${hue} 70% 72%)`;
  const bodyDark = shade(body, -0.16);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      style={{ filter: glow ? "drop-shadow(0 4px 10px rgba(59,110,246,0.45))" : undefined, opacity: dim ? 0.5 : 1 }}
      aria-hidden
    >
      <defs>
        <radialGradient id={`${uid}-b`} cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor={shade(body, 0.1)} />
          <stop offset="100%" stopColor={bodyDark} />
        </radialGradient>
      </defs>

      {/* soft bubble behind */}
      <circle cx="60" cy="60" r="54" fill={shade(body, 0.34)} opacity={0.5} />

      {kind === "mark" ? markGlyph(rng, body, bodyDark) : buddy(rng, uid, body, bodyDark)}
    </svg>
  );
}

function buddy(rng: () => number, uid: string, body: string, bodyDark: string) {
  const shape = pick(rng, ["round", "egg", "tall"]);
  const ear = pick(rng, ["round", "antenna", "pointy", "none"]);
  const eyes = pick(rng, ["round", "happy", "wink"]);
  const mouth = pick(rng, ["smile", "grin", "oo"]);

  const rx = shape === "tall" ? 30 : shape === "egg" ? 36 : 34;
  const ry = shape === "tall" ? 38 : shape === "egg" ? 32 : 34;
  const cy = 64;
  const fill = `url(#${uid}-b)`;

  return (
    <g stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
      {/* ears / antenna (behind body) */}
      {ear === "round" && (
        <>
          <circle cx={60 - rx * 0.7} cy={cy - ry * 0.85} r={11} fill={fill} />
          <circle cx={60 + rx * 0.7} cy={cy - ry * 0.85} r={11} fill={fill} />
        </>
      )}
      {ear === "pointy" && (
        <>
          <path d={`M${60 - rx * 0.7} ${cy - ry * 0.4} l-7 -22 l18 8 z`} fill={fill} />
          <path d={`M${60 + rx * 0.7} ${cy - ry * 0.4} l7 -22 l-18 8 z`} fill={fill} />
        </>
      )}
      {ear === "antenna" && (
        <>
          <line x1={60} y1={cy - ry} x2={60} y2={cy - ry - 16} stroke={bodyDark} strokeWidth={4} />
          <circle cx={60} cy={cy - ry - 20} r={6} fill="#F5A524" />
        </>
      )}

      {/* body */}
      <ellipse cx={60} cy={cy} rx={rx} ry={ry} fill={fill} />

      {/* little arms */}
      <circle cx={60 - rx - 1} cy={cy + ry * 0.25} r={7} fill={fill} />
      <circle cx={60 + rx + 1} cy={cy + ry * 0.25} r={7} fill={fill} />

      {/* cheeks */}
      <circle cx={60 - rx * 0.55} cy={cy + 6} r={6.5} fill="#FF9FB2" stroke="none" opacity={0.85} />
      <circle cx={60 + rx * 0.55} cy={cy + 6} r={6.5} fill="#FF9FB2" stroke="none" opacity={0.85} />

      {/* eyes */}
      {eyeShape(eyes, 60 - 13, cy - 4)}
      {eyeShape(eyes === "wink" ? "round" : eyes, 60 + 13, cy - 4)}

      {/* mouth */}
      {mouthShape(mouth, 60, cy + 12)}
    </g>
  );
}

function eyeShape(style: string, x: number, y: number) {
  if (style === "happy") {
    return <path d={`M${x - 6} ${y + 2} Q${x} ${y - 7} ${x + 6} ${y + 2}`} fill="none" stroke={OUTLINE} strokeWidth={3.5} />;
  }
  if (style === "wink") {
    return <path d={`M${x - 6} ${y} Q${x} ${y + 6} ${x + 6} ${y}`} fill="none" stroke={OUTLINE} strokeWidth={3.5} />;
  }
  return (
    <g stroke="none">
      <circle cx={x} cy={y} r={7.5} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={2} />
      <circle cx={x} cy={y + 1} r={4} fill={NAVY} />
      <circle cx={x - 1.4} cy={y - 1.2} r={1.6} fill="#FFFFFF" />
    </g>
  );
}

function mouthShape(style: string, x: number, y: number) {
  if (style === "oo") return <circle cx={x} cy={y} r={5} fill={NAVY} stroke="none" />;
  if (style === "grin")
    return (
      <path d={`M${x - 12} ${y - 3} Q${x} ${y + 12} ${x + 12} ${y - 3} Q${x} ${y + 4} ${x - 12} ${y - 3} Z`} fill={NAVY} stroke="none" />
    );
  return <path d={`M${x - 10} ${y - 2} Q${x} ${y + 9} ${x + 10} ${y - 2}`} fill="none" stroke={NAVY} strokeWidth={3.5} />;
}

// Cute sticker (star / heart / badge) for cosmetic stickers.
function markGlyph(rng: () => number, body: string, bodyDark: string) {
  const kind = pick(rng, ["star", "heart", "bolt"]);
  if (kind === "heart") {
    return (
      <path
        d="M60 92 C30 70 32 44 50 44 C58 44 60 52 60 52 C60 52 62 44 70 44 C88 44 90 70 60 92 Z"
        fill={body}
        stroke={bodyDark}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    );
  }
  if (kind === "bolt") {
    return <path d="M68 30 L40 66 L58 66 L52 92 L82 54 L62 54 Z" fill={body} stroke={bodyDark} strokeWidth={3} strokeLinejoin="round" />;
  }
  return (
    <path
      d="M60 30 l9 20 22 3 -16 15 4 22 -19 -11 -19 11 4 -22 -16 -15 22 -3 z"
      fill={body}
      stroke={bodyDark}
      strokeWidth={3}
      strokeLinejoin="round"
    />
  );
}

// ── colour utils ──
function softer(hex: string): string {
  // Blend a hex colour toward white for a pastel body.
  return mixHex(hex, "#ffffff", 0.4);
}
function shade(color: string, amt: number): string {
  if (color.startsWith("hsl")) {
    const m = color.match(/hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
    if (m) {
      const l = Math.max(0, Math.min(100, parseFloat(m[3]) + amt * 100));
      return `hsl(${m[1]} ${m[2]}% ${l}%)`;
    }
    return color;
  }
  return mixHex(color, amt < 0 ? "#000000" : "#ffffff", Math.abs(amt));
}
function mixHex(a: string, b: string, t: number): string {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  if (!pa || !pb) return a;
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `rgb(${r},${g},${bl})`;
}
function hexToRgb(hex: string): [number, number, number] | null {
  const c = hex.replace("#", "");
  if (c.length !== 6) return null;
  return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
}
