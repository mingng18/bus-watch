import Foundation

/// A point-in-time snapshot of the next departure at the home stop, computed
/// from the on-device schedule cache. Pure value type (no WidgetKit) so it is
/// unit-testable and reusable by both the app and the complication extension.
struct CountdownSnapshot: Equatable {
    let stopId: String
    let stopName: String
    let line: String
    let destination: String
    /// Decayed minutes-until-arrival (already adjusted for the time elapsed
    /// since the cache was fetched, clamped at 0).
    let minutesUntil: Int
    /// True when the cached schedule is older than the staleness threshold.
    let isStale: Bool
    let fetchedAt: Date
}

extension CountdownSnapshot {
    /// A sample snapshot used for widget placeholders/previews.
    static let placeholder = CountdownSnapshot(
        stopId: "sample",
        stopName: "Titiwangsa",
        line: "U82",
        destination: "Sentul",
        minutesUntil: 7,
        isStale: false,
        fetchedAt: Date()
    )
}

/// Pure logic that derives a glanceable countdown from the home stop id + the
/// on-device cache. Extracted from the WidgetKit layer so the time-decay math
/// (the bug-prone part) is trivially unit-testable.
enum CountdownResolver {
    /// Returns the next upcoming departure for the home stop, applying
    /// time-decay so the displayed minutes tick down between cache refreshes.
    /// Returns nil if there's no home stop, no cached schedule, or no
    /// not-yet-departed entry.
    static func snapshot(
        homeStopId: String?,
        cache: ScheduleCache,
        now: Date,
        staleAfter: TimeInterval = 600
    ) -> CountdownSnapshot? {
        guard let home = homeStopId,
              let entry = cache.entry(for: home) else { return nil }

        let elapsed = now.timeIntervalSince(entry.fetchedAt)
        let elapsedMinutes = Int(elapsed / 60)
        let isStale = elapsed > staleAfter

        // Pick the first departure that hasn't departed yet *after* time-decay.
        // The cache stores minutesUntil relative to fetch time, so subtract the
        // minutes that have elapsed since to keep the countdown live. A row
        // whose decayed value is negative has already left and is skipped in
        // favor of the next one; a row at exactly 0 is "arriving now".
        guard let next = entry.schedule.departures
            .map({ decayedMinutes($0, elapsedMinutes: elapsedMinutes) })
            .first(where: { $0.minutes >= 0 }) else {
            return nil
        }

        return CountdownSnapshot(
            stopId: home,
            stopName: entry.schedule.stopName,
            line: next.departure.line,
            destination: next.departure.destination,
            minutesUntil: max(next.minutes, 0),
            isStale: isStale,
            fetchedAt: entry.fetchedAt
        )
    }

    /// The WidgetKit refresh policy: tick at the next whole-minute boundary
    /// when we have something to show, otherwise throttle to avoid spinning.
    static func nextRefresh(after snapshot: CountdownSnapshot?, now: Date) -> Date {
        guard snapshot != nil else {
            // Nothing to show — check again in 15 minutes (e.g. the user may
            // set a home stop or open the app to refresh the cache).
            return now.addingTimeInterval(15 * 60)
        }
        // Next minute boundary so the "X min" label ticks each minute.
        let calendar = Calendar.current
        let nextMinute = calendar.date(byAdding: .minute, value: 1, to: now) ?? now
        let components = calendar.dateComponents([.year, .month, .day, .hour, .minute], from: nextMinute)
        return calendar.date(from: components) ?? nextMinute
    }

    /// Pairs a departure with its decayed (possibly negative) minutes-until,
    /// so callers can filter on the unclamped value while retaining the row's
    /// line/destination for display.
    private struct Decayed {
        let departure: Departure
        let minutes: Int
    }

    /// Returns the departure with its minutes-until reduced by the elapsed
    /// time since the cache was fetched. The value may go negative (meaning
    /// the bus has departed); callers filter and clamp as needed.
    private static func decayedMinutes(_ departure: Departure, elapsedMinutes: Int) -> Decayed {
        Decayed(departure: departure, minutes: departure.minutesUntil - elapsedMinutes)
    }
}
