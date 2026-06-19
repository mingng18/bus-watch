## 2024-06-25 - Avoid intermediate allocations with flat().filter(Boolean)
**Learning:** In V8/Node.js, chaining `.flat().filter(Boolean)` creates costly intermediate array allocations and causes the data to be traversed twice. A benchmark using 66 million items showed `.flat().filter(Boolean)` took ~7100ms, while `.flatMap(r => r || [])` took only ~3100ms.
**Action:** When flattening an array of arrays and stripping out null/undefined/falsy values, use `.flatMap(r => r || [])` to perform both operations in a single pass without allocating a massive intermediate flattened array.
<<<<<<< HEAD
## 2024-05-18 - Track array sortedness to avoid unnecessary sorting
**Learning:** During array groupings, constantly tracking array sortedness by comparing the current item against the previous item avoids running an expensive `.sort()` on arrays that are already inherently sorted by data source nature.
**Action:** Implemented a Set `unsortedTrips` in `backend/src/gtfs-static.ts` to identify unsorted sequences, and only passed those specific trips to `.sort()`, dropping execution time by 55% for the block.
## 2024-05-24 - Optimize Linear Route Search with TTL-cached Map Lookups
**Learning:** When optimizing O(N) array `.find()` lookups on static or semi-static data (like transit routes) inside a request handler, simply substituting a `for` loop reduces closure overhead but doesn't fix the algorithmic complexity. Creating a Map on every request is O(N) and often slower than a simple loop due to map instantiation overhead.
**Action:** Implemented a module-level, TTL-based memory cache (60 seconds) in the Cloudflare Worker to store both the raw array and O(1) lookup Maps (keyed by `id` and `shortName`). This avoids unbounded KV reads, eliminates per-request Map generation overhead, and successfully turns O(N) linear searches into true O(1) lookups across isolate requests.
## 2024-05-18 - Hoist Map Instantiation
**Learning:** Instantiating `Map` objects inside loops using chained array iterations (`new Map(routes.map(r => [r.id, r]))`) can cause significant performance overhead in hot loops (e.g. `nearby.map` when `routeMap` doesn't change per item).
**Action:** Always verify if object creations that don't depend on loop context can be hoisted to a wider scope to prevent unnecessary memory allocation and CPU cycles per iteration.

## 2024-06-19 - Removed chained array allocations in hot paths
**Learning:** Chained array methods (like `.map().filter()`) inside hot paths such as `findNearbyStops` create thousands of intermediate objects that are thrown away. This is especially slow when processing many thousands of items like `stops`.
**Action:** Replace array chains with standard `for` loops inside iterative performance-sensitive paths to eliminate intermediate allocations.
## 2025-02-18 - Optimize hot loop conversions by hoisting

**Learning:** Mathematical utility functions called inside deep iterations or "hot loops" (e.g., scanning thousands of stops to find nearby vehicles using `haversineDistance`) suffer from significant performance degradation if they redefine identical closures or recalculate static math conversions on every invocation. In our `haversineDistance` function, the inline closure `toRad` was re-created, and the `Math.PI / 180` conversion multiplier along with `R = 6371000` were re-evaluated on every single execution.

**Action:** Whenever implementing geometry or mathematical utilities intended for batch operations, proactively hoist all constant definitions and conversion factors out of the function body into the module scope. Avoid defining inline functional closures (like `(deg) => deg * Math.PI / 180`) within these utilities; inline the arithmetic directly to eliminate closure allocation overhead.
=======
## $(date +%Y-%m-%d) - In-Memory Caching for KV Fetches in Cloudflare Workers
**Learning:** Cloudflare Workers can persist global variables across multiple request invocations. Fetching data from KV namespaces on every request is an expensive I/O operation. Furthermore, dynamically generating cache keys or fetching promises on every request allocates unnecessary memory.
**Action:** Implemented a global `Map` to cache the static data KV fetches across the worker lifecycle using a TTL. Stored the `Promise` of the fetch instead of the resolved data to prevent cache stampedes (thundering herd problem) from concurrent requests. Pre-computed the key arrays (e.g., `STOPS_KEYS`) outside the hot request path to avoid redundant allocations on every call.
>>>>>>> bdb8e34 (Optimize static data fetches with in-memory caching)
