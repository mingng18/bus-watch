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
                    Text("\(arrivalPrefix(first))\(first.line ?? first.route ?? "") → \(first.destination) — \(arrivalMinutesText(first))")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(stopRowLabel(stop))
        .accessibilityHint("Shows arrivals for this stop.")
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

    /// Rider-facing VoiceOver label for a nearby stop row — one element that
    /// reads "Titiwangsa, 120 meters away" plus the next arrival when known,
    /// and home/favorite state so it isn't conveyed by glyph color alone.
    /// The arrival clause includes the scheduled-vs-live marker and the
    /// confidence qualifier so VoiceOver riders get the same honesty about
    /// estimate quality as sighted riders (issue #133, layered on #143).
    private func stopRowLabel(_ stop: NearbyStop) -> String {
        var parts = [stop.name, "\(stop.distanceM) meters away"]
        if let first = stop.arrivals.first {
            let route = first.line ?? first.route ?? ""
            // VoiceOver reads the full qualifier: "scheduled" / "live", plus
            // "approximate" + the uncertainty window when confidence is medium
            // or low, so a rider knows not to trust a weak estimate tightly.
            let source = arrivalSpokenSource(first)
            let approx = arrivalSpokenApprox(first)
            parts.append("\(source)\(route) to \(first.destination), \(approx)\(first.minutes) minutes")
        }
        if let favorites {
            if favorites.isHome(stop.id) { parts.append("home stop") }
            if favorites.contains(stop.id) { parts.append("favorited") }
        }
        return parts.joined(separator: ", ")
    }

    /// Visible prefix for the arrival line. Live arrivals show nothing; a
    /// historical/scheduled estimate shows "≈ " when we have an uncertainty
    /// window, otherwise the legacy "sched " tag.
    private func arrivalPrefix(_ a: Arrival) -> String {
        if a.isRealtime { return "" }
        if a.uncertaintyMinutes != nil { return "≈ " }
        return "sched "
    }

    /// Visible minutes text. For a scheduled estimate with an uncertainty
    /// window, render "5 min (approx)" so the rider sees the qualifier inline.
    private func arrivalMinutesText(_ a: Arrival) -> String {
        if !a.isRealtime, a.uncertaintyMinutes != nil {
            return "\(a.minutes) min (approx)"
        }
        return "\(a.minutes) min"
    }

    /// Spoken source word for VoiceOver: "live " or "scheduled ".
    private func arrivalSpokenSource(_ a: Arrival) -> String {
        a.isRealtime ? "live " : "scheduled "
    }

    /// Spoken approx qualifier for VoiceOver: "approximately " + the window
    /// when confidence is medium/low; empty for live or high-confidence.
    private func arrivalSpokenApprox(_ a: Arrival) -> String {
        if a.isRealtime { return "" }
        switch a.confidence {
        case "low", "medium":
            return "approximately "
        default:
            return ""
        }
    }
}
