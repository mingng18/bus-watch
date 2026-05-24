# API Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Drastically reduce API response times for location tracking (`/nearby`), route rendering (`/route/:routeId`), and station schedules by introducing in-memory caching, pre-computing route shapes during background ingestion, and concurrent database queries.

**Architecture:** Use global scope persistent variables in Cloudflare Workers to cache static GTFS JSON blobs across warm requests. Pre-compute shapes per route during background static refresh to avoid dynamically parsing large shapes blobs. Parallelize sequential D1 database ETA queries in the nearby route using Promise.all.

**Tech Stack:** TypeScript, Cloudflare Workers, Hono, Cloudflare D1 SQL, Cloudflare KV, Vitest.

---

### Task 1: In-Memory Caching for Static Datasets

**Files:**
- Modify: `backend/src/index.ts`
- Create: `backend/test/caching.test.ts`

- [ ] **Step 1: Write the caching test**

Create `backend/test/caching.test.ts` to test the in-memory cache function and ensure values are properly retrieved from KV and cached in-memory on subsequent reads:

```typescript
import { describe, it, expect, vi } from 'vitest';

// Simulating MEMORY_CACHE global map
const MEMORY_CACHE = new Map<string, any>();

async function getKvJsonCached<T>(kv: any, key: string): Promise<T> {
  if (MEMORY_CACHE.has(key)) {
    return MEMORY_CACHE.get(key) as T;
  }
  const val = await kv.get(key, 'json');
  if (val !== null) {
    MEMORY_CACHE.set(key, val);
  }
  return val as T;
}

describe('getKvJsonCached helper', () => {
  it('fetches from KV on cache miss and stores in memory', async () => {
    MEMORY_CACHE.clear();
    const mockKv = {
      get: vi.fn().mockResolvedValue({ some: 'data' })
    };

    const first = await getKvJsonCached(mockKv, 'test-key');
    expect(first).toEqual({ some: 'data' });
    expect(mockKv.get).toHaveBeenCalledTimes(1);

    // Second call should return cached without calling KV
    const second = await getKvJsonCached(mockKv, 'test-key');
    expect(second).toEqual({ some: 'data' });
    expect(mockKv.get).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run tests to verify caching test passes**

Run: `npx vitest run test/caching.test.ts`
Expected: PASS

- [ ] **Step 3: Implement getKvJsonCached and MEMORY_CACHE in `backend/src/index.ts`**

Modify `backend/src/index.ts` to define the global map and the helper function, then replace occurrences of `getKvJson` with `getKvJsonCached` for all static functions.

Insert at line 20 (before `const app = new Hono...`):
```typescript
const MEMORY_CACHE = new Map<string, any>();

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

Then replace occurrences in helper functions (around lines 242-281):
```typescript
async function getAllStops(kv: KVNamespace) {
  const results = await Promise.all(AGENCIES.map(a => getKvJsonCached<any[]>(kv, `stops:${a}`).catch(() => [])));
  return results.flat().filter(Boolean);
}

async function getAllRoutes(kv: KVNamespace) {
  const allRoutes = await Promise.all([...AGENCIES, ...SELANGOR_AGENCIES].map(a => getKvJsonCached<Route[]>(kv, `routes:${a}`).catch(() => []))).then(res => res.flat().filter(Boolean));
  return allRoutes;
}

async function getAllTrips(kv: KVNamespace) {
  const results = await Promise.all(AGENCIES.map(a => getKvJsonCached<any[]>(kv, `trips:${a}`).catch(() => [])));
  return results.flat().filter(Boolean);
}

async function getAllTripStops(kv: KVNamespace) {
  const results = await Promise.all(AGENCIES.map(a => getKvJsonCached<Record<string, any[]>>(kv, `tripStops:${a}`).catch(() => ({}))));
  return Object.assign({}, ...results);
}

async function getAllCalendar(kv: KVNamespace) {
  const results = await Promise.all(AGENCIES.map(a => getKvJsonCached<any[]>(kv, `calendar:${a}`).catch(() => [])));
  return results.flat().filter(Boolean);
}

async function getAllFrequencies(kv: KVNamespace) {
  const results = await Promise.all(AGENCIES.map(a => getKvJsonCached<any[]>(kv, `frequencies:${a}`).catch(() => [])));
  return results.flat().filter(Boolean);
}

async function getAllShapes(kv: KVNamespace) {
  const results = await Promise.all(AGENCIES.map(a => getKvJsonCached<Record<string, [number, number][]>>(kv, `shapes:${a}`).catch(() => ({}))));
  return Object.assign({}, ...results);
}
```

Update `/refresh` endpoint (around line 24) to clear the memory cache:
```typescript
app.get('/refresh', async (c) => {
  MEMORY_CACHE.clear();
  await refreshStaticData(c.env.KV);
  return c.json({ status: 'refreshed' });
});
```

- [ ] **Step 4: Run full test suite to make sure nothing is broken**

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add backend/src/index.ts backend/test/caching.test.ts
git commit -m "feat: implement worker in-memory caching for static datasets"
```

---

### Task 2: Pre-computed Route Shapes Generation and Retrieval

**Files:**
- Modify: `backend/src/index.ts`
- Test: `backend/test/nearby.test.ts` (run existing tests to verify)

- [ ] **Step 1: Implement route-specific shapes generator in `refreshStaticData`**

Modify `refreshStaticData` function in `backend/src/index.ts` to compute shapes for each route ID and store them as separate KV keys.

Replace the existing `refreshStaticData` function (around line 329):
```typescript
async function refreshStaticData(kv: KVNamespace) {
  for (const agency of AGENCIES) {
    try {
      const data = await fetchAndParseAgency(agency);
      await Promise.all([
        kv.put(`stops:${agency}`, JSON.stringify(data.stops)),
        kv.put(`routes:${agency}`, JSON.stringify(data.routes)),
        kv.put(`trips:${agency}`, JSON.stringify(data.trips)),
        kv.put(`tripStops:${agency}`, JSON.stringify(data.tripStops)),
        kv.put(`calendar:${agency}`, JSON.stringify(data.calendar)),
        kv.put(`frequencies:${agency}`, JSON.stringify(data.frequencies)),
        kv.put(`shapes:${agency}`, JSON.stringify(data.shapes)),
      ]);

      // Pre-compute and save route-specific shapes
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
      console.log(`Pre-computed shapes for ${routeToShapeIds.size} routes in agency ${agency}`);
    } catch (err) {
      console.error(`Failed to refresh ${agency}:`, err);
    }
  }
}
```

- [ ] **Step 2: Update `/route/:routeId` query endpoint in `backend/src/index.ts`**

Modify `/route/:routeId` (around line 197) to try fetching pre-computed shapes from KV first, bypassing loading of all shapes and trips.

Target content in `/route/:routeId`:
```typescript
  const allTrips = await getAllTrips(c.env.KV);
  const routeTrips = allTrips.filter(t => t.routeId === route!.id && t.shapeId);
  
  const allShapes = await getAllShapes(c.env.KV);
  const shapeIds = Array.from(new Set(routeTrips.map(t => t.shapeId)));
  let shapes = shapeIds.filter(id => allShapes[id]).map(id => ({
    id,
    points: allShapes[id]
  }));
```

Replace with:
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
```

- [ ] **Step 3: Run Vitest to check for syntax correctness**

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add backend/src/index.ts
git commit -m "feat: pre-compute and store route shapes in KV for fast queries"
```

---

### Task 3: Concurrent SQL Database ETA Queries in `/nearby`

**Files:**
- Modify: `backend/src/index.ts`

- [ ] **Step 1: Parallelize SQL D1 requests in `/nearby` endpoint**

Target content in `backend/src/index.ts` (around line 51):
```typescript
  // Enrich bus arrivals with historical ETA when available
  for (const stop of result) {
    if (stop.type === 'bus') {
      for (const arrival of stop.arrivals) {
        if (arrival.route) {
          const eta = await getHistoricalETA(c.env.DB, arrival.route, 0, 0, stop.id);
          if (eta !== null) {
            arrival.minutes = Math.round(eta);
          }
        }
      }
    }
  }
```

Replace with:
```typescript
  // Enrich bus arrivals with historical ETA concurrently
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

- [ ] **Step 2: Run full test suite**

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 3: Commit changes**

```bash
git add backend/src/index.ts
git commit -m "feat: parallelize D1 database ETA queries in nearby stops endpoint"
```
