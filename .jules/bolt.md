## 2024-06-22 - Optimize `new Map` Array Allocation Overhead
**Learning:** `new Map(array.map(...))` creates unnecessary intermediate arrays (due to `Array.prototype.map`), which severely degrades performance in hot loops, causing memory allocation and garbage collection overhead.
**Action:** Replace `new Map(array.map(...))` allocations with a standard `for` loop combined with `map.set()` to prevent redundant array creation, specifically in performance-critical areas like processing thousands of GTFS objects or searching for nearby stops.
## 2024-06-27 - Inline Lambda Allocations in Hot Paths
**Learning:** Replacing native array methods (`.find()`, `.findIndex()`, `.some()`) that accept inline lambda functions with standard `for` loops inside heavily repeated hot paths eliminates per-iteration memory allocations, reducing garbage collection overhead.
**Action:** When working in hot execution paths (like nested loops over thousands of transit trips), prefer standard loops over higher-order array functions to avoid continuous closure allocations. Always document these micro-optimizations with inline comments explaining the rationale.
## 2025-02-12 - Prevent lambda allocation in .find() hot paths
**Learning:** In heavily repeated request handlers (like bus position and ETA), using `Array.prototype.find()` with an inline lambda function allocates a new function per invocation, causing GC overhead. Building a `Map` dynamically per request is even slower (79.48 µs vs 15.27 µs for `.find()`).
**Action:** Replace `Array.prototype.find()` in hot array lookups (`vehicles`, `buses`) with standard `for` loops. This reduced execution time to ~13.85 µs and eliminated intermediate lambda allocations.
## 2025-02-09 - Map Lookup Optimization
**Learning:** Redundant `Map.has` and `Map.get` calls in tight loops for grouping/deduplication arrays can create unnecessary CPU overhead.
**Action:** Replaced the `has` check with a single `get` assignment and a falsy check before initializing and setting the default value in `backend/src/index.ts`. Benchmarks showed an approximate 26% improvement in this loop structure.
## 2025-02-18 - Hoist Cloudflare D1 Prepared Statements
**Learning:** Initializing Cloudflare D1 prepared statements (e.g., `env.DB.prepare(...)`) inside loop iterations like `.map()` causes significant N+1 compilation overhead because the query is unnecessarily recompiled per iteration.
**Action:** Extract the `env.DB.prepare()` statements outside the loops. Keep the `.bind(...)` or execute portion inside the loop mapping, enabling the prepared statement to be reused correctly across iterations and significantly lowering overhead.
## 2024-07-09 - Cache last key during Map aggregation of sorted arrays
**Learning:** When grouping SQL result rows into a `Map` that were already ordered by the grouping key (`ORDER BY ...`), the loop consecutively inserts identical keys. Using `map.get()` repeatedly for consecutive rows generates redundant hash computations and map lookups overhead.
**Action:** Track `lastKey` and `lastArr` during iteration, and bypass `map.get()` by pushing directly to `lastArr` when the current key strictly equals `lastKey`.

## 2024-05-18 - Fast String Parsing in Hot Loops
**Learning:** In heavily repeated code paths (like GTFS time parsing in `parseGtfsTimeSeconds` and `gtfsTimeToMinutes`), using array allocations and higher-order functions like `.split(':').map(Number)` or chaining `indexOf` / `substring` creates unnecessary garbage collection overhead and CPU cycles.
**Action:** Replace string-splitting array manipulations with optimized `while` loops that manually accumulate values using `.charCodeAt(i) - 48` for parsing digits. This skips intermediate array object creation, substring extraction, and `parseInt` overhead, improving parsing performance in hot paths (often by 3x-10x).
## 2025-02-18 - Hoist and Cache Map Instantiation globally across Worker Requests
**Learning:** Instantiating `Map` objects (like `tripMap`, `routeMap`, `routeTripMap`) per HTTP request in hot endpoints (like `/nearby`) incurs significant allocation overhead (~12ms per 100 reqs). Passing them downwards internally is good, but caching them across request invocations using memory scope (like Cloudflare KV promises cache) drastically cuts CPU time on worker invocations.
**Action:** Cache large static data map transformations in module scope with an expiration TTL, and pass these prebuilt maps down through handler functions via optional arguments to avoid redundant O(N) array traversals per request.
## 2024-07-06 - Map of Sets string allocation optimization
**Learning:** Using a nested `Map<K1, Set<K2>>` avoids constructing string interpolations (`${k1}-${k2}`) just to test membership in a single `Set<string>`. This cuts down on temporary string allocations in hot loops, reducing garbage collection pressure and improving raw loop throughput.
**Action:** Replaced `Set<string>` seen-lists with `Map<string, Set<string>>` inside nested loop tracking of routes per stop, yielding a ~40% latency reduction in benchmarking tests.
## 2025-02-18 - Optimize redundant map lookups by caching last key
**Learning:** In loops processing sorted data (e.g. data fetched from DB with ORDER BY), consecutive rows often share the same grouping key. Calling `Map.prototype.get` and potentially `Map.prototype.set` for every single row incurs unnecessary hashing and lookup overhead.
**Action:** Replaced the direct map lookup for every row with a lightweight cache storing the `lastKey` and `lastArr`. Since the query uses `ORDER BY route, bus_no`, consecutive samples for the same bus hit the cache and push to the existing array immediately, saving O(1) map overhead per row and resulting in ~40% faster trace grouping.
## 2024-03-24 - Parallelize DB inserts
**Learning:** Sequential DB batch inserts using `await env.DB.batch(...)` in a loop cause significant performance overhead.
**Action:** Replaced sequential awaits with concurrent promises collected in an array and awaited via `Promise.all(batchPromises)`, preserving error-handling per promise.
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

## 2024-07-28 - [Performance] ⚡ Bounding Box Pre-filtering for inner loops
**Learning:** Even if a bounding box pre-filter is applied in outer functions or loops, failing to apply it inside inner nested loops over large datasets (like checking every `vehicle` position for every nearby `stop` or evaluating historical passages) can reintroduce the trigonometric bottleneck of `haversineDistance`.
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

## 2025-02-28 - [Performance] ⚡ Array to Map Lookup caching in Cloudflare workers
**Learning:** O(N) array scans inside heavily accessed routes (like schedule lookups fetching multiple stops per request) scale poorly and cause high CPU spikes. Replacing `array.find(x => x.id === target)` with pre-computed `Map.get(target)` lookups reduces execution time by ~99% on typical workloads (e.g. 1800ms to 17ms for 10000 lookups).
**Action:** When working on heavily accessed functions that do repetitive lookups on static/cached lists (like GTFS stops, trips, routes), always pass a cached `Map` or create one locally rather than iterating over array items using `find` or `findIndex`.
