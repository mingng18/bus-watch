## 2025-06-09 - Insecure Admin Token Comparison
**Vulnerability:** Timing attack risk in admin token verification endpoint in Hono.
**Learning:** `timingSafeEqual` should be used instead of standard string equality (`===`) for sensitive tokens to prevent leaking information via timing measurements. In the Hono/Cloudflare Workers environment, standard `crypto.subtle.timingSafeEqual` is not directly available, but `timingSafeEqual` from `hono/utils/buffer` can be used. Note that this function is asynchronous and must be `await`ed.
**Prevention:** Always use constant-time comparison functions for passwords, auth tokens, API keys, and other secrets.
