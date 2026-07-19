import SwiftUI

struct NearbyListView: View {
    let response: NearbyResponse
    let onSelectStop: (NearbyStop) -> Void
    var onSelectTrip: (String) -> Void = { _ in }
    var favorites: FavoriteStore? = nil

    private var favoriteStops: [NearbyStop] {
        guard AppFeatureFlags.favoritesAndHome else { return [] }
        guard let favorites else { return [] }
        let byId = Dictionary(uniqueKeysWithValues: response.stops.map { ($0.id, $0) })
        // Home first, then the rest, matching FavoriteStore.sortedFavorites but
        // filtered to stops present in the current nearby response.
        return favorites.sortedFavorites.compactMap { byId[$0] }
    }

    private var trackedTrips: [BusRouteEntry] {
        Array(response.busRoutes.lazy.filter(\.supportsTripProgress).prefix(4))
    }

    var body: some View {
        List {
            if AppFeatureFlags.liveBusMap, !response.busRoutes.isEmpty {
                Section("Live buses") {
                    NearbyBusMapView(response: response)
                        .frame(height: 128)
                        .listRowInsets(EdgeInsets())

                    ForEach(trackedTrips) { bus in
                        Button {
                            onSelectTrip(bus.tripId)
                        } label: {
                            HStack {
                                Image(systemName: "bus.fill")
                                    .foregroundStyle(.orange)
                                Text(bus.routeShortName.isEmpty ? "Live bus" : bus.routeShortName)
                                    .font(.caption)
                                Spacer()
                                Text("\(bus.minutes) min")
                                    .font(.caption2)
                                    .foregroundStyle(.secondary)
                                    .contentTransition(.numericText())
                                    .animation(.default, value: bus.minutes)
                                Image(systemName: "chevron.right")
                                    .font(.caption2)
                                    .foregroundStyle(.secondary)
                            }
                        }
                        .accessibilityElement(children: .ignore)
                        .accessibilityLabel(trackedTripLabel(bus))
                        .accessibilityHint("Shows live trip progress.")
                    }
                }
            }

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
                if response.stops.isEmpty {
                    VStack(spacing: 4) {
                        Image(systemName: "location.slash")
                            .font(.title2)
                            .foregroundStyle(.secondary)
                            .accessibilityHidden(true)
                        Text("No stops nearby")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .listRowBackground(Color.clear)
                } else {
                    ForEach(response.stops) { stop in
                        stopRow(stop)
                    }
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
                    if AppFeatureFlags.favoritesAndHome,
                       let favorites,
                       favorites.isHome(stop.id) {
                        Image(systemName: "house.fill")
                            .foregroundStyle(.yellow)
                            .accessibilityLabel("Home stop")
                    }
                    if AppFeatureFlags.favoritesAndHome,
                       favorites?.contains(stop.id) == true {
                        Image(systemName: "star.fill")
                            .foregroundStyle(.yellow)
                            .accessibilityHidden(true)
                    }
                    Text("\(stop.distanceM)m")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                        .contentTransition(.numericText())
                        .animation(.default, value: stop.distanceM)
                }

                if let first = stop.arrivals.first {
                    Text("\(arrivalPrefix(first))\(first.line ?? first.route ?? "") → \(first.destination) — \(arrivalMinutesText(first))")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                        .contentTransition(.numericText())
                        .animation(.default, value: first.minutes)
                }
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(stopRowLabel(stop))
        .accessibilityHint("Shows arrivals for this stop.")
        .swipeActions(edge: .leading, allowsFullSwipe: true) {
            if AppFeatureFlags.favoritesAndHome, let favorites {
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
            if AppFeatureFlags.favoritesAndHome, let favorites {
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

    func trackedTripLabel(_ bus: BusRouteEntry) -> String {
        let name = bus.routeShortName.isEmpty ? "Live bus" : "Bus \(bus.routeShortName)"
        let minText = bus.minutes == 1 ? "1 minute" : "\(bus.minutes) minutes"
        return "\(name), \(minText)"
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
        if AppFeatureFlags.favoritesAndHome, let favorites {
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
