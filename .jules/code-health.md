## 2024-05-18 - [Move klHour to time-kl.ts to clean up imports]
**Learning:** Moving locally scoped helper functions which rely on other utility functions (like `toKlLocal` to `klHour`) into the central utility file where the dependencies exist, helps avoid unused imports on exports, and cleans up the code architecture.
**Action:** Relocated `klHour` to `time-kl.ts` and simplified the imports in `nearby.ts`.
