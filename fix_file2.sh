cat << 'INNEREOF' > patch2.swift
<<<<<<< SEARCH
## 2025-09-01 - Avoid bare data state abbreviations
**Learning:** Domain-specific data state abbreviations (like "sched" for scheduled arrivals) rendered as bare `Text` can be visually unappealing and less legible.
**Action:** In SwiftUI, avoid using raw text abbreviations for domain-specific data states. Use `Label` components with expanded text and standard SF Symbols (e.g., `Label("Scheduled", systemImage: "clock")`) to improve visual comprehension and accessibility without taking up much more space.
=======
## 2025-09-01 - Avoid bare data state abbreviations
**Learning:** Domain-specific data state abbreviations (like "sched" for scheduled arrivals) rendered as bare `Text` can be visually unappealing and less legible.
**Action:** In SwiftUI, avoid using raw text abbreviations for domain-specific data states. Use `Label` components or concatenated `Text(Image(systemName: "clock")) + Text("...")` to improve visual comprehension and accessibility without taking up much more space.
>>>>>>> REPLACE
INNEREOF
