import XCTest
@testable import BusWatch

/// Pins the data-sharing contract between the watch app and its WidgetKit
/// complication extension: the home stop written by the app via
/// `SharedDefaults.suite` must be readable back, and the storage keys must
/// match what `FavoriteStore` and `ScheduleCache` use. If a future refactor
/// drifts on the suite name or key strings, the complication silently breaks
/// (forever shows "Set a home stop") — these tests fail loudly first.
final class SharedDefaultsTests: XCTestCase {

    // NOTE: these tests hit the real `SharedDefaults.suite`, which under
    // `CODE_SIGNING_ALLOWED=NO` resolves to `.standard` (the App Group isn't
    // provisioned in CI/simulator). That's the same path the complication
    // takes, so the round-trip contract is what we're validating either way.

    override func tearDown() {
        // Clean up any keys we wrote so tests are hermetic.
        SharedDefaults.suite.removeObject(forKey: SharedDefaults.favoriteStopsKey)
        SharedDefaults.suite.removeObject(forKey: SharedDefaults.homeStopKey)
        SharedDefaults.suite.removeObject(forKey: SharedDefaults.scheduleCacheKey)
        super.tearDown()
    }

    // MARK: - Keys match FavoriteStore / ScheduleCache

    func testFavoriteStopsKeyMatchesFavoriteStoreConstants() {
        // FavoriteStore uses "buswatch.favoriteStops" for both its instance
        // favoritesKey and static storageKey. SharedDefaults must agree.
        let store = FavoriteStore(defaults: SharedDefaults.suite)
        store.add("home1")

        let written = SharedDefaults.suite.data(forKey: SharedDefaults.favoriteStopsKey)
        XCTAssertNotNil(written, "SharedDefaults.favoriteStopsKey must match FavoriteStore's storage key")
    }

    func testHomeStopKeyMatchesFavoriteStore() {
        let store = FavoriteStore(defaults: SharedDefaults.suite)
        store.setHome("home1")

        // Written through FavoriteStore, readable via SharedDefaults key —
        // this is exactly what the complication's timeline provider does.
        let home = SharedDefaults.suite.string(forKey: SharedDefaults.homeStopKey)
        XCTAssertEqual(home, "home1")
    }

    // MARK: - Keys match ScheduleCache

    func testScheduleCacheKeyMatchesScheduleCache() {
        let cache = ScheduleCache(defaults: SharedDefaults.suite)
        let schedule = StationScheduleResponse(
            stopId: "home1", stopName: "T",
            departures: [Departure(line: "U82", destination: "Sentul",
                                   departureTime: "08:30:00", minutesUntil: 5)])
        cache.store(schedule, for: "home1")

        // Written through ScheduleCache (default key = SharedDefaults const),
        // present under SharedDefaults.scheduleCacheKey.
        let blob = SharedDefaults.suite.data(forKey: SharedDefaults.scheduleCacheKey)
        XCTAssertNotNil(blob, "SharedDefaults.scheduleCacheKey must match ScheduleCache's default key")
    }

    // MARK: - Cross-instance round-trip (the widget's actual read path)

    func testHomeStopWrittenByAppIsReadableByFreshInstance() {
        // Simulate the app writing the home stop...
        let appSide = FavoriteStore(defaults: SharedDefaults.suite)
        appSide.setHome("titiwangsa")

        // ...and the widget reading it from a freshly-constructed store on the
        // same suite (different process, same shared container).
        let widgetSide = FavoriteStore(defaults: SharedDefaults.suite)
        XCTAssertEqual(widgetSide.homeStopId, "titiwangsa")
    }

    func testScheduleWrittenByAppIsReadableByFreshCache() {
        let schedule = StationScheduleResponse(
            stopId: "home1", stopName: "Titiwangsa",
            departures: [Departure(line: "U82", destination: "Sentul",
                                   departureTime: "08:30:00", minutesUntil: 7)])

        ScheduleCache(defaults: SharedDefaults.suite).store(schedule, for: "home1")

        let widgetSideCache = ScheduleCache(defaults: SharedDefaults.suite)
        XCTAssertEqual(widgetSideCache.schedule(for: "home1")?.departures.first?.minutesUntil, 7)
    }

    // MARK: - End-to-end: widget read via CountdownResolver

    func testCountdownResolverReadsHomeStopAndCacheFromSharedSuite() {
        // The exact path the complication takes: home stop + cache both read
        // from SharedDefaults.suite, fed to CountdownResolver.
        FavoriteStore(defaults: SharedDefaults.suite).setHome("home1")
        let schedule = StationScheduleResponse(
            stopId: "home1", stopName: "Titiwangsa",
            departures: [Departure(line: "U82", destination: "Sentul",
                                   departureTime: "08:30:00", minutesUntil: 9)])
        ScheduleCache(defaults: SharedDefaults.suite).store(schedule, for: "home1", now: Date())

        let home = SharedDefaults.suite.string(forKey: SharedDefaults.homeStopKey)
        let cache = ScheduleCache(defaults: SharedDefaults.suite)
        let snapshot = CountdownResolver.snapshot(homeStopId: home, cache: cache, now: Date())
        XCTAssertEqual(snapshot?.minutesUntil, 9)
        XCTAssertEqual(snapshot?.stopName, "Titiwangsa")
    }
}
