## 2024-05-25 - Bus progress timeline accessibility
**Learning:** Screen reader users lose critical contextual state (like past, current, and future positions) when it is conveyed only through visual indicators like color and icons in timeline views.
**Action:** Always combine the timeline elements into a single ignored element (`accessibilityElement(children: .ignore)`) and provide a unified, descriptive label (e.g. "Current stop: KLCC, arriving now") using `.accessibilityLabel`.
## 2024-06-19 - Combine contextual timeline visual states into unified accessibility labels
**Learning:** In SwiftUI, when contextual state (like past, current, or future positions in a timeline) is conveyed solely through visual indicators, VoiceOver riders get disconnected fragments (e.g. "Name... Time").
**Action:** Group the elements using `.accessibilityElement(children: .ignore)` on the container and provide a unified, descriptive `.accessibilityLabel` that translates the visual state into context (e.g. "Current stop: Name", "Passed stop: Name").
## 2024-06-20 - Add empty states for lists and collections
**Learning:** In SwiftUI, dynamically populated lists such as `ForEach` arrays will simply render as blank spaces without any feedback if the underlying array is empty. This can cause confusion as users might think the app is frozen or failed to load.
**Action:** Always provide explicit, helpful empty states using `if array.isEmpty` checks to communicate effectively that there is no data to display.
## 2024-06-21 - Fix VoiceOver truncation in .combine containers
**Learning:** Applying an explicit `.accessibilityLabel` to a container that uses `.accessibilityElement(children: .combine)` overrides the combined text, causing VoiceOver to omit the children's contents completely.
**Action:** When a combined label needs custom text (like severity prefixes), use `.accessibilityElement(children: .ignore)` and construct a unified `accessibilityLabel` string that includes all necessary details from the children to avoid data loss.
## 2024-06-30 - Replace dead deep-link buttons with text fallback on watchOS
**Learning:** `UIApplication.openSettingsURLString` is not available on watchOS. Wrapping unsupported deep-links in `#if !os(watchOS)` blocks on watchOS-first UI elements leaves dead, unresponsive buttons.
**Action:** Provide fallback text instructions (e.g., 'Enable in Watch Settings') instead of dead buttons when deep-links aren't supported.
