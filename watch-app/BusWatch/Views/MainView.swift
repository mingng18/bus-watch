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
                }, onSelectTrip: { tripId in
                    engine.selectBusTrip(tripId)
                }, favorites: favorites)
            case .error(let message):
                errorView(message: message)
            }
        }
        .navigationTitle("BusWatch")
        .toolbar {
            if engine.state.showsBackNavigation {
                ToolbarItem(placement: .topBarLeading) {
                    Button(action: { engine.showNearby() }) {
                        Label("Back", systemImage: "chevron.left")
                    }
                }
            } else if AppFeatureFlags.serviceAlerts {
                ToolbarItem(placement: .topBarLeading) {
                    Button(action: { showAlerts = true }) {
                        Label("Service alerts", systemImage: "exclamationmark.bubble")
                            .labelStyle(.iconOnly)
                    }
                }
            }
            ToolbarItem(placement: .topBarTrailing) {
                Button(action: { showManual = true }) {
                    Label("Manual Selection", systemImage: "list.bullet")
                        .labelStyle(.iconOnly)
                }
            }
            if AppFeatureFlags.externalJourneyPlanner {
                ToolbarItem(placement: .bottomBar) {
                    Link(destination: JourneyPlanner.url) {
                        Label("Plan a trip", systemImage: "arrow.triangle.turn.up.right.diamond")
                            .labelStyle(.iconOnly)
                    }
                }
            }
        }
        .sheet(isPresented: $showManual) {
            ManualPickerView(engine: engine, favorites: favorites) { stop in
                showManual = false
                engine.selectStation(stop)
            }
        }
        .sheet(isPresented: $showAlerts) {
            if AppFeatureFlags.serviceAlerts {
                NavigationStack {
                    AlertsView()
                }
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
                .accessibilityHidden(true)
            Text("Location access needed")
                .font(.caption)
                .multilineTextAlignment(.center)
            #if canImport(UIKit) && !os(watchOS)
            Button {
                if let url = URL(string: UIApplication.openSettingsURLString) {
                    UIApplication.shared.open(url)
                }
            } label: {
                Label("Open Settings", systemImage: "gear")
            }
            .buttonStyle(.bordered)
            #elseif os(watchOS)
            Text("Enable in Watch Settings")
                .font(.caption)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
            #endif
            Button {
                showManual = true
            } label: {
                Label("Manual Selection", systemImage: "list.bullet")
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
                .accessibilityHidden(true)
            Text(message)
                .font(.caption)
                .multilineTextAlignment(.center)
            Button {
                engine.start()
            } label: {
                Label("Retry", systemImage: "arrow.clockwise")
            }
            .buttonStyle(.bordered)
        }
    }

}
