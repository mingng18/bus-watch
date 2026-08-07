const fs = require('fs');
let content = fs.readFileSync('.jules/bolt.md', 'utf8');

const search = `<<<<<<< HEAD
## 2025-02-18 - Prasarana Map Allocation Optimization
**Learning:** In the \`findNearbyPrasaranaBuses\` function which processes external bus arrivals, \`routeNameMap\` (to map between Prasarana short names and GTFS routes) was being instantiated dynamically on every single HTTP request (e.g. \`/nearby\`). Since there are hundreds of routes, initializing Map instances dynamically causes unnecessary garbage collection and CPU overhead.
**Action:** Replaced dynamic \`routeNameMap\` allocation inside the nearby request handler with the module-cached \`shortNameMap\` exported from \`getRoutesMaps\` in \`index.ts\`. Passed it as an optional parameter (\`pShortNameMap\`) down to \`findNearbyPrasaranaBuses\`. This ensures O(1) route lookups using a globally cached map across subsequent requests, bypassing per-request memory allocation entirely.

## 2025-02-23 - Concurrent Data Fetching on Valid Paths
**Learning:** Sequential async lookups (like \`getRoutesMaps\` and \`getPrasaranaBuses\`) compound latency linearly. However, grouping ALL fetches (like \`getRealtimeVehicles\`, \`getAllTrips\`, \`getAllShapes\`) into a single \`Promise.all\` block before validating parameters (e.g. checking if \`route\` exists) causes unnecessary database/KV reads for invalid requests (like 404s), wasting I/O resources on error paths.
**Action:** When migrating sequential \`await\`s to concurrent \`Promise.all\` blocks in endpoints, split the requests into logical phases. Fetch the minimal data required for validation in the first \`Promise.all\`, perform the validation (early return on 404), and fetch the remaining heavy data in a second \`Promise.all\` block to preserve fast/cheap error paths while maximizing concurrency on the happy path.

## 2024-08-05 - Bounding Box Pre-filtering outside nested loops
**Learning:** In nested loops dealing with geographic data (e.g., checking every \`stop\` against every \`vehicle\`), applying a bounding box filter inside the inner loop is better than raw Haversine, but still requires evaluating thousands of out-of-bounds items iteratively.
**Action:** When finding items within a radius of a central point across nested relationships (e.g. stops and vehicles), compute a combined outer bounding box (\`searchRadius + innerRadius\`) and pre-filter the secondary dataset (vehicles) *outside* the outer loop. This changes the execution from $O(S \\times V)$ to $O(V + S \\times V_{nearby})$, dropping execution times drastically (e.g., from ~360ms to ~38ms).
=======
## 2026-07-28 - [Refactor] 🧹 Extracted helper functions in sampling.ts
**Learning:** Functions doing complex DB operations combined with in-memory transformations can quickly become unwieldy (like \`aggregateTravelTimes\`). Extracting the distinct logical steps (fetching, grouping, transforming, upserting) into smaller, exported helper functions makes the main function a readable orchestrator.
**Action:** Used \`sed\` or node string replacement via patch file to carefully extract logical blocks while preserving exactly the same logic and tests.
>>>>>>> ce4339e (🧹 [Refactor] Extract helper functions to simplify aggregateTravelTimes)`;

const replace = `## 2025-02-18 - Prasarana Map Allocation Optimization
**Learning:** In the \`findNearbyPrasaranaBuses\` function which processes external bus arrivals, \`routeNameMap\` (to map between Prasarana short names and GTFS routes) was being instantiated dynamically on every single HTTP request (e.g. \`/nearby\`). Since there are hundreds of routes, initializing Map instances dynamically causes unnecessary garbage collection and CPU overhead.
**Action:** Replaced dynamic \`routeNameMap\` allocation inside the nearby request handler with the module-cached \`shortNameMap\` exported from \`getRoutesMaps\` in \`index.ts\`. Passed it as an optional parameter (\`pShortNameMap\`) down to \`findNearbyPrasaranaBuses\`. This ensures O(1) route lookups using a globally cached map across subsequent requests, bypassing per-request memory allocation entirely.

## 2025-02-23 - Concurrent Data Fetching on Valid Paths
**Learning:** Sequential async lookups (like \`getRoutesMaps\` and \`getPrasaranaBuses\`) compound latency linearly. However, grouping ALL fetches (like \`getRealtimeVehicles\`, \`getAllTrips\`, \`getAllShapes\`) into a single \`Promise.all\` block before validating parameters (e.g. checking if \`route\` exists) causes unnecessary database/KV reads for invalid requests (like 404s), wasting I/O resources on error paths.
**Action:** When migrating sequential \`await\`s to concurrent \`Promise.all\` blocks in endpoints, split the requests into logical phases. Fetch the minimal data required for validation in the first \`Promise.all\`, perform the validation (early return on 404), and fetch the remaining heavy data in a second \`Promise.all\` block to preserve fast/cheap error paths while maximizing concurrency on the happy path.

## 2024-08-05 - Bounding Box Pre-filtering outside nested loops
**Learning:** In nested loops dealing with geographic data (e.g., checking every \`stop\` against every \`vehicle\`), applying a bounding box filter inside the inner loop is better than raw Haversine, but still requires evaluating thousands of out-of-bounds items iteratively.
**Action:** When finding items within a radius of a central point across nested relationships (e.g. stops and vehicles), compute a combined outer bounding box (\`searchRadius + innerRadius\`) and pre-filter the secondary dataset (vehicles) *outside* the outer loop. This changes the execution from $O(S \\times V)$ to $O(V + S \\times V_{nearby})$, dropping execution times drastically (e.g., from ~360ms to ~38ms).

## 2026-07-28 - [Refactor] 🧹 Extracted helper functions in sampling.ts
**Learning:** Functions doing complex DB operations combined with in-memory transformations can quickly become unwieldy (like \`aggregateTravelTimes\`). Extracting the distinct logical steps (fetching, grouping, transforming, upserting) into smaller, exported helper functions makes the main function a readable orchestrator.
**Action:** Used \`sed\` or node string replacement via patch file to carefully extract logical blocks while preserving exactly the same logic and tests.`;

if (!content.includes(search)) {
  console.error("Search string not found!");
  process.exit(1);
}

content = content.replace(search, replace);
fs.writeFileSync('.jules/bolt.md', content);
console.log("Resolved conflicts in .jules/bolt.md!");
