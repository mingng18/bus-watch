import XCTest
import CoreLocation
@testable import BusWatch

class MockCLLocationManager: CLLocationManager {
    var requestWhenInUseAuthorizationCalled = false
    var startUpdatingLocationCalled = false
    var stopUpdatingLocationCalled = false

    override func requestWhenInUseAuthorization() {
        requestWhenInUseAuthorizationCalled = true
    }

    override func startUpdatingLocation() {
        startUpdatingLocationCalled = true
    }

    override func stopUpdatingLocation() {
        stopUpdatingLocationCalled = true
    }
}

final class LocationManagerTests: XCTestCase {
    var mockManager: MockCLLocationManager!
    var sut: LocationManager!

    override func setUp() {
        super.setUp()
        mockManager = MockCLLocationManager()
        sut = LocationManager(manager: mockManager)
    }

    func testInitSetsManagerProperties() {
        XCTAssertTrue(mockManager.delegate === sut)
        XCTAssertEqual(mockManager.desiredAccuracy, kCLLocationAccuracyHundredMeters)
        XCTAssertEqual(mockManager.distanceFilter, 50)
    }

    func testRequestPermission() {
        sut.requestPermission()
        XCTAssertTrue(mockManager.requestWhenInUseAuthorizationCalled)
    }

    func testStartUpdatingWhenAuthorizedWhenInUse() {
        sut.authorizationStatus = .authorizedWhenInUse
        sut.startUpdating()
        XCTAssertTrue(mockManager.startUpdatingLocationCalled)
    }

    func testStartUpdatingWhenAuthorizedAlways() {
        sut.authorizationStatus = .authorizedAlways
        sut.startUpdating()
        XCTAssertTrue(mockManager.startUpdatingLocationCalled)
    }

    func testStartUpdatingWhenNotAuthorized() {
        sut.authorizationStatus = .denied
        sut.startUpdating()
        XCTAssertFalse(mockManager.startUpdatingLocationCalled)
    }

    func testStopUpdating() {
        sut.stopUpdating()
        XCTAssertTrue(mockManager.stopUpdatingLocationCalled)
    }

    func testDidUpdateLocations() {
        let expectedLocation = CLLocation(latitude: 37.7749, longitude: -122.4194)
        sut.locationManager(mockManager, didUpdateLocations: [expectedLocation])
        XCTAssertEqual(sut.location, expectedLocation)
    }

    func testDidChangeAuthorizationStartsUpdatingWhenAuthorized() {
        sut.locationManager(mockManager, didChangeAuthorization: .authorizedWhenInUse)
        XCTAssertEqual(sut.authorizationStatus, .authorizedWhenInUse)
        XCTAssertTrue(mockManager.startUpdatingLocationCalled)
    }

    func testDidChangeAuthorizationStartsUpdatingWhenAuthorizedAlways() {
        sut.locationManager(mockManager, didChangeAuthorization: .authorizedAlways)
        XCTAssertEqual(sut.authorizationStatus, .authorizedAlways)
        XCTAssertTrue(mockManager.startUpdatingLocationCalled)
    }

    func testDidChangeAuthorizationDoesNotStartUpdatingWhenNotAuthorized() {
        sut.locationManager(mockManager, didChangeAuthorization: .denied)
        XCTAssertEqual(sut.authorizationStatus, .denied)
        XCTAssertFalse(mockManager.startUpdatingLocationCalled)
    }
}
