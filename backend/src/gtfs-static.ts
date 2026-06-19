import { unzipSync } from 'fflate';
import { parseCsv } from './csv-parser';
import {
  GtfsStop, GtfsRoute, GtfsTrip, GtfsStopTime, GtfsCalendar,
  Stop, Route, Trip, TripStopEntry, CalendarEntry, AgencyData,
} from './types';
import { klDayOfWeek, klDateYyyyMmDd } from './time-kl';

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

function parseStops(
  rawStops: GtfsStop[],
  rawRoutes: GtfsRoute[],
  rawTrips: GtfsTrip[],
  rawStopTimes: GtfsStopTime[]
): { stops: Stop[]; stopMap: Map<string, Stop> } {
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

  return { stops, stopMap };
}

function parseRoutes(rawRoutes: GtfsRoute[]): Route[] {
  return rawRoutes.map(r => ({
    id: r.route_id,
    shortName: r.route_short_name,
    longName: r.route_long_name,
    type: parseInt(r.route_type),
  }));
}

function parseTrips(rawTrips: GtfsTrip[]): Trip[] {
  return rawTrips.map(t => ({
    id: t.trip_id,
    routeId: t.route_id,
    serviceId: t.service_id,
    headsign: t.trip_headsign,
    directionId: parseInt(t.direction_id) || 0,
    shapeId: '',
  }));
}

function parseTripStops(rawStopTimes: GtfsStopTime[], stopMap: Map<string, Stop>): Record<string, TripStopEntry[]> {
  const tripStops: Record<string, TripStopEntry[]> = {};
  // ⚡ Bolt: Track trips that need sorting instead of sorting all by default
  const unsortedTrips = new Set<string>();

  for (const st of rawStopTimes) {
    const tid = st.trip_id;
    let stops = tripStops[tid];
    const seq = parseInt(st.stop_sequence);

    if (!stops) {
      stops = [];
      tripStops[tid] = stops;
    } else if (seq < stops[stops.length - 1].sequence) {
      unsortedTrips.add(tid);
    }

    const stop = stopMap.get(st.stop_id);
    stops.push({
      stopId: st.stop_id,
      stopName: stop?.name || st.stop_id,
      lat: stop?.lat || 0,
      lon: stop?.lon || 0,
      arrivalTime: st.arrival_time,
      departureTime: st.departure_time,
      sequence: seq,
    });
  }

  for (const tid of unsortedTrips) {
    tripStops[tid].sort((a, b) => a.sequence - b.sequence);
  }
  return tripStops;
}

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

  const { stops, stopMap } = parseStops(rawStops, rawRoutes, rawTrips, rawStopTimes);
  const routes = parseRoutes(rawRoutes);
  const trips = parseTrips(rawTrips);
  const tripStops = parseTripStops(rawStopTimes, stopMap);

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
  // GTFS service calendars are authored in KL-local time (UTC+8); Workers run
  // in UTC. Derive day-of-week and calendar date in KL-local so we don't pick
  // the wrong service pattern ~8h/day around the UTC midnight boundary.
  // See issue #127.
  const dayIndex = klDayOfWeek(date);
  const dateStr = klDateYyyyMmDd(date);
  const active = new Set<string>();
  for (const entry of calendar) {
    if (dateStr >= entry.startDate && dateStr <= entry.endDate && entry.days[dayIndex]) {
      active.add(entry.serviceId);
    }
  }
  return active;
}