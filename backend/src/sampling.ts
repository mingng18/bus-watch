import { Env, VehiclePosition, PrasaranaBus } from './types';
import { haversineDistance } from './haversine';

interface LastPosition {
  bus_no: string;
  lat: number;
  lon: number;
  ts: number;
}

export async function sampleBusPositions(env: Env, vehicles: VehiclePosition[], prasaranaBuses: PrasaranaBus[]) {
  const stmts = [];
  const now = Math.floor(Date.now() / 1000);

  // Deterministic "last position per bus_no". The previous form
  // `GROUP BY bus_no HAVING timestamp = MAX(timestamp)` is non-standard SQL:
  // the SELECT lists non-aggregated lat/lon/ts while grouping only by bus_no,
  // so SQLite returns an indeterminate row from each group. With two sources
  // (gtfs + prasarana) sharing a bus_no, that nondeterminism could sample a
  // stale position. Use a window function to deterministically pick the row
  // with the greatest timestamp per bus_no (ties broken by rowid desc, the
  // insertion order, so the most recently inserted wins).
  // See issue #132.
  const { results } = await env.DB.prepare(
    `SELECT bus_no, lat, lon, ts FROM (
       SELECT bus_no, lat, lon, timestamp as ts, rowid,
         ROW_NUMBER() OVER (PARTITION BY bus_no ORDER BY timestamp DESC, rowid DESC) AS rn
       FROM bus_positions
       WHERE timestamp > (unixepoch() - 600)
     ) WHERE rn = 1`
  ).all<LastPosition>();

  const lastPositions = new Map<string, LastPosition>();
  if (results) {
    for (const r of results) {
      lastPositions.set(r.bus_no, r);
    }
  }
  
  // Insert GTFS vehicles
  for (const v of vehicles) {
    if (!v.tripId || !v.routeId) continue;
    
    const last = lastPositions.get(v.tripId);
    const moved = last ? haversineDistance(last.lat, last.lon, v.lat, v.lon) > 100 : true;
    const timedOut = last ? (now - last.ts) >= 300 : true;
    
    if (moved || timedOut) {
      stmts.push(env.DB.prepare(
        `INSERT INTO bus_positions (bus_no, route, source, lat, lon, speed, timestamp) 
         VALUES (?, ?, ?, ?, ?, NULL, ?)`
      ).bind(v.tripId, v.routeId, 'gtfs', v.lat, v.lon, v.timestamp));
    }
  }
  
  // Insert Prasarana vehicles
  for (const b of prasaranaBuses) {
    const last = lastPositions.get(b.bus_no);
    
    let ts = now;
    if (b.dt_gps) {
      const parsed = Math.floor(new Date(b.dt_gps).getTime() / 1000);
      if (!isNaN(parsed)) ts = parsed;
    }
    
    const moved = last ? haversineDistance(last.lat, last.lon, b.latitude, b.longitude) > 100 : true;
    const timedOut = last ? (ts - last.ts) >= 300 : true;
    
    if (moved || timedOut) {
      stmts.push(env.DB.prepare(
        `INSERT INTO bus_positions (bus_no, route, source, lat, lon, speed, timestamp)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(b.bus_no, b.route, 'prasarana', b.latitude, b.longitude, b.speed, ts));
    }
  }
  
  // Batch insert in chunks of 100 to avoid D1 limits
  for (let i = 0; i < stmts.length; i += 100) {
    await env.DB.batch(stmts.slice(i, i + 100));
  }
}

export async function aggregateTravelTimes(env: Env) {
  // Logic to group bus_positions by trip, detect stops, calculate travel time, upsert travel_times
}

export async function cleanupOldPositions(env: Env) {
  await env.DB.prepare(`DELETE FROM bus_positions WHERE timestamp < (unixepoch() - 7 * 24 * 60 * 60)`).run();
}
