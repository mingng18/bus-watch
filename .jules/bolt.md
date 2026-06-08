## 2024-05-19 - Avoid Chained Array Iterations for Critical Paths
**Learning:** Chaining `.filter().map()` incurs an intermediate array allocation which degraded performance inside the hot path `index.ts`.
**Action:** Replaced `.filter().map()` loops with highly optimized classic `for` loops containing precomputed property accesses (`routeId` / `routeShortName`), which yielded measurable execution speedups.
## 2024-05-19 - Deduplicate Batch Inputs
**Learning:** When addressing N+1 query problems by moving to a batched database query approach (e.g., Cloudflare D1 `db.batch()`), simply flattening an array of sequential queries into a batch array can still result in highly inefficient workloads if the input loop contains many duplicate items.
**Action:** Always deduplicate input parameters (e.g., using a `Set` or unique dictionary) before mapping them to batch database requests to ensure optimal performance and avoid hitting statement-per-batch limits.
