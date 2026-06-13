import SwiftUI

struct NearbyListView: View {
    let response: NearbyResponse
    let onSelectStop: (NearbyStop) -> Void
    var favorites: FavoriteStore? = nil

    private var favoriteStops: [NearbyStop] {
        guard let favorites else { return [] }
        let byId = Dictionary(uniqueKeysWithValues: response.stops.map { ($0.id, $0) })
        // Home first, then the rest, matching FavoriteStore.sortedFavorites but
        // filtered to stops present in the current nearby response.
        return favorites.sortedFavorites.compactMap { byId[$0] }
    }

    var body: some View {
        List {
            if !favoriteStops.isEmpty {
                Section {
                    ForEach(favoriteStops) { stop in
                        stopRow(stop)
                    }
                } header: {
                    HStack {
                        Image(systemName: "star.fill")
                            .foregroundStyle(.yellow)
                            .accessibilityHidden(true)
                        Text("Favorites")
                    }
                }
            }

            Section {
                ForEach(response.stops) { stop in
                    stopRow(stop)
                }
            } header: {
                Text("Nearby")
            }
        }
        .listStyle(.plain)
    }

    @ViewBuilder
    private func stopRow(_ stop: NearbyStop) -> some View {
        Button(action: { onSelectStop(stop) }) {
            VStack(alignment: .leading) {
                HStack {
                    Image(systemName: stop.type == "rail" ? "train.side.front.car" : "bus")
                        .foregroundStyle(stop.type == "rail" ? .blue : .orange)
                        .accessibilityHidden(true)
                    Text(stop.name)
                        .font(.caption)
                    Spacer()
                    if let favorites, favorites.isHome(stop.id) {
                        Image(systemName: "house.fill")
                            .foregroundStyle(.yellow)
                            .accessibilityLabel("Home stop")
                    }
                    if favorites?.contains(stop.id) == true {
                        Image(systemName: "star.fill")
                            .foregroundStyle(.yellow)
                            .accessibilityHidden(true)
                    }
                    Text("\(stop.distanceM)m")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }

                if let first = stop.arrivals.first {
                    Text("\(first.isRealtime ? "" : "sched ")\(first.line ?? first.route ?? "") → \(first.destination) — \(first.minutes) min")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
            }
        }
        .swipeActions(edge: .leading, allowsFullSwipe: true) {
            if let favorites {
                Button {
                    favorites.toggleHome(stop.id)
                } label: {
                    Label(favorites.isHome(stop.id) ? "Remove Home" : "Set Home",
                          systemImage: favorites.isHome(stop.id) ? "house.slash" : "house")
                }
                .tint(.yellow)
            }
        }
        .swipeActions(edge: .trailing) {
            if let favorites {
                Button(role: favorites.contains(stop.id) ? .destructive : nil) {
                    favorites.toggle(stop.id)
                } label: {
                    Label(favorites.contains(stop.id) ? "Unfavorite" : "Favorite",
                          systemImage: favorites.contains(stop.id) ? "star.slash" : "star")
                }
                .tint(.yellow)
            }
        }
    }
}
