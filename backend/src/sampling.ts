import { Env, VehiclePosition, PrasaranaBus } from './types';

export async function sampleBusPositions(env: Env, vehicles: VehiclePosition[], prasaranaBuses: PrasaranaBus[]) {
  // Logic to insert new bus_positions if moved >100m or no sample in 5 min
}

export async function aggregateTravelTimes(env: Env) {
  // Logic to group bus_positions by trip, detect stops, calculate travel time, upsert travel_times
}

export async function cleanupOldPositions(env: Env) {
  await env.DB.prepare(`DELETE FROM bus_positions WHERE timestamp < (unixepoch() - 7 * 24 * 60 * 60)`).run();
}
