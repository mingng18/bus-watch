import SwiftUI

struct ManualPickerView: View {
    @ObservedObject var engine: ContextEngine

    var body: some View {
        List {
            Section("Nearby Stops") {
                if let nearby = engine.nearbyStops {
                    ForEach(nearby.stops) { stop in
                        Button(action: {
                            if stop.type == "rail" {
                                engine.selectStation(stop)
                            }
                        }) {
                            HStack {
                                Image(systemName: stop.type == "rail" ? "train.side.front.car" : "bus")
                                    .accessibilityHidden(true)
                                Text(stop.name)
                                    .font(.caption)
                            }
                        }
                    }
                } else {
                    Text("Loading...")
                        .foregroundStyle(.secondary)
                }
            }
        }
        .listStyle(.plain)
    }
}
