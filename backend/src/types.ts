export interface Env {
  KV: KVNamespace;
  DB: D1Database;
  ADMIN_TOKEN?: string;
  FRONTEND_URL?: string;
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
  /**
   * Coarse confidence in the `minutes` value ('high'|'medium'|'low'). Only
   * set when minutes came from the historical-aggregate path; live GTFS
   * realtime arrivals leave this unset. See issue #133.
   */
  confidence?: EtaConfidence;
  /**
   * Uncertainty half-window in minutes for a historical estimate, so the
   * client can render "≈5 min". Omitted for live arrivals.
   */
  uncertainty_minutes?: number;
  /**
   * "scheduled" = derived from historical aggregates (not live); "live" =
   * from a GTFS-realtime vehicle position. Omitted = legacy/unknown so older
   * clients are unaffected. See issue #133.
   */
  eta_source?: 'scheduled' | 'live';
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
  /** JS day index (0=Sun..6=Sat) in KL-local time. See time-kl.ts. */
  day_of_week: number;
  /** KL-local hour (0..23) of the from-stop passage. */
  time_bucket: number;
  /** Mean absolute deviation of samples, in seconds (robust spread signal). */
  spread_seconds: number;
}

/**
 * Result of a historical-ETA lookup. Carries a confidence signal so callers
 * can render an honest "approx N min" qualifier instead of a single point
 * estimate. See issue #133.
 */
export type EtaConfidence = 'high' | 'medium' | 'low';

export interface HistoricalEtaResult {
  /** Point estimate, in minutes (avg_seconds / 60, rounded for display only upstream). */
  minutes: number;
  /** Half-width of the uncertainty window, in minutes (from spread_seconds). */
  uncertaintyMinutes: number;
  /** Coarse confidence bucket derived from sample_count + spread. */
  confidence: EtaConfidence;
  /** Historical aggregates are never live. Lets callers flag scheduled-vs-live. */
  isLive: false;
  /** Number of samples backing the estimate (0 when no data was found). */
  sampleCount: number;
}