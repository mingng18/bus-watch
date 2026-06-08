## 2024-06-08 - Mocking D1 Batch and Time Dependency

**Learning:** When testing logic that relies on `Date.now()` and batch database inserts (like `sampleBusPositions`), using `vi.useFakeTimers()` to freeze system time ensures deterministic tests. Additionally, the mock for Cloudflare D1 `env.DB` must support the `.batch()` method along with chained `.prepare().bind().all()` configurations to properly test batch execution thresholds and parameter binding.
**Action:** Always freeze system time via `vi.useFakeTimers()` before mocking `env.DB` in D1 tests, and ensure `.batch()` and chained methods are properly wired to `vi.fn()` for assertion checks.
