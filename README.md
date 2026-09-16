# Sri Lankan Guru

Production-ready travel planning platform for **Sri Lankan Guru** — a Colombo-based
Destination Management Company. A cinematic, editorial web experience combined with an
AI-assisted itinerary planner.

> Don't just visit Sri Lanka. Travel it your way.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS 4** with an editorial design system (Deep Jungle / Ocean / Sand / Cloud / Terracotta / Tea Green)
- **React Three Fiber** atmospheric scene on the hero (dynamic import, desktop only)
- **Supabase** — Auth (email/password + Google), PostgreSQL with Row Level Security, Storage
- **Claude API** itinerary generation — server-side only, validated with Zod, grounded in the curated destination database
- **Server-side PDF** itineraries (pdfkit) — premium travel-document styling
- **Transactional email** adapter (Resend-compatible)
- **Leaflet + OpenStreetMap** route maps (no API key required)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in what you have — the app degrades honestly without keys
npm run dev
```

Every integration is adapter-based. Without environment variables the app still runs:
the planner falls back to the deterministic curated-planner, drafts live in
`sessionStorage`, and protected features show a clear setup notice instead of fake data.

## Environment variables

See [.env.example](./.env.example). Public keys (`NEXT_PUBLIC_*`) are the only values
exposed to the browser; every other credential stays server-side in route handlers.

## Database

Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL editor. It creates:

`profiles`, `destinations`, `experiences`, `destination_categories`,
`travel_routes`, `itineraries`, `itinerary_days`, `itinerary_activities`,
`user_preferences` — with foreign keys, indexes, `updated_at` triggers, and
**row-level security** so users can only ever read and write their own itineraries.

## Architecture

```
app/                  routes (home, explore, destinations, plan, itinerary, journeys, auth, api/*)
components/           reusable UI (home scenes, destination cards, planner wizard, itinerary editor, map)
lib/
  destinations.ts     curated destination database — the factual source for AI + planner
  itinerary/          zod schemas, rules-based composer, Claude adapter
  supabase/           browser / server / admin clients
  pdf/                pdfkit document generator
  email/              transactional email adapter
hooks/                media & reduced-motion hooks
types/                shared TypeScript interfaces
supabase/             SQL schema (RLS) + seed
```

Business logic lives in `lib/`; components stay presentational. Adding a destination
means adding one entry to `lib/destinations.ts` — Explore, detail pages, filters, the
planner and the AI grounding all pick it up automatically.

## Security

- All privileged credentials (Claude, email, service role, PDF key) are server-only
- AI requests go through `POST /api/itinerary/generate` — never browser → provider
- Structured JSON from Claude is Zod-validated before storage or display
- RLS on every user-owned table; the service key is never imported client-side

## Deployment (Vercel)

Push to Git, import into Vercel, add the environment variables, deploy. Route handlers
that need Node (PDF generation) already declare `runtime = 'nodejs'`.
