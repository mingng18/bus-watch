import XCTest
@testable import BusWatch

/// Unit tests for the pure ETA→trigger-time logic in `NotificationService`.
///
/// We deliberately do not exercise `UNUserNotificationCenter` here — that
/// requires a host app and run-time authorization — so the tests target the
/// deterministic helpers (`arrivalTrigger`, body strings, identifiers) that
/// drive the scheduling decisions.
final class NotificationServiceTests: XCTestCase {

    // Fixed reference time so trigger arithmetic is deterministic.
    private let now = Date(timeIntervalSince1970: 1_700_000_000) // 2023-11-14T22:13:20Z

    // MARK: - arrivalTrigger

    func testArrivalTriggerSchedulesLeadMinutesBeforeArrival() {
        // ETA 10 min, want 3 min lead → fire 7 min from now.
        let trigger = NotificationService.arrivalTrigger(
            minutesUntil: 10, leadMinutes: 3, now: now
        )
        XCTAssertEqual(trigger, now.addingTimeInterval(7 * 60))
    }

    func testArrivalTriggerReturnsNilWhenLeadExceedsETA() {
        // Asking for more lead than the ETA allows can't be scheduled in the
        // future — the caller should fire an immediate alert instead.
        let trigger = NotificationService.arrivalTrigger(
            minutesUntil: 5, leadMinutes: 99, now: now
        )
        XCTAssertNil(trigger)
    }

    func testArrivalTriggerReturnsNilWhenLeadExactlyElapsed() {
        // ETA 5 min, want 5 min lead → the alert should have fired already.
        // Returning nil signals the caller to fire immediately instead.
        let trigger = NotificationService.arrivalTrigger(
            minutesUntil: 5, leadMinutes: 5, now: now
        )
        XCTAssertNil(trigger)
    }

    func testArrivalTriggerReturnsNilForZeroOrNegativeETA() {
        XCTAssertNil(NotificationService.arrivalTrigger(
            minutesUntil: 0, leadMinutes: 1, now: now))
        XCTAssertNil(NotificationService.arrivalTrigger(
            minutesUntil: -3, leadMinutes: 1, now: now))
    }

    func testArrivalTriggerForClosestSchedulableArrival() {
        // ETA 2 min, want 1 min lead → fire 1 min from now (the tightest
        // schedulable lead that still lands strictly before arrival).
        let trigger = NotificationService.arrivalTrigger(
            minutesUntil: 2, leadMinutes: 1, now: now
        )
        XCTAssertEqual(trigger, now.addingTimeInterval(60))
    }

    // MARK: - Identifiers

    func testArrivalIdentifierIsStableForSameDeparture() {
        let dep = Departure(line: "U82", destination: "Sentul",
                            departureTime: "08:30:00", minutesUntil: 7)
        let id1 = NotificationService.arrivalIdentifier(departure: dep)
        let id2 = NotificationService.arrivalIdentifier(departure: dep)
        XCTAssertEqual(id1, id2, "Re-scheduling the same departure must reuse the id")
    }

    func testArrivalIdentifierDiffersAcrossDepartures() {
        let dep1 = Departure(line: "U82", destination: "Sentul",
                             departureTime: "08:30:00", minutesUntil: 7)
        let dep2 = Departure(line: "U82", destination: "Sentul",
                             departureTime: "08:45:00", minutesUntil: 12)
        XCTAssertNotEqual(
            NotificationService.arrivalIdentifier(departure: dep1),
            NotificationService.arrivalIdentifier(departure: dep2)
        )
    }

    func testApproachingIdentifierIsStablePerTripStop() {
        let a = NotificationService.approachingIdentifier(tripId: "T1", stopId: "S1")
        let b = NotificationService.approachingIdentifier(tripId: "T1", stopId: "S1")
        XCTAssertEqual(a, b)
    }

    // MARK: - Body strings

    func testArrivalBodyIncludesLineDestinationAndLead() {
        let dep = Departure(line: "U82", destination: "Sentul Timur",
                            departureTime: "08:30:00", minutesUntil: 7)
        let body = NotificationService.arrivalBody(
            departure: dep, leadMinutes: 3, stopName: "Titiwangsa"
        )
        XCTAssertEqual(body, "U82 → Sentul Timur arriving in 3 min at Titiwangsa.")
    }

    func testArrivalBodyFallsBackWhenLineEmpty() {
        let dep = Departure(line: "", destination: "Sentul",
                            departureTime: "08:30:00", minutesUntil: 7)
        let body = NotificationService.arrivalBody(
            departure: dep, leadMinutes: 0, stopName: nil
        )
        XCTAssertEqual(body, "Service → Sentul arriving now.")
    }

    func testApproachingBodyIncludesMinutesWhenKnown() {
        let body = NotificationService.approachingBody(stopName: "Titiwangsa", minutesAway: 2)
        XCTAssertEqual(body, "Get ready — Titiwangsa in about 2 min.")
    }

    func testApproachingBodyOmitsMinutesWhenUnknown() {
        let body = NotificationService.approachingBody(stopName: "Titiwangsa", minutesAway: nil)
        XCTAssertEqual(body, "Get ready — approaching Titiwangsa.")
    }

    // MARK: - Category identifiers (smoke test)

    func testCategoryIdentifiersAreUnique() {
        XCTAssertNotEqual(NotificationService.Category.arrivalAlert,
                          NotificationService.Category.approachingStop)
    }
}
