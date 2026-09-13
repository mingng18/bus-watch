cat << 'INNEREOF' > patch.swift
<<<<<<< SEARCH
                if !stop.arrivals.contains(where: { $0.isRealtime }) {
                    Label("Scheduled", systemImage: "clock")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                        .accessibilityLabel("Scheduled arrivals")
                }
=======
                if !stop.arrivals.contains(where: { $0.isRealtime }) {
                    (Text(Image(systemName: "clock")) + Text(" Scheduled"))
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                        .accessibilityLabel("Scheduled arrivals")
                }
>>>>>>> REPLACE
INNEREOF
