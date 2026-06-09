## 2024-05-19 - Avoid Chained Array Iterations for Critical Paths
**Learning:** Chaining `.filter().map()` incurs an intermediate array allocation which degraded performance inside the hot path `index.ts`.
**Action:** Replaced `.filter().map()` loops with highly optimized classic `for` loops containing precomputed property accesses (`routeId` / `routeShortName`), which yielded measurable execution speedups.

## 2025-05-18 - Avoid O(N) operations and temporary allocations in inner map chains
**Learning:** Found an architectural bottleneck where array mapping inside a high-iteration loop (`findNearbyStops`) performed chained `.map().filter()` resulting in unnecessary object closures and intermediate allocations. Hoisting maps (`routeMap`) outside `.map` and replacing `.filter()` with regular `for` loops measurably decreases allocations.
**Action:** When working on array reduction or mapping functions, especially when creating response payloads, ensure heavy map initializations are hoisted and chained high-level array methods inside hot loops are avoided.
