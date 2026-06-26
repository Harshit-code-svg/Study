# STUDYMAP — Game-layer Study Tracker

Dark, mobile-first, PWA study app. Boss chapters, XP, streaks, spaced revisions, daily challenges, badges. 100% localStorage, zero backend.

![stack](https://img.shields.io/badge/Next.js-14-black) ![ts](https://img.shields.io/badge/TypeScript-5-blue) ![pwa](https://img.shields.io/badge/PWA-ready-purple)

## ✨ Features

**Core (Step 1)**
- 4 subjects, boss chapters marked 💀
- Chapter resource tracking: Video / Notes / PYQ / Revise
- Confidence 0-3
- localStorage persist (`studymap-v4`)

**Motivation (Step 2)**
- Streak counter + shields
- XP / level system
- Heatmap + Wall of Proof

**Intelligence (Step 3)**
- Goals CRUD with countdown warnings
- Weekly reports
- Subject balance radar

**Game (Step 4)**
- Boss Slayer modal: 3× XP, badge unlock, revision auto-schedule
- Daily Grind challenges: +100 XP +1 🛡️
- Spaced revisions: 3 / 7 / 21 / 45 day
- 8 badges
- Morning checklist
- XP Economy page

**Polish (Step 5)**
- PWA: manifest, SW, install prompt, offline cache
- Mobile bottom nav, floating +Log FAB
- Loading skeletons, empty states everywhere
- Error boundary, 404
- Session log modal
- Hydration-safe store
- Production static export

## 🛠 Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (persist)
- Framer Motion
- Recharts
- Sonner
- lucide-react
- date-fns

## 🚀 Run locally

```bash
npm install
npm run dev
# http://localhost:3000
```

## 🏗 Build

```bash
npm run build
```

next.config.mjs:
```js
output: 'export',
images: { unoptimized: true },
trailingSlash: true
```

## ☁️ Deploy to Vercel

1. Push to GitHub
2. Vercel → New Project → Import
3. Framework: Next.js
4. Build: `npm run build`
5. Deploy

CLI:
```bash
npm i -g vercel
vercel --prod
```

Static hosts: publish directory `out`

## ✅ Testing checklist

- [x] Log a session → streak, XP, heatmap, wall update
- [x] Complete a chapter → milestone, boss logic, revision schedule
- [x] Goal countdown warnings
- [x] Daily challenge generation
- [x] Badge unlocks
- [x] Morning checklist
- [x] PWA install prompt
- [x] `npm run build` clean

## 📄 License

MIT
