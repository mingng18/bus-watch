import WidgetKit
import SwiftUI

/// The BusWatch countdown complication. Shows the next-departure countdown
/// for the user's home stop across the four watchOS accessory families.
struct CountdownWidget: Widget {
    let kind = "BusWatchCountdownWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: CountdownTimelineProvider()) { entry in
            countdownView(for: WidgetFamily.accessoryRectangular, snapshot: entry.snapshot)
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
