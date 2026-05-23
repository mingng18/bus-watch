import Foundation

struct StationScheduleResponse: Codable {
    let stopId: String
    let stopName: String
    let departures: [Departure]
}

struct Departure: Identifiable, Codable {
    let line: String
    let destination: String
    let departureTime: String
    let minutesUntil: Int

    var id: String { "\(line)-\(destination)-\(departureTime)" }
}
