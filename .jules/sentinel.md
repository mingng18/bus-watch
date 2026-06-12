## 2024-06-07 - Secure Administrative Endpoints
**Vulnerability:** Missing authentication on administrative endpoints (`/refresh`, `/rail/ingest`), relying on "security by obscurity" for MVP. Additionally, `/rail/ingest` leaked internal error details in its catch block.
**Learning:** Even for MVPs, operational and administrative endpoints that trigger data ingestion or heavy background tasks must not rely on "security by obscurity." These endpoints can be discovered and abused to cause Denial of Service (DoS) or trigger unwanted state changes. Furthermore, returning raw error messages to the client exposes system internals.
**Prevention:** Always implement authentication (e.g., a Bearer token check via `ADMIN_TOKEN` environment variable) for operational endpoints. Employ a "fail closed" approach: if the auth configuration is missing or validation fails, deny access (401 Unauthorized). Sanitize error responses to avoid leaking internal stack traces or database errors.

## 2024-06-12 - Timing Attack Vulnerability in Token Validation
**Vulnerability:** Timing attacks on simple string comparisons for authentication tokens (`authHeader !== 'Bearer ' + c.env.ADMIN_TOKEN`).
**Learning:** Standard string comparisons (`===`, `!==`) fail fast, leaking length and character information based on comparison time, which can allow an attacker to guess the token over many requests.
**Prevention:** Use constant-time comparison functions like `timingSafeEqual` (available in `hono/utils/buffer` for Hono apps) for all authentication secrets, tokens, or passwords to ensure execution time does not depend on the input string length or characters. Note that this function is asynchronous and must be `await`ed.
