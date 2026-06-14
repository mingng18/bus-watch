import WidgetKit
import Foundation

/// Feeds the complication by reading the home stop + cached schedule from
/// the shared App Group defaults.
///
/// The complication is a *mirror* of the most recent in-app refresh: it
/// reads the on-device cache only and does **not** call APIClient. Background
/// network from a watchOS widget extension is heavily throttled/unreliable,
/// and the cache is already refreshed whenever the user opens the app (via
/// ContextEngine). The countdown still ticks down each minute thanks to
/// CountdownResolver's time-decay applied against the cache timestamp.
struct CountdownTimelineProvider: TimelineProvider {
    func placeholder(in context: Context) -> CountdownEntry {
        CountdownEntry(date: Date(), snapshot: .placeholder)
    }

    func getSnapshot(in context: Context, completion: @escaping (CountdownEntry) -> Void) {
        completion(currentEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<CountdownEntry>) -> Void) {
        let now = Date()
        let entry = currentEntry(now: now)
        let nextRefresh = CountdownResolver.nextRefresh(after: entry.snapshot, now: now)
        completion(Timeline(entries: [entry], policy: .after(nextRefresh)))
    }

    /// Builds the current entry from the shared store. Extracted so both the
    /// snapshot and timeline paths share identical logic.
    private func currentEntry(now: Date = Date()) -> CountdownEntry {
        let home = SharedDefaults.suite.string(forKey: SharedDefaults.homeStopKey)
        let cache = ScheduleCache(defaults: SharedDefaults.suite)
        let snapshot = CountdownResolver.snapshot(homeStopId: home, cache: cache, now: now)
        return CountdownEntry(date: now, snapshot: snapshot)
    }
}
