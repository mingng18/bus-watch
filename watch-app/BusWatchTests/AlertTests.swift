import XCTest
@testable import BusWatch

/// Tests the `Alert` model that backs `AlertsView`: JSON decoding of the
/// `/alerts` response, and the severity -> icon/color mapping used in the view.
final class AlertTests: XCTestCase {

    private func makeAlert(severity: String) -> Alert {
        Alert(id: "test", title: "T", summary: "S", date: "2026-06-14T04:00:00.000Z",
              affectedLines: [], severity: severity, url: "https://example.com")
    }

    func testDecodesAlertsResponse() throws {
        let json = """
        {
            "alerts": [
                {"id": "info-gangguan-trafik-laluan-173-36",
                 "title": "Traffic disruption — routes 173",
                 "summary": "Traffic disruption — routes 173",
                 "date": "2026-06-13T05:01:32.000Z",
                 "affectedLines": ["173"],
                 "severity": "warning",
                 "url": "https://myrapid.com.my/info-gangguan-trafik-laluan-173-36/"}
            ]
        }
        """.data(using: .utf8)!

        let response = try JSONDecoder().decode(AlertsResponse.self, from: json)

        XCTAssertEqual(response.alerts.count, 1)
        let alert = try XCTUnwrap(response.alerts.first)
        XCTAssertEqual(alert.id, "info-gangguan-trafik-laluan-173-36")
        XCTAssertEqual(alert.severity, "warning")
        XCTAssertEqual(alert.affectedLines, ["173"])
    }

    func testEmptyAlertsResponseDecodes() throws {
        let json = #"{"alerts":[]}"#.data(using: .utf8)!
        let response = try JSONDecoder().decode(AlertsResponse.self, from: json)
        XCTAssertTrue(response.alerts.isEmpty)
    }

    // MARK: - Severity mapping

    func testSevereAlertMapsToOctagonAndRed() {
        let alert = makeAlert(severity: "severe")
        XCTAssertEqual(alert.severityIcon, "exclamationmark.octagon.fill")
        XCTAssertEqual(alert.severityColor, "red")
    }

    func testWarningAlertMapsToTriangleAndOrange() {
        let alert = makeAlert(severity: "warning")
        XCTAssertEqual(alert.severityIcon, "exclamationmark.triangle.fill")
        XCTAssertEqual(alert.severityColor, "orange")
    }

    func testInfoAlertMapsToInfoCircleAndBlue() {
        let alert = makeAlert(severity: "info")
        XCTAssertEqual(alert.severityIcon, "info.circle.fill")
        XCTAssertEqual(alert.severityColor, "blue")
    }

    func testUnknownSeverityFallsBackToInfoStyling() {
        let alert = makeAlert(severity: "bogus")
        XCTAssertEqual(alert.severityIcon, "info.circle.fill")
        XCTAssertEqual(alert.severityColor, "blue")
    }

    // MARK: - Date parsing

    func testParsedDateDecodesISO8601() {
        let alert = makeAlert(severity: "info")
        // 2026-06-14T04:00:00.000Z (fractional seconds — model tolerates them)
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        let expected = formatter.date(from: "2026-06-14T04:00:00.000Z")
        XCTAssertEqual(alert.parsedDate, expected)
    }

    func testParsedDateFallsBackOnBadInput() {
        let alert = Alert(id: "x", title: "t", summary: "s", date: "not-a-date",
                          affectedLines: [], severity: "info", url: "u")
        XCTAssertEqual(alert.parsedDate, .distantPast)
    }
}
