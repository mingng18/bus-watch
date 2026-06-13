import SwiftUI

@main
struct BusWatchApp: App {
    @StateObject private var contextEngine = ContextEngine()
    @StateObject private var favorites = FavoriteStore()

    var body: some Scene {
        WindowGroup {
            MainView()
                .environmentObject(contextEngine)
                .environmentObject(favorites)
        }
    }
}
