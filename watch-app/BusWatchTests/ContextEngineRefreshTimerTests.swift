import XCTest
@testable import BusWatch

/// Pins down the bus-trip auto-refresh timer lifecycle (#129).
///
/// Before the fix, `refreshTimer` was only invalidated when a *new* trip
/// started, so leaving the trip view (`.station`/`.nearby`/`.error`) left a
/// 30s timer polling `fetchBusProgress` for a trip nobody was viewing —
/// battery + network drain, and it could flip the UI back to `.onBus`/
/// `.error`. These tests assert the invariant: the timer is armed only while
/// in `.onBus`, and any other state tears it down.
///
/// We drive transitions through `setState` and arm the timer via
/// `startAutoRefresh` (both internal for this reason) rather than the
/// network-backed public methods, so the test is deterministic and never
/// hits the backend. The timer's 30s cadence is long enough that it never
/// fires during these synchronous transitions, so no real fetch is issued.
final class ContextEngineRefreshTimerTests: XCTestCase {

    private func makeNearby() -> NearbyResponse {
        NearbyResponse(stops: [
            NearbyStop(id: "stop1", name: "Titiwangsa", type: "bus",
                       distanceM: 120, arrivals: [])
        ])
    }

    private func makeProgress() -> BusProgressResponse {
        BusProgressResponse(tripId: "trip1", routeShortName: "U82",
                            destination: "Sentul", busPosition: nil,
                            stops: [], progressPercent: 50)
    }

    private func makeSchedule() -> StationScheduleResponse {
        StationScheduleResponse(
            stopId: "stop1", stopName: "Titiwangsa",
            departures: [Departure(line: "U82", destination: "Sentul",
                                   departureTime: "08:30:00", minutesUntil: 5)]
        )
    }

    // MARK: - Timer starts off

    func testTimerNotRunningByDefault() {
        let engine = ContextEngine()
        XCTAssertFalse(engine.isAutoRefreshing,
                       "A fresh engine with no active trip must not be polling")
    }

    // MARK: - Arming the timer on a trip

    func testStartingAutoRefreshArmsTimer() {
        let engine = ContextEngine()
        engine.startAutoRefresh(tripId: "trip1")
        XCTAssertTrue(engine.isAutoRefreshing,
                      "startAutoRefresh should arm the 30s refresh timer")
    }

    func testRepeatingOnBusKeepsTimerRunning() {
        // The timer's own refresh callback re-enters `.onBus` on every tick.
        // Those transitions must NOT tear the timer down — that's the happy
        // path the fix is careful to preserve.
        let engine = ContextEngine()
        engine.startAutoRefresh(tripId: "trip1")
        engine.setState(.onBus(makeProgress()))
        XCTAssertTrue(engine.isAutoRefreshing,
                      "Re-entering .onBus must keep the refresh timer armed")
    }

    // MARK: - Leaving the trip tears the timer down (the #129 fix)

    func testNearbyStopsTimer() {
        let engine = ContextEngine()
        engine.startAutoRefresh(tripId: "trip1")
        XCTAssertTrue(engine.isAutoRefreshing)

        engine.setState(.nearby(makeNearby()))

        XCTAssertFalse(engine.isAutoRefreshing,
                       "Leaving the trip for .nearby must stop the refresh timer")
    }

    func testStationStopsTimer() {
        let engine = ContextEngine()
        engine.startAutoRefresh(tripId: "trip1")
        XCTAssertTrue(engine.isAutoRefreshing)

        let stop = makeNearby().stops.first!
        engine.setState(.station(stop, makeSchedule(), isOffline: false))

        XCTAssertFalse(engine.isAutoRefreshing,
                       "Leaving the trip for .station must stop the refresh timer")
    }

    func testErrorStopsTimer() {
        let engine = ContextEngine()
        engine.startAutoRefresh(tripId: "trip1")
        XCTAssertTrue(engine.isAutoRefreshing)

        engine.setState(.error("Network is down"))

        XCTAssertFalse(engine.isAutoRefreshing,
                       "Entering .error must stop the refresh timer (no point polling)")
    }

    func testNoLocationStopsTimer() {
        let engine = ContextEngine()
        engine.startAutoRefresh(tripId: "trip1")
        XCTAssertTrue(engine.isAutoRefreshing)

        engine.setState(.noLocation)

        XCTAssertFalse(engine.isAutoRefreshing,
                       "Dropping to .noLocation must stop the refresh timer")
    }

    func testLoadingStopsTimer() {
        let engine = ContextEngine()
        engine.startAutoRefresh(tripId: "trip1")
        XCTAssertTrue(engine.isAutoRefreshing)

        engine.setState(.loading)

        XCTAssertFalse(engine.isAutoRefreshing,
                       "Returning to .loading must stop the refresh timer")
    }

    // MARK: - Restarting a trip re-arms the timer

    func testStartingNewTripAfterLeavingReArmsTimer() {
        let engine = ContextEngine()
        engine.startAutoRefresh(tripId: "trip1")
        engine.setState(.nearby(makeNearby())) // leaves the trip
        XCTAssertFalse(engine.isAutoRefreshing)

        // The rider picks a new trip — the timer must come back.
        engine.startAutoRefresh(tripId: "trip2")

        XCTAssertTrue(engine.isAutoRefreshing,
                      "Selecting a new trip after leaving must re-arm the refresh timer")
    }
}
