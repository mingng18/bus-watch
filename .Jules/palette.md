## 2024-05-18 - Accessibility Labels for SwiftUI Icon Buttons
**Learning:** In SwiftUI, icon-only toolbar buttons using `Image(systemName:)` do not automatically receive an accessible label. VoiceOver will read out the system name if no label is provided, which is poor UX.
**Action:** Always append `.accessibilityLabel("Descriptive Text")` to `Button` components that only contain an `Image` to ensure screen reader support.
