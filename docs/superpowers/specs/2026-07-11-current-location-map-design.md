# Current Location on Nearby Map

**Date:** 2026-07-11
**Status:** Approved default design; pending implementation

## Goal

Show the rider’s current Watch location on BusWatch’s nearby live-bus map.

## Design

- Add MapKit’s native `UserAnnotation()` to `NearbyBusMapView`.
- Keep existing orange live-bus markers and small white/blue stop markers unchanged.
- Preserve the current bus-and-stop camera fitting, pan, and zoom behavior. Do not continuously recenter on the rider because that would fight manual panning and could push nearby buses offscreen.
- Let MapKit hide the user annotation naturally when location permission or a valid location is unavailable.
- Reuse the app’s existing Core Location authorization flow; no new permission prompt, Info.plist key, backend call, or API-model change is required.

## Testability

Add a small pure `NearbyMapPresentation` value that states whether current location is included and produces the map accessibility label. `NearbyBusMapView` consumes that value to conditionally add `UserAnnotation()`. A regression test verifies the live-map presentation includes current location and announces it to VoiceOver.

## Accessibility

Update the map label from “Live bus map with N buses” to “Live bus map with N buses and your current location” when the user annotation is enabled.

## Verification

1. Add and run a focused regression test in red, then green.
2. Run all Watch tests serially.
3. Build the Watch app and install it on Ming’s simulator.
4. Grant location permission, set the simulated Kuala Lumpur location, launch BusWatch, and visually confirm the native blue user-location marker appears alongside bus and stop markers.
5. Commit directly on `master`, push to `origin/master`, and verify local/remote hashes match.
