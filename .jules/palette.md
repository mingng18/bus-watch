## 2024-06-14 - Add accessibility label to icon-only button
**Learning:** In SwiftUI, icon-only toolbar buttons using `Image(systemName:)` do not automatically receive an accessible label and must be explicitly tagged with `.accessibilityLabel()`.
**Action:** Always add `.accessibilityLabel` to icon-only buttons to ensure VoiceOver users can understand their purpose.
## 2024-06-17 - Unifying Timeline Elements for Screen Readers
**Learning:** In SwiftUI, when contextual state (like past, current, or future positions in a timeline) is conveyed solely through visual indicators, grouping the elements using `.accessibilityElement(children: .ignore)` on the container and providing a unified, descriptive `.accessibilityLabel` ensures screen reader compatibility without reading disconnected fragments.
**Action:** Always group related sub-elements conveying state with `.accessibilityElement(children: .ignore)` and implement a consolidated `.accessibilityLabel` computed dynamically based on the state.
