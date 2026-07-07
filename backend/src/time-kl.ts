/**
 * Kuala Lumpur is on Malaysia Time (MYT), UTC+8 year-round (no DST).
 * GTFS `departure_time` and service calendars in the Prasarana feeds are
 * authored in KL-local time, but Cloudflare Workers run in UTC with no `TZ`
 * env. Every place that derives seconds-since-midnight or day-of-week from a
 * `Date` must therefore shift into KL-local first. See issue #127.
 */

/** KL offset from UTC, in milliseconds (8 hours). */
export const KL_OFFSET_MS = 8 * 60 * 60 * 1000;

/**
 * Returns the KL-local equivalent of the given UTC instant as a `Date` whose
 * UTC fields hold the KL-local wall-clock value. Use `getUTCHours()` etc. on
 * the result (NOT `getHours()`, which would re-apply the runtime TZ).
 *
 * Mirrors the pattern already in `rail-schedule.ts` (lines 58-61).
 */
export function toKlLocal(date: Date): Date {
  return new Date(date.getTime() + KL_OFFSET_MS);
}

/**
 * Seconds since KL-local midnight for the given UTC instant.
 * Use this wherever GTFS HH:MM:SS departure times are compared.
 */
export function klSecondsSinceMidnight(date: Date): number {
  const kl = toKlLocal(date);
  return kl.getUTCHours() * 3600 + kl.getUTCMinutes() * 60 + kl.getUTCSeconds();
}

/**
 * Returns the JS day-of-week index (0=Sunday ... 6=Saturday) in KL-local time
 * for the given UTC instant. GTFS `calendar.txt` uses this index ordering.
 */
export function klDayOfWeek(date: Date): number {
  return toKlLocal(date).getUTCDay();
}

/**
 * Returns the KL-local calendar date as a `YYYYMMDD` string, matching the
 * `start_date`/`end_date` format used by GTFS `calendar.txt`.
 */
export function klDateYyyyMmDd(date: Date): string {
  const kl = toKlLocal(date);
  const y = kl.getUTCFullYear();
  const m = String(kl.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kl.getUTCDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

/**
 * Parses a GTFS time string (HH:MM:SS) into seconds since midnight.
 * Uses a fast zero-allocation index search for performance.
 * Note that GTFS times can exceed 24:00:00 for trips extending into the next day.
 */
export function parseGtfsTimeSeconds(time: string): number {
  const c1 = time.indexOf(':');
  const c2 = time.indexOf(':', c1 + 1);
  const h = parseInt(time.substring(0, c1), 10) || 0;
  const m = parseInt(time.substring(c1 + 1, c2 !== -1 ? c2 : undefined), 10) || 0;
  const s = c2 !== -1 ? parseInt(time.substring(c2 + 1), 10) || 0 : 0;

  return h * 3600 + m * 60 + s;
}
