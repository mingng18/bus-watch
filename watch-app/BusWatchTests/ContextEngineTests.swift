import XCTest
import Combine
import CoreLocation
@testable import BusWatch

class ContextEngineMockURLProtocol: URLProtocol {
    static var mockData: [String: Data] = [:]
    static var mockError: Error?

    override class func canInit(with request: URLRequest) -> Bool {
        return true
    }

    override class func canonicalRequest(for request: URLRequest) -> URLRequest {
        return request
    }

    override func startLoading() {
        if let error = ContextEngineMockURLProtocol.mockError {
            self.client?.urlProtocol(self, didFailWithError: error)
            return
        }

        if let url = request.url,
           let data = ContextEngineMockURLProtocol.mockData[url.path] {
            let response = HTTPURLResponse(url: url, statusCode: 200, httpVersion: nil, headerFields: nil)!
            self.client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
            self.client?.urlProtocol(self, didLoad: data)
            self.client?.urlProtocolDidFinishLoading(self)
        } else {
            let response = HTTPURLResponse(url: request.url!, statusCode: 404, httpVersion: nil, headerFields: nil)!
            self.client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
            self.client?.urlProtocolDidFinishLoading(self)
        }
    }

    override func stopLoading() {}
}

final class ContextEngineTests: XCTestCase {
    private var session: URLSession!
    private var cancellables = Set<AnyCancellable>()

    override func setUp() {
        super.setUp()
        let configuration = URLSessionConfiguration.ephemeral
        configuration.protocolClasses = [ContextEngineMockURLProtocol.self]
        session = URLSession(configuration: configuration)
        ContextEngineMockURLProtocol.mockData.removeAll()
        ContextEngineMockURLProtocol.mockError = nil

        let defaults = SharedDefaults.suite
        defaults.removeObject(forKey: SharedDefaults.scheduleCacheKey)
    }

    override func tearDown() {
        cancellables.removeAll()
        session.invalidateAndCancel()
        session = nil
        super.tearDown()
    }

    private func makeEngine() -> ContextEngine {
        ContextEngine(api: APIClient(baseURL: "https://test.api", session: session))
    }

    private func expectState(
        _ engine: ContextEngine,
        matching predicate: @escaping (AppState) -> Bool,
        verify: @escaping (AppState) -> Void
    ) -> XCTestExpectation {
        let exp = expectation(description: "Expected state transition")
        engine.$state.filter(predicate).first().sink { state in
            verify(state)
            exp.fulfill()
        }.store(in: &cancellables)
        return exp
    }

    private func makeNearbyResponse() -> NearbyResponse {
        NearbyResponse(stops: [
            NearbyStop(id: "stop1", name: "Titiwangsa", type: "bus", distanceM: 120, arrivals: [])
        ])
    }

    private func makeScheduleResponse() -> StationScheduleResponse {
        StationScheduleResponse(
            stopId: "stop1", stopName: "Titiwangsa",
            departures: [Departure(line: "U82", destination: "Sentul", departureTime: "08:30:00", minutesUntil: 5)]
        )
    }

    private func makeProgressResponse() -> BusProgressResponse {
        BusProgressResponse(tripId: "trip1", routeShortName: "U82", destination: "Sentul", busPosition: nil, stops: [], progressPercent: 50)
    }

    func testInitialState() {
        let engine = makeEngine()
        if case .loading = engine.state {
            // Pass
        } else {
            XCTFail("Expected initial state to be .loading")
        }
    }

    func testShowNearbyTransitionsState() {
        let engine = makeEngine()
        let nearby = makeNearbyResponse()
        engine.nearbyStops = nearby

        engine.showNearby()

        if case .nearby(let receivedNearby) = engine.state {
            XCTAssertEqual(receivedNearby.stops.first?.id, "stop1")
        } else {
            XCTFail("Expected state to be .nearby")
        }
    }

    func testSelectStationSuccess() {
        let engine = makeEngine()
        let stop = makeNearbyResponse().stops.first!
        let schedule = makeScheduleResponse()
        let encoder = JSONEncoder()

        ContextEngineMockURLProtocol.mockData["/station/stop1/schedule"] = try! encoder.encode(schedule)

        let exp = expectState(engine, matching: {
            if case .station = $0 { return true }
            return false
        }) { state in
            if case .station(let receivedStop, let receivedSchedule, let isOffline) = state {
                XCTAssertEqual(receivedStop.id, stop.id)
                XCTAssertEqual(receivedSchedule.stopId, schedule.stopId)
                XCTAssertFalse(isOffline)
            }
        }
        engine.selectStation(stop)
        wait(for: [exp], timeout: 1.0)
    }

    func testSelectStationFailureWithCacheFallback() {
        let engine = makeEngine()
        let stop = makeNearbyResponse().stops.first!
        let schedule = makeScheduleResponse()

        // Prime the cache
        let cache = ScheduleCache(defaults: SharedDefaults.suite)
        cache.store(schedule, for: stop.id)

        // Mock a network failure
        ContextEngineMockURLProtocol.mockError = URLError(.notConnectedToInternet)

        let exp = expectState(engine, matching: {
            if case .station = $0 { return true }
            return false
        }) { state in
            if case .station(let receivedStop, let receivedSchedule, let isOffline) = state {
                XCTAssertEqual(receivedStop.id, stop.id)
                XCTAssertEqual(receivedSchedule.stopId, schedule.stopId)
                XCTAssertTrue(isOffline)
            }
        }
        engine.selectStation(stop)
        wait(for: [exp], timeout: 1.0)
    }

    func testSelectStationFailureWithoutCache() {
        let engine = makeEngine()
        let stop = makeNearbyResponse().stops.first!

        // Clear cache and mock network error
        let cache = ScheduleCache(defaults: SharedDefaults.suite)
        cache.clear()
        ContextEngineMockURLProtocol.mockError = URLError(.notConnectedToInternet)

        let exp = expectState(engine, matching: {
            if case .error = $0 { return true }
            return false
        }) { state in
            if case .error(let message) = state {
                XCTAssertEqual(message, APIError.badResponse.friendlyMessage)
            }
        }
        engine.selectStation(stop)
        wait(for: [exp], timeout: 1.0)
    }

    func testSelectBusTripSuccess() {
        let engine = makeEngine()
        let progress = makeProgressResponse()
        let encoder = JSONEncoder()

        ContextEngineMockURLProtocol.mockData["/bus/trip/trip1/progress"] = try! encoder.encode(progress)

        let exp = expectState(engine, matching: {
            if case .onBus = $0 { return true }
            return false
        }) { state in
            if case .onBus(let receivedProgress) = state {
                XCTAssertEqual(receivedProgress.tripId, progress.tripId)
                XCTAssertTrue(engine.isAutoRefreshing)
            }
        }
        engine.selectBusTrip("trip1")
        wait(for: [exp], timeout: 1.0)
    }

    @MainActor
    func testRefreshRetriesFromTheSameLocationAfterAnError() async throws {
        let manager = LocationManager(manager: MockCLLocationManager())
        manager.authorizationStatus = .authorizedWhenInUse
        let engine = ContextEngine(api: APIClient(baseURL: "https://test.api", session: session), locationManager: manager)
        ContextEngineMockURLProtocol.mockData["/nearby"] = try JSONEncoder().encode(makeNearbyResponse())
        let initial = expectState(engine, matching: {
            if case .nearby = $0 { return true }
            return false
        }) { _ in }
        manager.location = CLLocation(latitude: 3.14, longitude: 101.68)
        await fulfillment(of: [initial], timeout: 2)

        engine.setState(.error("Connection failed"))
        // No new location event: Retry must perform the request itself.
        await engine.refresh()
        if case .nearby(let response) = engine.state {
            XCTAssertEqual(response.stops.first?.id, "stop1")
        } else {
            XCTFail("Retry must fetch again while the rider is stationary")
        }
    }


    @MainActor
    func testRefreshWithoutLocationRestartsLocationUpdates() async {
        let mock = MockCLLocationManager()
        let manager = LocationManager(manager: mock)
        manager.authorizationStatus = .authorizedWhenInUse
        let engine = ContextEngine(api: APIClient(baseURL: "https://test.api", session: session), locationManager: manager)
        engine.setState(.error("Connection failed"))
        await engine.refresh()
        XCTAssertTrue(mock.startUpdatingLocationCalled)
        if case .loading(let message) = engine.state {
            XCTAssertEqual(message, "Locating...")
        } else {
            XCTFail("Retry without a location must resume locating")
        }
    }

    @MainActor
    func testRefreshRespectsRestrictedLocationAccess() async {
        let manager = LocationManager(manager: MockCLLocationManager())
        manager.authorizationStatus = .restricted
        let engine = ContextEngine(api: APIClient(baseURL: "https://test.api", session: session), locationManager: manager)
        await engine.refresh()
        if case .noLocation = engine.state {} else {
            XCTFail("Restricted location access must show the location guidance")
        }
        XCTAssertFalse(engine.isRefreshing)
    }

}
