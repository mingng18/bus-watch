## 2024-06-02 - Secure Administrative Endpoints
**Vulnerability:** The `/rail/ingest` and `/refresh` endpoints were intentionally unauthenticated ("protected by obscurity (no auth needed for MVP)"), allowing any unauthenticated user to trigger server-side operations on the infrastructure.
**Learning:** MVP architectural decisions sometimes leave sensitive operational endpoints exposed. The existing environment structure required updating `Env` with the `ADMIN_TOKEN`.
**Prevention:** Implement "fail closed" authentication using `ADMIN_TOKEN` during API development, strictly verifying `Authorization: Bearer <token>` and returning HTTP 401 Unauthorized for all unauthenticated attempts, rather than relying on security by obscurity.
