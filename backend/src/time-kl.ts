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
 * ⚡ Bolt Performance Optimization:
 * Fast math-based day-of-week calculation from unix timestamp.
 * Avoids slow `new Date()` allocations in hot paths.
 */
export function klDayOfWeekFromUnix(timestampSecs: number): number {
  // Epoch starts on a Thursday (day 4)
  // KL offset is +8 hours (28800 seconds)
  return Math.floor((timestampSecs + 28800) / 86400 + 4) % 7;
}

/**
 * ⚡ Bolt Performance Optimization:
 * Fast math-based hour-of-day calculation from unix timestamp.
 * Avoids slow `new Date()` allocations in hot paths.
 */
export function klHourOfDayFromUnix(timestampSecs: number): number {
  // KL offset is +8 hours (28800 seconds)
  return Math.floor(((timestampSecs + 28800) % 86400) / 3600);
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
/**
 * ⚡ Bolt Performance Optimization:
 * Shared utility for fast, zero-allocation parsing of GTFS HH:MM:SS strings.
 * Manual charCode loop avoids substring/split allocations and parseInt overhead.
 */
export function parseGtfsTimeParts(t: string): [number, number, number] {
  let h = 0, m = 0, s = 0;
  let i = 0;
  const len = t.length;

  while (i < len && t.charCodeAt(i) !== 58) { // ':' is 58
    const code = t.charCodeAt(i);
    if (code >= 48 && code <= 57) {
      h = h * 10 + (code - 48);
    }
    i++;
  }
  i++;

  while (i < len && t.charCodeAt(i) !== 58) {
    const code = t.charCodeAt(i);
    if (code >= 48 && code <= 57) {
      m = m * 10 + (code - 48);
    }
    i++;
  }
  i++;

  while (i < len) {
    const code = t.charCodeAt(i);
    if (code >= 48 && code <= 57) {
      s = s * 10 + (code - 48);
    }
    i++;
  }

  return [h, m, s];
}

export function parseGtfsTimeSeconds(time: string): number {
  const [h, m, s] = parseGtfsTimeParts(time);
  return h * 3600 + m * 60 + s;
}
