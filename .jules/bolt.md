## 2024-06-25 - Avoid intermediate allocations with flat().filter(Boolean)
**Learning:** In V8/Node.js, chaining `.flat().filter(Boolean)` creates costly intermediate array allocations and causes the data to be traversed twice. A benchmark using 66 million items showed `.flat().filter(Boolean)` took ~7100ms, while `.flatMap(r => r || [])` took only ~3100ms.
**Action:** When flattening an array of arrays and stripping out null/undefined/falsy values, use `.flatMap(r => r || [])` to perform both operations in a single pass without allocating a massive intermediate flattened array.
## 2024-05-18 - Hoist Map Instantiation
**Learning:** Instantiating `Map` objects inside loops using chained array iterations (`new Map(routes.map(r => [r.id, r]))`) can cause significant performance overhead in hot loops (e.g. `nearby.map` when `routeMap` doesn't change per item).
**Action:** Always verify if object creations that don't depend on loop context can be hoisted to a wider scope to prevent unnecessary memory allocation and CPU cycles per iteration.
