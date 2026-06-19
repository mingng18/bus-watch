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
  const m = String(kl.getUTCMonth() + 1).padStart(2, "0");
  const d = String(kl.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

/**
 * KL-local hour (0..23) for "now". Mirrors the bucketing key written by
 * aggregateTravelTimes so a lookup at 09:30 MYT hits the 09 bucket.
 */
export function klHour(date: Date): number {
  return toKlLocal(date).getUTCHours();
}
