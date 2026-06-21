"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { ChestReward } from "@/lib/types";
import { APP_NAME } from "@/lib/brand";
import { Button } from "./ui";
import { Icon, IconName } from "./Icon";
import { Beast } from "./Beast";
import { Today } from "./Home";
import { Shop } from "./Shop";
import { League } from "./Leaderboard";
import { Friends } from "./Friends";
import { You } from "./Profile";
import { MissionOverlay } from "./QuestOverlay";
import { RewardOverlay } from "./ChestOverlay";

const TABS: { key: string; label: string; icon: IconName }[] = [
  { key: "today", label: "Today", icon: "home" },
  { key: "shop", label: "Shop", icon: "bag" },
  { key: "league", label: "League", icon: "trophy" },
  { key: "friends", label: "Friends", icon: "people" },
  { key: "you", label: "You", icon: "profile" },
];

export function AppShell() {
  const s = useStore();
  const [tab, setTab] = useState(0);
  const [overlay, setOverlay] = useState<"mission" | "reward" | null>(null);
  const [reward, setReward] = useState<ChestReward | null>(null);

  if (s.status === "loading") return <Splash />;
  if (s.status === "error") return <ErrorScreen message={s.errorMessage ?? "Something went wrong"} onRetry={s.bootstrap} />;

  const screens = [
    <Today key="t" onStart={() => setOverlay("mission")} />,
    <Shop key="s" />,
    <League key="l" />,
    <Friends key="f" />,
    <You key="y" />,
  ];

  return (
    <div className="relative mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden bg-bg">
      <main className="relative min-h-0 flex-1">{screens[tab]}</main>

      <nav className="edge relative z-10 flex shrink-0 items-stretch justify-around border-x-0 border-b-0 bg-surface shadow-softUp">
        {TABS.map((t, i) => {
          const active = tab === i;
          const showBadge = t.key === "friends" && s.requests.length > 0;
          return (
            <button key={t.key} onClick={() => setTab(i)} className="relative flex flex-1 flex-col items-center gap-0.5 py-2.5">
              <span className={`transition ${active ? "text-primary" : "text-inkFaint"}`}>
                <Icon name={t.icon} size={22} strokeWidth={active ? 2.3 : 1.9} />
              </span>
              <span className={`text-[10px] font-bold ${active ? "text-primary" : "text-inkFaint"}`}>{t.label}</span>
              {showBadge && (
                <span className="absolute right-[24%] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-streak px-1 text-[10px] font-bold text-white">
                  {s.requests.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {overlay === "mission" && (
        <MissionOverlay
          onClose={() => setOverlay(null)}
          onReward={(r) => {
            setReward(r);
            setOverlay("reward");
          }}
        />
      )}
      {overlay === "reward" && reward && (
        <RewardOverlay
          reward={reward}
          streak={s.streak}
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
    <div className="sky flex h-[100dvh] flex-col items-center justify-center">
      <Beast seed="quest-hello" size={120} glow />
      <h1 className="mt-5 font-display text-3xl font-extrabold text-ink">{APP_NAME}</h1>
      <div className="mt-6 h-8 w-8 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
    </div>
  );
}

function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="sky flex h-[100dvh] flex-col items-center justify-center px-8 text-center">
      <Beast seed="oops-buddy" size={96} dim />
      <h2 className="mt-4 font-display text-xl font-extrabold text-ink">Couldn’t connect</h2>
      <p className="mt-2 text-sm text-inkSoft">{message}</p>
      <div className="edge mt-3 rounded-2xl bg-surface p-3.5 text-xs font-medium text-inkFaint shadow-soft">
        Tip: in Supabase, enable Authentication → Providers → Anonymous sign-ins.
      </div>
      <div className="mt-6 w-48">
        <Button label="Try again" onClick={onRetry} icon="play" />
      </div>
    </div>
  );
}
