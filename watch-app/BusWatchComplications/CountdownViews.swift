import SwiftUI
import WidgetKit

/// Per-family SwiftUI views for the countdown complication. Each reads the
/// entry's snapshot (nil = empty state) and renders a glance-appropriate
/// amount of information.

/// Circular (Infograph face): bold minutes number over a faint "MIN".
struct CountdownCircularView: View {
    let snapshot: CountdownSnapshot?

    var body: some View {
        if let snapshot {
            VStack(spacing: 0) {
                Text("\(snapshot.minutesUntil)")
                    .font(.system(size: 28, weight: .bold))
                    .widgetAccentable()
                    .contentTransition(.numericText())
                Text("MIN")
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundStyle(.secondary)
            }
            .accessibilityElement(children: .ignore)
            .accessibilityLabel("\(snapshot.minutesUntil) minutes")
        } else {
            Image(systemName: "bus")
                .font(.title3)
                .foregroundStyle(.secondary)
                .accessibilityLabel("No bus selected")
        }
    }
}

/// Rectangular (Ultra/Modular faces): two-row stop + service detail.
struct CountdownRectangularView: View {
    let snapshot: CountdownSnapshot?

    var body: some View {
        if let snapshot {
            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 4) {
                    Image(systemName: "bus.fill")
                        .font(.caption2)
                    Text(snapshot.stopName)
                        .font(.caption2)
                        .lineLimit(1)
                }
                Text("\(snapshot.line) → \(snapshot.destination)")
                    .font(.caption)
                    .lineLimit(1)
                HStack(alignment: .firstTextBaseline, spacing: 2) {
                    Text("\(snapshot.minutesUntil)")
                        .font(.system(.body, design: .rounded).weight(.bold))
                        .contentTransition(.numericText())
                    Text("min")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
            }
            .accessibilityElement(children: .ignore)
            .accessibilityLabel("\(snapshot.line) to \(snapshot.destination), \(snapshot.minutesUntil) minutes, from \(snapshot.stopName)")
        } else {
            VStack(alignment: .leading, spacing: 2) {
                Image(systemName: "star")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Text("Set a home stop")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
            .accessibilityElement(children: .ignore)
            .accessibilityLabel("Set a home stop")
        }
    }
}

/// Inline (Siri/Utility faces): single plain-text line.
struct CountdownInlineView: View {
    let snapshot: CountdownSnapshot?

    var body: some View {
        if let snapshot {
            Text("\(snapshot.line) · \(snapshot.minutesUntil) min · \(snapshot.stopName)")
                .contentTransition(.numericText())
                .accessibilityLabel("\(snapshot.line), \(snapshot.minutesUntil) minutes, from \(snapshot.stopName)")
        } else {
            Text("BusWatch")
        }
    }
}

/// Corner (Modular/Simple faces): compact minutes.
struct CountdownCornerView: View {
    let snapshot: CountdownSnapshot?

    var body: some View {
        if let snapshot {
            Text("\(snapshot.minutesUntil)m")
                .font(.caption2.weight(.bold))
                .contentTransition(.numericText())
                .accessibilityLabel("\(snapshot.minutesUntil) minutes")
        } else {
            Image(systemName: "bus")
                .font(.caption2)
                .foregroundStyle(.secondary)
                .accessibilityLabel("No bus selected")
        }
    }
}

/// Routes each watchOS accessory family to its view. Used by the widget body.
@ViewBuilder
func countdownView(for family: WidgetFamily, snapshot: CountdownSnapshot?) -> some View {
    switch family {
    case .accessoryCircular:    CountdownCircularView(snapshot: snapshot)
    case .accessoryRectangular: CountdownRectangularView(snapshot: snapshot)
    case .accessoryInline:      CountdownInlineView(snapshot: snapshot)
    case .accessoryCorner:      CountdownCornerView(snapshot: snapshot)
    default:                    CountdownRectangularView(snapshot: snapshot)
    }
}
