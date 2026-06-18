## 2024-06-14 - Add accessibility label to icon-only button
**Learning:** In SwiftUI, icon-only toolbar buttons using `Image(systemName:)` do not automatically receive an accessible label and must be explicitly tagged with `.accessibilityLabel()`.
**Action:** Always add `.accessibilityLabel` to icon-only buttons to ensure VoiceOver users can understand their purpose.
## 2024-06-25 - Unified VoiceOver labels for contextual timelines
**Learning:** In SwiftUI, when contextual state (like past, current, or future positions in a timeline) is conveyed solely through visual indicators, VoiceOver reads these elements as disconnected fragments by default.
**Action:** Group the elements using `.accessibilityElement(children: .ignore)` on the container and provide a unified, descriptive `.accessibilityLabel` to ensure screen reader users get the full context (e.g., "KLCC, passed" instead of just "KLCC").
