## 2024-05-19 - Avoid Chained Array Iterations for Critical Paths
**Learning:** Chaining `.filter().map()` incurs an intermediate array allocation which degraded performance inside the hot path `index.ts`.
**Action:** Replaced `.filter().map()` loops with highly optimized classic `for` loops containing precomputed property accesses (`routeId` / `routeShortName`), which yielded measurable execution speedups.
## 2024-05-19 - Use single-pass flatMap over multi-pass flat().filter()
**Learning:** Using `.flat().filter(Boolean)` incurs intermediate array allocations and causes the engine to do a multi-pass traversal. This has a performance cost inside the backend data loading endpoints.
**Action:** Replaced `.flat().filter(Boolean)` with `.flatMap(r => r || [])` allowing single-pass processing without allocating intermediate arrays for measurably improved performance.
