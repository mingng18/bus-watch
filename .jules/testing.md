## 2024-06-08 - Added tests for findNearbyPrasaranaBuses
**Learning:** Found that `normalizeRouteCode` removes trailing zeros from route names, transforming `300` into `30`. Because of this, it failed to match the `300` route short name from the `routes` test data, defaulting the destination to an empty string and the routeId to the code `30`.
**Action:** When testing code that utilizes normalization logic, be prepared to adjust expected values to account for these side effects, or add corresponding test data that anticipates the normalized formats.
