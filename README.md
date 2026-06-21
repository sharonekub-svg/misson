# Quest 🎯

**One mission a day.** A friendly daily-mission game.

Every day you get one fun mission. Film yourself doing it, a friendly AI gives
you the ✓ (it's generous — close counts 😊), you keep your streak alive, earn
coins + XP, level up, and unlock cute buddies.

**Look & feel:** light, friendly, **navy blue**. Round big-eyed buddies drawn
from scratch in SVG (generated deterministically from a seed — no emoji
anywhere), soft cards, a bouncy Duolingo-style streak celebration. The whole
brand lives in one constant: [`src/lib/brand.ts`](src/lib/brand.ts).

**Stack:** Next.js (web, this repo root) + Supabase (accounts, data, video
storage, AI). A Flutter build of the same idea lives in [`flutter_app/`](flutter_app/).

## Screens

| Screen | What it does |
|---|---|
| **Today** | An endless winding path of missions. Today's mission is the glowing one; tap **Start mission**. |
| **Mission** | The buddy, the mission, its difficulty, and a clear explainer of how the AI check works. Film or upload → friendly AI gives the ✓. |
| **Reward** | A bouncy streak celebration (flame + count + confetti) plus coins + XP. |
| **Shop** | Unlock cute buddies and stickers with coins. |
| **You** | Your buddy, your level bar (XP → Level), streak, coins, freezes — with plain-language explainers for every mechanic. |
| **League** | Friends ranked by streak. |
| **Friends** | Add friends, accept requests, see activity. |

## How the AI checks your mission

You film yourself doing the mission. The app grabs a few moments from your clip
and sends them to a friendly AI (Claude vision) that confirms you gave it a go —
and it's **deliberately generous**, so honest attempts pass. Missions are also
**AI-generated** to only ever be things the AI can verify with confidence from a
short video (clear, indoor, no equipment). See
[`supabase/functions/generate-quest`](supabase/functions/generate-quest/index.ts)
and [`supabase/functions/verify-quest`](supabase/functions/verify-quest/index.ts).

## The rules it models

- **Difficulty rhythm:** Sun/Mon/Tue = Easy · Wed/Thu = Medium · Fri/Sat = Hard.
- **Streak** with **3 freezes** a month.
- **Rewards** roll a rarity that multiplies coins; harder missions roll better.
- **XP & Level:** every mission grants XP (harder = more), which levels you up.

Every mechanic has an always-visible, plain-language explainer in the UI
(see the **You** tab and the mission screen).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

The Supabase connection details are public (publishable key; access gated by Row
Level Security), so it talks to the live backend out of the box.

### Backend setup (for the AI features)

The full schema is in [`supabase/schema.sql`](supabase/schema.sql). Two add-ons
were layered in via migrations — apply them to an existing database and the app
upgrades gracefully (it falls back to safe defaults until you do):

- [`supabase/migrations/0001_xp_levels.sql`](supabase/migrations/0001_xp_levels.sql) — XP + Levels.
- [`supabase/migrations/0002_ai_quests.sql`](supabase/migrations/0002_ai_quests.sql) — AI-generated missions.

Deploy the two Edge Functions and set the `ANTHROPIC_API_KEY` secret to turn on
real AI mission generation + checking (without the key they run in a friendly
demo mode).
