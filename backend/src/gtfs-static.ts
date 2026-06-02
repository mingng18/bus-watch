import { unzipSync } from 'fflate';
import { parseCsv } from './csv-parser';
import {
  GtfsStop, GtfsRoute, GtfsTrip, GtfsStopTime, GtfsCalendar,
  Stop, Route, Trip, TripStopEntry, CalendarEntry, AgencyData, Frequency
} from './types';

const STATIC_URLS = {
  'rapid-bus-kl': 'https://api.data.gov.my/gtfs-static/prasarana?category=rapid-bus-kl',
  'rapid-bus-mrtfeeder': 'https://api.data.gov.my/gtfs-static/prasarana?category=rapid-bus-mrtfeeder',
  'rapid-rail-kl': 'https://api.data.gov.my/gtfs-static/prasarana?category=rapid-rail-kl',
};

const ROUTE_TYPE_MAP: Record<string, 'bus' | 'rail'> = {
  '0': 'rail',
  '1': 'rail',
  '2': 'rail',
  '3': 'bus',
  '4': 'bus',
};

export async function fetchAndParseAgency(agency: string): Promise<AgencyData> {
  const url = STATIC_URLS[agency as keyof typeof STATIC_URLS];
  if (!url) throw new Error(`Unknown agency: ${agency}`);

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${agency}: ${response.status}`);

  const zipBuffer = await response.arrayBuffer();
  const files = unzipSync(new Uint8Array(zipBuffer));

  const getFile = (name: string): string => {
    const key = Object.keys(files).find(k => k.endsWith(name));
    return key ? new TextDecoder().decode(files[key]) : '';
  };

  const rawStops = parseCsv(getFile('stops.txt')) as unknown as GtfsStop[];
  const rawRoutes = parseCsv(getFile('routes.txt')) as unknown as GtfsRoute[];
  const rawTrips = parseCsv(getFile('trips.txt')) as unknown as GtfsTrip[];
  const rawStopTimes = parseCsv(getFile('stop_times.txt')) as unknown as GtfsStopTime[];
  const rawCalendar = parseCsv(getFile('calendar.txt')) as unknown as GtfsCalendar[];

  const stopMap = new Map<string, Stop>();

  // Build route type lookup
  const routeIdToType = new Map(rawRoutes.map(r => [r.route_id, r.route_type]));
  const tripToRouteType = new Map(rawTrips.map(t => [t.trip_id, routeIdToType.get(t.route_id) || '3']));

  // Parse stops - determine type from trips serving each stop
  const stops: Stop[] = rawStops.map(s => {
    const stop: Stop = {
      id: s.stop_id,
      name: s.stop_name,
      lat: parseFloat(s.stop_lat),
      lon: parseFloat(s.stop_lon),
      type: 'bus',
      parentStation: s.parent_station,
    };
    stopMap.set(s.stop_id, stop);
    return stop;
  });

  // Set stop type based on routes serving it via stop_times → trips → routes
  for (const st of rawStopTimes) {
    const rt = tripToRouteType.get(st.trip_id);
    if (rt && ['0', '1', '2'].includes(rt)) {
      const stop = stopMap.get(st.stop_id);
      if (stop) stop.type = 'rail';
    }
  }

  // Child stops inherit parent type
  for (const stop of stops) {
    if (stop.parentStation) {
      const parent = stopMap.get(stop.parentStation);
      if (parent) stop.type = parent.type;
    }
  }

  const routes: Route[] = rawRoutes.map(r => ({
    id: r.route_id,
    shortName: r.route_short_name,
    longName: r.route_long_name,
    type: parseInt(r.route_type),
  }));

  const trips: Trip[] = rawTrips.map(t => ({
    id: t.trip_id,
    routeId: t.route_id,
    serviceId: t.service_id,
    headsign: t.trip_headsign,
    directionId: parseInt(t.direction_id) || 0,
    shapeId: '', // Dummy value
  }));

  const tripStops: Record<string, TripStopEntry[]> = {};
  for (const st of rawStopTimes) {
    if (!tripStops[st.trip_id]) tripStops[st.trip_id] = [];
    const stop = stopMap.get(st.stop_id);
    tripStops[st.trip_id].push({
      stopId: st.stop_id,
      stopName: stop?.name || st.stop_id,
      lat: stop?.lat || 0,
      lon: stop?.lon || 0,
      arrivalTime: st.arrival_time,
      departureTime: st.departure_time,
      sequence: parseInt(st.stop_sequence),
    });
  }
  for (const tid of Object.keys(tripStops)) {
    tripStops[tid].sort((a, b) => a.sequence - b.sequence);
  }

  const calendar: CalendarEntry[] = rawCalendar.map(c => ({
    serviceId: c.service_id,
    days: [c.sunday, c.monday, c.tuesday, c.wednesday, c.thursday, c.friday, c.saturday]
      .map(d => d === '1'),
    startDate: c.start_date,
    endDate: c.end_date,
  }));

  return { stops, routes, trips, tripStops, calendar, frequencies: [], shapes: {} };
}

export function getActiveServiceIds(calendar: CalendarEntry[], date: Date): Set<string> {
  const dayIndex = date.getDay();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const active = new Set<string>();
  for (const entry of calendar) {
    if (dateStr >= entry.startDate && dateStr <= entry.endDate && entry.days[dayIndex]) {
      active.add(entry.serviceId);
    }
  }
  return active;
}
