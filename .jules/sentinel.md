## 2024-06-01 - Security by Obscurity in Ops Endpoints
**Vulnerability:** The `/rail/ingest` endpoint and `/refresh` endpoint were left completely unauthenticated, relying on the fact that their URLs were unknown (security by obscurity).
**Learning:** Ops and manual trigger endpoints in production environments are often found via fuzzing or leaked in logs/code. Relying on obscurity is a critical vulnerability.
**Prevention:** Always require authentication (e.g. an admin token) for any endpoint that triggers data ingest, refresh, or significant processing, even if it's "just for MVP" or internal testing. Fail closed if the token is misconfigured.
