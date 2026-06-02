import XCTest
@testable import BusWatch

class MockURLProtocol: URLProtocol {
    static var requestHandler: ((URLRequest) throws -> (HTTPURLResponse, Data))?

    override class func canInit(with request: URLRequest) -> Bool {
        return true
    }

    override class func canonicalRequest(for request: URLRequest) -> URLRequest {
        return request
    }

    override func startLoading() {
        guard let handler = MockURLProtocol.requestHandler else {
            fatalError("Handler is unavailable.")
        }

        do {
            let (response, data) = try handler(request)
            client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
            client?.urlProtocol(self, didLoad: data)
            client?.urlProtocolDidFinishLoading(self)
        } catch {
            client?.urlProtocol(self, didFailWithError: error)
        }
    }

    override func stopLoading() {}
}

final class APIClientTests: XCTestCase {

    var apiClient: APIClient!

    override func setUp() {
        super.setUp()
        let configuration = URLSessionConfiguration.ephemeral
        configuration.protocolClasses = [MockURLProtocol.self]
        let session = URLSession(configuration: configuration)
        apiClient = APIClient(baseURL: "https://test.api", session: session)
    }

    override func tearDown() {
        apiClient = nil
        MockURLProtocol.requestHandler = nil
        super.tearDown()
    }

    func testFetchNearbySuccess() async throws {
        let json = """
        {
            "stops": [
                {
                    "id": "stop1",
                    "name": "Stop 1",
                    "type": "bus",
                    "distance_m": 100,
                    "arrivals": [
                        {
                            "line": "A",
                            "destination": "Downtown",
                            "minutes": 5,
                            "isRealtime": true
                        }
                    ]
                }
            ]
        }
        """

        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!
            return (response, json.data(using: .utf8)!)
        }

        let response = try await apiClient.fetchNearby(lat: 1.0, lon: 2.0)
        XCTAssertEqual(response.stops.count, 1)
        XCTAssertEqual(response.stops[0].id, "stop1")
        XCTAssertEqual(response.stops[0].name, "Stop 1")
        XCTAssertEqual(response.stops[0].distanceM, 100)
        XCTAssertEqual(response.stops[0].arrivals.count, 1)
        XCTAssertEqual(response.stops[0].arrivals[0].line, "A")
    }

    func testFetchStationScheduleSuccess() async throws {
        let json = """
        {
            "stopId": "stat1",
            "stopName": "Station 1",
            "departures": [
                {
                    "line": "Blue",
                    "destination": "North",
                    "departureTime": "10:00",
                    "minutesUntil": 10
                }
            ]
        }
        """

        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!
            return (response, json.data(using: .utf8)!)
        }

        let response = try await apiClient.fetchStationSchedule(stopId: "stat1")
        XCTAssertEqual(response.stopId, "stat1")
        XCTAssertEqual(response.stopName, "Station 1")
        XCTAssertEqual(response.departures.count, 1)
        XCTAssertEqual(response.departures[0].line, "Blue")
        XCTAssertEqual(response.departures[0].minutesUntil, 10)
    }

    func testFetchBusProgressSuccess() async throws {
        let json = """
        {
            "tripId": "trip1",
            "routeShortName": "B",
            "destination": "South",
            "busPosition": {
                "lat": 1.2,
                "lon": 3.4
            },
            "stops": [
                {
                    "id": "stop1",
                    "name": "Stop 1",
                    "arrivalTime": "10:00",
                    "passed": true,
                    "isCurrent": false
                }
            ],
            "progressPercent": 50
        }
        """

        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!
            return (response, json.data(using: .utf8)!)
        }

        let response = try await apiClient.fetchBusProgress(tripId: "trip1")
        XCTAssertEqual(response.tripId, "trip1")
        XCTAssertEqual(response.progressPercent, 50)
        XCTAssertEqual(response.busPosition?.lat, 1.2)
        XCTAssertEqual(response.stops.count, 1)
        XCTAssertEqual(response.stops[0].passed, true)
    }

    func testFetchRoutesSuccess() async throws {
        let json = """
        {
            "routes": [
                {
                    "id": "route1",
                    "shortName": "R1",
                    "longName": "Route 1",
                    "type": "bus"
                }
            ]
        }
        """

        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!
            return (response, json.data(using: .utf8)!)
        }

        let response = try await apiClient.fetchRoutes(lat: 1.0, lon: 2.0)
        XCTAssertEqual(response.routes.count, 1)
        XCTAssertEqual(response.routes[0].id, "route1")
        XCTAssertEqual(response.routes[0].shortName, "R1")
    }

    func testFetchBadResponse() async {
        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(url: request.url!, statusCode: 404, httpVersion: nil, headerFields: nil)!
            return (response, Data())
        }

        do {
            _ = try await apiClient.fetchNearby(lat: 1.0, lon: 2.0)
            XCTFail("Expected badResponse error")
        } catch let error as APIError {
            XCTAssertEqual(error, .badResponse)
        } catch {
            XCTFail("Unexpected error type: \\(error)")
        }
    }
}
