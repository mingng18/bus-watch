## 2024-06-25 - Avoid intermediate allocations with flat().filter(Boolean)
**Learning:** In V8/Node.js, chaining `.flat().filter(Boolean)` creates costly intermediate array allocations and causes the data to be traversed twice. A benchmark using 66 million items showed `.flat().filter(Boolean)` took ~7100ms, while `.flatMap(r => r || [])` took only ~3100ms.
**Action:** When flattening an array of arrays and stripping out null/undefined/falsy values, use `.flatMap(r => r || [])` to perform both operations in a single pass without allocating a massive intermediate flattened array.
## 2024-05-18 - Track array sortedness to avoid unnecessary sorting
**Learning:** During array groupings, constantly tracking array sortedness by comparing the current item against the previous item avoids running an expensive `.sort()` on arrays that are already inherently sorted by data source nature.
**Action:** Implemented a Set `unsortedTrips` in `backend/src/gtfs-static.ts` to identify unsorted sequences, and only passed those specific trips to `.sort()`, dropping execution time by 55% for the block.
