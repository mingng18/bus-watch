## 2025-02-14 - Fix timing attack vulnerability in token authentication

**Vulnerability:** String comparison operators (`===` and `!==`) used to verify `ADMIN_TOKEN` were susceptible to timing attacks, allowing an attacker to determine the correct token character-by-character by measuring the time taken for the comparison to fail.

**Learning:** When comparing sensitive information like passwords, API keys, or security tokens, standard equality checks fail early. The time it takes to return false reveals how many initial characters match the secret string.

**Prevention:** Always use constant-time comparison algorithms like `crypto.subtle.timingSafeEqual` (or `timingSafeEqual` from `hono/utils/buffer` when working with Hono) for sensitive string comparisons, regardless of token length.
