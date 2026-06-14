import SwiftUI

/// Lists recent MyRapid service alerts (disruptions, delays, line updates).
/// Fetches on appear and surfaces loading / empty / error states inline.
struct AlertsView: View {
    private let api = APIClient.shared

    @State private var loadState: LoadState = .loading

    enum LoadState {
        case loading
        case loaded([Alert])
        case empty
        case error(String)
    }

    var body: some View {
        Group {
            switch loadState {
            case .loading:
                ProgressView("Loading alerts...")
            case .empty:
                VStack(spacing: 8) {
                    Image(systemName: "checkmark.seal.fill")
                        .font(.title2)
                        .foregroundStyle(.green)
                        .accessibilityHidden(true)
                    Text("No active disruptions")
                        .font(.caption)
                }
            case .error(let message):
                VStack(spacing: 12) {
                    Image(systemName: "exclamationmark.triangle")
                        .font(.title2)
                        .foregroundStyle(.red)
                    Text(message)
                        .font(.caption2)
                    Button("Retry") {
                        Task { await load() }
                    }
                    .buttonStyle(.bordered)
                }
            case .loaded(let alerts):
                List {
                    ForEach(alerts) { alert in
                        alertRow(alert)
                    }
                }
                .listStyle(.plain)
            }
        }
        .navigationTitle("Alerts")
        .onAppear { Task { await load() } }
    }

    @ViewBuilder
    private func alertRow(_ alert: Alert) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(alignment: .top) {
                Image(systemName: alert.severityIcon)
                    .foregroundStyle(severityTint(alert))
                    .accessibilityHidden(true)
                Text(alert.title)
                    .font(.caption)
                Spacer()
            }
            if !alert.affectedLines.isEmpty {
                Text(alert.affectedLines.joined(separator: ", "))
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
            Text(RelativeDateTimeFormatter().localizedString(for: alert.parsedDate, relativeTo: Date()))
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(alert.severity) alert: \(alert.title)")
    }

    private func severityTint(_ alert: Alert) -> Color {
        switch alert.severity {
        case "severe":  return .red
        case "warning": return .orange
        default:        return .blue
        }
    }

    private func load() async {
        await MainActor.run { loadState = .loading }
        do {
            let response = try await api.fetchAlerts()
            await MainActor.run {
                loadState = response.alerts.isEmpty ? .empty : .loaded(response.alerts)
            }
        } catch {
            await MainActor.run { loadState = .error(error.localizedDescription) }
        }
    }
}
