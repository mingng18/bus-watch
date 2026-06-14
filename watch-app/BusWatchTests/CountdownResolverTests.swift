import XCTest
@testable import BusWatch

/// Tests the pure countdown-resolution logic that powers the complication
/// (#109): reading the home stop from the shared cache, applying time-decay,
/// and computing the WidgetKit refresh cadence. The resolver is WidgetKit-
/// free so it can be exercised entirely in-process.
final class CountdownResolverTests: XCTestCase {

    private func makeDefaults(suite: String = "buswatch.tests.\(UUID().uuidString)") -> UserDefaults {
        let defaults = UserDefaults(suiteName: suite)!
        defaults.removePersistentDomain(forName: suite)
        return defaults
    }

    /// A 3-departures schedule; `minutesUntil` values are relative to the
    /// fetch time, matching how `ScheduleCache` stores them.
    private func makeSchedule(stopId: String = "home1",
                              stopName: String = "Titiwangsa",
                              minutes: [Int] = [10, 22, 40],
                              now: Date) -> StationScheduleResponse {
        let departures = minutes.enumerated().map { i, m in
            Departure(line: "U82",
                      destination: i == 0 ? "Sentul" : "Sentul Timur",
                      departureTime: "08:\(30 + i * 10):00",
                      minutesUntil: m)
        }
        return StationScheduleResponse(stopId: stopId, stopName: stopName, departures: departures)
    }

    private func cache(with schedule: StationScheduleResponse,
                       stopId: String,
                       fetchedAt: Date) -> ScheduleCache {
        let cache = ScheduleCache(defaults: makeDefaults())
        cache.store(schedule, for: stopId, now: fetchedAt)
        return cache
    }

    private let epoch = Date(timeIntervalSince1970: 1_700_000_000)

    // MARK: - snapshot

    func testReturnsNilWhenNoHomeStop() {
        let cache = cache(with: makeSchedule(now: epoch), stopId: "home1", fetchedAt: epoch)
        XCTAssertNil(CountdownResolver.snapshot(homeStopId: nil, cache: cache, now: epoch))
    }

    func testReturnsNilWhenHomeStopNotCached() {
        let cache = cache(with: makeSchedule(now: epoch), stopId: "other", fetchedAt: epoch)
        XCTAssertNil(CountdownResolver.snapshot(homeStopId: "home1", cache: cache, now: epoch))
    }

    func testReturnsNextDepartureMinutesUntil() {
        let cache = cache(with: makeSchedule(minutes: [10, 22, 40], now: epoch),
                          stopId: "home1", fetchedAt: epoch)
        let snap = CountdownResolver.snapshot(homeStopId: "home1", cache: cache, now: epoch)
        XCTAssertEqual(snap?.minutesUntil, 10)
        XCTAssertEqual(snap?.line, "U82")
        XCTAssertEqual(snap?.destination, "Sentul")
        XCTAssertEqual(snap?.stopName, "Titiwangsa")
    }

    func testTimeDecaySubtractsElapsedMinutes() {
        // Cached 10 min away; 4 minutes later the countdown should read 6.
        let cache = cache(with: makeSchedule(minutes: [10], now: epoch),
                          stopId: "home1", fetchedAt: epoch)
        let now = epoch.addingTimeInterval(4 * 60)
        let snap = CountdownResolver.snapshot(homeStopId: "home1", cache: cache, now: now)
        XCTAssertEqual(snap?.minutesUntil, 6)
    }

    func testTimeDecayClampsAtZero() {
        // Cached 10 min away; 10 minutes later the bus is arriving now (decayed
        // to exactly 0), which still counts as upcoming → shows 0.
        let cache = cache(with: makeSchedule(minutes: [10], now: epoch),
                          stopId: "home1", fetchedAt: epoch)
        let now = epoch.addingTimeInterval(10 * 60)
        let snap = CountdownResolver.snapshot(homeStopId: "home1", cache: cache, now: now)
        XCTAssertEqual(snap?.minutesUntil, 0)
    }

    func testReturnsNilWhenBusHasFullyDeparted() {
        // Cached 2 min away; 10 minutes later it has left (decayed to -8) with
        // no later departure → nothing upcoming.
        let cache = cache(with: makeSchedule(minutes: [2], now: epoch),
                          stopId: "home1", fetchedAt: epoch)
        let now = epoch.addingTimeInterval(10 * 60)
        XCTAssertNil(CountdownResolver.snapshot(homeStopId: "home1", cache: cache, now: now))
    }

    func testSkipsAlreadyDepartedRowsAfterDecay() {
        // First departure decayed away (5 min, 7 min later = departed);
        // the resolver should fall through to the next valid departure (18).
        let cache = cache(with: makeSchedule(minutes: [5, 25], now: epoch),
                          stopId: "home1", fetchedAt: epoch)
        let now = epoch.addingTimeInterval(7 * 60)
        let snap = CountdownResolver.snapshot(homeStopId: "home1", cache: cache, now: now)
        // 25 - 7 = 18
        XCTAssertEqual(snap?.minutesUntil, 18)
    }

    func testReturnsNilWhenAllDeparturesHaveDepartedAfterDecay() {
        let cache = cache(with: makeSchedule(minutes: [3, 5], now: epoch),
                          stopId: "home1", fetchedAt: epoch)
        let now = epoch.addingTimeInterval(20 * 60)
        XCTAssertNil(CountdownResolver.snapshot(homeStopId: "home1", cache: cache, now: now))
    }

    func testIsStaleWhenCacheOlderThanMaxAge() {
        // Use a far-future departure so the row is still upcoming after 11 min,
        // letting the staleness flag be the thing under test.
        let cache = cache(with: makeSchedule(minutes: [60], now: epoch),
                          stopId: "home1", fetchedAt: epoch)
        let now = epoch.addingTimeInterval(11 * 60) // 660s > 600s default
        let snap = CountdownResolver.snapshot(homeStopId: "home1", cache: cache, now: now)
        XCTAssertTrue(snap?.isStale == true)
    }

    func testIsNotStaleWhenCacheFresh() {
        let cache = cache(with: makeSchedule(minutes: [10], now: epoch),
                          stopId: "home1", fetchedAt: epoch)
        let now = epoch.addingTimeInterval(2 * 60)
        let snap = CountdownResolver.snapshot(homeStopId: "home1", cache: cache, now: now)
        XCTAssertFalse(snap?.isStale == true)
    }

    // MARK: - nextRefresh

    func testNextRefreshTicksEachMinuteWhenSnapshot() {
        let snap = CountdownSnapshot(stopId: "home1", stopName: "T", line: "U82",
                                     destination: "Sentul", minutesUntil: 7,
                                     isStale: false, fetchedAt: epoch)
        // 22:13:20 → next whole minute is 22:14:00 (40s later).
        let next = CountdownResolver.nextRefresh(after: snap, now: epoch)
        let calendar = Calendar.current
        let secs = calendar.component(.second, from: next)
        XCTAssertEqual(secs, 0)
        XCTAssertGreaterThan(next, epoch)
    }

    func testNextRefreshThrottledWhenNoSnapshot() {
        let next = CountdownResolver.nextRefresh(after: nil, now: epoch)
        XCTAssertEqual(next.timeIntervalSince(epoch), 15 * 60, accuracy: 1)
    }
}
