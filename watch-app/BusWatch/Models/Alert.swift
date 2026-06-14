import Foundation

/// Recent service-disruption alerts sourced from MyRapid media releases.
struct AlertsResponse: Codable {
    let alerts: [Alert]
}

struct Alert: Identifiable, Codable {
    let id: String
    let title: String
    let summary: String
    /// ISO 8601 date string (UTC) from the sitemap lastmod.
    let date: String
    /// Affected bus routes / rail lines, when extractable from the slug.
    let affectedLines: [String]
    /// "info" | "warning" | "severe"
    let severity: String
    let url: String

    /// Parsed date for display; falls back to .distantPast if unparseable.
    var parsedDate: Date {
        ISO8601DateFormatter().date(from: date) ?? .distantPast
    }
}

extension Alert {
    /// SF Symbol + tint color for the alert's severity level.
    var severityIcon: String {
        switch severity {
        case "severe":   return "exclamationmark.octagon.fill"
        case "warning":  return "exclamationmark.triangle.fill"
        default:         return "info.circle.fill"
        }
    }

    var severityColor: String {
        switch severity {
        case "severe":   return "red"
        case "warning":  return "orange"
        default:         return "blue"
        }
    }
}
