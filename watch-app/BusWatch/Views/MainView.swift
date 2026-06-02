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
                noLocationView
            case .station(let stop, let schedule):
                StationArrivalsView(stop: stop, schedule: schedule)
            case .onBus(let progress):
                BusProgressView(progress: progress)
            case .nearby(let response):
                NearbyListView(response: response) { stop in
                    engine.selectStation(stop)
                }
            case .error(let message):
                errorView(message: message)
            }
        }
        .navigationTitle("BusWatch")
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button(action: { showManual = true }) {
                    Image(systemName: "list.bullet")
                }
            }
        }
        .sheet(isPresented: $showManual) {
            ManualPickerView(engine: engine)
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
