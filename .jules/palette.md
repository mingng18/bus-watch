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
## 2024-08-01 - Prefer Label for icon-only buttons
**Learning:** In SwiftUI, icon-only toolbar buttons using `Image(systemName:)` require an explicit `.accessibilityLabel()`. However, using a `Label` with `.labelStyle(.iconOnly)` automatically provides the label text to VoiceOver, making a manual accessibility label redundant and reducing boilerplate.
**Action:** Always use `Label("Text", systemImage: "icon").labelStyle(.iconOnly)` for icon-only buttons instead of manually adding accessibility labels to Images to improve code consistency and automatic accessibility.
## 2025-01-20 - Add explicit accessibility header traits
**Learning:** In SwiftUI, large bold text indicating the title or heading of a view isn't automatically recognized as a heading by VoiceOver. Screen reader users often rely on the rotor to navigate quickly between headings, and failing to mark main titles as headers degrades their navigation experience.
**Action:** Always append `.accessibilityAddTraits(.isHeader)` to main `.font(.headline)` or title texts that serve as the heading for a view or section.
## 2024-05-24 - Dynamic Text Transitions and Irrelevant State Reduction
**Learning:** Strikethroughs combined with color muting effectively reduce cognitive load for obsolete list items (like passed stops). SwiftUIs `.contentTransition(.numericText())` is a zero-effort way to make countdowns and remaining counts feel polished and delightful without custom animation logic.
**Action:** Use `.strikethrough()` with muted colors for expired data, and default to `.contentTransition(.numericText())` for any dynamic countdowns or metric texts.
## 2025-01-22 - Smooth full strings with dynamic numbers
**Learning:** In SwiftUI, `.contentTransition(.numericText())` smoothly animates changes even when the `Text` contains full sentences or formatted strings where only a numeric component changes (like "Titiwangsa → 5 min" or "120m").
**Action:** Apply `.contentTransition(.numericText())` along with `.animation` to any dynamic string displaying numeric counts or distances.
## 2025-01-22 - Replace typographical symbols for VoiceOver
**Learning:** VoiceOver interprets typographical symbols literally (e.g. reading "→" as "Right arrow"), which can break the natural flow of spoken destination text.
**Action:** Always provide an explicit `.accessibilityLabel` (e.g. "Towards Destination") for views containing typographical symbols meant to convey direction or intent.

## 2025-01-22 - Collapse icon-heavy button labels for VoiceOver
**Learning:** In SwiftUI, VoiceOver will read the individual components of complex `Button` labels containing multiple elements like icons, text, and chevrons as disconnected fragments, significantly degrading the screen reader experience.
**Action:** Use `.accessibilityElement(children: .ignore)` on the `Button` and provide a single cohesive phrase as an `.accessibilityLabel` to describe the button's purpose and state accurately.
## 2025-01-22 - Add semantic meaning to typographical symbols
**Learning:** VoiceOver interprets typographical symbols literally (e.g. reading '→' as 'Right arrow').
**Action:** In SwiftUI, apply an explicit `.accessibilityLabel` to provide the semantic meaning (e.g., 'Towards [Destination]') when using these symbols for direction or intent.
