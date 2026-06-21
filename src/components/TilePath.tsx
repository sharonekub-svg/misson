"use client";

import { useEffect, useRef, useState } from "react";
import { QuestNode, TIER_META } from "@/lib/types";
import { Beast } from "./Beast";
import { Rune } from "./Rune";
import { Icon } from "./Icon";

const SPACING = 128;
const AMP = 64;
const TOP = 54;
const BOTTOM = 40;
const D = 78;

export function TilePath({
  nodes,
  mobSeed,
  onTapCurrent,
}: {
  nodes: QuestNode[];
  mobSeed: string;
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
          <path d={d} fill="none" stroke="#1B1F27" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
          <path
            d={d}
            fill="none"
            stroke="#2C313C"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="2 12"
          />
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
            style={{ left: pts[anchor].x, top: pts[anchor].y - D / 2 - 58 }}
          >
            <div className="flex animate-float flex-col items-center">
              {nodes[anchor].status === "current" && (
                <div className="mb-1 rounded-md bg-ember px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black">
                  You
                </div>
              )}
              <Beast seed={mobSeed} size={42} glow />
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
  const tier = TIER_META[node.difficulty];

  const ring =
    node.status === "current" ? tier.color : node.status === "completed" ? "#2C313C" : "#22262F";

  return (
    <div className="absolute" style={{ left, top, width: D, height: D }}>
      {node.status === "current" && (
        <div
          className="absolute inset-0 animate-emberPulse rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,106,43,0.35), transparent 70%)" }}
        />
      )}

      {/* Frame */}
      <div
        onClick={onTap}
        className="absolute inset-0 grid place-items-center rounded-full bg-panel"
        style={{
          border: `2px solid ${ring}`,
          cursor: onTap ? "pointer" : "default",
          boxShadow: node.status === "current" ? `0 0 18px ${tier.color}66` : "0 6px 16px rgba(0,0,0,0.5)",
        }}
      >
        <Beast
          seed={node.seed}
          size={D - 18}
          tint={node.status === "locked" ? "#3A4150" : tier.color}
          dim={node.status !== "current"}
        />
      </div>

      {/* Status badge */}
      {node.status === "completed" && (
        <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-bg text-lesser ring-1 ring-line">
          <Icon name="check" size={14} strokeWidth={2.6} />
        </span>
      )}
      {node.status === "locked" && (
        <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-bg text-inkFaint ring-1 ring-line">
          <Icon name="lock" size={12} strokeWidth={2} />
        </span>
      )}

      {/* Always-visible difficulty rune */}
      <span className="absolute -left-1.5 -top-1.5">
        <Rune difficulty={node.difficulty} size={22} glow={node.status === "current"} />
      </span>
    </div>
  );
}
