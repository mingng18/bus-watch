import Foundation
import UserNotifications

/// Schedules local notifications for transit events:
///
/// 1. **Arrival alert** — "alert me N minutes before a saved stop's next
///    arrival", scheduled from the live ETA so the notification fires
///    `leadMinutes` before the bus/train is predicted to arrive.
/// 2. **Approaching-stop buzz** — fired immediately when the rider's GPS
///    approaches a saved destination stop while on a bus trip.
///
/// The ETA→trigger-time math is split into pure helpers so it can be unit
/// tested without the UserNotifications stack.
final class NotificationService: ObservableObject {
    /// A stable namespace for the categories/identifiers we register.
    enum Category {
        static let arrivalAlert = "buswatch.arrivalAlert"
        static let approachingStop = "buswatch.approachingStop"
    }

    private let center: UNUserNotificationCenter

    init(center: UNUserNotificationCenter = .current()) {
        self.center = center
    }

    // MARK: - Permissions

    /// Requests the alert/badge/sound authorization. Returns the granted
    /// status; failures default to `false`.
    @discardableResult
    func requestAuthorization() async -> Bool {
        do {
            return try await center.requestAuthorization(options: [.alert, .badge, .sound])
        } catch {
            return false
        }
    }

    // MARK: - Arrival alert

    /// Schedules an arrival alert for a specific departure.
    ///
    /// - Parameters:
    ///   - departure: The `Departure` the rider wants a heads-up for.
    ///   - leadMinutes: How many minutes before arrival the alert should fire.
    ///   - now: Injection point for the clock (testability).
    /// - Returns: The scheduled notification identifier, or `nil` if the
    ///   computed trigger is in the past and the UNUserNotificationCenter
    ///   would silently drop it (callers should fire immediately instead).
    @discardableResult
    func scheduleArrivalAlert(for departure: Departure,
                              leadMinutes: Int,
                              stopName: String? = nil,
                              now: Date = Date()) async -> String? {
        guard let trigger = Self.arrivalTrigger(minutesUntil: departure.minutesUntil,
                                                leadMinutes: leadMinutes,
                                                now: now) else {
            return nil
        }

        let id = Self.arrivalIdentifier(departure: departure)
        let content = UNMutableNotificationContent()
        content.title = "Bus arriving soon"
        content.body = Self.arrivalBody(departure: departure,
                                        leadMinutes: leadMinutes,
                                        stopName: stopName)
        content.sound = .default
        content.categoryIdentifier = Category.arrivalAlert

        // `trigger` is an absolute Date; convert to the time-interval trigger
        // UNUserNotificationCenter expects (must be strictly positive).
        let interval = max(trigger.timeIntervalSince(now), 1)
        let notificationTrigger = UNTimeIntervalNotificationTrigger(timeInterval: interval, repeats: false)
        let request = UNNotificationRequest(identifier: id, content: content, trigger: notificationTrigger)
        do {
            try await center.add(request)
            return id
        } catch {
            return nil
        }
    }

    /// When the lead time has already elapsed (or is exactly now), fire the
    /// alert immediately rather than scheduling it.
    func fireImmediateArrivalAlert(for departure: Departure, stopName: String? = nil) async {
        let content = UNMutableNotificationContent()
        content.title = "Bus arriving now"
        content.body = Self.arrivalBody(departure: departure, leadMinutes: 0, stopName: stopName)
        content.sound = .default
        content.categoryIdentifier = Category.arrivalAlert

        let id = "immediate-\(departure.id)-\(UUID().uuidString)"
        let request = UNNotificationRequest(identifier: id, content: content, trigger: nil)
        try? await center.add(request)
    }

    // MARK: - Approaching stop

    /// Fires an immediate "approaching your stop" notification when the
    /// rider is on a bus and near their destination. Idempotent within a
    /// short window via `identifier` de-duplication: repeating the same
    /// `tripId`/`stopId` pair overwrites the pending alert instead of
    /// stacking duplicates.
    func notifyApproachingStop(tripId: String,
                               stopId: String,
                               stopName: String,
                               minutesAway: Int? = nil) async {
        let content = UNMutableNotificationContent()
        content.title = "Approaching your stop"
        content.body = Self.approachingBody(stopName: stopName, minutesAway: minutesAway)
        content.sound = .default
        content.categoryIdentifier = Category.approachingStop

        let id = Self.approachingIdentifier(tripId: tripId, stopId: stopId)
        let request = UNNotificationRequest(identifier: id, content: content, trigger: nil)
        try? await center.add(request)
    }

    /// Cancels a pending approaching-stop alert for the given trip/stop.
    func cancelApproachingStop(tripId: String, stopId: String) {
        let id = Self.approachingIdentifier(tripId: tripId, stopId: stopId)
        center.removePendingNotificationRequests(withIdentifiers: [id])
        center.removeDeliveredNotifications(withIdentifiers: [id])
    }

    // MARK: - Pure trigger-time logic (unit-tested)

    /// Computes the `Date` at which an arrival alert should fire, given:
    /// - `minutesUntil`: live ETA in minutes (e.g. from `Departure.minutesUntil`)
    /// - `leadMinutes`: how many minutes early the rider wants the heads-up
    /// - `now`: the reference time
    ///
    /// Returns `nil` when the lead time has already elapsed (the alert would
    /// fire in the past); callers should fall back to an immediate alert.
    static func arrivalTrigger(minutesUntil: Int,
                               leadMinutes: Int,
                               now: Date) -> Date? {
        guard minutesUntil > 0 else { return nil }
        // If the desired lead time has already elapsed (or equals the ETA),
        // there's no future moment to schedule — signal the caller to fire
        // immediately via `fireImmediateArrivalAlert`.
        guard leadMinutes < minutesUntil else { return nil }
        let delayMinutes = minutesUntil - leadMinutes
        guard delayMinutes > 0 else { return nil }
        return now.addingTimeInterval(TimeInterval(delayMinutes * 60))
    }

    /// Stable identifier so re-scheduling the same departure updates the
    /// existing pending request instead of stacking duplicates.
    static func arrivalIdentifier(departure: Departure) -> String {
        "arrival-\(departure.id)"
    }

    static func approachingIdentifier(tripId: String, stopId: String) -> String {
        "approaching-\(tripId)-\(stopId)"
    }

    static func arrivalBody(departure: Departure, leadMinutes: Int, stopName: String?) -> String {
        let head = departure.line.isEmpty ? "Service" : departure.line
        let where_ = stopName.map { " at \($0)" } ?? ""
        if leadMinutes > 0 {
            return "\(head) → \(departure.destination) arriving in \(leadMinutes) min\(where_)."
        }
        return "\(head) → \(departure.destination) arriving now\(where_)."
    }

    static func approachingBody(stopName: String, minutesAway: Int?) -> String {
        if let minutesAway, minutesAway >= 0 {
            return "Get ready — \(stopName) in about \(minutesAway) min."
        }
        return "Get ready — approaching \(stopName)."
    }
}
