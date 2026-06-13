## 2024-06-13 - Authentication Timing Attacks in Hono
**Vulnerability:** Timing attacks against manual string comparisons of authentication tokens (`ADMIN_TOKEN`).
**Learning:** In Hono/Cloudflare Workers environments, standard `crypto.subtle.timingSafeEqual` is not directly available and basic string comparisons (`===` or `!==`) can be susceptible to timing attacks, allowing an attacker to deduce the token.
**Prevention:** Import and use `timingSafeEqual` from `hono/utils/buffer`. Ensure inputs are strictly strings, as passing `undefined` or `null` will throw errors.
