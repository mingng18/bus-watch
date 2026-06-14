import SwiftUI

/// Shows the next departures from `stopId` heading toward a saved destination
/// stop. Mirrors `StationArrivalsView` but is scoped to trips that actually
/// pass through the destination, and surfaces an empty state when no such
/// trips are scheduled.
struct DeparturesTowardView: View {
    let stopName: String
    let destinationName: String
    let schedule: StationScheduleResponse

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 8) {
                Text(stopName)
                    .font(.headline)

                Text("→ \(destinationName)")
                    .font(.caption)
                    .foregroundStyle(.secondary)

                Divider()

                if schedule.departures.isEmpty {
                    Text("No departures toward \(destinationName)")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                } else {
                    ForEach(schedule.departures) { dep in
                        HStack {
                            Circle()
                                .fill(dep.minutesUntil <= 3 ? Color.green : Color.blue)
                                .frame(width: 8, height: 8)
                            VStack(alignment: .leading) {
                                Text(dep.line)
                                    .font(.caption2)
                                    .foregroundStyle(.secondary)
                                Text("→ \(dep.destination)")
                                    .font(.caption)
                            }
                            Spacer()
                            Text("\(dep.minutesUntil) min")
                                .font(.caption)
                                .bold()
                                .foregroundStyle(dep.minutesUntil <= 3 ? Color.green : .white)
                        }
                        .accessibilityElement(children: .ignore)
                        .accessibilityLabel(departureLabel(dep))
                    }
                }
            }
            .padding()
        }
    }

    /// Rider-facing VoiceOver label for a departure row. Mirrors
    /// `StationArrivalsView.departureLabel` — one phrase that surfaces
    /// urgency in words rather than color alone (WCAG 1.4.1).
    private func departureLabel(_ dep: Departure) -> String {
        let urgency = dep.minutesUntil <= 3 ? ", arriving soon" : ""
        return "\(dep.line) to \(dep.destination), \(dep.minutesUntil) minutes\(urgency)"
    }
}
