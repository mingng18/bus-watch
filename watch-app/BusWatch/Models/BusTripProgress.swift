import Foundation

struct BusProgressResponse: Codable {
    let tripId: String
    let routeShortName: String
    let destination: String
    let busPosition: BusPosition?
    let stops: [TripStopStatus]
    let progressPercent: Int
}

struct BusPosition: Codable {
    let lat: Double
    let lon: Double
}

struct TripStopStatus: Identifiable, Codable {
    let id: String
    let name: String
    let arrivalTime: String
    let passed: Bool
    let isCurrent: Bool
}
