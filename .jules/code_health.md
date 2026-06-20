## 2025-02-18 - Unused Env parameter in fetchAlerts
**Learning:** `fetchAlerts` had an unused `env` argument while `Env` was imported only as a type parameter in `getCachedAlerts`. TypeScript flagged the unused import when it was imported as a value.
**Action:** Changed the import to `import type { Env }`, removed the unused `env` argument from `fetchAlerts`, and updated calls to `fetchAlerts` across the codebase and tests to reflect the new signature.
