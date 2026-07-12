import { Env } from './types';
import { toKlLocal, parseGtfsTimeParts } from './time-kl';

interface RailArrival {
  trip_id: string;
  route_short_name: string;
  route_long_name: string;
  headsign: string;
  scheduled_time: string; // HH:MM
  minutes_until: number;
}

interface RailScheduleResponse {
  stop_id: string;
  stop_name: string;
  arrivals: RailArrival[];
  stale?: boolean; // true if ingest metadata is older than 8 days
}

interface RailStopResult {
  stop_id: string;
  stop_name: string;
  lat: number;
  lon: number;
}

/**
 * Converts a GTFS HH:MM:SS time string (which may exceed 24h) into
 * total minutes since midnight.
 */
function gtfsTimeToMinutes(t: string): number {
  // ⚡ Bolt Performance Optimization: Use shared zero-allocation parser
  const [h, m] = parseGtfsTimeParts(t);
  return h * 60 + m;
}

/**
 * Formats a GTFS HH:MM:SS time string into a human-readable HH:MM,
 * wrapping times >= 24h back to the next-day equivalent.
 */
function formatGtfsTime(t: string): string {
  // ⚡ Bolt Performance Optimization: Use shared zero-allocation parser
  const [h, m] = parseGtfsTimeParts(t);
  const hWrapped = h % 24;
  return `${hWrapped.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export async function getRailSchedule(
  env: Env,
  stopId: string,
  windowMinutes = 120
): Promise<RailScheduleResponse | null> {
  // 1. Fetch stop info
  const stopRow = await env.DB.prepare(
    `SELECT stop_id, stop_name FROM rail_stops WHERE stop_id = ?`
  ).bind(stopId).first<{ stop_id: string; stop_name: string }>();

  if (!stopRow) return null;

  // 2. Current time as minutes-since-midnight (server time is UTC; KL is UTC+8)
  const now = new Date();
  const klNow = toKlLocal(now);
  const currentMinutes = klNow.getUTCHours() * 60 + klNow.getUTCMinutes();

  // 3. Query upcoming arrivals within the window
  // We compare GTFS times as integers: departure_minutes = hours*60 + mins.
  // Handles overnight wrap (e.g., window crosses midnight).
  const upperMinutes = currentMinutes + windowMinutes;

  const { results } = await env.DB.prepare(
    `SELECT
       rst.departure_time,
       rt.trip_id,
       rt.headsign,
       rr.route_short_name,
       rr.route_long_name,
       -- Compute departure_minutes in SQL: CAST(substr(departure_time,1,2) AS INTEGER)*60 + CAST(substr(departure_time,4,2) AS INTEGER)
       (CAST(substr(rst.departure_time, 1, 2) AS INTEGER) * 60 + CAST(substr(rst.departure_time, 4, 2) AS INTEGER)) AS departure_minutes
     FROM rail_stop_times rst
     JOIN rail_trips rt ON rt.trip_id = rst.trip_id
     JOIN rail_routes rr ON rr.route_id = rt.route_id
     WHERE rst.stop_id = ?
       AND (CAST(substr(rst.departure_time, 1, 2) AS INTEGER) * 60 + CAST(substr(rst.departure_time, 4, 2) AS INTEGER))
           BETWEEN ? AND ?
     ORDER BY departure_minutes ASC
     LIMIT 20`
  ).bind(stopId, currentMinutes, upperMinutes).all<{
    departure_time: string;
    trip_id: string;
    headsign: string;
    route_short_name: string;
    route_long_name: string;
    departure_minutes: number;
  }>();

  const arrivals: RailArrival[] = results.map(row => ({
    trip_id: row.trip_id,
    route_short_name: row.route_short_name,
    route_long_name: row.route_long_name,
    headsign: row.headsign,
    scheduled_time: formatGtfsTime(row.departure_time),
    minutes_until: row.departure_minutes - currentMinutes,
  }));

  // 4. Check staleness
  const metaRow = await env.DB.prepare(
    `SELECT value FROM rail_ingest_meta WHERE key = 'last_ingested_at'`
  ).first<{ value: string }>();

  let stale = false;
  if (metaRow) {
    const lastIngest = new Date(metaRow.value);
    const ageMs = Date.now() - lastIngest.getTime();
    stale = ageMs > 8 * 24 * 60 * 60 * 1000; // >8 days
  } else {
    stale = true; // never ingested
  }

  return {
    stop_id: stopRow.stop_id,
    stop_name: stopRow.stop_name,
    arrivals,
    stale,
  };
}

/**
 * Case-insensitive search for rail stations by name.
 * Requires at least 2 characters. Returns up to 20 matches.
 */
export async function searchRailStops(
  env: Env,
  query: string
): Promise<RailStopResult[]> {
  const { results } = await env.DB.prepare(
    `SELECT stop_id, stop_name, lat, lon
     FROM rail_stops
     WHERE LOWER(stop_name) LIKE LOWER(?)
     ORDER BY stop_name ASC
     LIMIT 20`
  ).bind(`%${query}%`).all<RailStopResult>();

  return results;
}
