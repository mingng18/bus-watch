## 2025-02-14 - Prevent Data Leakage in Error Logs
**Vulnerability:** Sensitive Data Leakage via Console Logs.
**Learning:** Logging the raw error object directly (e.g., `console.error('...', err)`) can inadvertently leak sensitive application state, internal configuration, or authorization tokens. Furthermore, in TypeScript, directly accessing properties on caught errors requires explicit typing (e.g., `catch (err: any)`) to avoid `TS2339`.
**Prevention:** Always sanitize error objects by extracting only non-sensitive details, such as `err?.message || 'Unknown error'`. Validate type safety of catch block assignments to ensure builds do not fail after security patches.
