# Pocket Manager Online

Browser football management game built with Next.js 15 + Supabase and deployable on Vercel.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Zustand
- Supabase (Auth, Postgres, Realtime, RLS)
- next-pwa

## Features

- Main menu flow:
  - Create Solo Game
  - Create Multiplayer
  - Join Multiplayer
  - Language Select
- EN/ES instant UI switching (persisted to Supabase user profile)
- Username/password auth flow (username mapped to internal email for Supabase auth)
- Solo career setup with difficulty + solo-only cheat toggles
- Multiplayer lobby host/join with invite codes, team pool restrictions, realtime lobby + chat + ready status
- Lightweight text match simulation with goals, xG, possession, cards, injuries, and timeline
- Retirement-to-manager logic (ageing + retirement roll + 5% manager conversion)
- International job offer generation based on reputation/performance heuristics
- PWA manifest and service worker integration

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Apply SQL in Supabase SQL editor:

- `supabase/schema.sql`
- `supabase/seed.sql`

4. Run:

```bash
npm run dev
```

5. Production check:

```bash
npm run build
```

## Vercel deployment (one-click import)

1. Push repository to GitHub.
2. In Vercel: **Add New → Project → Import Git Repository**.
3. Select this repo.
4. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy.

No custom backend servers are required.

## Supabase policy notes

- Solo saves can use cheats.
- Multiplayer saves/settings reject enabled cheats unless the authenticated user is `ConnorB`.
- RLS policies enforce lobby participation for chat writes.

## Username format

- Allowed username characters for login/signup mapping: `a-z`, `0-9`, `.`, `_`, `-`.
- The client sanitizes usernames to this set before generating internal auth emails (`<username>@pocket-manager.local`).

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — Next lint
