export interface Env {
  FRONTEND_URL?: string;
  KV: KVNamespace;
  DB: D1Database;
}

// --- GTFS raw types ---

export interface GtfsStop {
  stop_id: string;
  stop_name: string;
  stop_lat: string;
  stop_lon: string;
  location_type: string;
  parent_station: string;
}

export interface GtfsRoute {
  route_id: string;
  route_short_name: string;
  route_long_name: string;
  route_type: string;
}

export interface GtfsTrip {
  trip_id: string;
  route_id: string;
  service_id: string;
  trip_headsign: string;
  direction_id: string;
}

export interface GtfsStopTime {
  trip_id: string;
  arrival_time: string;
  departure_time: string;
  stop_id: string;
  stop_sequence: string;
}

export interface GtfsCalendar {
  service_id: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  start_date: string;
  end_date: string;
}

export interface GtfsShape {
  shape_id: string;
  shape_pt_lat: string;
  shape_pt_lon: string;
  shape_pt_sequence: string;
}

// --- Processed types (stored in KV) ---

export interface Stop {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: 'bus' | 'rail';
  parentStation: string;
}

export interface Route {
  id: string;
  shortName: string;
  longName: string;
  type: number;
}

export interface Trip {
  id: string;
  routeId: string;
  serviceId: string;
  headsign: string;
  directionId: number;
  shapeId: string;
}

export interface TripStopEntry {
  stopId: string;
  stopName: string;
  lat: number;
  lon: number;
  arrivalTime: string;
  departureTime: string;
  sequence: number;
}

export interface CalendarEntry {
  serviceId: string;
  days: boolean[];
  startDate: string;
  endDate: string;
}

export interface ScheduleEntry {
  tripId: string;
  routeShortName: string;
  headsign: string;
  departureTime: string;
  directionId: number;
}

export interface VehiclePosition {
  tripId: string;
  routeId: string;
  lat: number;
  lon: number;
  currentStopSequence: number;
  timestamp: number;
  stopId: string;
}

// --- API response types ---

export interface NearbyStop {
  id: string;
  name: string;
  type: 'bus' | 'rail';
  lat: number;
  lon: number;
  distance_m: number;
  arrivals: Arrival[];
}

export interface Arrival {
  line?: string;
  route?: string;
  destination: string;
  minutes: number;
  isRealtime: boolean;
  tripId?: string;
}

export interface BusRouteEntry {
  routeId: string;
  routeShortName: string;
  destination: string;
  minutes: number;
  tripId: string;
  lat: number;
  lon: number;
  busNo?: string;
}

export interface BusProgressResponse {
  tripId: string;
  routeShortName: string;
  destination: string;
  busPosition: { lat: number; lon: number } | null;
  stops: TripStopStatus[];
  progressPercent: number;
}

export interface TripStopStatus {
  id: string;
  name: string;
  arrivalTime: string;
  passed: boolean;
  isCurrent: boolean;
}

export interface StationScheduleResponse {
  stopId: string;
  stopName: string;
  departures: Departure[];
}

export interface Departure {
  line: string;
  destination: string;
  departureTime: string;
  minutesUntil: number;
}

export interface RouteInfo {
  id: string;
  shortName: string;
  longName: string;
  type: 'bus' | 'rail';
}

export interface Frequency {
  tripId: string;
  startTime: string;
  endTime: string;
  headwaySecs: number;
}

export interface RouteDetailsResponse {
  routeId: string;
  buses: BusRouteEntry[];
  shapes: {
    id: string;
    points: [number, number][]; // Array of [lat, lon]
  }[];
}

// --- Prasarana Socket.IO bus data ---

export interface PrasaranaBus {
  bus_no: string;
  route: string;
  latitude: number;
  longitude: number;
  speed: number;
  dir: number | null;
  trip_rev_kind: string;
  provider: string;
  captain_id: string;
  dt_gps: string;
  dt_received: string;
}

// --- KV data aggregate ---

export interface AgencyData {
  stops: Stop[];
  routes: Route[];
  trips: Trip[];
  tripStops: Record<string, TripStopEntry[]>;
  calendar: CalendarEntry[];
  frequencies: Frequency[];
  shapes: Record<string, [number, number][]>;
}

export interface BusPosition {
  id: number;
  bus_no: string;
  route: string;
  /** 'gtfs' | 'prasarana' | string */
  source: string;
  lat: number;
  lon: number;
  speed: number | null;
  /** Unix seconds */
  timestamp: number;
  created_at: number;
}

export interface TravelTime {
  id: number;
  route: string;
  from_stop_id: string;
  to_stop_id: string;
  from_lat: number;
  from_lon: number;
  to_lat: number;
  to_lon: number;
  /** Average travel time in seconds */
  avg_seconds: number;
  sample_count: number;
  updated_at: number;
}