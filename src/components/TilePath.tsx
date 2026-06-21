"use client";

import { useEffect, useRef, useState } from "react";
import { DIFFICULTY_META, QuestNode } from "@/lib/types";
import { MobAvatar } from "./ui";

const SPACING = 122;
const AMP = 70;
const TOP = 44;
const BOTTOM = 150;
const D = 72;

function darken(hex: string, amt = 0.22): string {
  const c = hex.replace("#", "");
  const r = Math.round(parseInt(c.slice(0, 2), 16) * (1 - amt));
  const g = Math.round(parseInt(c.slice(2, 4), 16) * (1 - amt));
  const b = Math.round(parseInt(c.slice(4, 6), 16) * (1 - amt));
  return `rgb(${r},${g},${b})`;
}

export function TilePath({
  nodes,
  mobEmoji,
  accessory,
  onTapCurrent,
}: {
  nodes: QuestNode[];
  mobEmoji: string;
  accessory?: string | null;
  onTapCurrent: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(380);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = nodes.length;
  const pts = nodes.map((_, i) => ({
    x: width / 2 + AMP * Math.sin(i * 0.95),
    y: TOP + i * SPACING,
  }));
  const height = TOP + Math.max(0, n - 1) * SPACING + BOTTOM;

  let anchor = nodes.findIndex((q) => q.status === "current");
  if (anchor === -1) {
    for (let i = n - 1; i >= 0; i--) {
      if (nodes[i].status === "completed") {
        anchor = i;
        break;
      }
    }
  }

  let d = "";
  if (pts.length) {
    d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const cur = pts[i];
      const midY = (prev.y + cur.y) / 2;
      d += ` Q ${prev.x} ${midY} ${(prev.x + cur.x) / 2} ${midY} Q ${cur.x} ${midY} ${cur.x} ${cur.y}`;
    }
  }

  return (
    <div ref={containerRef} className="no-scrollbar relative h-full w-full overflow-y-auto">
      <div className="relative" style={{ height }}>
        <svg width={width} height={height} className="pointer-events-none absolute inset-0">
          <path d={d} fill="none" stroke="#E0E4EE" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {nodes.map((node, i) => (
          <Node
            key={i}
            node={node}
            x={pts[i].x}
            y={pts[i].y}
            onTap={node.status === "current" ? onTapCurrent : undefined}
          />
        ))}

        {anchor >= 0 && (
          <div
            className="pointer-events-none absolute -translate-x-1/2"
            style={{ left: pts[anchor].x, top: pts[anchor].y - D / 2 - 70 }}
          >
            <div className="flex animate-bob flex-col items-center">
              {nodes[anchor].status === "current" && (
                <div className="mb-1 rounded-full bg-surface px-3 py-1 text-[13px] font-extrabold text-primaryDark shadow-soft">
                  GO
                </div>
              )}
              <MobAvatar emoji={mobEmoji} accessory={accessory} size={46} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Node({
  node,
  x,
  y,
  onTap,
}: {
  node: QuestNode;
  x: number;
  y: number;
  onTap?: () => void;
}) {
  const left = x - D / 2;
  const top = y - D / 2;

  if (node.status === "locked") {
    return (
      <Circle left={left} top={top} fill="#E3E6EE" base="#CFD4E0">
        <span className="text-2xl opacity-50">🔒</span>
      </Circle>
    );
  }

  if (node.status === "completed") {
    const color = DIFFICULTY_META[node.difficulty].color;
    return (
      <Circle left={left} top={top} fill={color} base={darken(color)}>
        <span className="text-3xl font-black text-white">✓</span>
      </Circle>
    );
  }

  // current
  return (
    <Circle left={left} top={top} fill="#1FC99B" base="#10A982" onTap={onTap} halo>
      <span className="text-2xl">{node.emoji}</span>
    </Circle>
  );
}

function Circle({
  left,
  top,
  fill,
  base,
  onTap,
  halo,
  children,
}: {
  left: number;
  top: number;
  fill: string;
  base: string;
  onTap?: () => void;
  halo?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute" style={{ left, top, width: D, height: D }}>
      {halo && (
        <div
          className="absolute inset-0 animate-pulseRing rounded-full"
          style={{ background: "#1FC99B" }}
        />
      )}
      <div className="absolute rounded-full" style={{ top: 6, left: 0, width: D, height: D - 6, background: base }} />
      <div
        onClick={onTap}
        className="absolute flex items-center justify-center rounded-full"
        style={{ top: 0, left: 0, width: D, height: D - 6, background: fill, cursor: onTap ? "pointer" : "default" }}
      >
        {children}
      </div>
    </div>
  );
}
