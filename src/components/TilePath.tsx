"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QuestNode, TIER_META, difficultyForWeekday } from "@/lib/types";
import { Beast } from "./Beast";
import { Rune } from "./Rune";
import { Icon } from "./Icon";

const SPACING = 124;
const AMP = 62;
const TOP = 50;
const BOTTOM = 40;
const D = 76;
const PAGE = 8; // how many future stops to reveal per scroll

export function TilePath({
  nodes,
  mobSeed,
  onTapCurrent,
}: {
  nodes: QuestNode[]; // real stops: completed + today's current
  mobSeed: string;
  onTapCurrent: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(380);
  const [futureCount, setFutureCount] = useState(PAGE);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Unlimited path: real stops, then endlessly-generated upcoming stops.
  const allNodes = useMemo<QuestNode[]>(() => {
    const out = [...nodes];
    let day = (nodes[nodes.length - 1]?.day ?? 0) + 1;
    const base = new Date();
    for (let i = 1; i <= futureCount; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      out.push({
        day: day++,
        title: "Coming soon",
        seed: `future-${i}`,
        difficulty: difficultyForWeekday(d.getDay()),
        verify: "ai",
        status: "locked",
      });
    }
    return out;
  }, [nodes, futureCount]);

  function onScroll() {
    const el = containerRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight > el.scrollHeight - 240) {
      setFutureCount((c) => c + PAGE);
    }
  }

  const n = allNodes.length;
  const pts = allNodes.map((_, i) => ({ x: width / 2 + AMP * Math.sin(i * 0.9), y: TOP + i * SPACING }));
  const height = TOP + Math.max(0, n - 1) * SPACING + BOTTOM;

  let anchor = allNodes.findIndex((q) => q.status === "current");
  if (anchor === -1) {
    for (let i = nodes.length - 1; i >= 0; i--) {
      if (allNodes[i].status === "completed") {
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
    <div ref={containerRef} onScroll={onScroll} className="no-scrollbar relative h-full w-full overflow-y-auto">
      <div className="relative" style={{ height }}>
        <svg width={width} height={height} className="pointer-events-none absolute inset-0">
          <path d={d} fill="none" stroke="#DCE6FB" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={3} strokeDasharray="1 12" strokeLinecap="round" />
        </svg>

        {allNodes.map((node, i) => (
          <Node key={i} node={node} x={pts[i].x} y={pts[i].y} onTap={node.status === "current" ? onTapCurrent : undefined} />
        ))}

        {anchor >= 0 && (
          <div className="pointer-events-none absolute -translate-x-1/2" style={{ left: pts[anchor].x, top: pts[anchor].y - D / 2 - 56 }}>
            <div className="flex animate-float flex-col items-center">
              {allNodes[anchor].status === "current" && (
                <div className="mb-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-soft">
                  You
                </div>
              )}
              <Beast seed={mobSeed} size={44} glow />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Node({ node, x, y, onTap }: { node: QuestNode; x: number; y: number; onTap?: () => void }) {
  const left = x - D / 2;
  const top = y - D / 2;
  const tier = TIER_META[node.difficulty];
  const ring = node.status === "current" ? "#3B6EF6" : node.status === "completed" ? tier.color : "#E3E9F6";

  return (
    <div className="absolute" style={{ left, top, width: D, height: D }}>
      {node.status === "current" && (
        <div className="absolute inset-0 animate-ring rounded-full" style={{ background: "rgba(59,110,246,0.25)" }} />
      )}
      <div
        onClick={onTap}
        className="absolute inset-0 grid place-items-center rounded-full bg-surface shadow-soft"
        style={{ border: `3px solid ${ring}`, cursor: onTap ? "pointer" : "default" }}
      >
        <Beast
          seed={node.status === "locked" ? "locked-buddy" : node.seed}
          size={D - 20}
          tint={node.status === "locked" ? "#AEB8D6" : tier.color}
          dim={node.status === "locked"}
        />
      </div>

      {node.status === "completed" && (
        <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-easy text-white shadow-soft">
          <Icon name="check" size={14} strokeWidth={2.8} />
        </span>
      )}
      {node.status === "locked" && (
        <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-surface text-inkFaint shadow-soft ring-1 ring-line">
          <Icon name="lock" size={12} strokeWidth={2} />
        </span>
      )}

      <span className="absolute -left-1 -top-1">
        <Rune difficulty={node.difficulty} size={22} glow={node.status === "current"} />
      </span>
    </div>
  );
}
