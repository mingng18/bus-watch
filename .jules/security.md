## 2024-06-19 - Fixed overly permissive CORS policy fallback
**Learning:** Returning a wildcard `*` fallback for CORS policies when environment variables (like `FRONTEND_URL`) are absent creates a severe vulnerability where an API allows cross-origin requests from any domain, bypassing Same-Origin Policy protections.
**Action:** Replaced the wildcard fallback with an empty string (`''`) in Hono's `cors` middleware origin configuration. This ensures undefined cross-origin requests are appropriately denied.
