import SwiftUI
import CoreLocation
import Combine

enum AppState {
    case loading
    case station(NearbyStop, StationScheduleResponse, isOffline: Bool)
    case onBus(BusProgressResponse)
    case nearby(NearbyResponse)
    case error(String)
    case noLocation
}

class ContextEngine: ObservableObject {
    @Published var state: AppState = .loading
    @Published var nearbyStops: NearbyResponse?

    private let api = APIClient.shared
    private let locationManager = LocationManager()
    /// On-device timetable cache so favorite stops still show scheduled times
    /// when the network is unavailable or a fetch is stale.
    private let scheduleCache = ScheduleCache()
    private var cancellables = Set<AnyCancellable>()
    private var refreshTimer: Timer?

    init() {
        locationManager.$location
            .compactMap { $0 }
            .removeDuplicates { $0.distance(from: $1) < 30 }
            .sink { [weak self] location in
                Task { await self?.updateForLocation(location) }
            }
            .store(in: &cancellables)

        locationManager.$authorizationStatus
            .sink { [weak self] status in
                if status == .notDetermined {
                    self?.locationManager.requestPermission()
                } else if status == .denied {
                    self?.state = .noLocation
                }
            }
            .store(in: &cancellables)
    }

    func start() {
        locationManager.startUpdating()
    }

    func selectStation(_ stop: NearbyStop) {
        Task {
            do {
                let schedule = try await api.fetchStationSchedule(stopId: stop.id)
                // Network succeeded — refresh the on-device cache for offline
                // fallback next time.
                scheduleCache.store(schedule, for: stop.id)
                await MainActor.run { self.state = .station(stop, schedule, isOffline: false) }
            } catch {
                // Network failed — fall back to the last cached timetable so
                // the rider still sees scheduled times, flagged as offline.
                if let cached = scheduleCache.schedule(for: stop.id) {
                    await MainActor.run { self.state = .station(stop, cached, isOffline: true) }
                } else {
                    await MainActor.run { self.state = .error(error.localizedDescription) }
                }
            }
        }
    }

    func selectBusTrip(_ tripId: String) {
        Task {
            do {
                let progress = try await api.fetchBusProgress(tripId: tripId)
                await MainActor.run { self.state = .onBus(progress) }
                startAutoRefresh(tripId: tripId)
            } catch {
                await MainActor.run { self.state = .error(error.localizedDescription) }
            }
        }
    }

    func showNearby() {
        if let nearby = nearbyStops {
            state = .nearby(nearby)
        }
    }

    private func updateForLocation(_ location: CLLocation) async {
        do {
            let nearby = try await api.fetchNearby(lat: location.coordinate.latitude, lon: location.coordinate.longitude)
            await MainActor.run { self.nearbyStops = nearby }

            let speed = location.speed >= 0 ? location.speed : 0
            let isMoving = speed > 5

            if isMoving, let firstStop = nearby.stops.first, firstStop.type == "bus" {
                let busArrivals = firstStop.arrivals.filter { $0.isRealtime }
                if !busArrivals.isEmpty {
                    await MainActor.run { self.state = .nearby(nearby) }
                    return
                }
            }

            if let nearestStation = nearby.stops.first(where: { $0.type == "rail" }),
               nearestStation.distanceM < 200 {
                let schedule = try await api.fetchStationSchedule(stopId: nearestStation.id)
                scheduleCache.store(schedule, for: nearestStation.id)
                await MainActor.run { self.state = .station(nearestStation, schedule, isOffline: false) }
                return
            }

            await MainActor.run { self.state = .nearby(nearby) }
        } catch {
            await MainActor.run { self.state = .error(error.localizedDescription) }
        }
    }

    private func startAutoRefresh(tripId: String) {
        refreshTimer?.invalidate()
        refreshTimer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { [weak self] _ in
            Task { [weak self] in
                guard let self else { return }
                do {
                    let progress = try await self.api.fetchBusProgress(tripId: tripId)
                    await MainActor.run { self.state = .onBus(progress) }
                } catch { }
            }
        }
    }
}
