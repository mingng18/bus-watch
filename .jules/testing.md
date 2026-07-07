## 2024-06-19 - Added test for database failure in aggregateTravelTimes
**Learning:** We can mock Cloudflare D1 query chain (e.g. `env.DB.prepare().bind().all()`) to throw an error by ensuring `all` rejects with `new Error()` and spying on `console.error` to ensure the fallback logic and error handlers act defensively.
**Action:** Implemented test ensuring `aggregateTravelTimes` safely catches errors reading from D1, returns early, and logs error using the `timingSafeEqual`-like isolation approach for D1 database failures.

## 2024-06-19 - Testing Prasarana Buses
**Learning:** Adding test coverage for Prasarana nearby bus logic ensures that edge cases like fallback speed calculation (speed <= 0), route code normalization, and specific trip_rev_kind values are explicitly verified. It requires passing mock PrasaranaBus entities and Route/Trip entities to test the sorting and filtering correctly. Testing uncovered that `routeShortName` resolution depends properly on the map setup within the module.
**Action:** Implemented test cases for `findNearbyPrasaranaBuses` within `backend/test/nearby.test.ts`.

## 2024-06-19 - Extracted parsing logic in fetchAndParseAgency
**Learning:** Refactored a monolithic gtfs parsing function into independent helper functions (`parseStops`, `parseRoutes`, `parseTrips`, `parseTripStops`) to improve code health without changing functionality.
**Action:** Created dedicated pure-ish functions that accept raw extracted arrays and map directly to structured objects, minimizing side-effects inside the main data-fetching control flow.

## 2024-06-19 - Testing Hono CORS Middlewares
**Learning:** In Hono, if the CORS middleware returns a wildcard `*`, it allows all domains. If it returns an empty string `''` or a specific non-matching domain for an unknown origin, it responds with that string in the `Access-Control-Allow-Origin` header, causing the browser to block the cross-origin request.
**Action:** Wrote `cors.test.ts` to assert that Hono's `cors` does not return `*` when `FRONTEND_URL` is undefined, protecting against wildcard fallback logic.
## 2024-06-19 - Testing Prasarana Buses
**Learning:** Adding test coverage for Prasarana nearby bus logic ensures that edge cases like fallback speed calculation (speed <= 0), route code normalization, and specific trip_rev_kind values are explicitly verified. It requires passing mock PrasaranaBus entities and Route/Trip entities to test the sorting and filtering correctly. Testing uncovered that `routeShortName` resolution depends properly on the map setup within the module.
**Action:** Implemented test cases for `findNearbyPrasaranaBuses` within `backend/test/nearby.test.ts`.
## 2024-06-19 - Extracted parsing logic in fetchAndParseAgency
**Learning:** Refactored a monolithic gtfs parsing function into independent helper functions (`parseStops`, `parseRoutes`, `parseTrips`, `parseTripStops`) to improve code health without changing functionality.
**Action:** Created dedicated pure-ish functions that accept raw extracted arrays and map directly to structured objects, minimizing side-effects inside the main data-fetching control flow.

## 2025-07-06 - Extract GTFS time parsing logic
**Action:** Refactored duplicated zero-allocation GTFS time parsing logic from multiple files into a shared, testable utility function in `time-kl.ts` to improve maintainability and readability.
## 2024-05-14 - Handle errors properly when extracting functions
**Learning:** When extracting code from a function that returns an expected error object upon failure (e.g., returning `{ inserted: number; error: string }` rather than throwing), ensure the try-catch block inside the main controller preserves this behavior. Directly bubbling up network failures into an un-handled union return can cause hidden ReferenceErrors or unexpected TypeErrors further down the execution path if destructuring doesn't handle failures correctly.
**Action:** When creating extracted helper functions, either design them to throw and be caught by the parent function's existing error handler, or explicitly handle and type the error return objects correctly. For this refactor, wrapping the helper calls in a try-catch and returning the error string in the expected object format resolved the issue and passed tests.
