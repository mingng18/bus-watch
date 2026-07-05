import XCTest
@testable import BusWatch

class MockURLProtocol: URLProtocol {
    static var mockData: Data?
    static var mockResponse: HTTPURLResponse?
    static var mockError: Error?

    override class func canInit(with request: URLRequest) -> Bool {
        return true
    }

    override class func canonicalRequest(for request: URLRequest) -> URLRequest {
        return request
    }

    override func startLoading() {
        if let error = MockURLProtocol.mockError {
            client?.urlProtocol(self, didFailWithError: error)
        } else {
            if let response = MockURLProtocol.mockResponse {
                client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
            }
            if let data = MockURLProtocol.mockData {
                client?.urlProtocol(self, didLoad: data)
            }
            client?.urlProtocolDidFinishLoading(self)
        }
    }

    override func stopLoading() {}
}

final class APIClientTests: XCTestCase {
    var apiClient: APIClient!

    override func setUp() {
        super.setUp()
        MockURLProtocol.mockData = nil
        MockURLProtocol.mockResponse = nil
        MockURLProtocol.mockError = nil

        let configuration = URLSessionConfiguration.ephemeral
        configuration.protocolClasses = [MockURLProtocol.self]
        let session = URLSession(configuration: configuration)
        apiClient = APIClient(baseURL: "https://test.example.com", session: session)
    }

    func testFetchNearby_Success() async throws {
        let json = """
        {
            "stops": [
                {
                    "id": "stop1",
                    "name": "Test Stop",
                    "type": "bus",
                    "distance_m": 100,
                    "arrivals": []
                }
            ]
        }
        """
        MockURLProtocol.mockData = json.data(using: .utf8)
        MockURLProtocol.mockResponse = HTTPURLResponse(url: URL(string: "https://test.example.com")!, statusCode: 200, httpVersion: nil, headerFields: nil)

        let response = try await apiClient.fetchNearby(lat: 1.0, lon: 2.0)
        XCTAssertEqual(response.stops.count, 1)
        XCTAssertEqual(response.stops[0].id, "stop1")
    }

    func testFetchStationSchedule_Success() async throws {
        let json = """
        {
            "stopId": "stop1",
            "stopName": "Test Stop",
            "departures": [
                {
                    "line": "L1",
                    "destination": "Dest",
                    "departureTime": "10:00",
                    "minutesUntil": 5
                }
            ]
        }
        """
        MockURLProtocol.mockData = json.data(using: .utf8)
        MockURLProtocol.mockResponse = HTTPURLResponse(url: URL(string: "https://test.example.com")!, statusCode: 200, httpVersion: nil, headerFields: nil)

        let response = try await apiClient.fetchStationSchedule(stopId: "stop1")
        XCTAssertEqual(response.stopId, "stop1")
        XCTAssertEqual(response.departures.count, 1)
        XCTAssertEqual(response.departures[0].line, "L1")
    }

    func testFetchDeparturesToward_Success() async throws {
        let json = """
        {
            "stopId": "stop1",
            "stopName": "Test Stop",
            "departures": []
        }
        """
        MockURLProtocol.mockData = json.data(using: .utf8)
        MockURLProtocol.mockResponse = HTTPURLResponse(url: URL(string: "https://test.example.com")!, statusCode: 200, httpVersion: nil, headerFields: nil)

        let response = try await apiClient.fetchDeparturesToward(stopId: "stop1", destinationStopId: "dest1")
        XCTAssertEqual(response.stopId, "stop1")
    }

    func testFetchBusProgress_Success() async throws {
        let json = """
        {
            "tripId": "trip1",
            "routeShortName": "R1",
            "destination": "Dest",
            "busPosition": null,
            "stops": [],
            "progressPercent": 50
        }
        """
        MockURLProtocol.mockData = json.data(using: .utf8)
        MockURLProtocol.mockResponse = HTTPURLResponse(url: URL(string: "https://test.example.com")!, statusCode: 200, httpVersion: nil, headerFields: nil)

        let response = try await apiClient.fetchBusProgress(tripId: "trip1")
        XCTAssertEqual(response.tripId, "trip1")
        XCTAssertEqual(response.progressPercent, 50)
    }

    func testFetch_BadResponse() async {
        MockURLProtocol.mockResponse = HTTPURLResponse(url: URL(string: "https://test.example.com")!, statusCode: 500, httpVersion: nil, headerFields: nil)

        do {
            _ = try await apiClient.fetchStationSchedule(stopId: "stop1")
            XCTFail("Expected fetch to throw APIError.badResponse")
        } catch let error as APIError {
            XCTAssertEqual(error, .badResponse)
        } catch {
            XCTFail("Unexpected error type: \(error)")
        }
    }

    func testInvalidURL_Throws() async {
        let badClient = APIClient(baseURL: "https://test.example.com/ space")
        do {
            _ = try await badClient.fetchStationSchedule(stopId: "stop1")
            XCTFail("Expected fetch to throw APIError.invalidURL")
        } catch let error as APIError {
            XCTAssertEqual(error, .invalidURL)
        } catch {
            XCTFail("Unexpected error type: \(error)")
        }
    }
}
