## 2024-05-30 - SwiftUI Icon-Only Buttons Accessibility
**Learning:** SwiftUI toolbar buttons that only contain an `Image(systemName:)` do not automatically receive an accessible label derived from their icon or context. They will be read as generic buttons by VoiceOver unless explicitly labeled.
**Action:** Always add `.accessibilityLabel("Descriptive Text")` to icon-only buttons in SwiftUI views to ensure screen reader users understand the button's purpose.
