import SwiftUI

struct BusProgressView: View {
    let progress: BusProgressResponse
    /// The rider's saved destination stop id, if any. When the bus approaches
    /// this stop we fire a "get ready" notification. When nil, we fall back to
    /// alerting on the next unpassed stop so the rider always gets a buzz.
    var destinationStopId: String? = nil
    /// How many stops ahead to trigger the approaching-stop buzz.
    var approachingThreshold: Int = 1

    @EnvironmentObject private var notifications: NotificationService
    @State private var lastAlertedStopId: String?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(progress.routeShortName)
                        .font(.headline)
                    Spacer()
                }
                Text("→ \(progress.destination)")
                    .font(.caption)
                    .foregroundStyle(.secondary)

                Divider()

                ForEach(progress.stops) { stop in
                    TripStopRow(stop: stop)
                }

                Divider()

                HStack {
                    Spacer()
                    let remaining = progress.stops.filter { !$0.passed }.count
                    Text("\(remaining) stops remaining")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
            }
            .padding()
        }
        .task(id: progress.tripId) {
            await maybeFireApproachingAlert()
        }
        // Re-evaluate whenever the stop list changes (e.g. auto-refresh).
        .onChange(of: progress.stops.map(\.id)) { _ in
            Task { await maybeFireApproachingAlert() }
        }
    }

    /// Fires the approaching-stop notification exactly once per destination
    /// when the bus is within `approachingThreshold` stops of it. Idempotent:
    /// the NotificationService de-duplicates by trip+stop identifier.
    private func maybeFireApproachingAlert() async {
        guard let target = upcomingTargetStop() else { return }
        guard target.id != lastAlertedStopId else { return }
        lastAlertedStopId = target.id
        await notifications.requestAuthorization()
        await notifications.notifyApproachingStop(
            tripId: progress.tripId,
            stopId: target.id,
            stopName: target.name
        )
    }

    /// Returns the stop the rider is approaching, or nil if we've passed it.
    /// Prefers the saved destination; otherwise falls back to the next stop.
    private func upcomingTargetStop() -> TripStopStatus? {
        let upcoming = progress.stops.filter { !$0.passed }
        guard !upcoming.isEmpty else { return nil }
        if let destinationStopId,
           let match = upcoming.first(where: { $0.id == destinationStopId }) {
            let position = upcoming.firstIndex(where: { $0.id == destinationStopId }) ?? 0
            return position < approachingThreshold ? match : nil
        }
        return upcoming.first
    }
}

private struct TripStopRow: View {
    let stop: TripStopStatus

    var body: some View {
        HStack(spacing: 6) {
            if stop.isCurrent {
                Image(systemName: "location.circle.fill")
                    .font(.caption)
                    .foregroundStyle(.green)
            } else if stop.passed {
                Circle()
                    .fill(Color.gray)
                    .frame(width: 8, height: 8)
            } else {
                Circle()
                    .strokeBorder(Color.blue, lineWidth: 1.5)
                    .frame(width: 8, height: 8)
            }

            Text(stop.name)
                .font(.caption)
                .foregroundStyle(stop.passed && !stop.isCurrent ? Color.secondary : Color.white)

            Spacer()

            if stop.isCurrent {
                Text("HERE")
                    .font(.caption2)
                    .bold()
                    .foregroundStyle(.green)
            } else if !stop.passed {
                Text(stop.arrivalTime)
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(stopRowLabel(stop))
    }

    private func stopRowLabel(_ stop: TripStopStatus) -> String {
        if stop.isCurrent {
            return "\(stop.name), current stop"
        } else if stop.passed {
            return "\(stop.name), passed"
        } else {
            return "\(stop.name), expected at \(stop.arrivalTime)"
        }
    }
}
