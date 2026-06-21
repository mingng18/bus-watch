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
