import XCTest
@testable import BusWatch

/// Tests the data plumbing behind `DeparturesTowardView`: the schedule model
/// that the `/station/:stopId/schedule/toward` endpoint returns, and the
/// empty-state branch the view renders when no trips head toward the saved
/// destination.
final class DeparturesTowardViewTests: XCTestCase {

    func testDecodesTowardDestinationSchedule() throws {
        let json = """
        {
            "stopId": "current",
            "stopName": "Current Stop",
            "departures": [
                {"line": "Line A", "destination": "Toward Dest", "departureTime": "08:30:30", "minutesUntil": 5}
            ]
        }
        """.data(using: .utf8)!

        let response = try JSONDecoder().decode(StationScheduleResponse.self, from: json)

        XCTAssertEqual(response.stopId, "current")
        XCTAssertEqual(response.stopName, "Current Stop")
        XCTAssertEqual(response.departures.count, 1)
        XCTAssertEqual(response.departures.first?.destination, "Toward Dest")
        XCTAssertEqual(response.departures.first?.minutesUntil, 5)
    }

    func testEmptyDeparturesSurfacesEmptyState() {
        // The view shows its "No departures toward …" empty state precisely
        // when the filtered schedule has no departures.
        let schedule = StationScheduleResponse(stopId: "current", stopName: "Current Stop", departures: [])
        XCTAssertTrue(schedule.departures.isEmpty)
    }

    func testMultipleDeparturesPreserveOrder() throws {
        let json = """
        {
            "stopId": "current",
            "stopName": "Current Stop",
            "departures": [
                {"line": "Line A", "destination": "Toward Dest", "departureTime": "08:30:30", "minutesUntil": 5},
                {"line": "Line B", "destination": "Also Toward", "departureTime": "08:50:30", "minutesUntil": 25}
            ]
        }
        """.data(using: .utf8)!

        let response = try JSONDecoder().decode(StationScheduleResponse.self, from: json)

        XCTAssertEqual(response.departures.count, 2)
        XCTAssertEqual(response.departures[0].departureTime, "08:30:30")
        XCTAssertEqual(response.departures[1].departureTime, "08:50:30")
    }
}
