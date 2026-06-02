## 2024-02-28 - Concurrent Static Data Fetching
**Learning:** Sequential `await` in loops blocks execution and slows down background sync jobs. In this case, `fetchAndParseAgency` and KV puts were done one-by-one.
**Action:** Use `await Promise.allSettled(AGENCIES.map(async ...))` to process all arrays concurrently.
