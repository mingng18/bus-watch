import Foundation

struct NearbyResponse: Codable {
    let stops: [NearbyStop]
}

struct NearbyStop: Identifiable, Codable {
    let id: String
    let name: String
    let type: String
    let distanceM: Int
    let arrivals: [Arrival]

    enum CodingKeys: String, CodingKey {
        case id, name, type
        case distanceM = "distance_m"
        case arrivals
    }
}

struct Arrival: Identifiable, Codable {
    let line: String?
    let route: String?
    let destination: String
    let minutes: Int
    let isRealtime: Bool

    var id: String { "\(destination)-\(minutes)" }
}
