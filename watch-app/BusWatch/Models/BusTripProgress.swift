import Foundation

struct BusProgressResponse: Codable {
    let tripId: String
    let routeShortName: String
    let destination: String
    let busPosition: BusPosition?
    let stops: [TripStopStatus]
    let progressPercent: Int
    let remainingStopsCount: Int

    enum CodingKeys: String, CodingKey {
        case tripId
        case routeShortName
        case destination
        case busPosition
        case stops
        case progressPercent
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.tripId = try container.decode(String.self, forKey: .tripId)
        self.routeShortName = try container.decode(String.self, forKey: .routeShortName)
        self.destination = try container.decode(String.self, forKey: .destination)
        self.busPosition = try container.decodeIfPresent(BusPosition.self, forKey: .busPosition)
        let stops = try container.decode([TripStopStatus].self, forKey: .stops)
        self.stops = stops
        self.progressPercent = try container.decode(Int.self, forKey: .progressPercent)

        // Performance optimization: Pre-calculate the remaining stops count
        // during decoding instead of re-calculating it during every view render pass.
        self.remainingStopsCount = stops.filter { !$0.passed }.count
    }
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
