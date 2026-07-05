## 2025-02-18 - Unused Env parameter in fetchAlerts
**Learning:** `fetchAlerts` had an unused `env` argument while `Env` was imported only as a type parameter in `getCachedAlerts`. TypeScript flagged the unused import when it was imported as a value.
**Action:** Changed the import to `import type { Env }`, removed the unused `env` argument from `fetchAlerts`, and updated calls to `fetchAlerts` across the codebase and tests to reflect the new signature.
## 2025-02-18 - Unused Alert export
**Learning:** The `Alert` interface in `backend/src/alerts.ts` was exported but wasn't being imported or utilized outside of that file, as it was only returned indirectly or not exposed strictly by module consumers relying purely on types rather than interface structures outside.
**Action:** Removed the `export` keyword from the `Alert` interface in `backend/src/alerts.ts`.
