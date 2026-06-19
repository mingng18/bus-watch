## 2024-06-19 - Testing Hono CORS Middlewares
**Learning:** In Hono, if the CORS middleware returns a wildcard `*`, it allows all domains. If it returns an empty string `''` or a specific non-matching domain for an unknown origin, it responds with that string in the `Access-Control-Allow-Origin` header, causing the browser to block the cross-origin request.
**Action:** Wrote `cors.test.ts` to assert that Hono's `cors` does not return `*` when `FRONTEND_URL` is undefined, protecting against wildcard fallback logic.
