import Foundation
import Combine

/// Persists a set of favorite stop IDs client-side via `UserDefaults`, with one
/// stop optionally marked as **home** for one-tap access at the top of nearby.
///
/// Uses `@AppStorage`-backed persistence (JSON-encoded) rather than SwiftData,
/// matching the lightweight persistence the app already relies on.
final class FavoriteStore: ObservableObject {
    @Published private(set) var favorites: Set<String>
    @Published private(set) var homeStopId: String?

    private let defaults: UserDefaults
    private let favoritesKey = "buswatch.favoriteStops"
    private let homeKey = "buswatch.homeStop"

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        self.favorites = Self.loadFavorites(from: defaults)
        self.homeStopId = defaults.string(forKey: homeKey)

        // A home stop must always be a member of the favorites set.
        if let home = self.homeStopId, !self.favorites.contains(home) {
            self.homeStopId = nil
        }
    }

    var sortedFavorites: [String] {
        // Home stop first (if any), then the rest alphabetically for stable order.
        guard let home = homeStopId else {
            return favorites.sorted()
        }
        return [home] + favorites.filter { $0 != home }.sorted()
    }

    func contains(_ stopId: String) -> Bool {
        favorites.contains(stopId)
    }

    func isHome(_ stopId: String) -> Bool {
        homeStopId == stopId
    }

    /// Adds a stop to favorites. Returns true if the set changed.
    @discardableResult
    func add(_ stopId: String) -> Bool {
        guard !favorites.contains(stopId) else { return false }
        favorites.insert(stopId)
        persist()
        return true
    }

    /// Removes a stop from favorites. If it was home, home is cleared.
    /// Returns true if the set changed.
    @discardableResult
    func remove(_ stopId: String) -> Bool {
        guard favorites.contains(stopId) else { return false }
        favorites.remove(stopId)
        if homeStopId == stopId {
            homeStopId = nil
            defaults.removeObject(forKey: homeKey)
        }
        persist()
        return true
    }

    /// Toggles membership of a stop. Returns the new membership state.
    @discardableResult
    func toggle(_ stopId: String) -> Bool {
        if favorites.contains(stopId) {
            remove(stopId)
            return false
        } else {
            add(stopId)
            return true
        }
    }

    /// Marks a stop as home. The stop is added to favorites if not already a member.
    func setHome(_ stopId: String) {
        add(stopId)
        guard homeStopId != stopId else { return }
        homeStopId = stopId
        defaults.set(stopId, forKey: homeKey)
    }

    /// Clears the home marker without removing the stop from favorites.
    func clearHome() {
        guard homeStopId != nil else { return }
        homeStopId = nil
        defaults.removeObject(forKey: homeKey)
    }

    /// Toggles whether a stop is home. Clearing home leaves the stop favorited.
    func toggleHome(_ stopId: String) {
        if isHome(stopId) {
            clearHome()
        } else {
            setHome(stopId)
        }
    }

    // MARK: - Persistence

    private static let storageKey = "buswatch.favoriteStops"

    private func persist() {
        let array = Array(favorites)
        if let data = try? JSONEncoder().encode(array) {
            defaults.set(data, forKey: FavoriteStore.storageKey)
        } else {
            defaults.set(array, forKey: FavoriteStore.storageKey)
        }
    }

    private static func loadFavorites(from defaults: UserDefaults) -> Set<String> {
        if let data = defaults.data(forKey: storageKey),
           let array = try? JSONDecoder().decode([String].self, from: data) {
            return Set(array)
        }
        if let array = defaults.array(forKey: storageKey) as? [String] {
            return Set(array)
        }
        return []
    }
}
