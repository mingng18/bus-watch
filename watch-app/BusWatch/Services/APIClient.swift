import Foundation

class APIClient {
    static let shared = APIClient()

    let baseURL: String

    private init(baseURL: String = "https://bus-watch.nggihming123.workers.dev") {
        self.baseURL = baseURL
    }

    func fetchNearby(lat: Double, lon: Double, radius: Int = 500) async throws -> NearbyResponse {
        let url = try makeURL("/nearby?lat=\(lat)&lon=\(lon)&radius=\(radius)")
        return try await fetch(url)
    }

    func fetchStationSchedule(stopId: String) async throws -> StationScheduleResponse {
        let encoded = stopId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? stopId
        let url = try makeURL("/station/\(encoded)/schedule")
        return try await fetch(url)
    }

    func fetchDeparturesToward(stopId: String, destinationStopId: String, limit: Int = 5) async throws -> StationScheduleResponse {
        let encodedStop = stopId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? stopId
        let encodedDest = destinationStopId.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? destinationStopId
        let url = try makeURL("/station/\(encodedStop)/schedule/toward?destinationStopId=\(encodedDest)&limit=\(limit)")
        return try await fetch(url)
    }

    func fetchBusProgress(tripId: String) async throws -> BusProgressResponse {
        let encoded = tripId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? tripId
        let url = try makeURL("/bus/trip/\(encoded)/progress")
        return try await fetch(url)
    }

    func fetchRoutes(lat: Double, lon: Double, radius: Int = 500) async throws -> RoutesResponse {
        let url = try makeURL("/routes?lat=\(lat)&lon=\(lon)&radius=\(radius)")
        return try await fetch(url)
    }

    func fetchAlerts(limit: Int = 20) async throws -> AlertsResponse {
        let url = try makeURL("/alerts?limit=\(limit)")
        return try await fetch(url)
    }

    /// Builds a URL from the base + path/query, throwing `.invalidURL` if the
    /// result can't be parsed. Replaces the prior force-unwraps that would
    /// crash on a malformed (e.g. user/backend-influenced) stopId or tripId.
    private func makeURL(_ pathAndQuery: String) throws -> URL {
        guard let url = URL(string: "\(baseURL)\(pathAndQuery)") else {
            throw APIError.invalidURL
        }
        return url
    }

    private func fetch<T: Decodable>(_ url: URL) async throws -> T {
        let (data, response) = try await URLSession.shared.data(from: url)
        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            throw APIError.badResponse
        }
        let decoder = JSONDecoder()
        return try decoder.decode(T.self, from: data)
    }
}

enum APIError: Error {
    case invalidURL
    case badResponse

    /// Rider-facing description shown in `MainView`'s error state. Avoids
    /// surfacing `localizedDescription` ("the operation couldn't be
    /// completed") which tells a rider nothing actionable. Fallback for
    /// non-`APIError` networking failures lives in `friendlyMessage(for:)`.
    var friendlyMessage: String {
        switch self {
        case .invalidURL:
            return "Couldn't load this stop. Try another."
        case .badResponse:
            return "Couldn't reach BusWatch. Check your connection."
        }
    }
}

/// Maps any thrown error to a rider-facing string at the display boundary.
/// `APIError` cases get a specific message; everything else (typically
/// `URLError` timeouts / lost-connection) collapses to a generic "couldn't
/// reach" message so the rider isn't shown raw framework text.
func friendlyMessage(for error: Error) -> String {
    if let api = error as? APIError {
        return api.friendlyMessage
    }
    return APIError.badResponse.friendlyMessage
}

struct RoutesResponse: Codable {
    let routes: [RouteInfo]
}

struct RouteInfo: Identifiable, Codable {
    let id: String
    let shortName: String
    let longName: String
    let type: String
}
