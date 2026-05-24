import { Env, VehiclePosition, PrasaranaBus } from './types';

export async function sampleBusPositions(env: Env, vehicles: VehiclePosition[], prasaranaBuses: PrasaranaBus[]) {
  const stmts = [];
  
  // Insert GTFS vehicles
  for (const v of vehicles) {
    if (!v.tripId || !v.routeId) continue;
    stmts.push(env.DB.prepare(
      `INSERT INTO bus_positions (bus_no, route, source, lat, lon, speed, timestamp) 
       VALUES (?, ?, ?, ?, ?, NULL, ?)
       ON CONFLICT DO NOTHING` // Assuming we don't have unique constraint, but we should prevent exact dupes in real logic
    ).bind(v.tripId, v.routeId, 'gtfs', v.lat, v.lon, v.timestamp));
  }
  
  // Insert Prasarana vehicles
  const now = Math.floor(Date.now() / 1000);
  for (const b of prasaranaBuses) {
    stmts.push(env.DB.prepare(
      `INSERT INTO bus_positions (bus_no, route, source, lat, lon, speed, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(b.bus_no, b.route, 'prasarana', b.latitude, b.longitude, b.speed, now));
  }
  
  if (stmts.length > 0) {
    await env.DB.batch(stmts);
  }
}

export async function aggregateTravelTimes(env: Env) {
  // Logic to group bus_positions by trip, detect stops, calculate travel time, upsert travel_times
}

export async function cleanupOldPositions(env: Env) {
  await env.DB.prepare(`DELETE FROM bus_positions WHERE timestamp < (unixepoch() - 7 * 24 * 60 * 60)`).run();
}
