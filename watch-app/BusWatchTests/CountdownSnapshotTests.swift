import XCTest
@testable import BusWatch

final class CountdownSnapshotTests: XCTestCase {

    func testInitialization() {
        let date = Date()
        let snapshot = CountdownSnapshot(
            stopId: "test-stop",
            stopName: "Test Stop Name",
            line: "123",
            destination: "Test Destination",
            minutesUntil: 5,
            isStale: true,
            fetchedAt: date
        )

        XCTAssertEqual(snapshot.stopId, "test-stop")
        XCTAssertEqual(snapshot.stopName, "Test Stop Name")
        XCTAssertEqual(snapshot.line, "123")
        XCTAssertEqual(snapshot.destination, "Test Destination")
        XCTAssertEqual(snapshot.minutesUntil, 5)
        XCTAssertTrue(snapshot.isStale)
        XCTAssertEqual(snapshot.fetchedAt, date)
    }

    func testEquality() {
        let date = Date()
        let snapshot1 = CountdownSnapshot(
            stopId: "test-stop",
            stopName: "Test Stop Name",
            line: "123",
            destination: "Test Destination",
            minutesUntil: 5,
            isStale: true,
            fetchedAt: date
        )

        let snapshot2 = CountdownSnapshot(
            stopId: "test-stop",
            stopName: "Test Stop Name",
            line: "123",
            destination: "Test Destination",
            minutesUntil: 5,
            isStale: true,
            fetchedAt: date
        )

        let snapshotDifferent = CountdownSnapshot(
            stopId: "other-stop",
            stopName: "Test Stop Name",
            line: "123",
            destination: "Test Destination",
            minutesUntil: 5,
            isStale: true,
            fetchedAt: date
        )

        XCTAssertEqual(snapshot1, snapshot2)
        XCTAssertNotEqual(snapshot1, snapshotDifferent)
    }

    func testPlaceholder() {
        let placeholder = CountdownSnapshot.placeholder

        XCTAssertEqual(placeholder.stopId, "sample")
        XCTAssertEqual(placeholder.stopName, "Titiwangsa")
        XCTAssertEqual(placeholder.line, "U82")
        XCTAssertEqual(placeholder.destination, "Sentul")
        XCTAssertEqual(placeholder.minutesUntil, 7)
        XCTAssertFalse(placeholder.isStale)
        XCTAssertTrue(abs(placeholder.fetchedAt.timeIntervalSinceNow) < 60)
    }
}
