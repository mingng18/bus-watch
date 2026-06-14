import SwiftUI

struct BusProgressView: View {
    let progress: BusProgressResponse

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(progress.routeShortName)
                        .font(.headline)
                    Spacer()
                }
                Text("→ \(progress.destination)")
                    .font(.caption)
                    .foregroundStyle(.secondary)

                Divider()

                ForEach(progress.stops) { stop in
                    TripStopRow(stop: stop)
                }

                Divider()

                HStack {
                    Spacer()
                    let remaining = progress.stops.filter { !$0.passed }.count
                    Text("\(remaining) stops remaining")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
            }
            .padding()
        }
    }
}

private struct TripStopRow: View {
    let stop: TripStopStatus

    var body: some View {
        HStack(spacing: 6) {
            if stop.isCurrent {
                Image(systemName: "location.circle.fill")
                    .font(.caption)
                    .foregroundStyle(.green)
            } else if stop.passed {
                Circle()
                    .fill(Color.gray)
                    .frame(width: 8, height: 8)
            } else {
                Circle()
                    .strokeBorder(Color.blue, lineWidth: 1.5)
                    .frame(width: 8, height: 8)
            }

            Text(stop.name)
                .font(.caption)
                .foregroundStyle(stop.passed && !stop.isCurrent ? Color.secondary : Color.white)

            Spacer()

            if stop.isCurrent {
                Text("HERE")
                    .font(.caption2)
                    .bold()
                    .foregroundStyle(.green)
            } else if !stop.passed {
                Text(stop.arrivalTime)
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
        }
    }
}
