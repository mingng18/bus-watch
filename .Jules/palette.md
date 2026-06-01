## 2024-05-24 - Missing accessibility label on SwiftUI icon-only toolbar buttons
**Learning:** In SwiftUI views, icon-only toolbar buttons using `Image(systemName:)` do not automatically receive an accessible label and must be explicitly tagged with `.accessibilityLabel()` for screen reader support.
**Action:** Always add an `.accessibilityLabel()` tag when creating icon-only buttons using `Image(systemName:)`, especially in toolbars.
