enum AppFeatureFlags {
    /// Favorites and home-stop setup remain in-tree, but are hidden for this release.
    static let favoritesAndHome = false

    /// MyRapid service-alert entry point is deferred for this release.
    static let serviceAlerts = false

    /// Arrival reminders and approaching-stop notification prompts are deferred.
    static let arrivalNotifications = false

    /// Show live nearby bus positions supplied by `/nearby.busRoutes`.
    static let liveBusMap = true
}
