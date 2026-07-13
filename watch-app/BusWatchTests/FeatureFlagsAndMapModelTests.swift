import XCTest
@testable import BusWatch

final class FeatureFlagsAndMapModelTests: XCTestCase {
    func testReleaseFeatureFlagsHideDeferredActionsAndShowLiveBusMap() {
        XCTAssertFalse(AppFeatureFlags.favoritesAndHome)
        XCTAssertFalse(AppFeatureFlags.serviceAlerts)
        XCTAssertFalse(AppFeatureFlags.arrivalNotifications)
        XCTAssertFalse(AppFeatureFlags.externalJourneyPlanner)
        XCTAssertTrue(AppFeatureFlags.liveBusMap)

    func testTrackedTripLabelPluralization() {
        let view = NearbyListView(response: NearbyResponse(stops: [], busRoutes: []), onSelectStop: { _ in })

        let singleMinuteBus = BusRouteEntry(routeId: "1", routeShortName: "U82", destination: "", minutes: 1, tripId: "t1", lat: 0, lon: 0, busNo: nil)
        XCTAssertEqual(view.trackedTripLabel(singleMinuteBus), "Bus U82, 1 minute")

        let multipleMinuteBus = BusRouteEntry(routeId: "2", routeShortName: "U82", destination: "", minutes: 5, tripId: "t2", lat: 0, lon: 0, busNo: nil)
        XCTAssertEqual(view.trackedTripLabel(multipleMinuteBus), "Bus U82, 5 minutes")

        let emptyNameBus = BusRouteEntry(routeId: "3", routeShortName: "", destination: "", minutes: 1, tripId: "t3", lat: 0, lon: 0, busNo: nil)
        XCTAssertEqual(view.trackedTripLabel(emptyNameBus), "Live bus, 1 minute")
    }
}
    func testNearbyResponseDecodesCoordinatesTripsAndLiveBuses() throws {
        let data = #"""
        {
          "stops": [
            {
              "id": "stop-1",
              "name": "Muzium Tekstil Negara",
              "type": "bus",
              "lat": 3.147136,
              "lon": 101.69481,
              "distance_m": 92,
              "arrivals": [
                {
                  "route": "590",
                  "destination": "Bandar",
                  "minutes": 1,
                  "isRealtime": true,
                  "tripId": "trip-590"
                }
              ]
            }
          ],
          "busRoutes": [
            {
              "routeId": "route-590",
              "routeShortName": "590",
              "destination": "Bandar",
              "minutes": 1,
              "tripId": "trip-590",
              "lat": 3.1475,
              "lon": 101.695
            }
          ]
        }
        """#.data(using: .utf8)!

        let response = try JSONDecoder().decode(NearbyResponse.self, from: data)

        XCTAssertEqual(response.stops.first?.lat, 3.147136)
        XCTAssertEqual(response.stops.first?.lon, 101.69481)
        XCTAssertEqual(response.stops.first?.arrivals.first?.tripId, "trip-590")
        XCTAssertEqual(response.busRoutes.count, 1)
        XCTAssertEqual(response.busRoutes.first?.routeShortName, "590")
    }

    func testNearbyResponseDefaultsMissingBusRoutesToEmpty() throws {
        let data = #"{"stops":[]}"#.data(using: .utf8)!

        let response = try JSONDecoder().decode(NearbyResponse.self, from: data)

        XCTAssertTrue(response.busRoutes.isEmpty)
    }

    func testOnlyDetailStatesShowBackNavigation() {
        let stop = NearbyStop(
            id: "stop-1",
            name: "Muzium Tekstil Negara",
            type: "bus",
            distanceM: 92,
            arrivals: []
        )
        let schedule = StationScheduleResponse(
            stopId: stop.id,
            stopName: stop.name,
            departures: []
        )
        let progress = BusProgressResponse(
            tripId: "trip-590",
            routeShortName: "590",
            destination: "Bandar",
            busPosition: nil,
            stops: [],
            progressPercent: 0
        )

        XCTAssertTrue(AppState.station(stop, schedule, isOffline: false).showsBackNavigation)
        XCTAssertTrue(AppState.onBus(progress).showsBackNavigation)
        XCTAssertFalse(AppState.nearby(NearbyResponse(stops: [])).showsBackNavigation)
        XCTAssertFalse(AppState.loading.showsBackNavigation)
    }

    func testOnlyGtfsBusEntriesSupportTripProgress() {
        let gtfsBus = BusRouteEntry(
            routeId: "route-590",
            routeShortName: "590",
            destination: "Bandar",
            minutes: 1,
            tripId: "trip-590",
            lat: 3.1475,
            lon: 101.695,
            busNo: nil
        )
        let prasaranaBus = BusRouteEntry(
            routeId: "route-T816",
            routeShortName: "T816",
            destination: "",
            minutes: 1,
            tripId: "BUS-42",
            lat: 3.1475,
            lon: 101.695,
            busNo: "BUS-42"
        )

        XCTAssertTrue(gtfsBus.supportsTripProgress)
        XCTAssertFalse(prasaranaBus.supportsTripProgress)
    }

    func testPrasaranaBusRowDecodesAsMapOnlyVehicle() throws {
        let data = Data(#"""
        {
          "stops": [],
          "busRoutes": [{
            "routeId": "route-T816",
            "routeShortName": "T816",
            "destination": "",
            "minutes": 1,
            "tripId": "BUS-42",
            "lat": 3.1475,
            "lon": 101.695,
            "busNo": "BUS-42"
          }]
        }
        """#.utf8)

        let response = try JSONDecoder().decode(NearbyResponse.self, from: data)

        XCTAssertEqual(response.busRoutes.first?.busNo, "BUS-42")
        XCTAssertFalse(try XCTUnwrap(response.busRoutes.first).supportsTripProgress)
    }

    func testBusProgressMapModelRequiresAndPreservesRealtimePosition() throws {
        let liveProgress = BusProgressResponse(
            tripId: "trip-202",
            routeShortName: "202",
            destination: "Kuala Lumpur",
            busPosition: BusPosition(lat: 3.15148, lon: 101.69551),
            stops: [],
            progressPercent: 25
        )
        let unavailableProgress = BusProgressResponse(
            tripId: "trip-202",
            routeShortName: "202",
            destination: "Kuala Lumpur",
            busPosition: nil,
            stops: [],
            progressPercent: 25
        )

        let model = try XCTUnwrap(BusProgressMapModel(progress: liveProgress))

        XCTAssertEqual(model.routeShortName, "202")
        XCTAssertEqual(model.latitude, 3.15148)
        XCTAssertEqual(model.longitude, 101.69551)
        XCTAssertNil(BusProgressMapModel(progress: unavailableProgress))
    }

    func testNearbyMapPresentationIncludesCurrentLocation() {
        let presentation = NearbyMapPresentation(busCount: 2)

        XCTAssertTrue(presentation.showsCurrentLocation)
        XCTAssertEqual(
            presentation.accessibilityLabel,
            "Live bus map with 2 buses and your current location"
        )
    }

    func testTrackedTripLabelPluralization() {
        let view = NearbyListView(response: NearbyResponse(stops: [], busRoutes: []), onSelectStop: { _ in })

        let singleMinuteBus = BusRouteEntry(routeId: "1", routeShortName: "U82", destination: "", minutes: 1, tripId: "t1", lat: 0, lon: 0, busNo: nil)
        XCTAssertEqual(view.trackedTripLabel(singleMinuteBus), "Bus U82, 1 minute")

        let multipleMinuteBus = BusRouteEntry(routeId: "2", routeShortName: "U82", destination: "", minutes: 5, tripId: "t2", lat: 0, lon: 0, busNo: nil)
        XCTAssertEqual(view.trackedTripLabel(multipleMinuteBus), "Bus U82, 5 minutes")

        let emptyNameBus = BusRouteEntry(routeId: "3", routeShortName: "", destination: "", minutes: 1, tripId: "t3", lat: 0, lon: 0, busNo: nil)
        XCTAssertEqual(view.trackedTripLabel(emptyNameBus), "Live bus, 1 minute")
    }
}
