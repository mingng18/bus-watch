## 2024-06-08 - Precompute Sets for lookup in loops
**Learning:** Checking for inclusion in small, constant arrays via `.includes()` inside loops (like `['0', '1', '2'].includes(rt)`) over large datasets (e.g. `rawStopTimes`) incurs unnecessary array allocations and linearly bounded lookups during every iteration.
**Action:** Always extract invariant arrays into precomputed `Set` objects outside loop boundaries to ensure O(1) lookups and eliminate allocations, reducing execution time significantly.
