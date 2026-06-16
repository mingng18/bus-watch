## 2024-06-25 - Avoid intermediate allocations with flat().filter(Boolean)
**Learning:** In V8/Node.js, chaining `.flat().filter(Boolean)` creates costly intermediate array allocations and causes the data to be traversed twice. A benchmark using 66 million items showed `.flat().filter(Boolean)` took ~7100ms, while `.flatMap(r => r || [])` took only ~3100ms.
**Action:** When flattening an array of arrays and stripping out null/undefined/falsy values, use `.flatMap(r => r || [])` to perform both operations in a single pass without allocating a massive intermediate flattened array.

## 2024-05-24 - Haversine distance lambda allocation optimization
**Learning:** Hot functions inside loops like `haversineDistance` shouldn't re-declare nested logic or recompute constants. The previous implementation recreated a degree-to-radian lambda `toRad` and `PI / 180` constant on every call, slowing down operations significantly when run inside `filter` or `for` loops against large arrays.
**Action:** Lift constants (like `R` and `PI_180`) out of functions to a wider scope. Avoid inline lambda definitions within a hot execution path unless completely necessary.
