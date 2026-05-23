import SwiftUI

@main
struct BusWatchApp: App {
    @StateObject private var contextEngine = ContextEngine()

    var body: some Scene {
        WindowGroup {
            MainView()
                .environmentObject(contextEngine)
        }
    }
}
