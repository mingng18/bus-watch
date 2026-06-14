import SwiftUI

struct StationArrivalsView: View {
    let stop: NearbyStop
    let schedule: StationScheduleResponse
    var favorites: FavoriteStore? = nil
    @EnvironmentObject private var notifications: NotificationService

    @State private var reminderMinutes: Int = 5
    @State private var scheduledReminderId: String?

    private let leadOptions = [1, 3, 5, 10]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 8) {
                Text(stop.name)
                    .font(.headline)

                favoriteControls
                    .padding(.top, 2)

                Divider()

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
                }

                if !stop.arrivals.contains(where: { $0.isRealtime }) {
                    Text("sched")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }

                Divider()
                arrivalReminderControls

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
                }
                Button {
                    Task { await scheduleReminder(for: next) }
                } label: {
                    Label(scheduledReminderId == nil ? "Set alert" : "Alert set",
                          systemImage: scheduledReminderId == nil ? "bell" : "bell.badge.fill")
                        .font(.caption)
                }
                .buttonStyle(.bordered)
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
            }
        }
    }
}
