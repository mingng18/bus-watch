import SwiftUI

struct ManualPickerView: View {
    @ObservedObject var engine: ContextEngine
    var favorites: FavoriteStore? = nil

    private var favoriteStops: [NearbyStop] {
        guard let favorites, let nearby = engine.nearbyStops else { return [] }
        let byId = Dictionary(uniqueKeysWithValues: nearby.stops.map { ($0.id, $0) })
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

            Section("Nearby Stops") {
                if let nearby = engine.nearbyStops {
                    ForEach(nearby.stops) { stop in
                        stopRow(stop)
                    }
                } else {
                    Text("Loading...")
                        .foregroundStyle(.secondary)
                }
            }
        }
        .listStyle(.plain)
    }

    @ViewBuilder
    private func stopRow(_ stop: NearbyStop) -> some View {
        Button {
            if stop.type == "rail" {
                engine.selectStation(stop)
            }
        } label: {
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
