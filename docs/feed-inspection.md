# GTFS-realtime feed inspection (Prasarana)

Spike for [issue #106](https://github.com/mingng18/bus-watch/issues/106). Goal:
find out whether Prasarana's GTFS-realtime feeds populate the fields we need to
build **service alerts** (roadmap A1) and **crowding** (roadmap A2), instead of
the vehicle-position location/trip fields `bus-watch` reads today.

## TL;DR

| Feed (`<entity>`) | Endpoint exists? | Useful fields populated? | Unblocks |
| --- | --- | --- | --- |
| `alert` | _TBD — run probe_ | _TBD_ | A1 (alerts) |
| `trip-update` | _TBD — run probe_ | _TBD_ | (context for A1/A2) |
| `vehicle-position` | **Yes** (already consumed) | `occupancy_status` / `congestion_level` / `occupancy_percentage` — _TBD_ | A2 (crowding) |

> The "TBD" cells above are intentionally left for a live run of the probe
> script (see below). Do not hard-code a claim about feed contents without
> decoding real bytes — Prasarana's feeds vary by time of day and may be
> partially populated.

## Background

`backend/src/gtfs-realtime.ts` today fetches only:

```
https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl
https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-mrtfeeder
```

and reads `trip.tripId`, `trip.routeId`, `position.latitude/longitude`,
`currentStopSequence`, `timestamp`, `stopId`. It **discards**
`occupancy_status`, `congestion_level` and `occupancy_percentage`, and the app
**never** fetches `alert` or `trip-update` entities.

`api.data.gov.my` (the official Malaysian open-data gateway) follows a
consistent URL pattern:

```
https://api.data.gov.my/gtfs-realtime/<entity>/prasarana?category=<category>
```

where `<entity>` ∈ `{vehicle-position, alert, trip-update}` and `<category>` ∈
`{rapid-bus-kl, rapid-bus-mrtfeeder}` (and possibly others). This spike probes
the `alert` and `trip-update` variants and re-checks the crowding fields on the
known `vehicle-position` feed.

## Probe script

`backend/scripts/inspect-feeds.ts` decodes each candidate feed with
`gtfs-realtime-bindings` (already a backend dependency) and reports, per entity
type, the **fraction of entities that populate each field of interest** plus a
distribution histogram of enum-valued fields.

### Run it

```bash
cd backend
npm i -D tsx          # one-time dev runner (not a runtime dependency)
npx tsx scripts/inspect-feeds.ts
```

The decoding + field-presence logic (`analyzeFeed`) is a **pure** function and
is covered by `backend/test/inspect-feeds.test.ts`, which builds GTFS-rt
`FeedMessage` payloads in-process and asserts the presence counts. The network
fetch is isolated to a thin CLI runner so the analysis is deterministic and
offline-testable.

### What each report answers

**Alert** (`<entity> = alert`)

| Field | GTFS-rt name | Why it matters |
| --- | --- | --- |
| Header text | `header_text` | One-line summary shown in list |
| Description text | `description_text` | Body / detail view |
| Severity | `severity_level` (INFO/WARNING/SEVERE) | Sort + badge |
| Cause / Effect | `cause`, `effect` (e.g. WEATHER / SIGNIFICANT_DELAYS) | Iconography, filtering |
| TTS | `tts_header_text`, `tts_description_text` | watchOS VoiceOver |
| Informed entity | `informed_entity` (route_id / trip / stop) | Scoping an alert to a route/stop |

**TripUpdate** (`<entity> = trip-update`)

| Field | GTFS-rt name | Why it matters |
| --- | --- | --- |
| Stop time updates | `stop_time_update` | Per-stop ETA |
| Delay | `stop_time_update[].arrival/departure.delay` | Live-vs-scheduled offset |
| Timestamp | `timestamp` | Freshness |

**VehiclePosition** (`<entity> = vehicle-position`) — crowding (A2)

| Field | GTFS-rt name | Values |
| --- | --- | --- |
| Occupancy status | `occupancy_status` | EMPTY … FULL, NOT_ACCEPTING_PASSENGERS |
| Congestion level | `congestion_level` | RUNNING_SMOOTHLY … SEVERE_CONGESTION |
| Occupancy % | `occupancy_percentage` | 0–100 |

## How to interpret a run

For each candidate the script prints `populated/total (n%)`. Decision rules:

- **Alert feed returns non-2xx or 0 entities** → no real-time alert pipeline via
  GTFS-rt; fall back to scraping MyRapid media-releases HTML (issue notes this as
  the fallback). Block on building A1 on scraped data.
- **Alert feed returns entities with `header_text` + `informed_entity`** ≥ ~50%
  populated → A1 is viable directly off the feed.
- **`occupancy_status` is populated** on a meaningful share of vehicle positions
  → A2 (crowding badges) is viable; extend `VehiclePosition` in
  `backend/src/types.ts` and `fetchVehiclePositions`.
- **`occupancy_percentage`** is the strongest signal if present (numeric), but
  `occupancy_status` alone is enough for a 3-bucket badge (empty / seats /
  full).

## Next steps

1. Run the probe during a weekday daytime window (feeds are sparse off-peak).
2. Fill the TL;DR table with measured populate-rates.
3. Based on results, open follow-up implementation issues against A1 / A2:
   - A1 (alerts): add an `alert` fetch path + KV cache + `/alerts` route.
   - A2 (crowding): extend `fetchVehiclePositions` to carry occupancy and surface
     a badge in the watch app.
