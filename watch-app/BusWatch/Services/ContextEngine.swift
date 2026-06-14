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
    /// when the network is unavailable or a fetch is stale. Backed by the
    /// shared App Group defaults so the complication extension can read it.
    private let scheduleCache = ScheduleCache(defaults: SharedDefaults.suite)
    private var cancellables = Set<AnyCancellable>()
    private var refreshTimer: Timer?
    /// Consecutive auto-refresh failures for the active trip; after
    /// `maxRefreshFailures` we surface an error instead of showing stale data.
    private var consecutiveRefreshFailures = 0

    /// Tolerated consecutive bus-progress refresh failures before erroring.
    private static let maxRefreshFailures = 3

    /// Whether the 30s bus-trip auto-refresh timer is currently armed.
    /// True only while the user is viewing a live trip (`.onBus`); any
    /// other state stops the timer.
    var isAutoRefreshing: Bool { refreshTimer != nil }

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
                    self?.setState(.noLocation)
                }
            }
            .store(in: &cancellables)
    }

    deinit {
        // The timer captures self weakly, but leaving it scheduled after the
        // engine is gone still drains battery until the run loop drops it.
        refreshTimer?.invalidate()
    }

    /// Centralized state transition: stops the bus-trip refresh timer
    /// whenever we leave the `.onBus` view, so it isn't polling a trip
    /// nobody is looking at. Setting `.onBus` keeps the timer running
    /// (the timer's own refresh callback routes through here too).
    ///
    /// Internal (not private) so tests can assert the timer-invalidation
    /// invariant directly for every `AppState` case without standing up a
    /// live network round-trip.
    func setState(_ newState: AppState) {
        state = newState
        if case .onBus = newState {
            // Staying on the bus — the refresh timer stays armed.
        } else {
            refreshTimer?.invalidate()
            refreshTimer = nil
            consecutiveRefreshFailures = 0
        }
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
                await MainActor.run { self.setState(.station(stop, schedule, isOffline: false)) }
            } catch {
                // Network failed — fall back to the last cached timetable so
                // the rider still sees scheduled times, flagged as offline.
                if let cached = scheduleCache.schedule(for: stop.id) {
                    await MainActor.run { self.setState(.station(stop, cached, isOffline: true)) }
                } else {
                    await MainActor.run { self.setState(.error(friendlyMessage(for: error))) }
                }
            }
        }
    }

    func selectBusTrip(_ tripId: String) {
        Task {
            do {
                let progress = try await api.fetchBusProgress(tripId: tripId)
                await MainActor.run { self.setState(.onBus(progress)) }
                startAutoRefresh(tripId: tripId)
            } catch {
                await MainActor.run { self.setState(.error(friendlyMessage(for: error))) }
            }
        }
    }

    func showNearby() {
        if let nearby = nearbyStops {
            setState(.nearby(nearby))
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
                    await MainActor.run { self.setState(.nearby(nearby)) }
                    return
                }
            }

            if let nearestStation = nearby.stops.first(where: { $0.type == "rail" }),
               nearestStation.distanceM < 200 {
                let schedule = try await api.fetchStationSchedule(stopId: nearestStation.id)
                scheduleCache.store(schedule, for: nearestStation.id)
                await MainActor.run { self.setState(.station(nearestStation, schedule, isOffline: false)) }
                return
            }

            await MainActor.run { self.setState(.nearby(nearby)) }
        } catch {
            await MainActor.run { self.setState(.error(friendlyMessage(for: error))) }
        }
    }

    /// Internal so tests can arm the timer (the precondition for asserting
    /// it gets torn down on state change) without a live bus-progress fetch.
    func startAutoRefresh(tripId: String) {
        refreshTimer?.invalidate()
        consecutiveRefreshFailures = 0
        refreshTimer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { [weak self] _ in
            Task { [weak self] in
                guard let self else { return }
                do {
                    let progress = try await self.api.fetchBusProgress(tripId: tripId)
                    self.consecutiveRefreshFailures = 0
                    await MainActor.run { self.setState(.onBus(progress)) }
                } catch {
                    // Transient blips are tolerated (the rider keeps the last
                    // known progress), but after several consecutive failures
                    // surface an error so they're not staring at stale data.
                    self.consecutiveRefreshFailures += 1
                    if self.consecutiveRefreshFailures >= Self.maxRefreshFailures {
                        await MainActor.run { self.setState(.error(friendlyMessage(for: error))) }
                    }
                }
            }
        }
    }
}
