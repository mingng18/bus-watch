## 2025-06-07 - Avoid array.find() inside loop iterations
**Learning:** In high-frequency map iterations (e.g. mapping over nearby stops to find bus arrivals), using `array.find()` inside the loop introduces an O(N^2) bottleneck, unnecessarily re-evaluating the search.
**Action:** Precompute a `Map` structure mapping IDs to items outside the loop to reduce lookups to O(1) complexity.
