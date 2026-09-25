import WidgetKit
import SwiftUI

/// The BusWatch countdown complication. Shows the next-departure countdown
/// for the user's home stop across the four watchOS accessory families.
struct CountdownWidgetEntryView: View {
    var entry: CountdownEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        countdownView(for: family, snapshot: entry.snapshot)
    }
}

struct CountdownWidget: Widget {
    let kind = "BusWatchCountdownWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: CountdownTimelineProvider()) { entry in
            CountdownWidgetEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("Next bus")
        .description("Countdown to the next departure at your home stop.")
        .supportedFamilies([
            .accessoryCircular,
            .accessoryCorner,
            .accessoryRectangular,
            .accessoryInline
        ])
    }
}
