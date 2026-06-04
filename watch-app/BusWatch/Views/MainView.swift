import SwiftUI

struct MainView: View {
    @EnvironmentObject var engine: ContextEngine
    @State private var showManual = false

    var body: some View {
        Group {
            switch engine.state {
            case .loading:
                ProgressView("Locating...")
            case .noLocation:
                VStack(spacing: 12) {
                    Image(systemName: "location.slash")
                        .font(.title2)
                        .accessibilityHidden(true)
                    Text("Location access needed")
                        .font(.caption)
                    Button("Open Settings") {
                        if let url = URL(string: UIApplication.openSettingsURLString) {
                            UIApplication.shared.open(url)
                        }
                    }
                    .buttonStyle(.bordered)
                    Button("Manual Selection") {
                        showManual = true
                    }
                    .buttonStyle(.bordered)
                }
            case .station(let stop, let schedule):
                StationArrivalsView(stop: stop, schedule: schedule)
            case .onBus(let progress):
                BusProgressView(progress: progress)
            case .nearby(let response):
                NearbyListView(response: response) { stop in
                    engine.selectStation(stop)
                }
            case .error(let message):
                VStack(spacing: 12) {
                    Image(systemName: "exclamationmark.triangle")
                        .font(.title2)
                        .foregroundStyle(.red)
                        .accessibilityHidden(true)
                    Text(message)
                        .font(.caption)
                    Button("Retry") {
                        engine.start()
                    }
                    .buttonStyle(.bordered)
                }
            }
        }
        .navigationTitle("BusWatch")
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button(action: { showManual = true }) {
                    Image(systemName: "list.bullet")
                }
                .accessibilityLabel("Manual Selection")
            }
        }
        .sheet(isPresented: $showManual) {
            ManualPickerView(engine: engine)
        }
        .onAppear {
            engine.start()
        }
    }
}
