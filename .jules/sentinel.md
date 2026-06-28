## 2024-06-14 - Hono Dynamic CORS Origin Configuration
**Vulnerability:** Overly permissive wildcard CORS configuration (`app.use('*', cors())`).
**Learning:** In Hono backend setups, standard CORS middleware invocation configures a static wildcard origin. When dynamic origin checking (e.g., matching against a configured `FRONTEND_URL` environment variable) is required, the `cors` middleware must be configured using its origin callback `cors({ origin: (origin, c) => c.env.FRONTEND_URL || '*' })` rather than wrapping the `cors` initialization within a custom middleware handler (`app.use('*', (c, next) => cors(...)(c, next))`), which performs poorly.
**Prevention:** When configuring CORS with variable parameters dependent on the request context `c`, exclusively use the dynamic callback syntax built into Hono's `cors` plugin.
## 2024-06-20 - [Fix DoS via unbound radius parameter]
**Vulnerability:** The /nearby and /routes endpoints allowed unbounded radius parameter values, triggering large spatial queries and leading to DoS.
**Learning:** Always bound spatial query parameters.
**Prevention:** Clamp radius queries and enforce maximum allowable limits.
## 2025-02-27 - Fix overly permissive CORS policy fallback
**Vulnerability:** The CORS policy in Hono used `c.env.FRONTEND_URL || ''` as its fallback origin. This resulted in an overly permissive configuration that could bypass cross-origin restrictions, opening the application up to potential unauthorized data access or CSRF-like attacks.
**Learning:** Returning an empty string in Hono's `cors` middleware origin configuration is not a secure fallback, as it may be loosely interpreted or lead to overly permissive behavior, and lacks a safe default.
**Prevention:** Always provide a secure, specific fallback origin (such as the local development URL, e.g., `'http://localhost:8081'`) when configuring dynamic CORS origins that depend on optional environment variables.
## 2025-02-27 - Fix overly permissive CORS policy fallback
**Vulnerability:** The CORS policy in Hono used `c.env.FRONTEND_URL || ''` as its fallback origin. This resulted in an overly permissive configuration that could bypass cross-origin restrictions, opening the application up to potential unauthorized data access or CSRF-like attacks.
**Learning:** Returning an empty string in Hono's `cors` middleware origin configuration is not a secure fallback, as it may be loosely interpreted or lead to overly permissive behavior, and lacks a safe default.
**Prevention:** Always provide a secure, specific fallback origin (such as the local development URL, e.g., `'http://localhost:8081'`) when configuring dynamic CORS origins that depend on optional environment variables.
## 2024-12-10 - Unbounded Integer and String Length Inputs in Multiple Endpoints
**Vulnerability:** Several API endpoints (`/station/:stopId/schedule/toward`, `/rail/schedule`, `/rail/stops`) were missing bounds checking on integer and string length inputs. For example, `limit` and `window` parameters could be parsed as unbounded integers, and `q` search query could be an excessively long string. This left the application vulnerable to Denial of Service (DoS) attacks via resource exhaustion.
**Learning:** Security fixes applied to one endpoint (like the DoS fix applied to `/alerts`) can easily be missed in other similar endpoints if the codebase isn't audited comprehensively. Unbounded resource queries are a common pattern in unvalidated inputs.
**Prevention:** Always apply bounds checking and clamp parsed integer inputs (e.g., `parseInt(req.query('limit'), 10)`) to strict maximums. Validate input string lengths before passing them to expensive operations (like database queries). Whenever fixing a security issue in one location, proactively search the codebase for similar patterns.
## 2025-02-27 - Unprotected fetch timeout in serverless backend
**Vulnerability:** External `fetch` requests in serverless edge environments (like Cloudflare Workers) lacked timeout controls. An unresponsive external server would cause the worker invocation to hang until the platform forcibly killed it, leading to resource exhaustion, elevated error rates, and potential denial-of-service (DoS) from accumulated stalled requests.
**Learning:** Default `fetch` behavior doesn't enforce strict timeouts. In serverless environments, hanging connections can quickly consume concurrency limits.
**Prevention:** Always use `AbortSignal.timeout(ms)` with a sensible limit when calling external APIs, and wrap the call in a `try...catch` block to handle the `TimeoutError` cleanly.
