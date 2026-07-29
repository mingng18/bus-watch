## 2025-02-18 - Unused Env parameter in fetchAlerts
**Learning:** `fetchAlerts` had an unused `env` argument while `Env` was imported only as a type parameter in `getCachedAlerts`. TypeScript flagged the unused import when it was imported as a value.
**Action:** Changed the import to `import type { Env }`, removed the unused `env` argument from `fetchAlerts`, and updated calls to `fetchAlerts` across the codebase and tests to reflect the new signature.

## YYYY-MM-DD - Refactoring Complex Functions
**Learning:** When refactoring a large monolithic function into smaller helpers (like `sampleBusPositions`), extract logical blocks (e.g., fetching initial state, preparing data for one source, preparing data for another source, and executing the combined data) into separate, named functions. This drastically improves readability and separates concerns.
**Action:** Split `sampleBusPositions` into `fetchLastPositions`, `prepareGtfsInsertStatements`, `preparePrasaranaInsertStatements`, and `executeBatchInserts`.
