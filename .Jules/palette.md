
## 2024-05-18 - Accessibility for Visual State Indication
**Learning:** In SwiftUI, when contextual state (like past, current, or future positions in a timeline or bus route progress) is conveyed solely through visual indicators like colors or icons, screen readers will read the individual visual elements (e.g., "location circle fill image") out of context.
**Action:** Group the visual indicators and text together using `.accessibilityElement(children: .ignore)` on the container and provide a unified, descriptive `.accessibilityLabel` (e.g., "Main Street, current stop") to translate the visual state into meaningful spoken context.
