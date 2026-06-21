"use client";

// ─────────────────────────────────────────────────────────────────────────
// Beast — original heraldic creature emblems, drawn from scratch in SVG and
// fully parametric: every shape (horns, eyes, fangs, crest, mane) is derived
// deterministically from a seed string. The same seed always yields the same
// beast, so a quest title or a creature id "owns" a unique sigil-beast that
// appears identically everywhere (Trail, Encounter, Bestiary, Den, Rivals).
//
// This is the identity layer that replaces emoji. Nothing here is stock.
// ─────────────────────────────────────────────────────────────────────────

const EMBER = "#FF6A2B";

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

function mix(rng: () => number, lo: number, hi: number): number {
  return lo + rng() * (hi - lo);
}
function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

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
  /** Override the silhouette colour (else a stable hue is derived from seed). */
  tint?: string;
  /** Ember aura — used for the awake / current beast. */
  glow?: boolean;
  /** Render muted (felled / locked / inactive). */
  dim?: boolean;
  kind?: BeastKind;
  className?: string;
}) {
  const rng = mulberry32(hashString(seed));
  const uid = `b${hashString(seed).toString(36)}`;

  // Stable per-seed palette on obsidian. tint overrides the hue.
  const hue = Math.floor(rng() * 360);
  const body = tint ?? `hsl(${hue} 30% 60%)`;
  const edge = tint ? shade(tint, -0.35) : `hsl(${hue} 34% 34%)`;
  const opacity = dim ? 0.45 : 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      style={{
        filter: glow ? `drop-shadow(0 0 10px ${EMBER}aa)` : undefined,
        opacity,
      }}
      aria-hidden
    >
      <defs>
        <radialGradient id={`${uid}-bg`} cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#262C38" />
          <stop offset="100%" stopColor="#13161D" />
        </radialGradient>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighten(body, 0.12)} />
          <stop offset="100%" stopColor={shade(body, -0.18)} />
        </linearGradient>
      </defs>

      {/* Faceted crest backdrop — engraved field-bestiary token. */}
      {crest(uid, glow)}

      {kind === "mark" ? markGlyph(rng, body, edge) : beastBody(rng, uid, body, edge)}
    </svg>
  );
}

// ── Backdrop ──
function crest(uid: string, glow: boolean) {
  const pts = hexPoints(60, 60, 52);
  return (
    <>
      <polygon
        points={pts}
        fill={`url(#${uid}-bg)`}
        stroke={glow ? "#FF6A2B" : "#2C313C"}
        strokeWidth={glow ? 2 : 1.5}
      />
      <polygon points={hexPoints(60, 60, 44)} fill="none" stroke="#2C313C" strokeWidth={1} opacity={0.7} />
    </>
  );
}

function hexPoints(cx: number, cy: number, r: number): string {
  const out: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    out.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return out.join(" ");
}

// ── The creature, built symmetrically around x = 60 ──
function beastBody(rng: () => number, uid: string, body: string, edge: string) {
  const headW = mix(rng, 22, 30);
  const headH = mix(rng, 20, 27);
  const headCy = 64;
  const pointedJaw = rng() > 0.45;
  const chinY = headCy + headH + (pointedJaw ? mix(rng, 8, 16) : 0);

  const hornLen = mix(rng, 16, 34);
  const hornSpread = mix(rng, 9, 17);
  const hornCurl = mix(rng, -10, 14);
  const hornBaseY = headCy - headH * 0.7;

  const earStyle = pick(rng, ["pointed", "round", "none"]);
  const crestSpikes = Math.floor(mix(rng, 0, 3.99));
  const eyeStyle = pick(rng, ["round", "almond", "slit"]);
  const fangs = Math.floor(mix(rng, 0, 3.99));
  const maneRays = rng() > 0.5 ? Math.floor(mix(rng, 4, 9)) : 0;

  const fill = `url(#${uid}-body)`;

  return (
    <g stroke={edge} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
      {/* Mane / aura rays behind the head */}
      {maneRays > 0 &&
        Array.from({ length: maneRays }).map((_, i) => {
          const a = (Math.PI / (maneRays - 1)) * i - Math.PI;
          const r1 = headW + 4;
          const r2 = headW + mix(rng, 12, 20);
          const x1 = 60 + r1 * Math.cos(a);
          const y1 = headCy + r1 * Math.sin(a) * 0.8;
          const x2 = 60 + r2 * Math.cos(a);
          const y2 = headCy + r2 * Math.sin(a) * 0.8;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={shade(body, -0.1)} strokeWidth={3} opacity={0.6} />
          );
        })}

      {/* Horns (mirrored) */}
      {horn(60 + hornSpread, hornBaseY, hornLen, hornCurl, fill, false)}
      {horn(60 - hornSpread, hornBaseY, hornLen, hornCurl, fill, true)}

      {/* Ears (mirrored) */}
      {earStyle !== "none" && ear(60 + headW * 0.78, headCy - headH * 0.3, earStyle, fill, false)}
      {earStyle !== "none" && ear(60 - headW * 0.78, headCy - headH * 0.3, earStyle, fill, true)}

      {/* Head */}
      <ellipse cx={60} cy={headCy} rx={headW} ry={headH} fill={fill} />
      {pointedJaw && (
        <polygon
          points={`${60 - headW * 0.66},${headCy + headH * 0.4} ${60 + headW * 0.66},${headCy + headH * 0.4} 60,${chinY}`}
          fill={fill}
        />
      )}

      {/* Crest spikes between the horns */}
      {Array.from({ length: crestSpikes }).map((_, i) => {
        const spread = (i - (crestSpikes - 1) / 2) * 7;
        const baseY = headCy - headH * 0.85;
        return (
          <polygon
            key={i}
            points={`${60 + spread - 3},${baseY} ${60 + spread + 3},${baseY} ${60 + spread},${baseY - mix(rng, 8, 14)}`}
            fill={shade(body, -0.12)}
          />
        );
      })}

      {/* Brow ridge */}
      <path
        d={`M ${60 - headW * 0.6} ${headCy - 3} Q 60 ${headCy - 9} ${60 + headW * 0.6} ${headCy - 3}`}
        fill="none"
        stroke={edge}
        strokeWidth={2.5}
      />

      {/* Eyes (ember, mirrored) */}
      {eye(60 + headW * 0.36, headCy + 2, eyeStyle, false)}
      {eye(60 - headW * 0.36, headCy + 2, eyeStyle, true)}

      {/* Snout */}
      <polygon
        points={`58,${headCy + headH * 0.55} 62,${headCy + headH * 0.55} 60,${headCy + headH * 0.55 + 5}`}
        fill={edge}
        stroke="none"
      />

      {/* Fangs */}
      {Array.from({ length: fangs }).map((_, i) => {
        const x = 60 + (i - (fangs - 1) / 2) * 8;
        const y = pointedJaw ? chinY - 6 : headCy + headH * 0.78;
        return (
          <polygon key={i} points={`${x - 2.4},${y} ${x + 2.4},${y} ${x},${y + 6}`} fill="#E9ECF2" stroke="none" />
        );
      })}
    </g>
  );
}

function horn(bx: number, by: number, len: number, curl: number, fill: string, mirror: boolean) {
  const dir = mirror ? -1 : 1;
  const tipX = bx + dir * curl;
  const tipY = by - len;
  const midX = bx + dir * (curl * 0.4 + 5);
  return (
    <polygon
      points={`${bx - 3},${by} ${bx + 3},${by} ${midX + dir * 2},${by - len * 0.5} ${tipX},${tipY}`}
      fill={fill}
    />
  );
}

function ear(x: number, y: number, style: string, fill: string, mirror: boolean) {
  const dir = mirror ? -1 : 1;
  if (style === "round") return <circle cx={x} cy={y} r={5} fill={fill} />;
  return (
    <polygon
      points={`${x},${y + 4} ${x + dir * 3},${y - 8} ${x + dir * 9},${y - 2}`}
      fill={fill}
    />
  );
}

function eye(x: number, y: number, style: string, mirror: boolean) {
  const dir = mirror ? -1 : 1;
  if (style === "almond") {
    return (
      <g>
        <ellipse cx={x} cy={y} rx={4.6} ry={2.8} fill={EMBER} transform={`rotate(${dir * -12} ${x} ${y})`} />
        <circle cx={x} cy={y} r={1.3} fill="#1A1208" />
      </g>
    );
  }
  if (style === "slit") {
    return <ellipse cx={x} cy={y} rx={1.7} ry={4.4} fill={EMBER} transform={`rotate(${dir * 14} ${x} ${y})`} />;
  }
  return (
    <g>
      <circle cx={x} cy={y} r={3.4} fill={EMBER} />
      <circle cx={x} cy={y} r={1.2} fill="#1A1208" />
    </g>
  );
}

// ── "Mark" mode — geometric sigil for cosmetic Marks (no creature) ──
function markGlyph(rng: () => number, body: string, edge: string) {
  const arms = Math.floor(mix(rng, 3, 6.99));
  const r = 30;
  const shapes = Array.from({ length: arms }).map((_, i) => {
    const a = (Math.PI * 2 * i) / arms - Math.PI / 2;
    const x = 60 + r * Math.cos(a);
    const y = 60 + r * Math.sin(a);
    return <circle key={i} cx={x} cy={y} r={mix(rng, 4, 7)} fill={body} stroke={edge} strokeWidth={2} />;
  });
  return (
    <g>
      <polygon points={hexPoints(60, 60, 16)} fill={body} stroke={edge} strokeWidth={2} />
      <circle cx={60} cy={60} r={6} fill={EMBER} />
      {shapes}
    </g>
  );
}

// ── colour utils ──
function shade(hex: string, amt: number): string {
  if (hex.startsWith("hsl")) {
    const m = hex.match(/hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
    if (m) {
      const l = Math.max(0, Math.min(100, parseFloat(m[3]) + amt * 100));
      return `hsl(${m[1]} ${m[2]}% ${l}%)`;
    }
    return hex;
  }
  const c = hex.replace("#", "");
  const f = (i: number) => {
    const v = parseInt(c.slice(i, i + 2), 16);
    return Math.max(0, Math.min(255, Math.round(v * (1 + amt))));
  };
  return `rgb(${f(0)},${f(2)},${f(4)})`;
}
function lighten(hex: string, amt: number): string {
  return shade(hex, amt);
}
