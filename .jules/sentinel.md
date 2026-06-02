## 2025-02-18 - Input Validation on Coordinates
**Learning:** Always validate parsed numbers, including coordinates (`lat`, `lon`), against their valid domains (e.g., bounds [-90, 90] and [-180, 180]) to prevent NaN propagation and unexpected out-of-bounds behavior.
**Action:** When working on API routes parsing coordinates from query parameters, explicitly add `Number.isNaN(val)` and valid range boundary checks.
