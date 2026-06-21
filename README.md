# Up Mission 🎯

A daily-quest dueling app. Every day you get one quest, film yourself doing it,
keep your streak alive, open a chest for coins, and grow your mob.

> This repo currently contains the **full app design + interactive prototype**
> (Flutter). All screens work with in-memory demo data so you can *see and feel*
> the app immediately. The cloud backend (accounts, real friends, streaks, video
> storage, AI quest checking) gets wired up next with Supabase.

## What's in here

| Screen | What it does |
|---|---|
| **Quest** (home) | The winding Duolingo-style tile path, your mob bobbing on today's tile, the **DUELING GO** button. |
| **Quest detail** | Today's quest, difficulty, how it's verified (AI or a friend), film/upload your video, complete. |
| **Chest** | Tap to open → reveals **Rare / Mega / Ultra** and the coins you won. |
| **Shop** | Buy & equip mobs (cat, dog, fox, bear, panda, elephant…) and designs (headphones, sunglasses, crown…). Some mobs have perks. |
| **League** | Friends leaderboard ranked by streak. |
| **Friends** | Add friends, accept requests, see friend activity notifications. |
| **You** | Your mob, streak, coins, and your 3 monthly freezes. |

### The rules it models
- **Weekly difficulty rhythm:** Sun/Mon/Tue = easy · Wed/Thu = medium · Fri/Sat = hard.
- **Streaks** with **3 freezes per month**.
- **Chests** roll a rarity that multiplies your coins (hard quests roll better odds).
- **Verification:** simple quests are tagged for **AI** to check; harder action
  quests are tagged for a **friend** to confirm.

---

## Run it on your phone / simulator

You need Flutter installed once on your computer:
👉 https://docs.flutter.dev/get-started/install

Then, from this folder:

```bash
# 1. One-time: generate the native folders + fetch packages
bash setup.sh

# 2. Run it (plug in your phone, or start a simulator first)
flutter run
```

While it's running, edit any file and **save** — the app updates live on your
phone in about a second (hot reload). That's your day-to-day loop.

### Show it to friends (before the store)
- **Android:** `flutter build apk` → send them the file, or use Google Play
  "internal testing".
- **iPhone:** use TestFlight.

### Project layout
```
lib/
  main.dart            app entry
  theme/               colours, fonts, theme (the design system)
  models/              quests, mobs, chests, friends
  state/               AppState — in-memory game logic (swap for Supabase later)
  widgets/             reusable pieces (3D button, mob avatar, badges)
  screens/             home (tile path), quest, chest, shop, leaderboard, friends, profile
```

## Next steps
1. **Backend (Supabase):** accounts, friends, streaks, leaderboard, video upload.
2. **Camera:** real film/upload from the quest screen.
3. **AI verification:** auto-check the simple quests from the recorded video.
4. **Push notifications:** friend activity + daily quest reminder.
