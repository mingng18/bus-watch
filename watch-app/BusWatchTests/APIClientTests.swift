import XCTest
@testable import BusWatch

class APIClientMockURLProtocol: URLProtocol {
    static var requestHandler: ((URLRequest) throws -> (HTTPURLResponse, Data))?

    override class func canInit(with request: URLRequest) -> Bool {
        return true
    }

    override class func canonicalRequest(for request: URLRequest) -> URLRequest {
        return request
    }

    override func startLoading() {
        guard let handler = APIClientMockURLProtocol.requestHandler else {
            XCTFail("Received unexpected request with no handler set")
            return
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
    var sut: APIClient!
    var session: URLSession!

    override func setUp() {
        super.setUp()

        let configuration = URLSessionConfiguration.ephemeral
        configuration.protocolClasses = [APIClientMockURLProtocol.self]
        session = URLSession(configuration: configuration)

        sut = APIClient(baseURL: "https://test.api", session: session)
    }

    override func tearDown() {
        APIClientMockURLProtocol.requestHandler = nil
        sut = nil
        session = nil
        super.tearDown()
    }

    func testFetchNearbySuccess() async throws {
        // Given
        let expectedJSON = """
        {
            "stops": [
                {
                    "id": "stop1",
                    "name": "Central Station",
                    "type": "bus",
                    "distance_m": 100,
                    "arrivals": []
                }
            ]
        }
        """.data(using: .utf8)!

                APIClientMockURLProtocol.requestHandler = { request in
            guard let url = request.url,
                  let components = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
                XCTFail("Invalid URL")
                throw URLError(.badURL)
            }
            XCTAssertEqual(components.scheme, "https")
            XCTAssertEqual(components.host, "test.api")
            XCTAssertEqual(components.path, "/nearby")

            let expectedQueryItems: [URLQueryItem] = [
                URLQueryItem(name: "lat", value: "10.0"),
                URLQueryItem(name: "lon", value: "20.0")
            ]

            for item in expectedQueryItems {
                XCTAssertTrue(components.queryItems?.contains(item) == true, "Missing query item \(item)")
            }

            let response = HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!
            return (response, expectedJSON)
        }

        // When
        let result = try await sut.fetchNearby(lat: 10.0, lon: 20.0)

        // Then
        XCTAssertEqual(result.stops.count, 1)
        XCTAssertEqual(result.stops[0].id, "stop1")
        XCTAssertEqual(result.stops[0].name, "Central Station")
    }

    func testFetchStationScheduleSuccess() async throws {
        // Given
        let expectedJSON = """
        {
            "stopId": "stop1",
            "stopName": "Central Station",
            "departures": []
        }
        """.data(using: .utf8)!

        APIClientMockURLProtocol.requestHandler = { request in
            XCTAssertEqual(request.url?.absoluteString, "https://test.api/station/stop1/schedule")
            let response = HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!
            return (response, expectedJSON)
        }

        // When
        let result = try await sut.fetchStationSchedule(stopId: "stop1")

        // Then
        XCTAssertEqual(result.stopId, "stop1")
        XCTAssertEqual(result.stopName, "Central Station")
    }

    func testInvalidURLHandling() async {
        // Given
        // We'll pass a stopId that breaks the URL string when combined with the path.
        // Swift 5.9 URL(string:) handles spaces, but empty string or complex invalid chars might still fail parsing if not percent encoded (though we percent encode).
        // To force invalidURL without relying on percent encoding (which fixes spaces), we can modify the APIClient to test makeURL throws, but it's easier to test the base URL being invalid or similar.
        // Since `baseURL` + `path` is constructed, if we set an empty baseURL it might still form a relative URL.
        // Let's create an APIClient with an invalid character in baseURL.

        let invalidClient = APIClient(baseURL: "https://test.api/invalid char", session: session)

        // When
        do {
            _ = try await invalidClient.fetchStationSchedule(stopId: "stop1")
            XCTFail("Should have thrown APIError.invalidURL")
        } catch let error as APIError {
            XCTAssertEqual(error, APIError.invalidURL)
            XCTAssertEqual(error.friendlyMessage, "Couldn't load this stop. Try another.")
        } catch {
            XCTFail("Expected APIError.invalidURL, got \(error)")
        }
    }

    func testBadResponseStatusCode() async {
        // Given
        APIClientMockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(url: request.url!, statusCode: 404, httpVersion: nil, headerFields: nil)!
            return (response, Data())
        }

        // When
        do {
            _ = try await sut.fetchStationSchedule(stopId: "stop1")
            XCTFail("Should have thrown APIError.badResponse")
        } catch let error as APIError {
            XCTAssertEqual(error, APIError.badResponse)
            XCTAssertEqual(error.friendlyMessage, "Couldn't reach BusWatch. Check your connection.")
        } catch {
            XCTFail("Expected APIError.badResponse, got \(error)")
        }
    }

    func testNetworkError() async {
        // Given
        APIClientMockURLProtocol.requestHandler = { request in
            throw URLError(.notConnectedToInternet)
        }

        // When
        do {
            _ = try await sut.fetchStationSchedule(stopId: "stop1")
            XCTFail("Should have thrown URLError")
        } catch {
            XCTAssertEqual(friendlyMessage(for: error), APIError.badResponse.friendlyMessage)
        }
    }
}
