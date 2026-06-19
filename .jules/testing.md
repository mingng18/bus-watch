## 2024-06-19 - Testing Prasarana Buses
**Learning:** Adding test coverage for Prasarana nearby bus logic ensures that edge cases like fallback speed calculation (speed <= 0), route code normalization, and specific trip_rev_kind values are explicitly verified. It requires passing mock PrasaranaBus entities and Route/Trip entities to test the sorting and filtering correctly. Testing uncovered that `routeShortName` resolution depends properly on the map setup within the module.
**Action:** Implemented test cases for `findNearbyPrasaranaBuses` within `backend/test/nearby.test.ts`.
## 2024-06-19 - Extracted parsing logic in fetchAndParseAgency
**Learning:** Refactored a monolithic gtfs parsing function into independent helper functions (`parseStops`, `parseRoutes`, `parseTrips`, `parseTripStops`) to improve code health without changing functionality.
**Action:** Created dedicated pure-ish functions that accept raw extracted arrays and map directly to structured objects, minimizing side-effects inside the main data-fetching control flow.
