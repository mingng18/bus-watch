# BusWatch release validation — 21 October 2026

Validated the checkout after updating from `a5aeba9` to upstream `4b458058e510bf437c1acf3e23980845ad2353df` (171 commits). Validation fixes are prepared on `codex/validate-release-2026-10-21`.

## Existing work preserved

The complete original tracked and untracked state is saved in the Git stash named `codex pre-update 2026-10-21`, object `0bd6514df7c39279160287275143418af0febba8`. Keep this stash until the original work has been reviewed.

- Carried forward the optional historical-ETA failure fallback and its regression test.
- Merged the production API URL assertion into the upstream API client tests. The production URL and generated test Info.plist setting were already present upstream.
- Restored personal Xcode workspace and scheme preferences. The older generated project, complication scheme edits, and Xcode Cloud manifest remain recoverable in the stash; the updated project uses its current XcodeGen configuration.

## Fixes during validation

- Updated two stale test call sites to construct the current loading state with its message.
- Made APIClient initialization available within the module, preserving the default shared client while allowing existing tests to inject URLSession.
- Replaced an invalid-URL fixture that Foundation now automatically percent-encodes with a genuinely malformed host.
- Injected the API client into ContextEngine with the existing shared client as the default. State tests now use an explicitly mocked session and observe state transitions instead of sleeping for 100 ms.
- Reproduced a trip-transition failure: observers received the on-bus state before auto-refresh was armed. Timer setup now happens on the main run loop before publishing that state. The transition regression failed before this fix and passed afterward.
- Unified container, watch app, and complication version/build settings at 1.0 (5), removed duplicate configuration entries, regenerated the project, and added a shared BusWatch test scheme. Regeneration also includes APIClientTests and NearbyResponseTests, which the checked-in project had omitted.

## Results

| Check | Result |
|---|---|
| Backend `pnpm test` | 193 tests passed across 23 files |
| Backend `pnpm exec tsc --noEmit` | Passed |
| Watch `xcodebuild test`, shared BusWatch scheme | 112 tests passed, zero failures |
| Simulator | Apple Watch Series 11 (46 mm), watchOS 27.0 |
| Brand asset validator | Passed |
| App Store scheme, Release archive | Succeeded for device SDKs |
| Archive signatures, `codesign --verify --deep --strict` | Passed |
| Embedded bundle version inspection | All three bundles are 1.0 (5) |
| Provisioning inspection | Apple Development; profiles expire 9 July 2027 |
| Live Simulator smoke check | Launched at simulated KL Sentral coordinates; production API data rendered bus markers, stop markers, and current-location dot on the map |
| `git diff --check` | Passed |

The archive produced the standard warning that App Intents metadata extraction was skipped because the app does not link AppIntents.framework. It did not prevent archiving.

## Artifacts

- Signed development archive: `/Users/ming/.codex/visualizations/2026/10/21/01a15ed2-e800-7b43-ae00-1e1a713f9850/BusWatch-validated.xcarchive`
- Live screenshot: `/Users/ming/.codex/visualizations/2026/10/21/01a15ed2-e800-7b43-ae00-1e1a713f9850/buswatch-live-check.png`
- Full watch test result: `/tmp/bus-watch-validated-tests.xcresult`
- Watch test log: `/tmp/bus-watch-validated-tests.log`
- Release archive log: `/tmp/bus-watch-validated-archive.log`

## Remaining release checks

- Physical Watch testing remains unverified: the registered Watch was offline. Simulator checks do not establish real-device GPS, battery behavior, or background refresh reliability.
- The archive is development-signed. Distribution export, App Store validation, and TestFlight upload were not performed.
- Build 5 was retained from the existing release configuration. Confirm the latest accepted App Store Connect build number before preparing another upload.
- No backend deployment or remote database mutation was performed. The live smoke check validates the responding production service, not the deployment of the local fallback fix.

## Reproduce

### PR consolidation follow-up

The subsequent consolidation in PR #511 passed 207 backend tests, TypeScript checks, and 116 watch tests. All five migrations applied to a fresh SQLite schema, and retention cleanup used the new timestamp index. A new device Release archive succeeded and its development signatures verified. The updated archive is saved at `/Users/ming/.codex/visualizations/2026/10/21/01a15ed2-e800-7b43-ae00-1e1a713f9850/BusWatch-consolidated.xcarchive`; test results and logs are `/tmp/bus-watch-consolidation-tests.xcresult`, `/tmp/bus-watch-consolidation-tests.log`, and `/tmp/bus-watch-consolidation-archive.log`.

The original live Simulator smoke check above preceded consolidation. The retained native changes affect empty-state alignment and home/favorite labels; the live-map implementation is unchanged. See the [backlog decision report](../maintenance/pr-consolidation-2026-10-21.md) for the selected changes and retained proposals.

### Commands

From `backend/`, install using `pnpm install --frozen-lockfile`, then run `pnpm test` and `pnpm exec tsc --noEmit`.

From `watch-app/`, run `xcodegen generate`, then:

```sh
xcodebuild -project BusWatch.xcodeproj -scheme BusWatch \
  -destination 'platform=watchOS Simulator,name=Apple Watch Series 11 (46mm),OS=27.0' \
  -parallel-testing-enabled NO test CODE_SIGNING_ALLOWED=NO

xcodebuild -project BusWatch.xcodeproj -scheme 'BusWatch AppStore' \
  -destination 'generic/platform=iOS' \
  -archivePath /tmp/BusWatch-release.xcarchive archive
```
