import SwiftUI

struct MainView: View {
    @EnvironmentObject var engine: ContextEngine
    @EnvironmentObject var favorites: FavoriteStore
    @State private var showManual = false
    @State private var showAlerts = false

    var body: some View {
        Group {
            switch engine.state {
            case .loading:
                ProgressView("Locating...")
            case .noLocation:
                noLocationView
            case .station(let stop, let schedule, let isOffline):
                StationArrivalsView(stop: stop, schedule: schedule, favorites: favorites, isOffline: isOffline)
            case .onBus(let progress):
                BusProgressView(progress: progress)
            case .nearby(let response):
                NearbyListView(response: response, onSelectStop: { stop in
                    engine.selectStation(stop)
                }, favorites: favorites)
            case .error(let message):
                errorView(message: message)
            }
        }
        .navigationTitle("BusWatch")
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button(action: { showAlerts = true }) {
                    Image(systemName: "exclamationmark.bubble")
                }
                .accessibilityLabel("Service alerts")
            }
            ToolbarItem(placement: .cancellationAction) {
                Button(action: { showManual = true }) {
                    Image(systemName: "list.bullet")
                        .accessibilityLabel("Manual Selection")
                }
            }
            // Deep link into Prasarana's Journey Planner so riders can plan a
            // multi-modal trip (Bus/BRT/LRT/MRT/Monorail) without leaving the
            // BusWatch launch flow. Opens the universal link in the system browser.
            ToolbarItem(placement: .bottomBar) {
                Link(destination: JourneyPlanner.url) {
                    Label("Plan a trip", systemImage: "arrow.triangle.turn.up.right.diamond")
                        .labelStyle(.iconOnly)
                }
            }
        }
        .sheet(isPresented: $showManual) {
            ManualPickerView(engine: engine, favorites: favorites)
        }
        .sheet(isPresented: $showAlerts) {
            NavigationStack {
                AlertsView()
            }
        }
        .onAppear {
            engine.start()
        }
    }
    @ViewBuilder
    private var noLocationView: some View {
        VStack(spacing: 12) {
            Image(systemName: "location.slash")
                .font(.title2)
            Text("Location access needed")
                .font(.caption)
            #if canImport(UIKit) && !os(watchOS)
            Button("Open Settings") {
                if let url = URL(string: UIApplication.openSettingsURLString) {
                    UIApplication.shared.open(url)
                }
            }
            .buttonStyle(.bordered)
            #elseif os(watchOS)
            Text("Enable Location in Watch Settings")
                .font(.caption2)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            #endif
            Button("Manual Selection") {
                showManual = true
            }
            .buttonStyle(.bordered)
        }
    }

    @ViewBuilder
    private func errorView(message: String) -> some View {
        VStack(spacing: 12) {
            Image(systemName: "exclamationmark.triangle")
                .font(.title2)
                .foregroundStyle(.red)
            Text(message)
                .font(.caption)
            Button("Retry") {
                engine.start()
            }
            .buttonStyle(.bordered)
        }
    }

}
