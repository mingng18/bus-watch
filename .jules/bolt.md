## 2024-06-25 - Avoid intermediate allocations with flat().filter(Boolean)
**Learning:** In V8/Node.js, chaining `.flat().filter(Boolean)` creates costly intermediate array allocations and causes the data to be traversed twice. A benchmark using 66 million items showed `.flat().filter(Boolean)` took ~7100ms, while `.flatMap(r => r || [])` took only ~3100ms.
**Action:** When flattening an array of arrays and stripping out null/undefined/falsy values, use `.flatMap(r => r || [])` to perform both operations in a single pass without allocating a massive intermediate flattened array.
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
