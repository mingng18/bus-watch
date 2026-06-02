## 2026-06-02 - Optimization of array.find() in loops using Maps
**Learning:** Found O(N^2) bottlenecks where `array.find()` was executed within an outer loop over vehicles in `backend/src/nearby.ts`. Precomputing a `Map` lookup object allowed O(1) checks and significantly sped up calculations, verified by an ~80-90% execution time drop in microbenchmarking.
**Action:** Always hoist lookups using `Map` creation before large loops, rather than using repeated O(N) array iteration methods like `.find()` or `.filter()` inside the loop.
