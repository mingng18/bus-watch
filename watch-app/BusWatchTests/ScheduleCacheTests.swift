import XCTest
@testable import BusWatch

/// Tests the offline schedule cache (#108): the cache that backs the
/// network-failure fallback branch in `ContextEngine.selectStation`.
///
/// The fallback decision itself is "network fails → read cache → show with
/// offline flag", so these tests pin down the cache primitives that make
/// that branch correct: store/retrieve round-trip, freshness, eviction,
/// and persistence across instances (matching FavoriteStore's style).
final class ScheduleCacheTests: XCTestCase {

    private func makeDefaults(suite: String = "buswatch.tests.\(UUID().uuidString)") -> UserDefaults {
        let defaults = UserDefaults(suiteName: suite)!
        defaults.removePersistentDomain(forName: suite)
        return defaults
    }

    private func makeSchedule(stopId: String = "stop1",
                              stopName: String = "Titiwangsa",
                              minutesUntil: Int = 5) -> StationScheduleResponse {
        StationScheduleResponse(
            stopId: stopId,
            stopName: stopName,
            departures: [
                Departure(line: "U82", destination: "Sentul",
                          departureTime: "08:30:00", minutesUntil: minutesUntil)
            ]
        )
    }

    // MARK: - Store / retrieve

    func testStoreThenRetrieveReturnsCachedSchedule() {
        let cache = ScheduleCache(defaults: makeDefaults())
        let schedule = makeSchedule()

        cache.store(schedule, for: "stop1")

        let retrieved = cache.schedule(for: "stop1")
        XCTAssertEqual(retrieved?.stopId, "stop1")
        XCTAssertEqual(retrieved?.departures.count, 1)
        XCTAssertEqual(retrieved?.departures.first?.minutesUntil, 5)
    }

    func testRetrieveReturnsNilForUncachedStop() {
        let cache = ScheduleCache(defaults: makeDefaults())
        XCTAssertNil(cache.schedule(for: "ghost"))
    }

    func testStoreOverwritesPreviousEntry() {
        let cache = ScheduleCache(defaults: makeDefaults())
        cache.store(makeSchedule(minutesUntil: 5), for: "stop1")
        cache.store(makeSchedule(minutesUntil: 12), for: "stop1")

        XCTAssertEqual(cache.schedule(for: "stop1")?.departures.first?.minutesUntil, 12)
    }

    // MARK: - Staleness (drives the offline indicator)

    func testFreshEntryIsNotStale() {
        let cache = ScheduleCache(defaults: makeDefaults())
        let now = Date()
        cache.store(makeSchedule(), for: "stop1", now: now)

        XCTAssertFalse(cache.isStale("stop1", maxAge: 600, now: now))
    }

    func testOldEntryIsStale() {
        let cache = ScheduleCache(defaults: makeDefaults())
        let fetchedAt = Date()
        let now = fetchedAt.addingTimeInterval(60 * 30) // 30 min later

        cache.store(makeSchedule(), for: "stop1", now: fetchedAt)

        XCTAssertTrue(cache.isStale("stop1", maxAge: 60 * 10, now: now))
    }

    func testAbsentEntryIsStale() {
        let cache = ScheduleCache(defaults: makeDefaults())
        XCTAssertTrue(cache.isStale("ghost", maxAge: 600, now: Date()))
    }

    // MARK: - Eviction

    func testRemoveDropsSingleEntry() {
        let cache = ScheduleCache(defaults: makeDefaults())
        cache.store(makeSchedule(), for: "stop1")
        cache.store(makeSchedule(stopId: "stop2"), for: "stop2")

        cache.remove("stop1")

        XCTAssertNil(cache.schedule(for: "stop1"))
        XCTAssertNotNil(cache.schedule(for: "stop2"))
    }

    func testRemoveIsNoOpForUncachedStop() {
        let cache = ScheduleCache(defaults: makeDefaults())
        cache.store(makeSchedule(), for: "stop1")

        cache.remove("ghost")

        XCTAssertNotNil(cache.schedule(for: "stop1"))
    }

    func testClearEmptiesEverything() {
        let cache = ScheduleCache(defaults: makeDefaults())
        cache.store(makeSchedule(), for: "stop1")
        cache.store(makeSchedule(stopId: "stop2"), for: "stop2")

        cache.clear()

        XCTAssertNil(cache.schedule(for: "stop1"))
        XCTAssertNil(cache.schedule(for: "stop2"))
    }

    // MARK: - Persistence across instances

    func testCachePersistsAcrossInstances() {
        let suite = "buswatch.tests.persist.\(UUID().uuidString)"
        let defaults = UserDefaults(suiteName: suite)!
        defer { defaults.removePersistentDomain(forName: suite) }

        let cache1 = ScheduleCache(defaults: defaults)
        cache1.store(makeSchedule(), for: "stop1")

        let cache2 = ScheduleCache(defaults: defaults)
        XCTAssertEqual(cache2.schedule(for: "stop1")?.stopId, "stop1")
    }

    // MARK: - Entry (schedule + timestamp)

    func testEntryExposesFetchTimestamp() {
        let cache = ScheduleCache(defaults: makeDefaults())
        let now = Date()
        cache.store(makeSchedule(), for: "stop1", now: now)

        let entry = cache.entry(for: "stop1")
        XCTAssertEqual(entry?.fetchedAt, now)
    }

    // MARK: - Fallback decision contract

    /// Documents the contract `ContextEngine.selectStation` relies on:
    /// when the network fails, a previously-cached schedule is served and
    /// flagged offline; with no cache, the engine surfaces the error.
    func testFallbackBranchHasScheduleAfterStore() {
        let cache = ScheduleCache(defaults: makeDefaults())
        // Simulate a successful earlier fetch populating the cache.
        cache.store(makeSchedule(), for: "stop1")

        // Simulate the offline branch: cache is consulted and non-nil.
        let offlineSchedule = cache.schedule(for: "stop1")
        XCTAssertNotNil(offlineSchedule,
                        "Offline fallback must find a schedule after a prior store")
    }

    func testFallbackBranchHasNoScheduleWhenNeverCached() {
        let cache = ScheduleCache(defaults: makeDefaults())
        // No prior fetch — the offline branch finds nothing to fall back to.
        XCTAssertNil(cache.schedule(for: "stop1"))
    }

    // MARK: - Resilience

    func testCorruptBlobDegradesToEmptyCache() {
        let suite = "buswatch.tests.corrupt.\(UUID().uuidString)"
        let defaults = UserDefaults(suiteName: suite)!
        defer { defaults.removePersistentDomain(forName: suite) }

        // Write garbage where the cache blob is expected.
        defaults.set(Data("not-json".utf8), forKey: "buswatch.scheduleCache")

        let cache = ScheduleCache(defaults: defaults)
        // A corrupt blob must not crash — it degrades to an empty cache.
        XCTAssertNil(cache.schedule(for: "stop1"))
        XCTAssertNil(cache.entry(for: "stop1"))
    }
}
