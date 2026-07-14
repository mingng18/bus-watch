import MapKit
import SwiftUI

struct BusProgressMapModel: Equatable {
    let routeShortName: String
    let latitude: Double
    let longitude: Double

    init?(progress: BusProgressResponse) {
        guard let position = progress.busPosition else { return nil }
        routeShortName = progress.routeShortName
        latitude = position.lat
        longitude = position.lon
    }
}

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
                        .accessibilityAddTraits(.isHeader)
                    Spacer()
                }
                Text("→ \(progress.destination)")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .accessibilityLabel("Towards \(progress.destination)")

                if let mapModel = BusProgressMapModel(progress: progress) {
                    RealtimeBusLocationMap(model: mapModel)
                        .padding(.vertical, 4)
                }

                Divider()

                ForEach(progress.stops) { stop in
                    TripStopRow(stop: stop)
                }

                Divider()

                HStack {
                    Spacer()
                    let remaining = progress.stops.filter { !$0.passed }.count
                    Text("\(remaining) stop\(remaining == 1 ? "" : "s") remaining")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                        .contentTransition(.numericText())
                        .animation(.default, value: remaining)
                }
            }
            .padding()
        }
        .task(id: progress.tripId) {
            await maybeFireApproachingAlert()
        }
        // Re-evaluate whenever the stop list changes (e.g. auto-refresh).
        .onChange(of: progress.stops.map(\.id)) { _, _ in
            Task { await maybeFireApproachingAlert() }
        }
    }

    /// Fires the approaching-stop notification exactly once per destination
    /// when the bus is within `approachingThreshold` stops of it. Idempotent:
    /// the NotificationService de-duplicates by trip+stop identifier.
    private func maybeFireApproachingAlert() async {
        guard AppFeatureFlags.arrivalNotifications else { return }
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

private struct RealtimeBusLocationMap: View {
    let model: BusProgressMapModel
    @State private var cameraPosition: MapCameraPosition = .automatic

    private var coordinate: CLLocationCoordinate2D {
        CLLocationCoordinate2D(latitude: model.latitude, longitude: model.longitude)
    }

    private var region: MKCoordinateRegion {
        MKCoordinateRegion(
            center: coordinate,
            span: MKCoordinateSpan(latitudeDelta: 0.008, longitudeDelta: 0.008)
        )
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Label("Live location", systemImage: "location.fill")
                .font(.caption2)
                .foregroundStyle(.green)

            Map(position: $cameraPosition, interactionModes: [.pan, .zoom]) {
                Marker(
                    model.routeShortName.isEmpty ? "Bus" : model.routeShortName,
                    systemImage: "bus.fill",
                    coordinate: coordinate
                )
                .tint(.orange)
            }
            .mapStyle(.standard)
            .frame(height: 120)
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
        .onAppear(perform: recenter)
        .onChange(of: model) { _, _ in recenter() }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Live location of bus \(model.routeShortName)")
    }

    private func recenter() {
        cameraPosition = .region(region)
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
                .strikethrough(stop.passed && !stop.isCurrent)
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
        .accessibilityLabel(stopAccessibilityLabel)
    }

    private var stopAccessibilityLabel: String {
        if stop.isCurrent {
            return "Current stop: \(stop.name), arriving now"
        } else if stop.passed {
            return "Passed stop: \(stop.name), arrived at \(stop.arrivalTime)"
        } else {
            return "Upcoming stop: \(stop.name), arriving at \(stop.arrivalTime)"
        }
    }
}
