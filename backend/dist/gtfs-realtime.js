import { transit_realtime } from 'gtfs-realtime-bindings';
const REALTIME_URLS = {
    'rapid-bus-kl': 'https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl',
    'rapid-bus-mrtfeeder': 'https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-mrtfeeder',
};
export async function fetchVehiclePositions(agency) {
    const url = REALTIME_URLS[agency];
    if (!url)
        return [];
    const response = await fetch(url);
    if (!response.ok)
        return [];
    const buffer = await response.arrayBuffer();
    const feed = transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
    const positions = [];
    for (const entity of feed.entity) {
        if (!entity.vehicle)
            continue;
        const v = entity.vehicle;
        const tripId = v.trip?.tripId || '';
        const routeId = v.trip?.routeId || '';
        const lat = v.position?.latitude || 0;
        const lon = v.position?.longitude || 0;
        const seq = v.currentStopSequence || 0;
        const ts = v.timestamp ? v.timestamp.toNumber?.() ?? v.timestamp : 0;
        const stopId = v.stopId || '';
        if (!tripId || (lat === 0 && lon === 0))
            continue;
        positions.push({ tripId, routeId, lat, lon, currentStopSequence: seq, timestamp: ts, stopId });
    }
    return positions;
}
