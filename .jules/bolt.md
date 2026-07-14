## 2024-06-25 - Avoid intermediate allocations with flat().filter(Boolean)
**Learning:** In V8/Node.js, chaining `.flat().filter(Boolean)` creates costly intermediate array allocations and causes the data to be traversed twice. A benchmark using 66 million items showed `.flat().filter(Boolean)` took ~7100ms, while `.flatMap(r => r || [])` took only ~3100ms.
**Action:** When flattening an array of arrays and stripping out null/undefined/falsy values, use `.flatMap(r => r || [])` to perform both operations in a single pass without allocating a massive intermediate flattened array.
## 2024-05-18 - Track array sortedness to avoid unnecessary sorting
**Learning:** During array groupings, constantly tracking array sortedness by comparing the current item against the previous item avoids running an expensive `.sort()` on arrays that are already inherently sorted by data source nature.
**Action:** Implemented a Set `unsortedTrips` in `backend/src/gtfs-static.ts` to identify unsorted sequences, and only passed those specific trips to `.sort()`, dropping execution time by 55% for the block.
## 2024-05-24 - Optimize Linear Route Search with TTL-cached Map Lookups
**Learning:** When optimizing O(N) array `.find()` lookups on static or semi-static data (like transit routes) inside a request handler, simply substituting a `for` loop reduces closure overhead but doesn't fix the algorithmic complexity. Creating a Map on every request is O(N) and often slower than a simple loop due to map instantiation overhead.
**Action:** Implemented a module-level, TTL-based memory cache (60 seconds) in the Cloudflare Worker to store both the raw array and O(1) lookup Maps (keyed by `id` and `shortName`). This avoids unbounded KV reads, eliminates per-request Map generation overhead, and successfully turns O(N) linear searches into true O(1) lookups across isolate requests.
## 2024-05-18 - Hoist Map Instantiation
**Learning:** Instantiating `Map` objects inside loops using chained array iterations (`new Map(routes.map(r => [r.id, r]))`) can cause significant performance overhead in hot loops (e.g. `nearby.map` when `routeMap` doesn't change per item).
**Action:** Always verify if object creations that don't depend on loop context can be hoisted to a wider scope to prevent unnecessary memory allocation and CPU cycles per iteration.

## 2024-06-19 - Removed chained array allocations in hot paths
**Learning:** Chained array methods (like `.map().filter()`) inside hot paths such as `findNearbyStops` create thousands of intermediate objects that are thrown away. This is especially slow when processing many thousands of items like `stops`.
**Action:** Replace array chains with standard `for` loops inside iterative performance-sensitive paths to eliminate intermediate allocations.
## 2025-02-18 - Optimize hot loop conversions by hoisting

**Learning:** Mathematical utility functions called inside deep iterations or "hot loops" (e.g., scanning thousands of stops to find nearby vehicles using `haversineDistance`) suffer from significant performance degradation if they redefine identical closures or recalculate static math conversions on every invocation. In our `haversineDistance` function, the inline closure `toRad` was re-created, and the `Math.PI / 180` conversion multiplier along with `R = 6371000` were re-evaluated on every single execution.

**Action:** Whenever implementing geometry or mathematical utilities intended for batch operations, proactively hoist all constant definitions and conversion factors out of the function body into the module scope. Avoid defining inline functional closures (like `(deg) => deg * Math.PI / 180`) within these utilities; inline the arithmetic directly to eliminate closure allocation overhead.
## 2024-06-20 - Optimize array allocations in findNearbyRoutes
**Learning:** Chaining `.filter()` and `.map()` results in multiple intermediate array allocations. When searching over large arrays of static data (e.g., transit stops), these redundant iterations and allocations create unnecessary memory pressure and slower execution times. Using a standard `for` loop with index-based iteration eliminates these overheads.
**Action:** Replace functional array iteration chains with raw `for` loops inside performance-critical data processing paths to skip intermediate array construction and significantly lower execution times.

## 2024-06-21 - Intermediate array allocation in hot loops
**Learning:** Found an instance in `backend/src/nearby.ts` where `vehicles.filter` was used inside a loop over `stops` to find nearby vehicles. This led to creating unnecessary intermediate array allocations repeatedly in a hot path. Benchmarks showed it to be ~25% slower than standard loops when scaling the stops and vehicles count.
**Action:** Replace chained array methods `.map().filter()` or array allocations from `.filter()` inside inner hot loops with a standard single loop iteration to directly process items and eliminate intermediate array overhead and redundant calculations.
## 2024-06-21 - Replace Array findIndex with manual standard for loop
**Learning:** `findIndex` using a lambda expression with conditions (such as checking `i > currentIdx`) iterates over the whole array up to the match, checking the closure for each element pointlessly over the skipped range `0` through `currentIdx`.
**Action:** Replaced `findIndex` with a manual `for` loop that strictly starts at `currentIdx + 1`, avoiding unnecessary iterations and memory allocations from closures.

## 2024-06-21 - Optimize CSV parsing string allocation
**Learning:** In hot parsing loops in Node.js/Cloudflare Workers, performing character-by-character string concatenation (`str += char`) causes significant overhead due to constant memory allocation and GC pressure.
**Action:** Replaced character-by-character concatenation with manual index tracking and `substring()` to slice larger contiguous chunks of the string at once. This reduces intermediate object creation and improved execution time by ~31% compared to the naive approach.

## 2024-06-21 - Cache GTFS fetch helpers
**Learning:** Functions doing expensive IO (like parsing/fetching JSON arrays) inside routes with multiple sequential or parallel `Promise.all`s should cache their resolved outputs to prevent severe latency hits and excessive allocations, especially on high-traffic workers or endpoints making many calls.
**Action:** Introduced global caching variables (`cachedStops`, `cachedTrips`, `cachedTripStops`, `cachedCalendar`, `cachedFrequencies`) to cache `getAll*` data within memory across worker invocations to prevent repetitive KV fetches.

## 2024-06-21 - Cache Cloudflare KV Fetch Promises
**Learning:** Calling `Promise.all` mapping over multiple async Cloudflare KV fetches (`kv.get`) on every request path deserializes potentially large JSON payloads repeatedly, applying heavy CPU and memory pressure on Workers while waiting for I/O operations. Cloudflare Worker limits are easily hit under concurrent requests when the same payload is parsed thousands of times per minute. Caching the resolved results helps, but leaves a window where concurrent requests might trigger redundant cache fetches ("cache stampede").
**Action:** Implemented Promise-based caching in memory (by storing the Promise object in a global variable rather than the resolved value) for repetitive KV calls like `getAllStops`, `getAllTrips`, `getAllTripStops`, `getAllCalendar`, `getAllFrequencies`, and `getAllShapes`. Subsequent simultaneous requests hitting the Cloudflare Worker during the async resolution window will `await` the existing pending Promise rather than initiating redundant KV API round-trips. Local benchmarking demonstrated concurrent request execution time dropping from ~42ms to ~0.07ms (under fully cached conditions).
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
## 2025-02-18 - Pre-compute and reuse route maps
**Learning:** Re-instantiating `Map` objects and iterating over large arrays on every HTTP request in Cloudflare Workers endpoints causes significant allocation and garbage collection overhead.
**Action:** Always pre-compute and cache map lookups outside the request handler, and pass them down as optional parameters to reuse the prebuilt Maps.
