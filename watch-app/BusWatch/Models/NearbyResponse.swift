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
    /// "scheduled" = derived from historical aggregates (not live); "live" =
    /// from a GTFS-realtime vehicle position. Nil = legacy/unknown. Issue #133.
    let etaSource: String?
    /// Coarse confidence in a scheduled/historical estimate ("high"/"medium"/
    /// "low"). Nil for live arrivals. Issue #133.
    let confidence: String?
    /// Half-width of the uncertainty window in minutes for a historical
    /// estimate, so the UI can show "≈5 min". Nil for live arrivals. #133.
    let uncertaintyMinutes: Int?

    var id: String { "\(destination)-\(minutes)" }

    enum CodingKeys: String, CodingKey {
        case line, route, destination, minutes, isRealtime
        case etaSource = "eta_source"
        case confidence
        case uncertaintyMinutes = "uncertainty_minutes"
    }
}
