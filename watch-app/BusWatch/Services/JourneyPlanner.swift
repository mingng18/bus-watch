import Foundation

/// Entry point for Prasarana's web Journey Planner, opened via a universal
/// link from the watch app. Trip planning is out of scope for BusWatch itself,
/// so we hand off to Prasarana's multi-modal planner (Bus/BRT/LRT/MRT/Monorail).
enum JourneyPlanner {
    /// Prasarana's public Journey Planner. Wrapped in a `caseless enum` so the
    /// URL lives in exactly one place and can be referenced from any view.
    static let url = URL(string: "https://www.myrapid.com.my/bus-train/pulse/journey-planner/")!
}
