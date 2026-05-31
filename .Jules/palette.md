## 2026-05-31 - SwiftUI Icon-Only Button Accessibility
**Learning:** In SwiftUI views, icon-only toolbar buttons using `Image(systemName:)` do not automatically receive an accessible label and must be explicitly tagged with `.accessibilityLabel()` for screen reader support.
**Action:** Always verify that icon-only buttons have an explicit `.accessibilityLabel()` applied, especially in toolbar items where context might not be visually obvious to a screen reader user.
