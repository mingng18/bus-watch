## 2024-05-31 - Missing Authentication on Administrative Endpoints
**Vulnerability:** Administrative/ops endpoints (`/refresh` and `/rail/ingest`) were unprotected and "protected by obscurity".
**Learning:** Endpoints that trigger expensive, state-changing operations should never rely solely on obscurity for protection, even in MVPs.
**Prevention:** Always add basic authentication (e.g., Bearer token checked against an environment variable) to admin/ops routes by default.
