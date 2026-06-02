## 2024-06-02 - Avoid re-calculating O(N) array operations in view rendering
**Learning:** SwiftUI body properties can be evaluated frequently. Doing array filtering or mapping inside the view body (`progress.stops.filter { ... }.count`) results in unnecessary CPU work on every render pass.
**Action:** Pre-calculate the result during JSON decoding or model initialization, storing it as a `let` property on the model struct so the view can do an O(1) property lookup instead.
