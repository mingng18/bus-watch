# BusWatch — Apple Watch Transit Tracker

## Problem

Checking bus and MRT arrival times in KL requires pulling out your phone, opening an app, and navigating to the right screen. For daily commuters, a quick glance at the wrist should be enough.

## Goal

A native watchOS app that shows real-time bus progress (where your bus is on its route) and MRT/LRT arrival times at nearby stations, auto-detected from your location.

## Constraints

- **KL only**: Prasarana services — `rapid-bus-kl`, `rapid-bus-mrtfeeder`, `rapid-rail-kl`
- **No MRT/LRT realtime**: Prasarana's `rapid-rail-kl` realtime feed is not yet available. Rail arrivals use static schedules only.
- **Bus realtime available**: Vehicle positions for `rapid-bus-kl` and `rapid-bus-mrtfeeder`, updated every 30 seconds via protobuf.
- **Data source**: [data.gov.my GTFS Static](https://developer.data.gov.my/realtime-api/gtfs-static) and [GTFS Realtime](https://developer.data.gov.my/realtime-api/gtfs-realtime)

## Architecture

```
[Apple Watch]  --HTTPS-->  [Cloudflare Worker]  --fetch-->  [data.gov.my GTFS APIs]
                               |
                               | Caches:
                               | - GTFS static data in KV (refreshed every 6h)
                               | - Realtime protobuf -> JSON (25s TTL)
```

Three components:

1. **Cloudflare Worker** — parses GTFS static ZIPs, decodes protobuf realtime feeds, serves compact JSON to the watch. No auth (public API, personal use).
2. **Watch App** — SwiftUI, watchOS 10+, standalone (no iPhone required). GPS auto-detects context, makes lightweight API calls.
3. **GTFS Data** — external, read-only. Static schedules + bus vehicle positions.

## Backend API

### `GET /nearby?lat=X&lon=Y&radius=500`

Returns nearby bus stops and rail stations sorted by distance. For stops with active buses, includes next bus arrival (realtime). For stations, includes next 3 scheduled departures per line.

```json
{
  "stops": [
    {
      "id": "stop_123",
      "name": "Bangsar LRT",
      "type": "rail",
      "distance_m": 120,
      "arrivals": [
        { "line": "Kelana Jaya", "destination": "Gombak", "minutes": 3, "isRealtime": false }
      ]
    },
    {
      "id": "stop_456",
      "name": "RapidKL Stop ABC",
      "type": "bus",
      "distance_m": 200,
      "arrivals": [
        { "route": "300", "destination": "KL Sentral", "minutes": 5, "isRealtime": true }
      ]
    }
  ]
}
```

### `GET /bus/trip/:tripId/progress`

Returns the bus's current position along its route from the realtime feed. Includes all remaining stops with ETA, the bus's lat/lon, and progress percentage. Used when the user has been matched to a specific bus trip.

### `GET /station/:stopId/schedule`

Full schedule for a rail station: next N departures per line/direction. Static timetable only.

### `GET /routes?lat=X&lon=Y`

Lists bus routes passing nearby. Used for manual route selection fallback. Returns route ID, short name, and direction info.

### Caching

- GTFS static data: fetched and parsed into KV on deploy, auto-refreshed every 6 hours
- Realtime responses: cached for 25 seconds (feeds update every 30s)
- Schedule lookups: cached for 5 minutes

## Watch App UX

### Main screen — single adaptive view

The watch shows one of three states based on context detection.

**State A: Near a station (within ~200m of a rail stop)**

```
┌──────────────────────┐
│  Bangsar LRT         │
│  ─────────────────── │
│  ● Kelana Jaya line  │
│    → Gombak    3 min │
│    → Putra Heights 7m│
│  ● Sri Petaling line │
│    → Sentral   12 min│
│  ─────────────────── │
│  ⟳ Auto-detected     │
└──────────────────────┘
```

Shows next 2-3 departures per line at the nearest station. "sched" label indicates static data (no realtime). Tap a departure to see the full stop list for that trip.

**State B: On a bus (GPS matches a bus route corridor + direction)**

```
┌──────────────────────┐
│  RapidKL 300         │
│  → KL Sentral        │
│  ─────────────────── │
│  Passed:  Bangsar    │
│  Passed:  Veledrome  │
│  ► HERE   TTDI       │
│  Next:    Phileo     │
│  Next:    KL Sentral │
│  ─────────────────── │
│  4 stops remaining   │
└──────────────────────┘
```

Shows route progress with current stop highlighted. Realtime GPS position of the bus shown when available.

**State C: Unsure (no match)**

Shows nearby stops/stations list from `/nearby`. User taps one to see arrivals, or taps "Select route" for manual bus route picker.

### Navigation

- Swipe up from main screen → nearby stops list
- Swipe left → manual route/station picker (favorites at top)
- Force touch / long press → switch between bus and rail mode manually
- Digital Crown → scroll through stop lists

### Complication (phase 2)

Show next bus/train arrival on the watch face directly — no need to open the app.

## Data Flow

### Bus tracking

1. Watch gets GPS coordinates
2. Calls `/nearby` → gets closest stops + active buses
3. If GPS matches a bus route corridor: match against realtime vehicle positions (same route, nearby lat/lon, matching direction)
4. Call `/bus/trip/:tripId/progress` → show route progress
5. Auto-refresh every 30s while on bus
6. If no match → show nearby stops list

### Station arrival

1. Watch gets GPS coordinates
2. Calls `/nearby` → detects nearest rail station
3. Calls `/station/:stopId/schedule` → shows upcoming departures
4. Auto-refresh every 60s while near station

### Context switching

- GPS sample every 15-20 seconds in background
- Moving 20-60 km/h on a road matching a bus route → bus state
- Stationary within 200m of a rail station → station state
- Neither → nearby list state
- User can override with manual selection

## Error Handling

- **No network**: Show last cached data with "offline" label. Watch caches the last API response per state.
- **GPS unavailable**: Fall straight to manual mode (favorites + route picker).
- **Backend down**: Same as offline — cached data with error indicator.
- **No realtime bus data** (GPS transponder issues): Show scheduled times with "sched" label.

## Battery Considerations

- GPS sampling throttled to every 15-20s (not continuous)
- Screen only refreshes when active or on timeline refresh
- No background downloads — fetch on-demand when user raises wrist
- Complication updates (phase 2) use minimal data transfers

## Tech Stack

### Backend

- Runtime: Cloudflare Workers (V8 isolate)
- Storage: Cloudflare KV
- Language: TypeScript
- GTFS parsing: manual CSV parsing (ZIP contains plain text files)
- Protobuf: `protobufjs` for decoding GTFS-RT feeds
- Deploy: `wrangler` CLI

### Watch App

- watchOS 10+ (SwiftUI)
- Minimum: Apple Watch Series 6 (standalone GPS)
- Location: CoreLocation (`.whenInUse` authorization)
- Networking: URLSession with async/await
- No third-party dependencies

### Project Structure

```
bus-watch/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Worker entry, routing
│   │   ├── gtfs-static.ts    # Parse & cache GTFS ZIP data
│   │   ├── gtfs-realtime.ts  # Decode protobuf feeds
│   │   ├── nearby.ts         # /nearby endpoint logic
│   │   ├── bus-tracker.ts    # /bus/trip progress logic
│   │   ├── station.ts        # /station schedule logic
│   │   └── routes.ts         # /routes endpoint logic
│   ├── wrangler.toml
│   └── package.json
├── watch-app/
│   └── BusWatch/             # Xcode project
│       ├── BusWatchApp.swift
│       ├── Views/
│       │   ├── MainView.swift
│       │   ├── StationArrivalsView.swift
│       │   ├── BusProgressView.swift
│       │   ├── NearbyListView.swift
│       │   └── ManualPickerView.swift
│       ├── Models/
│       │   ├── Stop.swift
│       │   ├── Arrival.swift
│       │   └── BusTrip.swift
│       ├── Services/
│       │   ├── APIClient.swift
│       │   ├── LocationManager.swift
│       │   └── ContextEngine.swift
│       └── Assets/
└── docs/
```

## Future (phase 2+)

- Watch face complication for next arrival
- MRT/LRT realtime integration when Prasarana publishes the feed
- Favorites/saved routes stored on watch
- Haptic notification when approaching your stop
