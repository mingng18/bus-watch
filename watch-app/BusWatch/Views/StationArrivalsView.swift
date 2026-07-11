import SwiftUI

struct StationArrivalsView: View {
    let stop: NearbyStop
    let schedule: StationScheduleResponse
    var favorites: FavoriteStore? = nil
    /// When true, the displayed schedule came from the on-device cache
    /// because the network fetch failed or was stale.
    var isOffline: Bool = false
    @EnvironmentObject private var notifications: NotificationService

    @State private var reminderMinutes: Int = 5
    @State private var scheduledReminderId: String?

    private let leadOptions = [1, 3, 5, 10]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 8) {
                Text(stop.name)
                    .font(.headline)
                    .accessibilityAddTraits(.isHeader)

                if AppFeatureFlags.favoritesAndHome {
                    favoriteControls
                        .padding(.top, 2)
                }

                if isOffline {
                    offlineBanner
                }

                Divider()

                if schedule.departures.isEmpty {
                    Text("No upcoming departures")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .padding(.vertical, 4)
                }

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
                            .contentTransition(.numericText())
                            .animation(.default, value: dep.minutesUntil)
                    }
                    // Combine the row into one VoiceOver element so the rider
                    // hears "U82 to Sentul, 5 minutes, arriving soon" rather
                    // than four disconnected fragments. The "arriving soon"
                    // tail pairs the green color cue with text (WCAG 1.4.1).
                    .accessibilityElement(children: .ignore)
                    .accessibilityLabel(departureLabel(dep))
                }

                if !stop.arrivals.contains(where: { $0.isRealtime }) {
                    Text("sched")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }

                if AppFeatureFlags.arrivalNotifications {
                    Divider()
                    arrivalReminderControls
                }

                HStack {
                    Spacer()
                    Text("Auto-detected")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
            }
            .padding()
        }
    }

    /// "Alert me N minutes before the next arrival" control. Schedules a local
    /// notification `reminderMinutes` ahead of the soonest departure, or fires
    /// immediately if that lead time has already elapsed.
    @ViewBuilder
    private var arrivalReminderControls: some View {
        if let next = schedule.departures.first {
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Image(systemName: "bell.badge")
                        .font(.caption)
                        .foregroundStyle(.orange)
                        .accessibilityHidden(true)
                    Text("Remind me")
                        .font(.caption)
                    Spacer()
                    Picker("", selection: $reminderMinutes) {
                        ForEach(leadOptions, id: \.self) { mins in
                            Text("\(mins) min before").tag(mins)
                        }
                    }
                    .labelsHidden()
                    .accessibilityLabel("Reminder lead time")
                    .accessibilityValue("\(reminderMinutes) minutes before")
                    .accessibilityHint("How many minutes before arrival to notify you.")
                }
                Button {
                    Task { await scheduleReminder(for: next) }
                } label: {
                    Label(scheduledReminderId == nil ? "Set alert" : "Alert set",
                          systemImage: scheduledReminderId == nil ? "bell" : "bell.badge.fill")
                        .font(.caption)
                }
                .buttonStyle(.bordered)
                .accessibilityLabel(scheduledReminderId == nil ? "Set alert" : "Alert set")
                .accessibilityValue(scheduledReminderId == nil ? "Off" : "On")
                .accessibilityHint("Schedules a notification \(reminderMinutes) minutes before arrival.")
            }
        }
    }

    private func scheduleReminder(for departure: Departure) async {
        await notifications.requestAuthorization()
        if let id = await notifications.scheduleArrivalAlert(
            for: departure,
            leadMinutes: reminderMinutes,
            stopName: stop.name
        ) {
            scheduledReminderId = id
        } else {
            // Lead time already elapsed — buzz now.
            await notifications.fireImmediateArrivalAlert(for: departure, stopName: stop.name)
            scheduledReminderId = "immediate-\(departure.id)"
        }
    }

    /// Explicit "offline / scheduled" indicator shown when the displayed
    /// timetable came from the on-device cache rather than a live fetch.
    @ViewBuilder
    private var offlineBanner: some View {
        HStack(spacing: 4) {
            Image(systemName: "wifi.slash")
                .font(.caption2)
                .foregroundStyle(.orange)
                .accessibilityHidden(true)
            Text("Offline — showing scheduled times")
                .font(.caption2)
                .foregroundStyle(.orange)
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Offline. Showing cached scheduled times.")
    }

    /// Rider-facing VoiceOver label for a departure row. Surfaces urgency in
    /// words ("arriving soon") so it isn't conveyed by color alone (WCAG
    /// 1.4.1), and reads as one phrase: "U82 to Sentul, 5 minutes".
    private func departureLabel(_ dep: Departure) -> String {
        let urgency = dep.minutesUntil <= 3 ? ", arriving soon" : ""
        return "\(dep.line) to \(dep.destination), \(dep.minutesUntil) minutes\(urgency)"
    }

    @ViewBuilder
    private var favoriteControls: some View {
        if let favorites {
            HStack {
                Button {
                    favorites.toggle(stop.id)
                } label: {
                    Label(favorites.contains(stop.id) ? "Favorited" : "Favorite",
                          systemImage: favorites.contains(stop.id) ? "star.fill" : "star")
                        .font(.caption)
                        .foregroundStyle(favorites.contains(stop.id) ? .yellow : .secondary)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Favorite")
                .accessibilityValue(favorites.contains(stop.id) ? "On" : "Off")
                .accessibilityHint("Saves this stop to your favorites.")

                Button {
                    favorites.toggleHome(stop.id)
                } label: {
                    Label(favorites.isHome(stop.id) ? "Home" : "Set Home",
                          systemImage: favorites.isHome(stop.id) ? "house.fill" : "house")
                        .font(.caption)
                        .foregroundStyle(favorites.isHome(stop.id) ? .yellow : .secondary)
                }
                .buttonStyle(.plain)
                .disabled(!favorites.contains(stop.id))
                .accessibilityLabel(favorites.isHome(stop.id) ? "Home" : "Set Home")
                .accessibilityValue(favorites.isHome(stop.id) ? "On" : "Off")
                .accessibilityHint("Marks this stop as your home for quick access.")
            }
        }
    }
}
