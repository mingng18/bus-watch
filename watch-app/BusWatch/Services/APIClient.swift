import Foundation

class APIClient {
    static let shared = APIClient()

    let baseURL: String

    private init(baseURL: String = "https://bus-watch.ming.workers.dev") {
        self.baseURL = baseURL
    }

    func fetchNearby(lat: Double, lon: Double, radius: Int = 500) async throws -> NearbyResponse {
        let url = URL(string: "\(baseURL)/nearby?lat=\(lat)&lon=\(lon)&radius=\(radius)")!
        return try await fetch(url)
    }

    func fetchStationSchedule(stopId: String) async throws -> StationScheduleResponse {
        let encoded = stopId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? stopId
        let url = URL(string: "\(baseURL)/station/\(encoded)/schedule")!
        return try await fetch(url)
    }

    func fetchDeparturesToward(stopId: String, destinationStopId: String, limit: Int = 5) async throws -> StationScheduleResponse {
        let encodedStop = stopId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? stopId
        let encodedDest = destinationStopId.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? destinationStopId
        let url = URL(string: "\(baseURL)/station/\(encodedStop)/schedule/toward?destinationStopId=\(encodedDest)&limit=\(limit)")!
        return try await fetch(url)
    }

    func fetchBusProgress(tripId: String) async throws -> BusProgressResponse {
        let encoded = tripId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? tripId
        let url = URL(string: "\(baseURL)/bus/trip/\(encoded)/progress")!
        return try await fetch(url)
    }

    func fetchRoutes(lat: Double, lon: Double, radius: Int = 500) async throws -> RoutesResponse {
        let url = URL(string: "\(baseURL)/routes?lat=\(lat)&lon=\(lon)&radius=\(radius)")!
        return try await fetch(url)
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
    case badResponse
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
