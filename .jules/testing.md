## 2024-06-19 - Extracted parsing logic in fetchAndParseAgency
**Learning:** Refactored a monolithic gtfs parsing function into independent helper functions (`parseStops`, `parseRoutes`, `parseTrips`, `parseTripStops`) to improve code health without changing functionality.
**Action:** Created dedicated pure-ish functions that accept raw extracted arrays and map directly to structured objects, minimizing side-effects inside the main data-fetching control flow.
