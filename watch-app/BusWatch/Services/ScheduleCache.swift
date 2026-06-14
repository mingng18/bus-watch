import Foundation

/// On-device cache of scheduled timetables for the user's favorite stops,
/// so bus-watch can keep showing times when the network is unavailable or
/// a fetch is stale — critical underground where there's no signal.
///
/// Persisted as JSON in `UserDefaults`, matching `FavoriteStore`'s style
/// (lightweight, no SwiftData migration overhead). Each entry pairs the
/// last-known `StationScheduleResponse` with the `Date` it was fetched so
/// callers can decide whether to trust it, mark it stale, or fall back.
final class ScheduleCache {
    /// A cached timetable plus when it was captured.
    struct Entry: Codable {
        let schedule: StationScheduleResponse
        let fetchedAt: Date
    }

    private let defaults: UserDefaults
    private let key: String

    init(defaults: UserDefaults = .standard, key: String = SharedDefaults.scheduleCacheKey) {
        self.defaults = defaults
        self.key = key
    }

    /// Reads the cached entry for a stop, or nil if nothing is stored.
    func entry(for stopId: String) -> Entry? {
        guard let entries = loadEntries() else { return nil }
        return entries[stopId]
    }

    /// Returns the cached schedule for a stop, regardless of freshness.
    func schedule(for stopId: String) -> StationScheduleResponse? {
        entry(for: stopId)?.schedule
    }

    /// Writes (or overwrites) the cached timetable for a stop, stamping it
    /// with `now`.
    func store(_ schedule: StationScheduleResponse, for stopId: String, now: Date = Date()) {
        var entries = loadEntries() ?? [:]
        entries[stopId] = Entry(schedule: schedule, fetchedAt: now)
        persist(entries)
    }

    /// Drops the cached entry for a single stop (e.g. when un-favorited).
    func remove(_ stopId: String) {
        guard var entries = loadEntries(), entries[stopId] != nil else { return }
        entries.removeValue(forKey: stopId)
        persist(entries)
    }

    /// Clears the entire cache.
    func clear() {
        defaults.removeObject(forKey: key)
    }

    /// Returns true when the cached entry is older than `maxAge` (or absent).
    /// Callers use this to decide whether to show a "stale / offline" badge.
    func isStale(_ stopId: String, maxAge: TimeInterval, now: Date = Date()) -> Bool {
        guard let entry = entry(for: stopId) else { return true }
        return now.timeIntervalSince(entry.fetchedAt) > maxAge
    }

    // MARK: - Persistence

    private func loadEntries() -> [String: Entry]? {
        guard let data = defaults.data(forKey: key) else { return nil }
        // Decode defensively: a corrupt blob shouldn't crash the app.
        return try? JSONDecoder().decode([String: Entry].self, from: data)
    }

    private func persist(_ entries: [String: Entry]) {
        guard let data = try? JSONEncoder().encode(entries) else { return }
        defaults.set(data, forKey: key)
    }
}
