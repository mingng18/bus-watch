import { describe, expect, it } from 'vitest';
import {
  KL_OFFSET_MS,
  toKlLocal,
  klSecondsSinceMidnight,
  klDayOfWeek,
  klDateYyyyMmDd,
  parseGtfsTimeParts,
  parseGtfsTimeSeconds,
} from '../src/time-kl';

describe('time-kl utilities', () => {
  describe('toKlLocal', () => {
    it('shifts UTC time to KL local time (+8 hours)', () => {
      // Midnight in UTC = 08:00 in KL
      const utcDate = new Date('2023-01-01T00:00:00.000Z');
      const klDate = toKlLocal(utcDate);

      expect(klDate.getTime()).toBe(utcDate.getTime() + KL_OFFSET_MS);
      expect(klDate.getUTCHours()).toBe(8);
      expect(klDate.getUTCDate()).toBe(1);
    });

    it('handles day boundary crossings correctly', () => {
      // 18:00 UTC = 02:00 next day in KL
      const utcDate = new Date('2023-01-01T18:00:00.000Z');
      const klDate = toKlLocal(utcDate);

      expect(klDate.getUTCHours()).toBe(2);
      expect(klDate.getUTCDate()).toBe(2);
      expect(klDate.getUTCMonth()).toBe(0); // January
    });

    it('handles year boundary crossings correctly', () => {
      // Dec 31 18:00 UTC = Jan 1 02:00 next year in KL
      const utcDate = new Date('2022-12-31T18:00:00.000Z');
      const klDate = toKlLocal(utcDate);

      expect(klDate.getUTCHours()).toBe(2);
      expect(klDate.getUTCDate()).toBe(1);
      expect(klDate.getUTCMonth()).toBe(0); // January
      expect(klDate.getUTCFullYear()).toBe(2023);
    });
  });

  describe('klSecondsSinceMidnight', () => {
    it('calculates seconds since midnight in KL local time', () => {
      // 00:00 UTC = 08:00 KL
      const utcDate = new Date('2023-01-01T00:00:00.000Z');
      const seconds = klSecondsSinceMidnight(utcDate);

      // 8 hours * 3600 seconds/hour
      expect(seconds).toBe(8 * 3600);
    });

    it('calculates seconds correctly crossing day boundaries', () => {
      // 18:00 UTC = 02:00 KL (next day)
      const utcDate = new Date('2023-01-01T18:00:00.000Z');
      const seconds = klSecondsSinceMidnight(utcDate);

      // 2 hours * 3600 seconds/hour
      expect(seconds).toBe(2 * 3600);
    });

    it('includes minutes and seconds correctly', () => {
      // 01:23:45 UTC = 09:23:45 KL
      const utcDate = new Date('2023-01-01T01:23:45.000Z');
      const seconds = klSecondsSinceMidnight(utcDate);

      expect(seconds).toBe(9 * 3600 + 23 * 60 + 45);
    });
  });

  describe('klDayOfWeek', () => {
    it('returns the correct day of week for KL local time', () => {
      // Jan 1, 2023 was a Sunday
      // 00:00 UTC = 08:00 KL (Sunday)
      const utcDate1 = new Date('2023-01-01T00:00:00.000Z');
      expect(klDayOfWeek(utcDate1)).toBe(0); // Sunday

      // 18:00 UTC = 02:00 KL (Monday, next day)
      const utcDate2 = new Date('2023-01-01T18:00:00.000Z');
      expect(klDayOfWeek(utcDate2)).toBe(1); // Monday
    });
  });

  describe('klDateYyyyMmDd', () => {
    it('formats the KL local date as YYYYMMDD string', () => {
      // 00:00 UTC Jan 1 = 08:00 KL Jan 1
      const utcDate1 = new Date('2023-01-01T00:00:00.000Z');
      expect(klDateYyyyMmDd(utcDate1)).toBe('20230101');

      // 18:00 UTC Jan 1 = 02:00 KL Jan 2
      const utcDate2 = new Date('2023-01-01T18:00:00.000Z');
      expect(klDateYyyyMmDd(utcDate2)).toBe('20230102');

      // 18:00 UTC Dec 31, 2022 = 02:00 KL Jan 1, 2023
      const utcDate3 = new Date('2022-12-31T18:00:00.000Z');
      expect(klDateYyyyMmDd(utcDate3)).toBe('20230101');
    });

    it('pads single-digit months and days with leading zeros', () => {
      // May 5th -> 0505
      const utcDate = new Date('2023-05-05T00:00:00.000Z');
      expect(klDateYyyyMmDd(utcDate)).toBe('20230505');
    });
  });


  describe('parseGtfsTimeParts', () => {
    it('parses typical HH:MM:SS format correctly', () => {
      expect(parseGtfsTimeParts('08:15:30')).toEqual([8, 15, 30]);
      expect(parseGtfsTimeParts('14:00:00')).toEqual([14, 0, 0]);
      expect(parseGtfsTimeParts('00:00:00')).toEqual([0, 0, 0]);
    });

    it('handles GTFS times crossing midnight (e.g., > 24 hours)', () => {
      expect(parseGtfsTimeParts('25:30:15')).toEqual([25, 30, 15]);
      expect(parseGtfsTimeParts('28:00:00')).toEqual([28, 0, 0]);
    });

    it('handles missing seconds or non-standard formats gracefully', () => {
      expect(parseGtfsTimeParts('10:15')).toEqual([10, 15, 0]);
      expect(parseGtfsTimeParts('2:5')).toEqual([2, 5, 0]);
    });
  });

  describe('parseGtfsTimeSeconds', () => {
    it('parses typical HH:MM:SS format correctly', () => {
      expect(parseGtfsTimeSeconds('08:15:30')).toBe(8 * 3600 + 15 * 60 + 30);
      expect(parseGtfsTimeSeconds('14:00:00')).toBe(14 * 3600);
      expect(parseGtfsTimeSeconds('00:00:00')).toBe(0);
    });

    it('handles GTFS times crossing midnight (e.g., > 24 hours)', () => {
      expect(parseGtfsTimeSeconds('25:30:15')).toBe(25 * 3600 + 30 * 60 + 15);
      expect(parseGtfsTimeSeconds('28:00:00')).toBe(28 * 3600);
    });

    it('handles missing seconds or non-standard formats gracefully', () => {
      expect(parseGtfsTimeSeconds('10:15')).toBe(10 * 3600 + 15 * 60);
      expect(parseGtfsTimeSeconds('2:5')).toBe(2 * 3600 + 5 * 60); // Assuming it interprets as H:M
    });
  });
});
