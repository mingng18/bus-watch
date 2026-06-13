import SwiftUI

struct StationArrivalsView: View {
    let stop: NearbyStop
    let schedule: StationScheduleResponse
    var favorites: FavoriteStore? = nil

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
