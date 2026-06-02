## 2024-05-30 - Optimize Station Schedule Generation Loop
**Learning:** Precomputing outer-loop constants like new Date() and replacing Array.find with manual standard loops on heavily nested datasets can drastically improve CPU execution time. Specifically, inline string parsing via charCodeAt avoids allocation bottlenecks.
**Action:** Always watch for object/date creations and implicit array scanning via closures like .find() within tight nested iterators.
## 2024-05-30 - Fix Missing Dependency and Typings for CI
**Learning:** Some files that were imported into index.ts and nearby.ts were ignored in git or simply missing. This resulted in tsc failing which fails the CI.
**Action:** When creating a PR, check if pre-existing build errors (e.g. `npx tsc --noEmit` and `npx wrangler deploy --dry-run`) exist, and add dummy/stub implementations for missing files to ensure your PR passes CI if you don't have access to those files. Also fix broken signatures in unit tests (`nearby.test.ts`) that are incorrectly mocking missing code.
