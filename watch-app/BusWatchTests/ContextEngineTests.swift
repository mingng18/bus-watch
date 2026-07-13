import XCTest
import Combine
@testable import BusWatch

class MockURLProtocol: URLProtocol {
    static var mockData: [String: Data] = [:]
    static var mockError: Error?

    override class func canInit(with request: URLRequest) -> Bool {
        return true
    }

    override class func canonicalRequest(for request: URLRequest) -> URLRequest {
        return request
    }

    override func startLoading() {
        if let error = MockURLProtocol.mockError {
            self.client?.urlProtocol(self, didFailWithError: error)
            return
        }

        if let url = request.url,
           let data = MockURLProtocol.mockData[url.path] {
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
    var cancellables = Set<AnyCancellable>()

    override func setUp() {
        super.setUp()
        MockURLProtocol.mockData.removeAll()
        MockURLProtocol.mockError = nil

        let defaults = SharedDefaults.suite
        defaults.removeObject(forKey: SharedDefaults.scheduleCacheKey)
    }

    override func tearDown() {
        cancellables.removeAll()
        super.tearDown()
    }

    private func makeEngine() -> ContextEngine {
        let config = URLSessionConfiguration.ephemeral
        config.protocolClasses = [MockURLProtocol.self]
        let session = URLSession(configuration: config)
        let client = APIClient(baseURL: "https://test.local", session: session)
        return ContextEngine(api: client)
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

        MockURLProtocol.mockData["/station/stop1/schedule"] = try! JSONEncoder().encode(schedule)

        let exp = expectation(description: "State changes to station")

        engine.$state
            .dropFirst() // Drop initial .loading
            .sink { state in
                if case .station(let receivedStop, let receivedSchedule, let isOffline) = state {
                    XCTAssertEqual(receivedStop.id, stop.id)
                    XCTAssertEqual(receivedSchedule.stopId, schedule.stopId)
                    XCTAssertFalse(isOffline)
                    exp.fulfill()
                }
            }
            .store(in: &cancellables)

        engine.selectStation(stop)

        wait(for: [exp], timeout: 1.0)
    }

    func testSelectStationFailureWithCacheFallback() {
        let engine = makeEngine()
        let stop = makeNearbyResponse().stops.first!
        let schedule = makeScheduleResponse()

        let cache = ScheduleCache(defaults: SharedDefaults.suite)
        cache.store(schedule, for: stop.id)
        MockURLProtocol.mockError = URLError(.notConnectedToInternet)

        let exp = expectation(description: "State changes to station offline")

        engine.$state
            .dropFirst()
            .sink { state in
                if case .station(let receivedStop, let receivedSchedule, let isOffline) = state {
                    XCTAssertEqual(receivedStop.id, stop.id)
                    XCTAssertEqual(receivedSchedule.stopId, schedule.stopId)
                    XCTAssertTrue(isOffline)
                    exp.fulfill()
                }
            }
            .store(in: &cancellables)

        engine.selectStation(stop)

        wait(for: [exp], timeout: 1.0)
    }

    func testSelectStationFailureWithoutCache() {
        let engine = makeEngine()
        let stop = makeNearbyResponse().stops.first!

        let cache = ScheduleCache(defaults: SharedDefaults.suite)
        cache.clear()
        MockURLProtocol.mockError = URLError(.notConnectedToInternet)

        let exp = expectation(description: "State changes to error")

        engine.$state
            .dropFirst()
            .sink { state in
                if case .error = state {
                    exp.fulfill()
                }
            }
            .store(in: &cancellables)

        engine.selectStation(stop)

        wait(for: [exp], timeout: 1.0)
    }

    func testSelectBusTripSuccess() {
        let engine = makeEngine()
        let progress = makeProgressResponse()

        MockURLProtocol.mockData["/bus/trip/trip1/progress"] = try! JSONEncoder().encode(progress)

        let exp = expectation(description: "State changes to onBus")

        engine.$state
            .dropFirst()
            .sink { state in
                if case .onBus(let receivedProgress) = state {
                    XCTAssertEqual(receivedProgress.tripId, progress.tripId)
                    XCTAssertTrue(engine.isAutoRefreshing)
                    exp.fulfill()
                }
            }
            .store(in: &cancellables)

        engine.selectBusTrip("trip1")

        wait(for: [exp], timeout: 1.0)
    }
}
