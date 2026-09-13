## 2023-11-20 - Batch D1 Inserts Concurrently
**Learning:** Inserting large volumes of rows into Cloudflare D1 (SQLite) sequentially inside a `for` loop exceeds execution time limits and starves the event loop. While `DB.batch()` improves things by grouping statements, running thousands of rows in a single batch can hit D1 request limits or memory caps.
**Action:** Chunk large inserts into discrete batches (e.g., 100 rows per batch) and execute them concurrently with bounded concurrency (e.g., 5 concurrent batches). Ensure that `DB.batch()` calls return their promises, and keep the set promises collected in an array and awaited via `Promise.all(batchPromises)`, preserving error-handling per promise.

## 2025-02-18 - Pre-compute and reuse route maps
**Learning:** Re-instantiating `Map` objects and iterating over large arrays on every HTTP request in Cloudflare Workers endpoints causes significant allocation and garbage collection overhead.
**Action:** Always pre-compute and cache map lookups outside the request handler, and pass them down as optional parameters to reuse the prebuilt Maps.

## 2025-02-18 - Optimize array allocations when processing shapes
**Learning:** Reconstructing GTFS shapes using chained methods like `Array.from(new Set(arr.map(...)))` and `Array.from(groups.entries()).filter().map()` inside heavily accessed endpoints causes severe CPU and memory allocation overhead. Benchmarking showed standard loops can perform the same filtering and mapping roughly 3-4x faster by bypassing intermediate arrays and Set-to-Array instantiation.
**Action:** Replace functional array chaining with standard `for` loops inside endpoints rendering complex GTFS relationships (like `shapes` extraction). Pre-instantiate target result arrays and push directly to them.

## 2024-07-25 - Group sequential async Cloudflare KV lookups
**Learning:** Sequential async lookups to remote stores like Cloudflare KV (e.g. `await getA(); await getB();`) compound latency linearly (e.g., 6 lookups at 50ms = 300ms delay).
**Action:** Group independent data fetches into concurrent `Promise.all` blocks to bound the total execution time to the single slowest request, dramatically improving endpoint response times.

## 2024-07-28 - [Performance] ⚡ Bounding Box Pre-filtering for Haversine Calculations
**Learning:** In Cloudflare Workers where execution time and CPU cycles are highly constrained, large loops (e.g., iterating through thousands of bus stops or vehicles) that calculate geographic distance using the Haversine formula can be a significant bottleneck due to expensive trigonometric math (`Math.sin`, `Math.cos`, `Math.atan2`).
**Action:** When filtering objects by geographic radius, implement a spatial pre-filter using a fast bounding box approximation before invoking the precise distance calculation. Use simple float comparisons (`<`, `>`) to aggressively prune out-of-bounds coordinates early, drastically reducing trigonometric overhead.

## 2024-07-28 - [Performance] ⚡ Bounding Box Pre-filtering for inner loops
**Learning:** Even if a bounding box pre-filter is applied in outer functions or loops, failing to apply it inside inner nested loops over large datasets (like checking every `vehicle` position for every nearby `stop`) can reintroduce the trigonometric bottleneck of `haversineDistance`.
**Action:** When iterating over coordinates in hot nested loops, ensure bounding box pre-filtering using `getBoundingBox` and arithmetic checks are applied directly inside the tightest loop where the geographic comparison occurs, effectively bypassing `haversineDistance` entirely for out-of-bounds items.

## 2024-07-28 - [Performance] ⚡ Bounding Box Pre-filtering for nearest point searches
**Learning:** When performing O(N) array scans to find the nearest point (like `nearestFromStopOnRoute`), recalculating the precise `haversineDistance` for every single coordinate introduces significant trigonometric overhead. Additionally, calling generic bounding box helpers inside the loop repeats constant calculations (like `Math.cos(lat)`).
**Action:** When finding a nearest point in a loop, pre-calculate the constants outside the loop, initialize a bounding box with the first point's distance, and dynamically shrink the bounding box limits (`minLat`, `maxLat`, `minLon`, `maxLon`) every time a closer point is found. This progressively and aggressively prunes outer coordinates with cheap arithmetic checks before falling back to `haversineDistance`.

## 2025-02-18 - Prasarana Map Allocation Optimization
**Learning:** In the `findNearbyPrasaranaBuses` function which processes external bus arrivals, `routeNameMap` (to map between Prasarana short names and GTFS routes) was being instantiated dynamically on every single HTTP request (e.g. `/nearby`). Since there are hundreds of routes, initializing Map instances dynamically causes unnecessary garbage collection and CPU overhead.
**Action:** Replaced dynamic `routeNameMap` allocation inside the nearby request handler with the module-cached `shortNameMap` exported from `getRoutesMaps` in `index.ts`. Passed it as an optional parameter (`pShortNameMap`) down to `findNearbyPrasaranaBuses`. This ensures O(1) route lookups using a globally cached map across subsequent requests, bypassing per-request memory allocation entirely.

## 2025-02-23 - Concurrent Data Fetching on Valid Paths
**Learning:** Sequential async lookups (like `getRoutesMaps` and `getPrasaranaBuses`) compound latency linearly. However, grouping ALL fetches (like `getRealtimeVehicles`, `getAllTrips`, `getAllShapes`) into a single `Promise.all` block before validating parameters (e.g. checking if `route` exists) causes unnecessary database/KV reads for invalid requests (like 404s), wasting I/O resources on error paths.
**Action:** When migrating sequential `await`s to concurrent `Promise.all` blocks in endpoints, split the requests into logical phases. Fetch the minimal data required for validation in the first `Promise.all`, perform the validation (early return on 404), and fetch the remaining heavy data in a second `Promise.all` block to preserve fast/cheap error paths while maximizing concurrency on the happy path.

## 2024-08-05 - Bounding Box Pre-filtering outside nested loops
**Learning:** In nested loops dealing with geographic data (e.g., checking every `stop` against every `vehicle`), applying a bounding box filter inside the inner loop is better than raw Haversine, but still requires evaluating thousands of out-of-bounds items iteratively.
**Action:** When finding items within a radius of a central point across nested relationships (e.g. stops and vehicles), compute a combined outer bounding box (`searchRadius + innerRadius`) and pre-filter the secondary dataset (vehicles) *outside* the outer loop. This changes the execution from $O(S \times V)$ to $O(V + S \times V_{nearby})$, dropping execution times drastically (e.g., from ~360ms to ~38ms).

## 2025-02-28 - Avoid array chaining overhead in hot paths
**Learning:** Chaining array methods like `.map().reduce()` and `.map().filter()` inside heavily executed hot loops (such as `aggregateSamples` and `rejectOutliers` in `backend/src/sampling.ts`) forces the engine to allocate new intermediate arrays for every step. In tests, a manual standard `for` loop approach that combines array extraction, average, and spread computation in a single structure performed measurably faster and avoided memory pressure compared to naive array chaining.
**Action:** When performing mathematical aggregations (like averages or MAD calculations) within tight loops, avoid chaining `.map()`, `.reduce()`, or `.filter()`. Use manual index-based `for` loops and accumulator variables to extract data and calculate values sequentially without allocating intermediary closure or array structures.

## 2024-10-24 - Optimize array allocations when processing raw GTFS sets
**Learning:** Chaining `.filter().map()` inside array to `Set` instantiations in data ingest paths (like `rail-ingest.ts`) causes the engine to allocate intermediate array structures. A standard `for` loop pushing directly to the `Set` reduces execution time and garbage collection pressure on large datasets.
**Action:** Replace functional `.filter().map()` chains with standard `for` loops when instantiating `Set` objects from large arrays.

## 2024-09-12 - String Sorting Optimization
**Learning:** Using `String.prototype.localeCompare` to sort strictly formatted ASCII strings (like "HH:MM:SS") applies complex I18N collation rules that add noticeable performance overhead.
**Action:** Use simple lexicographical comparison operators (`a < b ? -1 : a > b ? 1 : 0`) for much faster sorting when dealing with strictly formatted time strings.

## 2025-05-23 - Optimize array allocations when processing raw GTFS sets in rail ingestion
**Learning:** Chaining `.filter().map()` inside large array ingestion paths (like `rail-ingest.ts`) causes the engine to allocate massive intermediate array structures before mapping, increasing memory pressure and GC spikes. A standard `for` loop pushing directly to the target array executes the filtering/mapping logic in a single fast pass per dataset.
**Action:** Replace functional `.filter().map()` chains with standard `for` loops when parsing large CSV raw outputs in data ingestion scripts.

## 2023-10-27 - Avoid localeCompare for ASCII strings
**Learning:** Using String.prototype.localeCompare to sort strictly formatted ASCII strings (like HH:MM:SS times) applies complex internationalization collation rules, creating noticeable overhead.
**Action:** Use simple comparison operators (`a < b ? -1 : a > b ? 1 : 0`) for much faster lexicographical sorting in performance-critical paths.
