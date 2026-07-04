## 2024-06-14 - Add accessibility label to icon-only button
**Learning:** In SwiftUI, icon-only toolbar buttons using `Image(systemName:)` do not automatically receive an accessible label and must be explicitly tagged with `.accessibilityLabel()`.
**Action:** Always add `.accessibilityLabel` to icon-only buttons to ensure VoiceOver users can understand their purpose.
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
## 2024-06-29 - Replace generic static text with ProgressView
**Learning:** In SwiftUI, replace generic `Text('Loading...')` placeholders with `ProgressView('Loading...')` to provide standardized, native visual feedback for asynchronous loading states. This makes it immediately obvious to users that the app is actively loading data and automatically provides appropriate accessibility traits.
**Action:** Always use `ProgressView` instead of static `Text` for loading states to improve user feedback and accessibility.
## 2024-07-04 - watchOS Dead Button Fallback
**Learning:** `UIApplication.openSettingsURLString` is not available on watchOS, leading to silent, unresponsive "Open Settings" buttons if unconditionally rendered.
**Action:** Use platform guards (`#if canImport(UIKit) && !os(watchOS)`) and explicitly render a fallback text instruction (`#elseif os(watchOS)`) explaining how the user can enable settings manually on watchOS, instead of just removing the button or leaving it dead.
## 2024-07-20 - Avoid dead buttons on watchOS for unsupported URLs
**Learning:** `UIApplication.openSettingsURLString` is not available on watchOS. Avoid wrapping unsupported deep-links in `#if !os(watchOS)` blocks on watchOS-first UI elements, as this leaves dead, unresponsive buttons.
**Action:** Always provide explicit text instructions (e.g., 'Enable in Watch Settings') inside `#if os(watchOS)` when dealing with unsupported features on watchOS instead of a button that does nothing.
