## 2025-06-02 - Fix Information Exposure in Backend Route
**Learning:** Returning unhandled database exceptions via API responses (`err?.message || String(err)`) exposes internal DB structure and potential query failures.
**Action:** Always log exceptions server-side with `console.error` and return a generic, static message to the client (e.g., "Failed to ingest rail timetables") in `catch` blocks.
