# Current Location Map Marker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show MapKit’s native current-location marker on BusWatch’s nearby live-bus map.

**Architecture:** Add a tiny pure `NearbyMapPresentation` value for testable marker/accessibility configuration, then let `NearbyBusMapView` conditionally emit `UserAnnotation()`. Existing Core Location authorization, map camera fitting, bus markers, stop markers, and backend models remain unchanged.

**Tech Stack:** SwiftUI, MapKit, XCTest, watchOS Simulator, Xcode.

---

### Task 1: Add current-location presentation behavior with TDD

**Files:**
- Modify: `watch-app/BusWatchTests/FeatureFlagsAndMapModelTests.swift`
- Modify: `watch-app/BusWatch/Views/NearbyBusMapView.swift`

- [ ] **Step 1: Write the failing regression test**

Add before the closing brace of `FeatureFlagsAndMapModelTests`:

```swift
func testNearbyMapPresentationIncludesCurrentLocation() {
    let presentation = NearbyMapPresentation(busCount: 2)

    XCTAssertTrue(presentation.showsCurrentLocation)
    XCTAssertEqual(
        presentation.accessibilityLabel,
        "Live bus map with 2 buses and your current location"
    )
}
```

- [ ] **Step 2: Run the focused test and verify red**

Run:

```bash
cd watch-app
xcodebuild test \
  -project BusWatch.xcodeproj \
  -scheme BusWatch \
  -destination 'id=E6F65876-99B0-44B9-9191-547DEABD8419' \
  -only-testing:BusWatchTests/FeatureFlagsAndMapModelTests/testNearbyMapPresentationIncludesCurrentLocation \
  -parallel-testing-enabled NO \
  -maximum-parallel-testing-workers 1 \
  CODE_SIGNING_ALLOWED=NO \
  -quiet
```

Expected: FAIL because `NearbyMapPresentation` does not exist.

- [ ] **Step 3: Add minimal production behavior**

Add above `NearbyBusMapView` in `NearbyBusMapView.swift`:

```swift
struct NearbyMapPresentation: Equatable {
    let busCount: Int
    let showsCurrentLocation = true

    var accessibilityLabel: String {
        "Live bus map with \(busCount) buses and your current location"
    }
}
```

Add inside `NearbyBusMapView`:

```swift
private var presentation: NearbyMapPresentation {
    NearbyMapPresentation(busCount: response.busRoutes.count)
}
```

Add as the first content inside `Map(position:interactionModes:)`:

```swift
if presentation.showsCurrentLocation {
    UserAnnotation()
}
```

Replace the current hardcoded map accessibility label with:

```swift
.accessibilityLabel(presentation.accessibilityLabel)
```

- [ ] **Step 4: Run the focused test and verify green**

Run the exact focused command from Step 2.

Expected: PASS.

### Task 2: Verify and deliver

**Files:**
- Verify: `watch-app/BusWatch.xcodeproj`
- Verify: `watch-app/BusWatchTests/`

- [ ] **Step 1: Run all Watch tests serially**

Run:

```bash
cd watch-app
RESULT="/tmp/buswatch-user-location-tests-$$.xcresult"
xcodebuild test \
  -project BusWatch.xcodeproj \
  -scheme BusWatch \
  -destination 'id=E6F65876-99B0-44B9-9191-547DEABD8419' \
  -parallel-testing-enabled NO \
  -maximum-parallel-testing-workers 1 \
  -resultBundlePath "$RESULT" \
  CODE_SIGNING_ALLOWED=NO \
  -quiet
xcrun xcresulttool get test-results summary --path "$RESULT" --compact
```

Expected: 96 passed, 0 failed, 0 skipped.

- [ ] **Step 2: Validate and commit**

Run:

```bash
git diff --check
git add \
  watch-app/BusWatch/Views/NearbyBusMapView.swift \
  watch-app/BusWatchTests/FeatureFlagsAndMapModelTests.swift
git commit -m "feat(watch): show current location on nearby map"
```

- [ ] **Step 3: Push direct to master**

Run:

```bash
git pull --rebase origin master
git push origin master
LOCAL=$(git rev-parse master)
REMOTE=$(git ls-remote origin refs/heads/master | cut -f1)
test "$LOCAL" = "$REMOTE"
```

Expected: local and remote hashes match.

- [ ] **Step 4: Build, install, launch, and visually verify**

Run:

```bash
cd watch-app
UDID=E6F65876-99B0-44B9-9191-547DEABD8419
BUNDLE=com.nggihming.buswatch.watchkitapp
DERIVED=/tmp/buswatch-user-location-final
xcodebuild build \
  -project BusWatch.xcodeproj \
  -scheme BusWatch \
  -destination "id=$UDID" \
  -configuration Debug \
  -derivedDataPath "$DERIVED" \
  CODE_SIGNING_ALLOWED=NO \
  -quiet
xcrun simctl boot "$UDID" 2>/dev/null || true
xcrun simctl install "$UDID" "$DERIVED/Build/Products/Debug-watchsimulator/BusWatch.app"
xcrun simctl privacy "$UDID" grant location "$BUNDLE" || true
xcrun simctl location "$UDID" set '3.1478,101.6953'
xcrun simctl launch "$UDID" "$BUNDLE"
sleep 6
xcrun simctl io "$UDID" screenshot /tmp/buswatch-user-location-final.png
```

Expected: live-bus map shows native blue current-location marker alongside orange buses and stop dots; no error or permission alert.
