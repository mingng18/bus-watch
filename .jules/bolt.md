## 2026-05-24 - Precompute Maps for O(1) Lookups in `src/nearby.ts`

**Learning:** When performing repeated lookups inside loops on large arrays (e.g., matching thousands of GTFS trips to vehicles), using `Array.prototype.find()` creates an `O(N^2)` runtime bottleneck.
**Action:** Always precompute a `Map` linking IDs to objects outside of the loop structure and use `.get()` for `O(1)` access during iterations, specifically demonstrated in `findNearbyStops`, `findNearbyBusRoutes`, and `findNearbyPrasaranaBuses` which yielded up to a >20x speedup in benchmarking.
