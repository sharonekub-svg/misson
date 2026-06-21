"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { ChestReward } from "@/lib/types";
import { SquishyButton } from "./ui";
import { Home } from "./Home";
import { Shop } from "./Shop";
import { Leaderboard } from "./Leaderboard";
import { Friends } from "./Friends";
import { Profile } from "./Profile";
import { QuestOverlay } from "./QuestOverlay";
import { ChestOverlay } from "./ChestOverlay";

const TABS = [
  { key: "quest", label: "Quest", icon: "🎯" },
  { key: "shop", label: "Shop", icon: "🛍️" },
  { key: "league", label: "League", icon: "🏆" },
  { key: "friends", label: "Friends", icon: "👥" },
  { key: "you", label: "You", icon: "🐱" },
];

export function AppShell() {
  const s = useStore();
  const [tab, setTab] = useState(0);
  const [overlay, setOverlay] = useState<"quest" | "chest" | null>(null);
  const [reward, setReward] = useState<ChestReward | null>(null);

  if (s.status === "loading") return <Splash />;
  if (s.status === "error") return <ErrorScreen message={s.errorMessage ?? "Something went wrong"} onRetry={s.bootstrap} />;

  const screens = [
    <Home key="h" onStartQuest={() => setOverlay("quest")} />,
    <Shop key="s" />,
    <Leaderboard key="l" />,
    <Friends key="f" />,
    <Profile key="p" />,
  ];

  return (
    <div className="relative mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden bg-bg">
      <main className="relative min-h-0 flex-1">{screens[tab]}</main>

      <nav className="flex shrink-0 items-stretch justify-around bg-surface shadow-softUp">
        {TABS.map((t, i) => {
          const active = tab === i;
          const showBadge = t.key === "friends" && s.requests.length > 0;
          return (
            <button
              key={t.key}
              onClick={() => setTab(i)}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-2.5"
            >
              <span className={`text-xl transition ${active ? "" : "opacity-40 grayscale"}`}>{t.icon}</span>
              <span className={`text-[11px] font-extrabold ${active ? "text-primary" : "text-inkFaint"}`}>
                {t.label}
              </span>
              {showBadge && (
                <span className="absolute right-[22%] top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-hard px-1 text-[10px] font-bold text-white">
                  {s.requests.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {overlay === "quest" && (
        <QuestOverlay
          onClose={() => setOverlay(null)}
          onChest={(r) => {
            setReward(r);
            setOverlay("chest");
          }}
        />
      )}
      {overlay === "chest" && reward && (
        <ChestOverlay
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
    <div className="flex h-[100dvh] flex-col items-center justify-center bg-bg">
      <div className="text-6xl">🎯</div>
      <div className="mt-5 h-9 w-9 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center bg-bg px-8 text-center">
      <div className="text-5xl">😿</div>
      <h2 className="mt-4 text-xl font-extrabold text-ink">Couldn’t connect</h2>
      <p className="mt-2 text-sm font-semibold text-inkSoft">{message}</p>
      <div className="mt-3 rounded-xl bg-surfaceAlt p-3.5 text-xs font-bold text-inkFaint">
        Tip: in the Supabase dashboard, enable Authentication → Providers → Anonymous sign-ins.
      </div>
      <div className="mt-6 w-48">
        <SquishyButton label="TRY AGAIN" onClick={onRetry} icon={<span>↻</span>} />
      </div>
    </div>
  );
}
