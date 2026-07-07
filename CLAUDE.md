# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

BusWatch is a public-transit tracker for the Klang Valley (Kuala Lumpur). It has two independently-deployed halves that talk over HTTP:

- **`backend/`** — a Cloudflare Worker (TypeScript + Hono) that ingests GTFS + Prasarana feeds, caches them, and serves a JSON API.
- **`watch-app/`** — a standalone watchOS 10 SwiftUI app (`BusWatch`) that consumes that API.

There is no monorepo tooling tying them together; each is built and deployed on its own.

## Commands

### Backend (`backend/`)
```bash
npm run dev              # wrangler dev — local Worker on http://localhost:8787
npm run deploy           # wrangler deploy to production
npx tsc --noEmit         # typecheck — run this before considering work done
npm test                 # vitest run (whole suite)
npm run test:watch       # vitest watch
npx vitest run test/nearby.test.ts           # single test file
npx vitest run -t "dedupes bus positions"    # single test by name
npx tsx scripts/inspect-feeds.ts             # probe GTFS-realtime feeds (see ../docs/feed-inspection.md)
```
D1 migrations (the D1 binding is `DB` — i.e. `env.DB`; `bus-watch-d1` is the database name passed to wrangler):
```bash
npx wrangler d1 migrations apply bus-watch-d1 --local   # against wrangler dev's local D1
npx wrangler d1 migrations apply bus-watch-d1 --remote  # against production D1
```
Required Worker secrets: `ADMIN_TOKEN` (set via `npx wrangler secret put ADMIN_TOKEN`). Admin endpoints (`/refresh`, `/rail/ingest`) **fail closed** if it is missing.

### watch-app (`watch-app/`)
The Xcode project is **generated** from `project.yml` via [XcodeGen](https://github.com/yonaskolb/XcodeGen) — `BusWatch.xcodeproj` is checked in but `project.yml` is the source of truth for targets, bundle IDs, and settings. Regenerate after structural changes:
```bash
xcodegen generate
open BusWatch.xcodeproj      # build/run on a watchOS 10 simulator; ⌘U to test
```

## Verification (there is no CI)

`master` has no CI and no branch protection — verification is entirely manual. Before considering backend work done, run **both**:
```bash
cd backend && npx tsc --noEmit && npm test
```
Code-generation bots (Bolt/Palette/Sentinel/Jules) open many duplicate or low-quality PRs against `master`; the `.jules/*.md` files are their accumulated learnings, not project rules. See the PR-triage memory before bulk-closing PRs.

## Backend architecture

**Entry point:** `src/index.ts` defines the Hono app, every route, the scheduled (`cron`) handler, and the KV/D1 data-access helpers. It is the hub — most other `src/*.ts` files are pure functions that `index.ts` feeds with data it loaded.

**Data sources and where each is cached:**

| Source | Module | Cache (key) | TTL |
|---|---|---|---|
| GTFS **static** (stops/routes/trips/tripStops/calendar/frequencies/shapes) | `gtfs-static.ts` (+ `csv-parser.ts`) | **KV** `stops:<agency>`, `routes:<agency>`, … | refreshed by cron, otherwise indefinite |
| GTFS-rt **vehicle positions** | `gtfs-realtime.ts` | KV `realtime:vehicles` | 25s |
| **Prasarana Socket.IO** buses (fills routes GTFS omits, e.g. T816) | `prasarana-socketio.ts` | KV `prasarana:buses` | 60s |
| **D1** historical bus positions & travel times | `sampling.ts` | D1 `bus_positions`, `travel_times` | 7-day retention |
| Rail static timetables (rapid-rail-kl) | `rail-ingest.ts` | D1 `rail_stops/routes/trips/stop_times` | weekly re-ingest |

**Agencies** (`AGENCIES` in `index.ts`): `rapid-bus-kl`, `rapid-bus-mrtfeeder` carry realtime; `selangor-mobility` is optional/may be unavailable; `rapid-rail-kl` is static-only (rail). All KV keys are namespaced by agency, and the `getAll*` helpers fan out across agencies and merge.

**Scheduled jobs** (`wrangler.toml` `[triggers]`):
- `*/5 * * * *` — sample bus positions into D1, aggregate travel times, clean up old rows (`sampling.ts`).
- `0 */6 * * *` — refresh GTFS static + Prasarana data into KV.
- `0 2 * * 1` — re-ingest rail timetables into D1.

**The ETA pipeline** crosses all three stores: GTFS realtime gives current vehicle positions → `sampling.ts` records their movement into D1 `bus_positions` → `aggregateTravelTimes`/`getHistoricalETA` (in `nearby.ts`) derives historical travel times used to enrich `/nearby` arrivals. D1 `bus_positions` is also the fallback for reconstructing a route's shape when GTFS static has none (see `/route/:routeId`).

**Pure vs I/O split:** domain logic (`nearby.ts`, `bus-tracker.ts`, `station.ts`, `departures-toward.ts`, `frequency.ts`, `rail-schedule.ts`, `haversine.ts`, `csv-parser.ts`) is written as pure functions taking already-loaded data. This is what makes the `test/` suite fast and offline — tests build in-memory inputs and assert outputs. Keep new logic pure; do the fetch/cache work in `index.ts`.

**Security conventions** (from `.jules/sentinel.md`): admin endpoints require a Bearer `ADMIN_TOKEN` compared with `timingSafeEqual` from `hono/utils/buffer` — never use `===`/`!==` for secrets. Error responses from these endpoints must not echo internal details.

## watch-app architecture

**`Services/ContextEngine.swift`** is the app's brain. It is an `ObservableObject` holding a single `@Published state: AppState` (enum: `loading | station | onBus | nearby | error | noLocation`). It subscribes to `LocationManager` via Combine and **auto-selects between two states**: near a rail station (<200m) → `station`; otherwise → `nearby`. When you're on a moving bus (speed > 5 m/s) with realtime bus arrivals nearby, the rail-station auto-switch is suppressed so the app stays on `nearby` — it does **not** auto-enter bus-trip mode. The `.onBus` (bus-trip progress) state is user-triggered: `selectBusTrip(tripId:)` fires when the user taps a bus, then `startAutoRefresh` re-polls `/bus/trip/:id/progress` every 30s. New location-driven behaviors go here, not in views.

**`Services/APIClient.swift`** is a singleton with a **hardcoded `baseURL`** — change it when pointing at a different Worker deployment. `Services/FavoriteStore.swift` persists favorite stop IDs + one optional "home" stop in `UserDefaults` (JSON-encoded); home is always a member of the favorites set. `Models/*.swift` are the `Codable` response shapes that mirror the backend's API types.

**`Views/`** are stateless SwiftUI consumers of `ContextEngine`/`FavoriteStore` injected as `@EnvironmentObject` from `App/BusWatchApp.swift`.

## Cross-cutting notes

- GTFS IDs are strings everywhere (including rail) — never assume integer IDs.
- Prasarana bus positions carry no destination/headsign, so they render with `destination: ""`. Prasarana routes are matched with a trailing-`0` quirk (e.g. `route + '0'`) — check `mergeBusRoutes` and `/route/:routeId` before "fixing" route matching.
- GTFS `arrival_time`/`departure_time` may exceed 24:00:00 for overnight services.
- The Worker runs on Workers runtime (no Node APIs); `csv-parser.ts` uses manual `indexOf` parsing by design for throughput on large feeds (`.jules/bolt.md`).
