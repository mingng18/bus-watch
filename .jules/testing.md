## 2024-06-19 - Testing Confidence Scoring Logic
**Learning:** Pure functions containing distinct conditional thresholds (like `confidenceFromSamples`) greatly benefit from exact boundary and sub-boundary numeric test inputs to confirm that internal ratios (e.g., `spreadSeconds / avgSeconds <= 0.25`) are computed and gated correctly.
**Action:** When adding testing for similar utility logic, supply exact numerical boundaries for logic ratios and edge cases (like zero) to prevent regressions on score calculation boundaries.
