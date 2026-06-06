## 2025-02-14 - Missing Authentication on Administrative Endpoints
**Vulnerability:** Found administrative endpoints (`/refresh`, `/rail/ingest`) that triggered intensive background operations and database modifications but were completely unauthenticated or explicitly "protected by obscurity".
**Learning:** Development-time shortcuts for manual ops triggers often leak into production environments. When an expected environment variable secret like `ADMIN_TOKEN` is unconfigured, the application was implicitly allowing access by not having checks.
**Prevention:** Always implement 'fail closed' authentication checks on sensitive/administrative endpoints. If a required secret (e.g., `ADMIN_TOKEN`) is missing from the environment, default to denying access rather than bypassing the check.
