import WidgetKit
import SwiftUI

/// Entry point for the BusWatch complications widget extension.
@main
struct BusWatchComplicationsBundle: WidgetBundle {
    var body: some Widget {
        CountdownWidget()
    }
}
