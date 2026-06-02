## 2024-05-01 - Sentinel: Fail closed for optional auth tokens
**Learning:** For optional environment variables used for authentication (like `ADMIN_TOKEN`), checking for its presence and explicitly denying access (failing closed) if it is missing is critical to ensure endpoints aren't accidentally exposed if the token isn't configured in the environment.
**Action:** When implementing token-based authentication middlewares relying on environment variables, always handle the undefined case by returning a 401/403 rather than allowing the request to bypass checks.
