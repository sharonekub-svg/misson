# BOUNTY ⚔️

**Hunt the day.** A field bestiary disguised as a habit game.

You are a **Warden**. Every day a beast surfaces — your **Mission of the Day**.
You face it by completing a real-world challenge on camera, fell it, and claim
the spoils. Keep your **Flame** lit, climb the ranks, and grow your Bestiary.

**Art direction:** *inked grimoire* — obsidian + a single ember accent,
engraved grain, faceted difficulty runes, and hand-coded **sigil-beasts**
(original heraldic emblems generated deterministically from a seed — no emoji
anywhere). The whole brand lives in one constant: [`src/lib/brand.ts`](src/lib/brand.ts).

**Stack:** Next.js (web, this repo root) + Supabase (accounts, data, video
storage, AI verification via a Claude-vision Edge Function). A Flutter build of
the same idea lives in [`flutter_app/`](flutter_app/).

## Screens

| Screen | What it does |
|---|---|
| **Trail** | A fog-shrouded vertical route of encounters. Each node is a beast with an always-visible difficulty rune. The awake beast is today's mission. |
| **Encounter** | Full beast art, the real-world challenge, its tier, how it's verified, and the spoils preview. Film or upload → the Warden's Eye (AI) confirms the kill. |
| **Spoils** | Reveals the rarity roll + coins + XP from the felled beast. |
| **Bestiary** | Recruit new beasts with spoils; equip your hunter. Cosmetic Marks too. |
| **Den** | Your beast, your rank bar (XP → Level), Flame, and Wards. |
| **Rivals** | Allies ranked by longest Flame. |
| **Allies** | Recruit allies by handle, accept requests, see the war-band's tracks. |

## The rules it models

- **Weekly danger rhythm:** Sun/Mon/Tue = *Lesser* · Wed/Thu = *Greater* · Fri/Sat = *Dire*.
- **Flame** (streak) with **3 Wards** (freezes) per month.
- **Spoils** roll a rarity that multiplies coins; Dire beasts roll better odds.
- **XP & Rank:** every felled beast grants XP (harder = more). XP raises your Rank.
- **Verification:** simple beasts → **AI** (Claude vision on a video frame);
  Dire action beasts → an **ally** confirms.

Every mechanic carries a permanent, 10-second-readable explainer in the UI
(see the Codex section in the Den and the Bestiary header).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

The Supabase connection details are public (publishable key; all access is gated
by Row Level Security), so it talks to the live backend out of the box.

### Backend

The full schema lives in [`supabase/schema.sql`](supabase/schema.sql). XP + Levels
were added later — apply [`supabase/migrations/0001_xp_levels.sql`](supabase/migrations/0001_xp_levels.sql)
to an existing database (the app derives XP client-side until you do, so nothing
breaks in the meantime).
