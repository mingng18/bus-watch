import SwiftUI

@main
struct BusWatchApp: App {
    @StateObject private var contextEngine = ContextEngine()
    @StateObject private var favorites = FavoriteStore(defaults: SharedDefaults.suite)
    @StateObject private var notifications = NotificationService()

    var body: some Scene {
        WindowGroup {
            NavigationStack {
                MainView()
            }
            .environmentObject(contextEngine)
            .environmentObject(favorites)
            .environmentObject(notifications)
            .task {
                await notifications.removeFeatureNotificationsIfDisabled()
            }
        }
    }
}
