# Design Spec: Cloudflare Worker API Performance Optimization

**Date:** 2026-05-24
**Status:** Approved by User

---

## 1. Goal

The goal of this optimization is to drastically reduce API response times for location tracking (`/nearby`), route rendering (`/route/:routeId`), and station schedules (`/station/:stopId/schedule`) on the Watch App.

We aim to:
*   Bring typical static / database API response times down to **< 30ms** (excluding network transit).
*   Avoid memory and CPU runtime limit exhaustion on Cloudflare Workers (128MB limit).
*   Keep the system fully compatible with dynamic / reconstructed route shapes.

---

## 2. Technical Design

### A. Part 1: Worker In-Memory Caching for Static Data

Cloudflare Workers maintain warm execution contexts (isolates) across sequential requests. We can leverage global memory variables to cache massive static datasets that change infrequently.

#### Global Cache Variable
An in-memory `Map` inside the global scope of `backend/src/index.ts`:

```typescript
const MEMORY_CACHE = new Map<string, any>();
```

#### Cache Helper
A wrapper function to retrieve KV JSON values from the cache:

```typescript
async function getKvJsonCached<T>(kv: KVNamespace, key: string): Promise<T> {
  if (MEMORY_CACHE.has(key)) {
    return MEMORY_CACHE.get(key) as T;
  }
  const val = await kv.get(key, 'json');
  if (val !== null) {
    MEMORY_CACHE.set(key, val);
  }
  return val as T;
}
```

This helper will replace `getKvJson` for the following static datasets:
*   `stops:${agency}`
*   `routes:${agency}`
*   `trips:${agency}`
*   `tripStops:${agency}`
*   `calendar:${agency}`
*   `frequencies:${agency}`

#### Cache Invalidation
Whenever static data is updated via `/refresh`, we must clear the cache map so that the worker isolate immediately fetches the fresh datasets from KV:

```typescript
app.get('/refresh', async (c) => {
  MEMORY_CACHE.clear(); // Clear all memory entries
  await refreshStaticData(c.env.KV);
  return c.json({ status: 'refreshed' });
});
```

---

### B. Part 2: Route Shape Pre-computation

Instead of dynamically reading and parsing multi-megabyte `shapes:${agency}` blobs on every `/route/:routeId` request, we pre-compute and store route-specific shapes during background data imports.

#### Data Import Logic (`refreshStaticData`)
During static data refresh, we group shape coordinates by their respective `routeId` using the GTFS trips mapping:

```typescript
// For each agency
const routeToShapeIds = new Map<string, Set<string>>();
for (const trip of data.trips) {
  if (trip.shapeId) {
    if (!routeToShapeIds.has(trip.routeId)) {
      routeToShapeIds.set(trip.routeId, new Set());
    }
    routeToShapeIds.get(trip.routeId)!.add(trip.shapeId);
  }
}

const kvPromises: Promise<void>[] = [];
for (const [routeId, shapeIds] of routeToShapeIds.entries()) {
  const routeShapes = Array.from(shapeIds)
    .map(sid => ({
      id: sid,
      points: data.shapes[sid] || []
    }))
    .filter(s => s.points.length > 0);

  if (routeShapes.length > 0) {
    kvPromises.push(kv.put(`routeShapes:${routeId}`, JSON.stringify(routeShapes)));
  }
}
await Promise.all(kvPromises);
```

#### Route Query API (`/route/:routeId`)
The API first looks up the pre-computed shapes for the target route ID in KV:

```typescript
let shapes: any[] = [];
try {
  const cachedShapes = await c.env.KV.get(`routeShapes:${route!.id}`, 'json');
  if (cachedShapes) {
    shapes = cachedShapes as any[];
  }
} catch (err) {
  console.error('Failed to fetch pre-computed shapes from KV:', err);
}

// Fallback: reconstruct route shape from D1 historical bus positions
let isReconstructed = false;
if (shapes.length === 0) {
  // Existing D1 trail reconstruction code...
}
```

---

### C. Part 3: Concurrent SQL Queries in `/nearby`

We parallelize SQL database requests to Cloudflare D1 inside the `/nearby` endpoint.

#### Concurrent Refactor
```typescript
const etaPromises: Promise<void>[] = [];

for (const stop of result) {
  if (stop.type === 'bus') {
    for (const arrival of stop.arrivals) {
      if (arrival.route) {
        etaPromises.push((async () => {
          try {
            const eta = await getHistoricalETA(c.env.DB, arrival.route, 0, 0, stop.id);
            if (eta !== null) {
              arrival.minutes = Math.round(eta);
            }
          } catch (err) {
            console.error(`Failed to fetch historical ETA for route ${arrival.route} at stop ${stop.id}:`, err);
          }
        })());
      }
    }
  }
}

await Promise.all(etaPromises);
```

---

## 3. Spec Self-Review

*   **Placeholder Scan:** No placeholders or "TBD" items. The API schemas and implementation patterns match existing codes exactly.
*   **Consistency:** The route shape pre-computation seamlessly supports both GTFS-defined routes and custom dynamic reconstruction.
*   **Scope Check:** All optimizations reside cleanly in `backend/src/index.ts` and `backend/src/gtfs-static.ts`.
*   **Ambiguity:** All fallback workflows are explicitly defined (e.g. invalid cache triggers standard KV query, missing routeShape triggers D1 reconstruction).

---

## 4. Verification & Testing

### Test Suite Execution
Run tests locally via `npm run test` (Vitest) in the `backend/` directory to ensure no regressions are introduced in the nearby / static endpoints.

### API Integration Verification
Deploy changes locally using wrangler (`npx wrangler dev`) and make parallel requests using `curl` to:
1.  `/refresh` (verify it clears cache and builds `routeShapes:*` keys)
2.  `/nearby` (verify lat/lon returns instantly with historical ETAs populated)
3.  `/route/:routeId` (verify shapes are populated rapidly)
