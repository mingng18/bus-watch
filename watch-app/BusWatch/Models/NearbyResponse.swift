import Foundation

struct NearbyResponse: Codable {
    let stops: [NearbyStop]
    let busRoutes: [BusRouteEntry]

    init(stops: [NearbyStop], busRoutes: [BusRouteEntry] = []) {
        self.stops = stops
        self.busRoutes = busRoutes
    }

    enum CodingKeys: String, CodingKey {
        case stops, busRoutes
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        stops = try container.decode([NearbyStop].self, forKey: .stops)
        busRoutes = try container.decodeIfPresent([BusRouteEntry].self, forKey: .busRoutes) ?? []
    }
}

struct NearbyStop: Identifiable, Codable {
    let id: String
    let name: String
    let type: String
    let lat: Double?
    let lon: Double?
    let distanceM: Int
    let arrivals: [Arrival]

    init(id: String,
         name: String,
         type: String,
         lat: Double? = nil,
         lon: Double? = nil,
         distanceM: Int,
         arrivals: [Arrival]) {
        self.id = id
        self.name = name
        self.type = type
        self.lat = lat
        self.lon = lon
        self.distanceM = distanceM
        self.arrivals = arrivals
    }

    enum CodingKeys: String, CodingKey {
        case id, name, type, lat, lon
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
    let tripId: String?
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
        case line, route, destination, minutes, isRealtime, tripId
        case etaSource = "eta_source"
        case confidence
        case uncertaintyMinutes = "uncertainty_minutes"
    }
}

struct BusRouteEntry: Identifiable, Codable {
    let routeId: String
    let routeShortName: String
    let destination: String
    let minutes: Int
    let tripId: String
    let lat: Double
    let lon: Double
    let busNo: String?

    var id: String { "\(tripId)-\(busNo ?? "gtfs")" }
    var supportsTripProgress: Bool { busNo == nil && !tripId.isEmpty }
}
