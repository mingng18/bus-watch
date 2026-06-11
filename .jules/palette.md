## 2024-06-11 - SwiftUI Accessibility for Icons
**Learning:** In SwiftUI views, icon-only toolbar buttons using `Image(systemName:)` do not automatically receive an accessible label and must be explicitly tagged with `.accessibilityLabel()`. Decorative `Image(systemName:)` elements should use `.accessibilityHidden(true)` to prevent redundant screen reader announcements.
**Action:** Always add `.accessibilityLabel()` to icon-only buttons and `.accessibilityHidden(true)` to decorative icons in SwiftUI.
