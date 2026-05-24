# Caching & Arrival Predictions with D1

**Date:** 2026-05-24
**Status:** Approved

## Problem

1. Prasarana Socket.IO buses (e.g., T816) have no GTFS data — they show up with positions but no route details, stop names, or destinations.
2. Current ETA estimation uses a simple distance/speed heuristic (`distance / speed` or `distance / 250m per min`), which is inaccurate.
3. No historical data is stored, so there's no way to learn actual travel times.

## Approach

Hybrid sampling: store deduplicated bus position samples in D1, aggregate into per-route travel times between stops. Use those travel times for predictions and to enrich Prasarana-only routes.

## D1 Schema

```sql
-- Sampled bus positions (deduplicated per bus per interval)
CREATE TABLE bus_positions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bus_no TEXT NOT NULL,
  route TEXT NOT NULL,
  source TEXT NOT NULL,        -- 'gtfs' or 'prasarana'
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  speed REAL,
  timestamp INTEGER NOT NULL,  -- Unix seconds
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX idx_positions_bus_route ON bus_positions(bus_no, route, timestamp);

-- Aggregated travel times between stops
CREATE TABLE travel_times (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  route TEXT NOT NULL,
  from_stop_id TEXT NOT NULL,
  to_stop_id TEXT NOT NULL,
  from_lat REAL NOT NULL,
  from_lon REAL NOT NULL,
  to_lat REAL NOT NULL,
  to_lon REAL NOT NULL,
  avg_seconds INTEGER NOT NULL,
  sample_count INTEGER NOT NULL DEFAULT 1,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX idx_travel_unique ON travel_times(route, from_stop_id, to_stop_id);
```

## Sampling Logic

On each 5-minute cron tick:

1. Fetch GTFS realtime vehicle positions and Prasarana Socket.IO buses
2. For each bus, query D1 for the most recent position of this `bus_no`
3. If no sample exists within the last 5 minutes, or the bus has moved >100m, INSERT a new row
4. This produces ~1 sample per bus per 5 minutes during active service (~6-18 samples per trip)

## Travel Time Aggregation

Runs alongside sampling on the same cron tick:

1. Read recent `bus_positions` for each route (last 30 min)
2. For each bus trip (bus_no + continuous movement), detect stop passages:
   - GTFS stops: when bus is within 50m
   - Prasarana-only: detect clusters where speed drops to ~0 (treat as discovered stops)
3. Calculate travel time between consecutive stops
4. Upsert into `travel_times` using exponential moving average: `new_avg = (old_avg * 0.8) + (observed * 0.2)`
5. Auto-delete `bus_positions` older than 7 days

## Predictions

**New endpoint: `/bus/eta`**

- Input: `bus_no` or `tripId` + `stopId`
- Look up `travel_times` for the route from the bus's current segment to the target stop
- Sum average travel times for each segment
- Return predicted arrival in minutes
- Fallback to current distance/speed heuristic if no historical data exists yet

**Updated `/nearby` endpoint:**

- When a bus has a GTFS match: use `travel_times` for ETA instead of distance heuristic
- When a bus is Prasarana-only: check D1 for discovered stops/routes, use `travel_times` for ETA
- Response format unchanged — ETAs just improve over time

## Cron Schedule

```
# Existing — GTFS static refresh
0 */6 * * *   → refreshStaticData()

# New — sampling + aggregation + cleanup
*/5 * * * *   → sampleBusPositions() + aggregateTravelTimes() + cleanupOldPositions()
```

## Watch App Changes

Minimal. The `/nearby` response format stays the same. Optionally call `/bus/eta` when tracking a specific bus for more accurate progress updates.

## Cold Start

The system starts with no historical data. During the first days/weeks:
- ETAs fall back to the existing distance/speed heuristic
- Prasarana routes gradually get enriched as observations accumulate
- Travel time predictions improve as sample counts grow

## Storage Estimate

- ~500 buses active at peak, 1 sample per 5 min over ~16 hours = ~96,000 rows/day
- 7-day retention = ~672,000 rows in `bus_positions` at any time
- `travel_times` grows slowly — ~1,000-5,000 route-segment pairs total
- Well within D1 free tier (5 GB storage, 5M rows read/day)
