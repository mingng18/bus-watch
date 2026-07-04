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
                    if nearby.stops.isEmpty {
                        Text("No stops nearby")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                            .listRowBackground(Color.clear)
                    } else {
                        ForEach(nearby.stops) { stop in
                            stopRow(stop)
                        }
                    }
                } else {
                    ProgressView("Loading...")
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
                        .accessibilityHidden(true)
                }
                if favorites?.contains(stop.id) == true {
                    Image(systemName: "star.fill")
                        .foregroundStyle(.yellow)
                        .accessibilityHidden(true)
                }
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(stopRowLabel(stop))
        .accessibilityHint(stop.type == "rail"
                           ? "Shows arrivals for this station."
                           : "Bus stop. No live arrivals.")
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

    /// Rider-facing VoiceOver label for a manual-pick stop row. Combines the
    /// stop name with home/favorite state so it isn't conveyed by glyph
    /// color alone; matches `NearbyListView.stopRowLabel`.
    private func stopRowLabel(_ stop: NearbyStop) -> String {
        var parts = [stop.name]
        if let favorites {
            if favorites.isHome(stop.id) { parts.append("home stop") }
            if favorites.contains(stop.id) { parts.append("favorited") }
        }
        return parts.joined(separator: ", ")
    }
}
