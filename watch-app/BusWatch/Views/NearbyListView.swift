import SwiftUI

struct NearbyListView: View {
    let response: NearbyResponse
    let onSelectStop: (NearbyStop) -> Void

    var body: some View {
        List(response.stops) { stop in
            Button(action: { onSelectStop(stop) }) {
                VStack(alignment: .leading) {
                    HStack {
                        Image(systemName: stop.type == "rail" ? "train.side.front.car" : "bus")
                            .foregroundStyle(stop.type == "rail" ? .blue : .orange)
                            .accessibilityHidden(true)
                        Text(stop.name)
                            .font(.caption)
                        Spacer()
                        Text("\(stop.distanceM)m")
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }

                    if let first = stop.arrivals.first {
                        Text("\(first.isRealtime ? "" : "sched ")\(first.line ?? first.route ?? "") → \(first.destination) — \(first.minutes) min")
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }
                }
            }
        }
        .listStyle(.plain)
    }
}
