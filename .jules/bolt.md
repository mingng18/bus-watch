## 2024-05-19 - Avoid Chained Array Iterations for Critical Paths
**Learning:** Chaining `.filter().map()` incurs an intermediate array allocation which degraded performance inside the hot path `index.ts`.
**Action:** Replaced `.filter().map()` loops with highly optimized classic `for` loops containing precomputed property accesses (`routeId` / `routeShortName`), which yielded measurable execution speedups.
## 2025-06-12 - Hoisting Date Instantiation
**Learning:** Instantiating `new Date()` inside an array iteration over thousands of GTFS trips introduces severe performance overhead due to object allocation and garbage collection.
**Action:** Always hoist timestamp instantiation and standard calculations outside of tight loops if the time offset throughout the iteration is negligible.
