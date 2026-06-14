import Foundation

/// Single source of truth for the App Group identifier and the shared
/// `UserDefaults` keys that the app and its WidgetKit complication extension
/// use to talk to each other.
///
/// The complication runs in a **separate process** from the app, so it can't
/// read the app's `.standard` UserDefaults. Both processes must agree
/// byte-for-byte on the App Group suite name and the storage keys, or sharing
/// silently fails (the complication would forever show "no home stop").
///
/// `suite` falls back to `.standard` if the App Group isn't provisioned
/// (e.g. under `CODE_SIGNING_ALLOWED=NO` or on a device without the
/// entitlement) so the app never crashes — sharing simply degrades to the
/// local sandbox.
enum SharedDefaults {
    /// App Group shared by the watch app and the complications extension.
    /// Replace with a provisioned group identifier before release.
    static let appGroup = "group.com.buswatch.watchapp"

    /// The shared `UserDefaults`, falling back to `.standard` if the suite is
    /// unavailable so callers never receive `nil`.
    static let suite: UserDefaults = UserDefaults(suiteName: appGroup) ?? .standard

    // MARK: - Storage keys (must match FavoriteStore / ScheduleCache exactly)

    /// Persisted favorite stop IDs (JSON-encoded `[String]`).
    static let favoriteStopsKey = "buswatch.favoriteStops"
    /// The user's home stop id (raw `String`).
    static let homeStopKey = "buswatch.homeStop"
    /// Cached scheduled timetables keyed by stop id (JSON blob).
    static let scheduleCacheKey = "buswatch.scheduleCache"
}
