const fs = require('fs');

// Patch ManualPickerView.swift
let content = fs.readFileSync('watch-app/BusWatch/Views/ManualPickerView.swift', 'utf8');

const replacement1 = `<<<<<<< HEAD
                    Text("Nearby only")
                        .font(.caption2)
                        .padding(.horizontal, 4)
                        .padding(.vertical, 2)
                        .background(Color.secondary.opacity(0.2))
                        .cornerRadius(4)
                        .foregroundStyle(.secondary)
=======
                    Text("Rail only")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                        .padding(.horizontal, 4)
                        .padding(.vertical, 2)
                        .background(.quaternary)
                        .clipShape(RoundedRectangle(cornerRadius: 4))
>>>>>>> origin/master`;

content = content.replace(replacement1, `                    Text("Rail only")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                        .padding(.horizontal, 4)
                        .padding(.vertical, 2)
                        .background(.quaternary)
                        .clipShape(RoundedRectangle(cornerRadius: 4))`);

const replacement2 = `<<<<<<< HEAD
                           : "Bus stops must be selected from the nearby list.")
=======
                           : "Bus stop. Manual selection is for rail stations only.")
>>>>>>> origin/master`;

content = content.replace(replacement2, `                           : "Bus stop. Manual selection is for rail stations only.")`);

fs.writeFileSync('watch-app/BusWatch/Views/ManualPickerView.swift', content);

// Patch palette.md
let content2 = fs.readFileSync('.jules/palette.md', 'utf8');

const replacement3 = `<<<<<<< HEAD
## 2025-03-09 - Clarify Disabled States with Badges
**Learning:** Artificially disabling buttons (or disabling them for domain constraints) without clear visual indicators leads to user confusion. Additionally, providing misleading VoiceOver hints (like "No live arrivals" for a bus in a transit app) creates mistrust.
**Action:** When a list row is disabled due to underlying domain constraints, provide an inline visual badge (like \`Text("Nearby only")\`) rather than removing the disabled state, and ensure the \`.accessibilityHint\` strictly matches the domain constraint (e.g. "Must be selected from the nearby list").
=======
## 2024-10-04 - Clarify disabled state and constraints in manual picker
**Learning:** Do not conflate business-logic restrictions (disabling bus stops in manual picker) with artificial UI friction or contradict app purpose by claiming 'No live arrivals' for buses.
**Action:** Enhance legitimately disabled list items with clear visual badges (e.g., 'Rail only') and accurate accessibility hints ('Manual selection is for rail stations only') instead of confusing copy.
>>>>>>> origin/master`;

content2 = content2.replace(replacement3, `## 2024-10-04 - Clarify disabled state and constraints in manual picker
**Learning:** Do not conflate business-logic restrictions (disabling bus stops in manual picker) with artificial UI friction or contradict app purpose by claiming 'No live arrivals' for buses.
**Action:** Enhance legitimately disabled list items with clear visual badges (e.g., 'Rail only') and accurate accessibility hints ('Manual selection is for rail stations only') instead of confusing copy.`);

fs.writeFileSync('.jules/palette.md', content2);
