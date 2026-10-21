# BusWatch PR consolidation — 21 October 2026

Canonical review: [PR #511](https://github.com/mingng18/bus-watch/pull/511). Reviewed 103 original open PRs against master `4b458058e510bf437c1acf3e23980845ad2353df` using immutable head SHAs, patch comparisons, and three-way merge evidence. PR titles were not treated as proof of their current changes.

## Decisions

| Disposition | Count | Action |
|---|---:|---|
| Selected changes consolidated | 11 | Preserved in #511; source PRs closed as superseded |
| Already represented on master | 58 | Closed as superseded |
| Declined residual changes | 15 | Closed with a specific rationale |
| Competing proposals | 7 | Closed in favor of retained #326 or #349 |
| Distinct proposals retained | 12 | Keep open for focused review |

Verified outcome: all 91 planned source PRs are closed. GitHub now shows 13 open PRs: canonical #511 and the 12 retained proposals below. Each closure preserved the original description and added its specific reason plus the canonical reference. The JSON ledger records each reviewed head SHA, closure timestamp, and remote verification result.

## Included changes

- Nearby Prasarana data loads concurrently with the independent cached/GTFS inputs (#320).
- A timestamp-only index supports retention cleanup without requiring a route filter (#339).
- Regression coverage exercises ingestion failure, travel-time passage ordering and outliers, and ETA confidence (#314, #323, #378, #380).
- Watch coverage checks friendly errors and restricted/not-determined location authorization (#340, selected parts of #348). The unconditional stop-on-every-location-error change from #348 was omitted.
- Empty departure messages align across multiple lines, and home/favorite indicators are mutually exclusive (#383, #422, #478). Existing release feature flags remain intact.

## Validation

207 backend tests and TypeScript checks passed; 116 watchOS tests passed. A fresh SQLite database applied all five migrations and used `idx_bus_positions_timestamp` for retention cleanup. The App Store scheme produced a signed development archive. Physical Watch testing, distribution export, and TestFlight validation remain separate release checks.

The new migration is committed for a future deployment; it was not applied to production.

## Retained proposals

| PR | Scope needing separate review |
|---|---|
| [#316](https://github.com/mingng18/bus-watch/pull/316) | Retain route-map reuse proposal; verify duplicate-route precedence before replacing per-request maps. |
| [#326](https://github.com/mingng18/bus-watch/pull/326) | Retain one proposal for decomposing findNearbyStops; requires focused behavior-preservation review. |
| [#344](https://github.com/mingng18/bus-watch/pull/344) | Retain sampling aggregation helper refactor for separate structural review. |
| [#349](https://github.com/mingng18/bus-watch/pull/349) | Retain cached stop lookup proposal; duplicate-ID precedence and cache invalidation need explicit validation. |
| [#352](https://github.com/mingng18/bus-watch/pull/352) | Retain KV module extraction; moving shared caches and test mocks needs a dedicated review. |
| [#387](https://github.com/mingng18/bus-watch/pull/387) | Retain error-screen refresh/layout change for focused interaction review. |
| [#388](https://github.com/mingng18/bus-watch/pull/388) | Retain canonical-sequence cache proposal; rejected promises and invalidation need a dedicated review. |
| [#402](https://github.com/mingng18/bus-watch/pull/402) | Retain refresh-state behavior change in AlertsView for focused interaction review. |
| [#408](https://github.com/mingng18/bus-watch/pull/408) | Retain distinct header-hardening proposal; current head changes frame/CSP policy rather than the cache behavior in its title. |
| [#409](https://github.com/mingng18/bus-watch/pull/409) | Retain alternate XML optimization; compare allocation behavior and parser semantics with #451. |
| [#451](https://github.com/mingng18/bus-watch/pull/451) | Retain XML parser optimization and its tests for a focused parsing compatibility review. |
| [#481](https://github.com/mingng18/bus-watch/pull/481) | Retain alternate XML optimization; compare parsing semantics with #451 before choosing one implementation. |

Full evidence and per-PR decisions: [JSON ledger](pr-consolidation-2026-10-21.json).
