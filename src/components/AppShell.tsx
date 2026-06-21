"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { ChestReward } from "@/lib/types";
import { APP_NAME } from "@/lib/brand";
import { Button } from "./ui";
import { Icon, IconName } from "./Icon";
import { Beast } from "./Beast";
import { Trail } from "./Home";
import { Bestiary } from "./Shop";
import { Rivals } from "./Leaderboard";
import { Allies } from "./Friends";
import { Den } from "./Profile";
import { Encounter } from "./QuestOverlay";
import { Spoils } from "./ChestOverlay";

const TABS: { key: string; label: string; icon: IconName }[] = [
  { key: "trail", label: "Trail", icon: "trail" },
  { key: "bestiary", label: "Bestiary", icon: "bestiary" },
  { key: "rivals", label: "Rivals", icon: "rivals" },
  { key: "allies", label: "Allies", icon: "allies" },
  { key: "den", label: "Den", icon: "den" },
];

export function AppShell() {
  const s = useStore();
  const [tab, setTab] = useState(0);
  const [overlay, setOverlay] = useState<"encounter" | "spoils" | null>(null);
  const [reward, setReward] = useState<ChestReward | null>(null);

  if (s.status === "loading") return <Splash />;
  if (s.status === "error")
    return <ErrorScreen message={s.errorMessage ?? "Something went wrong"} onRetry={s.bootstrap} />;

  const screens = [
    <Trail key="t" onFace={() => setOverlay("encounter")} />,
    <Bestiary key="b" />,
    <Rivals key="r" />,
    <Allies key="a" />,
    <Den key="d" />,
  ];

  return (
    <div className="relative mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden bg-bg">
      <main className="relative min-h-0 flex-1">{screens[tab]}</main>

      <nav className="edge relative z-10 flex shrink-0 items-stretch justify-around border-x-0 border-b-0 bg-panel">
        {TABS.map((t, i) => {
          const active = tab === i;
          const showBadge = t.key === "allies" && s.requests.length > 0;
          return (
            <button
              key={t.key}
              onClick={() => setTab(i)}
              className="relative flex flex-1 flex-col items-center gap-1 py-2.5"
            >
              <span
                className={`transition ${active ? "text-ember" : "text-inkFaint"}`}
                style={active ? { filter: "drop-shadow(0 0 6px rgba(255,106,43,0.6))" } : undefined}
              >
                <Icon name={t.icon} size={21} strokeWidth={active ? 2.2 : 1.8} />
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? "text-ember" : "text-inkFaint"}`}>
                {t.label}
              </span>
              {showBadge && (
                <span className="absolute right-[24%] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 text-[10px] font-bold text-black">
                  {s.requests.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {overlay === "encounter" && (
        <Encounter
          onClose={() => setOverlay(null)}
          onSpoils={(r) => {
            setReward(r);
            setOverlay("spoils");
          }}
        />
      )}
      {overlay === "spoils" && reward && (
        <Spoils
          reward={reward}
          onCollect={() => {
            setReward(null);
            setOverlay(null);
          }}
        />
      )}
    </div>
  );
}

function Splash() {
  return (
    <div className="grain relative flex h-[100dvh] flex-col items-center justify-center bg-bg">
      <Beast seed="cinder-splash" size={120} glow />
      <h1 className="mt-6 font-display text-3xl font-black tracking-[0.3em] text-ink">{APP_NAME}</h1>
      <div className="mt-6 h-8 w-8 animate-spin rounded-full border-2 border-ember border-t-transparent" />
    </div>
  );
}

function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="grain relative flex h-[100dvh] flex-col items-center justify-center bg-bg px-8 text-center">
      <span className="text-dire">
        <Icon name="skull" size={56} strokeWidth={1.5} />
      </span>
      <h2 className="mt-4 font-display text-xl font-bold text-ink">The trail went cold</h2>
      <p className="mt-2 text-sm text-inkSoft">{message}</p>
      <div className="edge mt-3 rounded-xl bg-panel p-3.5 text-xs font-medium text-inkFaint">
        Tip: in the Supabase dashboard, enable Authentication → Providers → Anonymous sign-ins.
      </div>
      <div className="mt-6 w-48">
        <Button label="Try again" onClick={onRetry} icon="play" />
      </div>
    </div>
  );
}
