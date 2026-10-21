# BusWatch PR consolidation — 21 October 2026

Canonical review: [PR #511](https://github.com/mingng18/bus-watch/pull/511). Reviewed all 103 original open PRs against master `4b458058e510bf437c1acf3e23980845ad2353df`. The follow-up reviewed the 12 retained proposals against canonical head `150e57156d41d5d221305c0c31f28a9096ce5923`. Source heads were refreshed and unchanged. Titles were not treated as proof of current changes.

## Final decisions

| Disposition | Count | Action |
|---|---:|---|
| Selected changes consolidated | 21 | Useful implementation or tests carried into #511 |
| Already represented on master | 58 | Superseded |
| Declined residual changes | 17 | Specific rationale recorded per PR |
| Competing proposals | 7 | Resolved through the selected #326 or #349 approach |

The first round closed 91 source PRs. The remaining 12 reviews are complete and prepared for closure after publishing the validated changes. The JSON ledger records current remote outcomes and preserves the first-round decisions and verification.

## Included changes

- Nearby feed requests run concurrently; retention cleanup has a timestamp-only index (#320, #339).
- Tests cover ingestion failure, passage ordering/outliers, ETA confidence, friendly errors, and location authorization (#314, #323, #378, #380, #340, selected #348).
- Empty departure messages align over multiple lines; home/favorite indicators avoid duplication (#383, #422, #478).
- Shared KV loading and snapshot-derived route, stop, trip, and canonical-sequence indexes preserve duplicate-selection rules and refresh together (#316, #349, #352, #388).
- Nearby and sampling helpers retain spatial filtering, arrival ordering/caps, bucketing, bounded D1 batches, and failure propagation (#326, #344).
- Error-screen Retry refetches while stationary; error pull-to-refresh and empty-alert refresh behavior are retained (#387, #402).
- API framing protection is explicit; admin responses remain uncacheable (#408).
- Parser compatibility tests are retained from #451. All three XML rewrites were declined after reproducing Unicode offset corruption (#409, #451, #481).

Existing release feature flags remain intact. No backend deployment or production migration was performed.

## Follow-up decisions for the remaining 12

| PR | Disposition | Review and adaptation |
|---|---|---|
| [#316](https://github.com/mingng18/bus-watch/pull/316) | Selected changes | Reused route indexes for trip progress in kv.ts. Added an explicit lastById index to preserve its historical last-duplicate selection; nearby retains first-duplicate selection. Endpoint regression verifies the route and repeated-request cache reuse. |
| [#326](https://github.com/mingng18/bus-watch/pull/326) | Selected changes | Ported the nearby stop filtering, live bus arrivals, and scheduled arrivals helpers while retaining both spatial prefilters, entity maps, arrival order, route deduplication, and the three-arrival cap. Existing and added behavior tests pass. |
| [#344](https://github.com/mingng18/bus-watch/pull/344) | Selected changes | Split sampling aggregation into private read, group, detect, and upsert helpers. Preserved finite-row filtering, full route IDs containing pipes, outlier and time-bucket behavior, prepared-statement reuse, 100-statement batches, five-batch concurrency, and failure propagation. A 502-route regression exercises the full pipeline. |
| [#349](https://github.com/mingng18/bus-watch/pull/349) | Selected changes | Added a snapshot-derived stop index to both station handlers and optional map parameters to their schedule functions. The map keeps the first duplicate, matching the original Array.find behavior. Tests cover parity, missing stops, source expiry, and explicit invalidation. |
| [#352](https://github.com/mingng18/bus-watch/pull/352) | Selected changes | Extracted KV and transit-data loading into kv.ts, retaining the pure mergeBusRoutes export and current network fallbacks. Isolated caches per KV binding, deduplicated concurrent reads, and tied derived indexes to their exact source snapshots. Static ingestion invalidates local caches after writes. Existing endpoint and new cache tests pass. |
| [#387](https://github.com/mingng18/bus-watch/pull/387) | Selected changes | The remaining change was the main error screen, not AlertsView. Ported its List and pull-to-refresh layout, then fixed Retry to explicitly refetch using the latest location. Reproduced the stationary failure before fixing it; watch tests verify recovery, no-location restart, and restricted access. |
| [#388](https://github.com/mingng18/bus-watch/pull/388) | Selected changes | Reused typed canonical stop sequences for ETA requests and scheduled aggregation. Cache keys are the exact trip and trip-stop snapshots, rather than a separate global TTL promise. Tests cover concurrent reuse, invalidation, and retry after a transformation throws. |
| [#402](https://github.com/mingng18/bus-watch/pull/402) | Selected changes | Pull-to-refresh and refresh-state preservation already exist on master. Ported the only remaining useful change: the empty-alert Refresh button uses load(isRefresh: true), keeping its current content visible while fetching. The service-alert feature flag is unchanged. |
| [#408](https://github.com/mingng18/bus-watch/pull/408) | Selected changes | Admin no-store was already present. Added the remaining useful framing policy: CSP frame-ancestors none and X-Frame-Options DENY. Retained existing nosniff and no-store behavior, verified on actual responses. Omitted upgrade-insecure-requests because the JSON API has no subresources to upgrade. |
| [#409](https://github.com/mingng18/bus-watch/pull/409) | Declined rewrite | Declined the parser rewrite. A differential harness reproduced offset corruption in this immutable head: lowercasing text containing U+0130 expands its length, so offsets slice the original URL and lastmod incorrectly. Retained the existing bounded block scanner and added Unicode/boundary regression coverage in #511. |
| [#451](https://github.com/mingng18/bus-watch/pull/451) | Selected changes | Carried forward the URL-attribute compatibility test and expanded it with mixed-case tags, namespaced image locations, Unicode offsets, and cross-block isolation. Declined the production parser rewrite because its lowercased-document offsets corrupt URL/date fields after U+0130, reproduced against this head. |
| [#481](https://github.com/mingng18/bus-watch/pull/481) | Declined rewrite | Declined the alternate indexOf parser. It shares the reproduced Unicode-offset corruption with #409 and #451 and adds a full-document lowercase allocation. Retained the bounded current parser with compatibility regressions instead of publishing a behavior-changing optimization. |

## Parser reproduction

All three candidate implementations calculate positions in `xml.toLowerCase()` and apply them to the original XML. Given `<!-- İstanbul -->` before a URL entry, U+0130 becomes two code points when lowercased. Each candidate extracts `ttps://.../<` and `026-...<` instead of the exact URL and date. The existing scanner preserves both fields. Committed tests cover this case, URL attributes, mixed-case tags, namespaced image locations, and cross-block boundaries.

The earlier ledger description for #304 incorrectly inferred parser usage from an unused import. It is corrected: the current parser uses a bounded URL-block scanner.

## Validation

223 backend tests across 24 files and TypeScript checks passed. All 119 watchOS Simulator tests passed. The stationary Retry regression failed before the fix and passed afterward; additional cases cover missing location and restricted access. A 502-route sampling test checks full pipe-containing route IDs, finite-row filtering, 100-statement batches, and five-batch concurrency. Cache tests cover per-binding isolation, concurrent reuse, duplicate precedence, expiry/invalidation, and transformation failure recovery.

A device Release archive succeeded, development signatures passed deep/strict verification using the system trust store, and brand assets passed validation. The first round's fresh SQLite migration and timestamp-index checks remain applicable; migrations are unchanged in this follow-up. Physical Watch testing, distribution export, and TestFlight validation remain release checks. Native gesture interactions were compiled; automated watch tests verify the engine behavior rather than physical pull gestures.

See the [release validation report](../validation/2026-10-21-release-check.md) and [per-PR JSON ledger](pr-consolidation-2026-10-21.json).
