import WidgetKit
import Foundation

/// A single point on the complication's timeline: the date it's shown at,
/// plus the countdown snapshot (nil = empty/placeholder state).
struct CountdownEntry: TimelineEntry {
    let date: Date
    let snapshot: CountdownSnapshot?
}
