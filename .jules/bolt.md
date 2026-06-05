## 2024-06-05 - Precompute Maps to prevent O(N^2) bottlenecks
**Learning:** In backend data processing (`backend/src/nearby.ts`), frequent operations inside loops over large arrays using `Array.prototype.find()` created severe O(N^2) bottlenecks when searching `routes` or `trips` lists.
**Action:** When filtering or aggregating data against a secondary array, always precompute a `Map` outside the loop to change $O(N)$ lookups into $O(1)$ constant time lookups.
