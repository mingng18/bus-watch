## 2024-06-25 - Avoid intermediate allocations with flat().filter(Boolean)
**Learning:** In V8/Node.js, chaining `.flat().filter(Boolean)` creates costly intermediate array allocations and causes the data to be traversed twice. A benchmark using 66 million items showed `.flat().filter(Boolean)` took ~7100ms, while `.flatMap(r => r || [])` took only ~3100ms.
**Action:** When flattening an array of arrays and stripping out null/undefined/falsy values, use `.flatMap(r => r || [])` to perform both operations in a single pass without allocating a massive intermediate flattened array.

## 2024-06-19 - Removed chained array allocations in hot paths
**Learning:** Chained array methods (like `.map().filter()`) inside hot paths such as `findNearbyStops` create thousands of intermediate objects that are thrown away. This is especially slow when processing many thousands of items like `stops`.
**Action:** Replace array chains with standard `for` loops inside iterative performance-sensitive paths to eliminate intermediate allocations.
