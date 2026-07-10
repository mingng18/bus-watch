import MapKit
import SwiftUI

struct NearbyBusMapView: View {
    let response: NearbyResponse
    @State private var cameraPosition: MapCameraPosition = .automatic

    private var stopsWithCoordinates: [NearbyStop] {
        Array(response.stops.lazy.filter { $0.lat != nil && $0.lon != nil }.prefix(4))
    }

    private var region: MKCoordinateRegion {
        let coordinates = response.busRoutes.map {
            CLLocationCoordinate2D(latitude: $0.lat, longitude: $0.lon)
        } + stopsWithCoordinates.compactMap { stop in
            guard let lat = stop.lat, let lon = stop.lon else { return nil }
            return CLLocationCoordinate2D(latitude: lat, longitude: lon)
        }

        guard let first = coordinates.first else {
            return MKCoordinateRegion(
                center: CLLocationCoordinate2D(latitude: 3.139, longitude: 101.687),
                span: MKCoordinateSpan(latitudeDelta: 0.02, longitudeDelta: 0.02)
            )
        }

        let minLat = coordinates.map(\.latitude).min() ?? first.latitude
        let maxLat = coordinates.map(\.latitude).max() ?? first.latitude
        let minLon = coordinates.map(\.longitude).min() ?? first.longitude
        let maxLon = coordinates.map(\.longitude).max() ?? first.longitude
        let latitudeDelta = min(max((maxLat - minLat) * 1.4, 0.005), 0.08)
        let longitudeDelta = min(max((maxLon - minLon) * 1.4, 0.005), 0.08)

        return MKCoordinateRegion(
            center: CLLocationCoordinate2D(
                latitude: (minLat + maxLat) / 2,
                longitude: (minLon + maxLon) / 2
            ),
            span: MKCoordinateSpan(
                latitudeDelta: latitudeDelta,
                longitudeDelta: longitudeDelta
            )
        )
    }

    private var cameraSignature: [String] {
        response.busRoutes.map { "bus:\($0.id):\($0.lat):\($0.lon)" }
            + stopsWithCoordinates.compactMap { stop in
                guard let lat = stop.lat, let lon = stop.lon else { return nil }
                return "stop:\(stop.id):\(lat):\(lon)"
            }
    }

    var body: some View {
        Map(position: $cameraPosition, interactionModes: [.pan, .zoom]) {
            ForEach(stopsWithCoordinates) { stop in
                if let lat = stop.lat, let lon = stop.lon {
                    Annotation(
                        stop.name,
                        coordinate: CLLocationCoordinate2D(latitude: lat, longitude: lon)
                    ) {
                        Circle()
                            .fill(stop.type == "rail" ? Color.blue : Color.white)
                            .frame(width: 7, height: 7)
                            .overlay(Circle().stroke(.black.opacity(0.5), lineWidth: 1))
                    }
                }
            }

            ForEach(response.busRoutes) { bus in
                Marker(
                    bus.routeShortName.isEmpty ? "Bus" : bus.routeShortName,
                    systemImage: "bus.fill",
                    coordinate: CLLocationCoordinate2D(latitude: bus.lat, longitude: bus.lon)
                )
                .tint(.orange)
            }
        }
        .onAppear {
            cameraPosition = .region(region)
        }
        .onChange(of: cameraSignature) { _, _ in
            cameraPosition = .region(region)
        }
        .mapStyle(.standard(elevation: .flat, pointsOfInterest: .excludingAll, showsTraffic: false))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .accessibilityLabel("Live bus map with \(response.busRoutes.count) buses")
    }
}
