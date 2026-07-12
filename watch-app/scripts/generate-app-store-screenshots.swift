#!/usr/bin/env swift

import AppKit
import Foundation

struct ScreenshotSpec {
    let source: String
    let output: String
    let headline: String
    let caption: String
}

let scriptURL = URL(fileURLWithPath: #filePath)
let watchRoot = scriptURL.deletingLastPathComponent().deletingLastPathComponent()
let sourceRoot = watchRoot.appendingPathComponent("AppStore/ScreenshotSources", isDirectory: true)
let outputRoot = watchRoot.appendingPathComponent("fastlane/screenshots/en-US", isDirectory: true)

let specs = [
    ScreenshotSpec(
        source: "nearby-live-map.png",
        output: "01-your-kl-commute.png",
        headline: "Your KL commute.",
        caption: "Nearby buses, right on your wrist."
    ),
    ScreenshotSpec(
        source: "nearby-arrivals-list.png",
        output: "02-arrivals-at-a-glance.png",
        headline: "Arrivals at a glance.",
        caption: "Distance and live estimates in one view."
    ),
    ScreenshotSpec(
        source: "nearby-live-map.png",
        output: "03-live-buses-on-the-map.png",
        headline: "Live buses on the map.",
        caption: "See what is moving around you."
    ),
]

let canvasSize = NSSize(width: 416, height: 496)
let cream = NSColor(calibratedRed: 244 / 255, green: 243 / 255, blue: 235 / 255, alpha: 1)
let navy = NSColor(calibratedRed: 16 / 255, green: 31 / 255, blue: 92 / 255, alpha: 1)
let muted = NSColor(calibratedRed: 76 / 255, green: 82 / 255, blue: 103 / 255, alpha: 1)

let headlineFont = NSFont(name: "Georgia-Bold", size: 24) ?? .boldSystemFont(ofSize: 24)
let captionFont = NSFont.systemFont(ofSize: 13, weight: .medium)
let paragraph = NSMutableParagraphStyle()
paragraph.alignment = .center
paragraph.lineBreakMode = .byTruncatingTail

let headlineAttributes: [NSAttributedString.Key: Any] = [
    .font: headlineFont,
    .foregroundColor: navy,
    .paragraphStyle: paragraph,
]
let captionAttributes: [NSAttributedString.Key: Any] = [
    .font: captionFont,
    .foregroundColor: muted,
    .paragraphStyle: paragraph,
]

try FileManager.default.createDirectory(at: outputRoot, withIntermediateDirectories: true)

for spec in specs {
    let sourceURL = sourceRoot.appendingPathComponent(spec.source)
    let outputURL = outputRoot.appendingPathComponent(spec.output)
    guard let source = NSImage(contentsOf: sourceURL) else {
        throw NSError(domain: "BusWatchScreenshots", code: 1, userInfo: [NSLocalizedDescriptionKey: "Cannot load \(sourceURL.path)"])
    }

    let canvas = NSImage(size: canvasSize)
    canvas.lockFocus()

    cream.setFill()
    NSBezierPath(rect: NSRect(origin: .zero, size: canvasSize)).fill()

    NSString(string: spec.headline).draw(
        in: NSRect(x: 16, y: 457, width: 384, height: 30),
        withAttributes: headlineAttributes
    )
    NSString(string: spec.caption).draw(
        in: NSRect(x: 16, y: 432, width: 384, height: 19),
        withAttributes: captionAttributes
    )

    let frameRect = NSRect(x: 36, y: 12, width: 344, height: 410)
    let imageRect = frameRect.insetBy(dx: 3, dy: 3)
    let framePath = NSBezierPath(roundedRect: frameRect, xRadius: 30, yRadius: 30)
    navy.setFill()
    framePath.fill()

    NSGraphicsContext.saveGraphicsState()
    NSBezierPath(roundedRect: imageRect, xRadius: 27, yRadius: 27).addClip()
    source.draw(
        in: imageRect,
        from: NSRect(origin: .zero, size: source.size),
        operation: .sourceOver,
        fraction: 1,
        respectFlipped: true,
        hints: [.interpolation: NSImageInterpolation.high]
    )
    NSGraphicsContext.restoreGraphicsState()
    canvas.unlockFocus()

    guard let tiff = canvas.tiffRepresentation,
          let bitmap = NSBitmapImageRep(data: tiff),
          let png = bitmap.representation(using: .png, properties: [.compressionFactor: 1]) else {
        throw NSError(domain: "BusWatchScreenshots", code: 2, userInfo: [NSLocalizedDescriptionKey: "Cannot encode \(outputURL.path)"])
    }
    try png.write(to: outputURL, options: .atomic)
    print(outputURL.path)
}
