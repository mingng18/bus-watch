import { Env, VehiclePosition, PrasaranaBus, TripStopEntry } from './types';
import { haversineDistance } from './haversine';
import { klDayOfWeek } from './time-kl';

interface LastPosition {
  bus_no: string;
  lat: number;
  lon: number;
  ts: number;
}

/**
 * A raw GPS sample of a single bus, in time order. Mirrors the bus_positions
 * columns aggregateTravelTimes reads from D1.
 */
export interface PositionSample {
  bus_no: string;
  route: string;
  lat: number;
  lon: number;
  /** Unix seconds. */
  timestamp: number;
}

/**
 * One measured inter-stop travel time, before aggregation. Produced by
 * detectStopPassages from a time-ordered bus trace + an ordered stop list.
 */
export interface TravelTimeSample {
  route: string;
  from_stop_id: string;
  to_stop_id: string;
  from_lat: number;
  from_lon: number;
  to_lat: number;
  to_lon: number;
  /** Elapsed seconds between the two stop passages. */
  seconds: number;
  /** JS day index (0=Sun..6=Sat) in KL-local time of the from-stop passage. */
  day_of_week: number;
  /** KL-local hour (0..23) of the from-stop passage. */
  time_bucket: number;
}

/**
 * An aggregated travel_times row keyed by (route, from, to, day, hour), with a
 * spread measure for ETA confidence.
 */
export interface AggregatedTravelTime {
  route: string;
  from_stop_id: string;
  to_stop_id: string;
  from_lat: number;
  from_lon: number;
  to_lat: number;
  to_lon: number;
  avg_seconds: number;
  sample_count: number;
  day_of_week: number;
  time_bucket: number;
  /** Mean absolute deviation of the samples, in seconds. */
  spread_seconds: number;
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

/**
 * Radius (metres) within which a GPS sample counts as the bus being "at" a
 * stop. 80m is generous enough to absorb GPS jitter and the stop being on the
 * far side of a wide road, but tight enough that a bus passing on a parallel
 * street ~150m away won't false-trigger. KL bus stops are typically ~200-400m
 * apart, so consecutive stops rarely fall inside the same 80m disc.
 */
const STOP_PASSAGE_RADIUS_M = 80;

/**
 * Hard cap on a single inter-stop travel time, in seconds. A bus dwelling at a
 * stop, a data gap, or a bus going out of service can produce absurdly long
 * gaps (hours) that would poison the average. 30 min is well beyond any real
 * inter-stop travel time in KL urban service and is dropped as noise.
 */
const MAX_INTER_STOP_SECONDS = 30 * 60;

/**
 * Detect stop passages along a single bus's time-ordered trace, given the
 * ordered stop list for the route/direction the bus is serving.
 *
 * Algorithm: walk the trace in time order, advancing a pointer into the stop
 * sequence. When a sample falls within STOP_PASSAGE_RADIUS_M of the
 * *next expected* stop, record the timestamp as that stop's passage and advance
 * the pointer. A sample can only match the next stop (not any later one), so
 * the bus must pass stops in the stored order — this is what makes a single
 * stray GPS blip near a far-ahead stop unable to skip the sequence. When two
 * consecutive stops have both been passed, the elapsed time between their
 * passages becomes one TravelTimeSample.
 *
 * A skipped stop (the bus never gets within radius of stop N) is handled
 * gracefully: the pointer stays on stop N, so stop N+1 can't match either —
 * the sequence simply produces no sample for that leg and resumes if a later
 * position circles back within radius of N. This matches the audit's "skip a
 * stop" requirement: the leg is dropped, not fabricated.
 *
 * GPS outliers: an isolated sample far from any plausible trajectory (e.g. a
 * teleport) can still only match the *next* stop, and since it won't be within
 * radius of it, it's ignored. A second outlier that happens to land within
 * radius of the next stop produces one bogus passage timestamp, but the
 * resulting inter-stop sample is still bounded by MAX_INTER_STOP_SECONDS and
 * further damped by averaging across many real passages + MAD-based spread.
 */
export function detectStopPassages(
  samples: PositionSample[],
  stops: TripStopEntry[],
  route: string,
): TravelTimeSample[] {
  const results: TravelTimeSample[] = [];
  if (samples.length === 0 || stops.length < 2) return results;

  // Sort defensively; callers should already supply time order, but a single
  // out-of-order sample would corrupt elapsed-time math.
  const ordered = [...samples].sort((a, b) => a.timestamp - b.timestamp);

  let stopIdx = 0;
  let lastPassageTs: number | null = null; // timestamp the previous stop was hit
  let lastPassageStop: TripStopEntry | null = null;

  for (const s of ordered) {
    // Only test against the next expected stop. This enforces in-order
    // passage and makes a far-ahead outlier unable to skip stops.
    const target = stops[stopIdx];
    const d = haversineDistance(s.lat, s.lon, target.lat, target.lon);
    if (d > STOP_PASSAGE_RADIUS_M) continue;

    // `s` is a passage of `target`.
    if (lastPassageTs !== null && lastPassageStop !== null) {
      const seconds = s.timestamp - lastPassageTs;
      if (seconds > 0 && seconds <= MAX_INTER_STOP_SECONDS) {
        results.push({
          route,
          from_stop_id: lastPassageStop.stopId,
          to_stop_id: target.stopId,
          from_lat: lastPassageStop.lat,
          from_lon: lastPassageStop.lon,
          to_lat: target.lat,
          to_lon: target.lon,
          seconds,
          day_of_week: klDayOfWeek(new Date(lastPassageTs * 1000)),
          time_bucket: klHourOfDay(new Date(lastPassageTs * 1000)),
        });
      }
      // A seconds gap outside [0, MAX] is treated as noise / out-of-service:
      // we still advance past `target` (the bus clearly reached it) but emit
      // no sample for the leg, so one bad gap doesn't block later real legs.
    }

    lastPassageTs = s.timestamp;
    lastPassageStop = target;
    stopIdx++;
    if (stopIdx >= stops.length) break; // reached the terminus
  }

  return results;
}

/** KL-local hour (0..23). Local equivalent of klDayOfWeek in time-kl.ts. */
function klHourOfDay(date: Date): number {
  // toKlLocal shifts so UTC fields hold KL wall-clock; read UTC hours.
  const klOffsetMs = 8 * 60 * 60 * 1000;
  return new Date(date.getTime() + klOffsetMs).getUTCHours();
}

/**
 * Aggregate raw per-leg samples into one row per
 * (route, from, to, day_of_week, time_bucket), computing the mean and a robust
 * spread (mean absolute deviation). MAD is used instead of variance because
 * it's in the same units as the mean (seconds), so it maps directly onto the
 * ETA uncertainty window, and it's less skewed by the occasional dwell/gap
 * that survives the per-leg cap.
 *
 * GPS-noise handling at this layer: before averaging, samples for a given key
 * more than 3 * (median absolute deviation) from the key's median are dropped
 * as outliers. This catches the "one teleport produced a 25-minute leg among
 * 8-minute legs" case that survived MAX_INTER_STOP_SECONDS.
 */
export function aggregateSamples(
  samples: TravelTimeSample[],
): AggregatedTravelTime[] {
  // Group by the full bucket key.
  const groups = new Map<string, TravelTimeSample[]>();
  for (const s of samples) {
    const key = `${s.route}|${s.from_stop_id}|${s.to_stop_id}|${s.day_of_week}|${s.time_bucket}`;
    let arr = groups.get(key);
    if (!arr) groups.set(key, arr = []);
    arr.push(s);
  }

  const out: AggregatedTravelTime[] = [];
  for (const arr of groups.values()) {
    // Per-key MAD outlier rejection.
    const cleaned = rejectOutliers(arr.map(s => s.seconds));
    if (cleaned.length === 0) continue;
    const avg = cleaned.reduce((a, b) => a + b, 0) / cleaned.length;
    const mad = cleaned.reduce((a, b) => a + Math.abs(b - avg), 0) / cleaned.length;
    const first = arr[0];
    out.push({
      route: first.route,
      from_stop_id: first.from_stop_id,
      to_stop_id: first.to_stop_id,
      from_lat: first.from_lat,
      from_lon: first.from_lon,
      to_lat: first.to_lat,
      to_lon: first.to_lon,
      avg_seconds: Math.round(avg),
      sample_count: cleaned.length,
      day_of_week: first.day_of_week,
      time_bucket: first.time_bucket,
      spread_seconds: Math.round(mad),
    });
  }
  return out;
}

/**
 * Drop values more than `threshold * MAD` from the median. Falls back to the
 * raw array when there's too little data (≤3 samples) or when MAD is 0 (all
 * identical), so a clean low-volume leg isn't discarded just for being small.
 */
function rejectOutliers(values: number[], threshold = 3): number[] {
  if (values.length <= 3) return values;
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const devs = values.map(v => Math.abs(v - median));
  const mad = devs.reduce((a, b) => a + b, 0) / devs.length;
  if (mad === 0) return values; // all values identical or near-median
  return values.filter((_, i) => devs[i] <= threshold * mad);
}

/**
 * Build a representative ordered stop list per route, from the KV trip_stops
 * map (keyed by trip_id). A route has many trips; we pick the trip with the
 * most stops as the canonical sequence. All trips on a route+direction share
 * the same stop ordering in GTFS, so this captures the sequence buses are
 * expected to pass. The result is keyed by route_id.
 */
export function canonicalStopSequencesByRoute(
  trips: { id: string; routeId: string }[],
  tripStops: Record<string, TripStopEntry[]>,
): Map<string, TripStopEntry[]> {
  const bestByRoute = new Map<string, { stops: TripStopEntry[]; len: number }>();
  for (const t of trips) {
    const stops = tripStops[t.id];
    if (!stops || stops.length === 0) continue;
    const cur = bestByRoute.get(t.routeId);
    if (!cur || stops.length > cur.len) {
      bestByRoute.set(t.routeId, { stops, len: stops.length });
    }
  }
  const out = new Map<string, TripStopEntry[]>();
  for (const [routeId, { stops }] of bestByRoute) out.set(routeId, stops);
  return out;
}

/**
 * Read recent sampled positions from D1, detect stop passages per route+bus,
 * aggregate into travel-time buckets, and upsert into travel_times.
 *
 * `stopSequencesByRoute` is the canonical ordered stop list per route_id
 * (build it from KV trip_stops with canonicalStopSequencesByRoute before
 * calling). Passing it in keeps this function — and its pure helpers — free
 * of KV/index.ts coupling, which is what makes the algorithm unit-testable
 * against fixtures without a live DB.
 *
 * Defensive by design (issue #133): every stage is wrapped so one bad route
 * or one malformed row can't crash the cron. The cron itself wraps this call
 * in try/catch too.
 */
export async function aggregateTravelTimes(
  env: Env,
  stopSequencesByRoute: Map<string, TripStopEntry[]>,
) {
  // Pull positions from the last 6h. The sampling cron runs every 5 min, so a
  // 6h window lets a single run catch a full commute peak's worth of passages
  // even after a couple of skipped runs, while bounding the query cost.
  const since = Math.floor(Date.now() / 1000) - 6 * 60 * 60;
  let rows: PositionSample[] = [];
  try {
    const { results } = await env.DB.prepare(
      `SELECT bus_no, route, lat, lon, timestamp
       FROM bus_positions
       WHERE timestamp > ?
       ORDER BY route, bus_no, timestamp`,
    ).bind(since).all<PositionSample>();
    rows = (results || []).filter(r =>
      Number.isFinite(r.lat) && Number.isFinite(r.lon) && Number.isFinite(r.timestamp),
    );
  } catch (err) {
    console.error('aggregateTravelTimes: failed to read bus_positions:', err);
    return;
  }
  if (rows.length === 0) return;

  // Group positions by (route, bus_no) so each trace is one bus's path.
  const traces = new Map<string, PositionSample[]>();
  for (const r of rows) {
    const key = `${r.route}|${r.bus_no}`;
    let arr = traces.get(key);
    if (!arr) traces.set(key, arr = []);
    arr.push(r);
  }

  const allSamples: TravelTimeSample[] = [];
  for (const [route, samples] of traces) {
    const stops = stopSequencesByRoute.get(route);
    if (!stops) continue; // route unknown to GTFS static — nothing to key off
    try {
      const legs = detectStopPassages(samples, stops, route);
      allSamples.push(...legs);
    } catch (err) {
      // One bad trace must not poison the rest.
      console.error(`aggregateTravelTimes: detectStopPassages failed for route ${route}:`, err);
    }
  }
  if (allSamples.length === 0) return;

  const aggregated = aggregateSamples(allSamples);
  if (aggregated.length === 0) return;

  // Upsert. ON CONFLICT key is (route, from_stop_id, to_stop_id, day_of_week,
  // time_bucket) per migration 0004. We recompute the running average from the
  // stored row + new samples so an old bucket accrues evidence over time rather
  // than being overwritten by the latest 6h window. A single D1 batch keeps
  // this atomic and bounded.
  const now = Math.floor(Date.now() / 1000);
  const upsertStmts = aggregated.map(a =>
    env.DB.prepare(
      `INSERT INTO travel_times
         (route, from_stop_id, to_stop_id, from_lat, from_lon, to_lat, to_lon,
          avg_seconds, sample_count, updated_at, day_of_week, time_bucket, spread_seconds)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(route, from_stop_id, to_stop_id, day_of_week, time_bucket) DO UPDATE SET
         avg_seconds = ROUND((excluded.avg_seconds * excluded.sample_count
                              + travel_times.avg_seconds * travel_times.sample_count)
                             / (excluded.sample_count + travel_times.sample_count)),
         spread_seconds = ROUND((excluded.spread_seconds * excluded.sample_count
                                 + travel_times.spread_seconds * travel_times.sample_count)
                                / (excluded.sample_count + travel_times.sample_count)),
         sample_count = travel_times.sample_count + excluded.sample_count,
         updated_at = excluded.updated_at`,
    ).bind(
      a.route, a.from_stop_id, a.to_stop_id, a.from_lat, a.from_lon, a.to_lat, a.to_lon,
      a.avg_seconds, a.sample_count, now, a.day_of_week, a.time_bucket, a.spread_seconds,
    ),
  );

  // Chunk to stay under D1's per-batch limit.
  for (let i = 0; i < upsertStmts.length; i += 100) {
    try {
      await env.DB.batch(upsertStmts.slice(i, i + 100));
    } catch (err) {
      console.error('aggregateTravelTimes: upsert batch failed:', err);
    }
  }
}


export async function cleanupOldPositions(env: Env) {
  await env.DB.prepare(`DELETE FROM bus_positions WHERE timestamp < (unixepoch() - 7 * 24 * 60 * 60)`).run();
}
