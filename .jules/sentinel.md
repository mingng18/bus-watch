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

## 2024-05-18 - Fix Suboptimal Timing Attack Mitigation
**Vulnerability:** Manual length checking and string padding used alongside `timingSafeEqual` introduces unnecessary complexity and potential side channels.
**Learning:** `hono/utils/buffer`'s `timingSafeEqual` securely handles strings of differing lengths by internally hashing them before comparison.
**Prevention:** Rely on the built-in properties of robust cryptographic comparison functions (like Hono's `timingSafeEqual`) instead of attempting manual length-matching workarounds, which can often inadvertently introduce new side channels or bugs.
## 2025-02-27 - Fix overly permissive CORS policy fallback (localhost)
**Vulnerability:** The CORS policy in Hono used a hardcoded local development URL (`'http://localhost:8081'`) as a fallback when `c.env.FRONTEND_URL` was undefined. This meant attackers could run a malicious site on `localhost:8081` to bypass CORS protections.
**Learning:** Hardcoding local development domains in production CORS middleware can expose the application to cross-origin attacks originating from users' own machines. A missing environment variable should degrade securely (i.e. to no access), rather than falling back to local development defaults.
**Prevention:** Always use securely restrictive fallbacks (like an empty string `''` or a specifically crafted blocked state) instead of development defaults when configuring dynamic CORS policies.
## 2025-02-14 - Fix timing attack vulnerability in authorization header comparison
**Vulnerability:** The codebase was directly passing user input to `timingSafeEqual` in authentication endpoints without first verifying the length against the expected token. While `timingSafeEqual` avoids early exit, internally it runs a loop based on `Math.max(a.length, b.length)`. Depending on the timing execution properties of string-based constant time checks in JS/V8 engines (and specific library implementations like hono/utils/buffer), large length discrepancies can lead to timing leaks or potential DoS via large strings.
**Learning:** `timingSafeEqual` is only perfectly safe if inputs have been pre-validated to be of the exact same length, preventing the attacker from gaining length-based timing information or exhausting resources.
**Prevention:** Always ensure inputs to `timingSafeEqual` are hashed first to guarantee they are the exact same length, or perform a simple `O(1)` length equality check (`input.length === expected.length`) before using any string-based `timingSafeEqual` function.
