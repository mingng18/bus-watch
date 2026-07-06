import { unzipSync } from 'fflate';
import { parseCsv } from './csv-parser';
import { Env } from './types';

const RAIL_GTFS_URL = 'https://api.data.gov.my/gtfs-static/prasarana?category=rapid-rail-kl';
const BATCH_SIZE = 100;

async function batch(db: D1Database, stmts: D1PreparedStatement[]): Promise<void> {
  // Use Promise.all with chunking to execute batches concurrently but limit concurrency
  // to avoid overloading the DB connections
  const CONCURRENCY_LIMIT = 5;
  const chunks: D1PreparedStatement[][] = [];

  for (let i = 0; i < stmts.length; i += BATCH_SIZE) {
    chunks.push(stmts.slice(i, i + BATCH_SIZE));
  }

  for (let i = 0; i < chunks.length; i += CONCURRENCY_LIMIT) {
    const concurrentBatches = chunks.slice(i, i + CONCURRENCY_LIMIT);
    await Promise.all(concurrentBatches.map(chunk => db.batch(chunk)));
  }
}


async function fetchAndParseGtfsData() {
  // 1. Download GTFS ZIP
  let files;
  try {
    const resp = await fetch(RAIL_GTFS_URL, { signal: AbortSignal.timeout(15000) });
    if (!resp.ok) throw new Error(`GTFS fetch failed: ${resp.status}`);
    const zipBuffer = await resp.arrayBuffer();
    files = unzipSync(new Uint8Array(zipBuffer));
  } catch (err: any) {
    throw new Error(`GTFS fetch failed: ${err.message || err}`);
  }

  const getFile = (name: string): string => {
    const key = Object.keys(files).find(k => k.endsWith(name));
    return key ? new TextDecoder().decode(files[key]) : '';
  };

  // 2. Parse CSVs (reuse existing csv-parser)
  const rawStops    = parseCsv(getFile('stops.txt'));
  const rawRoutes   = parseCsv(getFile('routes.txt'));
  const rawTrips    = parseCsv(getFile('trips.txt'));
  const rawStopTimes = parseCsv(getFile('stop_times.txt'));

  return { rawStops, rawRoutes, rawTrips, rawStopTimes };
}

async function mapAndInsertGtfsData(
  env: Env,
  rawStops: Record<string, string>[],
  rawRoutes: Record<string, string>[],
  rawTrips: Record<string, string>[],
  rawStopTimes: Record<string, string>[]
): Promise<number> {
  let inserted = 0;

  // 3. Filter: only keep rail route types (0=tram, 1=subway, 2=rail)
  const railRouteIds = new Set(
    rawRoutes
      .filter(r => ['0', '1', '2'].includes(r.route_type))
      .map(r => r.route_id)
  );
  const railTripIds = new Set(
    rawTrips
      .filter(t => railRouteIds.has(t.route_id))
      .map(t => t.trip_id)
  );
  const railStopIds = new Set(
    rawStopTimes
      .filter(st => railTripIds.has(st.trip_id))
      .map(st => st.stop_id)
  );

  // 4. Upsert rail_stops
  const stopStmts = rawStops
    .filter(s => railStopIds.has(s.stop_id))
    .map(s =>
      env.DB.prepare(
        `INSERT INTO rail_stops (stop_id, stop_name, lat, lon)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(stop_id) DO UPDATE SET stop_name=excluded.stop_name, lat=excluded.lat, lon=excluded.lon`
      ).bind(s.stop_id, s.stop_name, parseFloat(s.stop_lat), parseFloat(s.stop_lon))
    );
  await batch(env.DB, stopStmts);
  inserted += stopStmts.length;

  // 5. Upsert rail_routes
  const routeStmts = rawRoutes
    .filter(r => railRouteIds.has(r.route_id))
    .map(r =>
      env.DB.prepare(
        `INSERT INTO rail_routes (route_id, route_short_name, route_long_name)
         VALUES (?, ?, ?)
         ON CONFLICT(route_id) DO UPDATE SET route_short_name=excluded.route_short_name, route_long_name=excluded.route_long_name`
      ).bind(r.route_id, r.route_short_name || '', r.route_long_name || '')
    );
  await batch(env.DB, routeStmts);
  inserted += routeStmts.length;

  // 6. Upsert rail_trips
  const tripStmts = rawTrips
    .filter(t => railTripIds.has(t.trip_id))
    .map(t =>
      env.DB.prepare(
        `INSERT INTO rail_trips (trip_id, route_id, service_id, headsign, direction)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(trip_id) DO UPDATE SET route_id=excluded.route_id, service_id=excluded.service_id, headsign=excluded.headsign, direction=excluded.direction`
      ).bind(t.trip_id, t.route_id, t.service_id, t.trip_headsign || '', parseInt(t.direction_id || '0') || 0)
    );
  await batch(env.DB, tripStmts);
  inserted += tripStmts.length;

  // 7. Upsert rail_stop_times
  const stStmts = rawStopTimes
    .filter(st => railTripIds.has(st.trip_id))
    .map(st =>
      env.DB.prepare(
        `INSERT INTO rail_stop_times (trip_id, stop_id, stop_seq, arrival_time, departure_time)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(trip_id, stop_seq) DO UPDATE SET stop_id=excluded.stop_id, arrival_time=excluded.arrival_time, departure_time=excluded.departure_time`
      ).bind(st.trip_id, st.stop_id, parseInt(st.stop_sequence), st.arrival_time, st.departure_time || st.arrival_time)
    );
  await batch(env.DB, stStmts);
  inserted += stStmts.length;

  return inserted;
}



export async function ingestRailTimetables(env: Env): Promise<{ inserted: number; error?: string }> {
  // Let exceptions from fetchAndParseGtfsData bubble up, which is what the tests expect
  const { rawStops, rawRoutes, rawTrips, rawStopTimes } = await fetchAndParseGtfsData();
  const inserted = await mapAndInsertGtfsData(env, rawStops, rawRoutes, rawTrips, rawStopTimes);

  // 8. Update ingest metadata
  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO rail_ingest_meta (key, value)
     VALUES ('last_ingested_at', ?)
     ON CONFLICT(key) DO UPDATE SET value=excluded.value`
  ).bind(now).run();

  return { inserted };
}
