import XCTest
@testable import BusWatch

final class NearbyResponseTests: XCTestCase {

    func testDecodeNearbyResponseWithStopsAndRoutes() throws {
        // Given
        let json = """
        {
            "stops": [
                {
                    "id": "stop_1",
                    "name": "Main St",
                    "type": "bus",
                    "distance_m": 120,
                    "lat": 40.7128,
                    "lon": -74.0060,
                    "arrivals": [
                        {
                            "destination": "Downtown",
                            "minutes": 5,
                            "isRealtime": true,
                            "route": "A1",
                            "eta_source": "live"
                        }
                    ]
                }
            ],
            "busRoutes": [
                {
                    "routeId": "route_1",
                    "routeShortName": "10",
                    "destination": "Uptown",
                    "minutes": 3,
                    "tripId": "trip_1",
                    "lat": 40.7130,
                    "lon": -74.0062,
                    "busNo": "B123"
                }
            ]
        }
        """.data(using: .utf8)!

        // When
        let decoder = JSONDecoder()
        let response = try decoder.decode(NearbyResponse.self, from: json)

        // Then
        XCTAssertEqual(response.stops.count, 1)
        XCTAssertEqual(response.stops[0].id, "stop_1")
        XCTAssertEqual(response.stops[0].name, "Main St")
        XCTAssertEqual(response.stops[0].distanceM, 120)
        XCTAssertEqual(response.stops[0].arrivals.count, 1)
        XCTAssertEqual(response.stops[0].arrivals[0].destination, "Downtown")
        XCTAssertEqual(response.stops[0].arrivals[0].minutes, 5)
        XCTAssertTrue(response.stops[0].arrivals[0].isRealtime)
        XCTAssertEqual(response.stops[0].arrivals[0].route, "A1")
        XCTAssertEqual(response.stops[0].arrivals[0].etaSource, "live")

        XCTAssertEqual(response.busRoutes.count, 1)
        XCTAssertEqual(response.busRoutes[0].routeId, "route_1")
        XCTAssertEqual(response.busRoutes[0].destination, "Uptown")
        XCTAssertEqual(response.busRoutes[0].minutes, 3)
        XCTAssertEqual(response.busRoutes[0].busNo, "B123")
    }

    func testDecodeNearbyResponseWithEmptyBusRoutes() throws {
        // Given
        let json = """
        {
            "stops": [
                {
                    "id": "stop_1",
                    "name": "Main St",
                    "type": "bus",
                    "distance_m": 120,
                    "arrivals": []
                }
            ],
            "busRoutes": []
        }
        """.data(using: .utf8)!

        // When
        let decoder = JSONDecoder()
        let response = try decoder.decode(NearbyResponse.self, from: json)

        // Then
        XCTAssertEqual(response.stops.count, 1)
        XCTAssertEqual(response.stops[0].id, "stop_1")
        XCTAssertTrue(response.busRoutes.isEmpty, "busRoutes should parse as an empty array")
    }

    func testNearbyResponseCustomInit() {
        // Given
        let arrival = Arrival(
            line: nil,
            route: "A1",
            destination: "Downtown",
            minutes: 5,
            isRealtime: true,
            tripId: nil,
            etaSource: "live",
            confidence: nil,
            uncertaintyMinutes: nil
        )
        let stop = NearbyStop(
            id: "s1",
            name: "S1",
            type: "bus",
            lat: 0,
            lon: 0,
            distanceM: 10,
            arrivals: [arrival]
        )
        let route = BusRouteEntry(
            routeId: "r1",
            routeShortName: "1",
            destination: "D1",
            minutes: 5,
            tripId: "t1",
            lat: 0,
            lon: 0,
            busNo: nil
        )

        // When
        let responseWithRoutes = NearbyResponse(stops: [stop], busRoutes: [route])
        let responseWithoutRoutes = NearbyResponse(stops: [stop])

        // Then
        XCTAssertEqual(responseWithRoutes.stops.count, 1)
        XCTAssertEqual(responseWithRoutes.busRoutes.count, 1)

        XCTAssertEqual(responseWithoutRoutes.stops.count, 1)
        XCTAssertTrue(responseWithoutRoutes.busRoutes.isEmpty)
    }
}
