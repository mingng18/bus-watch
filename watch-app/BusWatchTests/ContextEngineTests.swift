import XCTest
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

    override func setUp() {
        super.setUp()
        URLProtocol.registerClass(MockURLProtocol.self)
        MockURLProtocol.mockData.removeAll()
        MockURLProtocol.mockError = nil

        let defaults = SharedDefaults.suite
        defaults.removeObject(forKey: SharedDefaults.scheduleCacheKey)
    }

    override func tearDown() {
        URLProtocol.unregisterClass(MockURLProtocol.self)
        super.tearDown()
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
        let engine = ContextEngine()
        if case .loading = engine.state {
            // Pass
        } else {
            XCTFail("Expected initial state to be .loading")
        }
    }

    func testShowNearbyTransitionsState() {
        let engine = ContextEngine()
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
        let engine = ContextEngine()
        let stop = makeNearbyResponse().stops.first!
        let schedule = makeScheduleResponse()
        let encoder = JSONEncoder()

        MockURLProtocol.mockData["/station/stop1/schedule"] = try! encoder.encode(schedule)

        let exp = expectation(description: "State changes to station")

        // Use a background task to allow ContextEngine to process async
        Task {
            engine.selectStation(stop)

            // Wait a little for the async URLProtocol response to be processed
            try? await Task.sleep(nanoseconds: 100_000_000)

            await MainActor.run {
                if case .station(let receivedStop, let receivedSchedule, let isOffline) = engine.state {
                    XCTAssertEqual(receivedStop.id, stop.id)
                    XCTAssertEqual(receivedSchedule.stopId, schedule.stopId)
                    XCTAssertFalse(isOffline)
                    exp.fulfill()
                }
            }
        }

        wait(for: [exp], timeout: 1.0)
    }

    func testSelectStationFailureWithCacheFallback() {
        let engine = ContextEngine()
        let stop = makeNearbyResponse().stops.first!
        let schedule = makeScheduleResponse()

        // Prime the cache
        let cache = ScheduleCache(defaults: SharedDefaults.suite)
        cache.store(schedule, for: stop.id)

        // Mock a network failure
        MockURLProtocol.mockError = URLError(.notConnectedToInternet)

        let exp = expectation(description: "State changes to station offline")

        Task {
            engine.selectStation(stop)

            try? await Task.sleep(nanoseconds: 100_000_000)

            await MainActor.run {
                if case .station(let receivedStop, let receivedSchedule, let isOffline) = engine.state {
                    XCTAssertEqual(receivedStop.id, stop.id)
                    XCTAssertEqual(receivedSchedule.stopId, schedule.stopId)
                    XCTAssertTrue(isOffline)
                    exp.fulfill()
                }
            }
        }

        wait(for: [exp], timeout: 1.0)
    }

    func testSelectStationFailureWithoutCache() {
        let engine = ContextEngine()
        let stop = makeNearbyResponse().stops.first!

        // Clear cache and mock network error
        let cache = ScheduleCache(defaults: SharedDefaults.suite)
        cache.clear()
        MockURLProtocol.mockError = URLError(.notConnectedToInternet)

        let exp = expectation(description: "State changes to error")

        Task {
            engine.selectStation(stop)

            try? await Task.sleep(nanoseconds: 100_000_000)

            await MainActor.run {
                if case .error = engine.state {
                    exp.fulfill()
                }
            }
        }

        wait(for: [exp], timeout: 1.0)
    }

    func testSelectBusTripSuccess() {
        let engine = ContextEngine()
        let progress = makeProgressResponse()
        let encoder = JSONEncoder()

        MockURLProtocol.mockData["/bus/trip/trip1/progress"] = try! encoder.encode(progress)

        let exp = expectation(description: "State changes to onBus")

        Task {
            engine.selectBusTrip("trip1")

            try? await Task.sleep(nanoseconds: 100_000_000)

            await MainActor.run {
                if case .onBus(let receivedProgress) = engine.state {
                    XCTAssertEqual(receivedProgress.tripId, progress.tripId)
                    XCTAssertTrue(engine.isAutoRefreshing)
                    exp.fulfill()
                }
            }
        }

        wait(for: [exp], timeout: 1.0)
    }
}
