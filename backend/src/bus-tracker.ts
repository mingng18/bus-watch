import { Route, TripStopEntry, VehiclePosition, BusProgressResponse, TripStopStatus } from './types';

export function getBusTripProgress(
  tripId: string,
  routes: Route[],
  tripStops: Record<string, TripStopEntry[]>,
  vehicle: VehiclePosition | null,
): BusProgressResponse {
  const stops = tripStops[tripId];
  if (!stops) throw new Error(`Trip not found: ${tripId}`);

  const route = routes.find(r => r.id === vehicle?.routeId);
  const destination = stops[stops.length - 1]?.stopName || '';
  const currentSeq = vehicle?.currentStopSequence || 0;

  const stopStatuses: TripStopStatus[] = stops.map(s => ({
    id: s.stopId,
    name: s.stopName,
    arrivalTime: s.arrivalTime,
    passed: s.sequence < currentSeq,
    isCurrent: s.sequence === currentSeq,
  }));

  const progressPercent = stops.length > 1
    ? Math.round(((currentSeq - 1) / (stops.length - 1)) * 100)
    : 0;

  return {
    tripId,
    routeShortName: route?.shortName || '',
    destination,
    busPosition: vehicle ? { lat: vehicle.lat, lon: vehicle.lon } : null,
    stops: stopStatuses,
    progressPercent: Math.max(0, Math.min(100, progressPercent)),
  };
}
