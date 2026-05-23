import SwiftUI

struct StationArrivalsView: View {
    let stop: NearbyStop
    let schedule: StationScheduleResponse

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 8) {
                Text(stop.name)
                    .font(.headline)

                Divider()

                ForEach(schedule.departures) { dep in
                    HStack {
                        Circle()
                            .fill(dep.minutesUntil <= 3 ? Color.green : Color.blue)
                            .frame(width: 8, height: 8)
                        VStack(alignment: .leading) {
                            Text(dep.line)
                                .font(.caption2)
                                .foregroundStyle(.secondary)
                            Text("→ \(dep.destination)")
                                .font(.caption)
                        }
                        Spacer()
                        Text("\(dep.minutesUntil) min")
                            .font(.caption)
                            .bold()
                            .foregroundStyle(dep.minutesUntil <= 3 ? Color.green : .white)
                    }
                }

                if !stop.arrivals.contains(where: { $0.isRealtime }) {
                    Text("sched")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }

                HStack {
                    Spacer()
                    Text("Auto-detected")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
            }
            .padding()
        }
    }
}
