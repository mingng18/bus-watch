## 2025-02-14 - Constant-Time String Comparison Vulnerability Fix
**Learning:** `timingSafeEqual` from `hono/utils/buffer` and other standard implementations (like Node's `crypto`) might short-circuit, fall back on internal hashing which could change, or throw an error if the two input strings are of different lengths. This leads to length-leaking timing vulnerabilities and failures when checking authentication headers.
**Action:** When implementing constant-time string comparisons, always guarantee the strings are equal length *before* calling `timingSafeEqual`. A safe technique is: if lengths differ, fallback to comparing the expected string to itself, and later fail the check due to length mismatch.

## 2024-06-19 - Fixed overly permissive CORS policy fallback
**Learning:** Returning a wildcard `*` fallback for CORS policies when environment variables (like `FRONTEND_URL`) are absent creates a severe vulnerability where an API allows cross-origin requests from any domain, bypassing Same-Origin Policy protections.
**Action:** Replaced the wildcard fallback with an empty string (`''`) in Hono's `cors` middleware origin configuration. This ensures undefined cross-origin requests are appropriately denied.
