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
## 2025-07-06 - Extract GTFS time parsing logic
**Action:** Refactored duplicated zero-allocation GTFS time parsing logic from multiple files into a shared, testable utility function in `time-kl.ts` to improve maintainability and readability.

## 2024-07-06 - Update ContextEngine tests

**Action:** Renamed `MockURLProtocol` to `ContextEngineMockURLProtocol` to avoid namespace collisions. Updated both `project.yml` and `project.pbxproj` to add `GENERATE_INFOPLIST_FILE: YES` to the `BusWatchTests` target to fix the watchOS simulator code signing failure.

## 2025-07-06 - Extract GTFS time parsing logic
**Action:** Refactored duplicated zero-allocation GTFS time parsing logic from multiple files into a shared, testable utility function in `time-kl.ts` to improve maintainability and readability.
## 2024-07-06 - Test for getCachedAlerts KV read error fallback
**Action:** Added a `try/catch` block inside `getCachedAlerts` in `backend/src/alerts.ts` to correctly handle `KV.get` errors without crashing, and added a test case in `backend/test/alerts.test.ts` to mock `KV.get` to reject and verify the app fails over to fresh fetch data gracefully. This adheres to ensuring tests cover failure modes of dependencies like KV stores.
## 2024-07-06 - Mocking URLSession for Swift testing
**Learning:** When needing to mock `URLSession` for XCTest in Swift, modifying the client to allow dependency injection of `URLSession` and using a custom `URLProtocol` (like `MockURLProtocol`) provides an effective mechanism to intercept and mock network responses. Always use uniquely named mocks (like `APIClientMockURLProtocol`) to avoid global namespace collisions in the test target. When wiring a test in a project relying on `project.yml` as the source of truth, ensure the file or folder is mapped appropriately and ignore ephemeral files like `.pbxproj`.
**Action:** Modified `APIClient` private initializer to internal with a `session: URLSession` parameter defaulting to `.shared`, created `APIClientMockURLProtocol` to assert requests and provide stubbed JSON responses.
