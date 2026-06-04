## 2025-06-04 - Unauthenticated Admin Endpoints

**Vulnerability:** Critical operational endpoints (`/refresh` and `/rail/ingest`) were exposed without authentication, protected only by "obscurity" according to comments.
**Learning:** MVP assumptions often lead to endpoints being left publicly accessible with the intention to secure them "later". These endpoints could be abused to cause denial of service via CPU exhaustion (frequent static data refreshes) or corrupt application state.
**Prevention:** Always implement authentication on administrative endpoints, even in MVPs. Apply the fail-closed principle by denying access if an `ADMIN_TOKEN` is missing or mismatched. Use standard `Authorization: Bearer <token>` headers to secure these endpoints.
