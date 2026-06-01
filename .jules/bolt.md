## 2024-11-20 - O(N) array `.find` lookups inside loops
**Learning:** Using `array.find()` inside iteration loops (like `for...of` or `.map` closures) causes massive O(N^2) time complexity bottlenecks.
**Action:** Always precompute `new Map(...)` dictionaries for lookup data arrays outside of loops and closures to enable O(1) retrieval instead of O(N).
