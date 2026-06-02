## 2024-05-19 - Avoid Chained Array Iterations for Critical Paths
**Learning:** Chaining `.filter().map()` incurs an intermediate array allocation which degraded performance inside the hot path `index.ts`.
**Action:** Replaced `.filter().map()` loops with highly optimized classic `for` loops containing precomputed property accesses (`routeId` / `routeShortName`), which yielded measurable execution speedups.
