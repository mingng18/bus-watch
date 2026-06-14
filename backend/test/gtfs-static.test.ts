import { describe, it, expect } from "vitest";
import { getActiveServiceIds } from "../src/gtfs-static";
import { CalendarEntry } from "../src/types";

describe("getActiveServiceIds", () => {
  const baseCalendarEntry: CalendarEntry = {
    serviceId: "service_1",
    days: [false, true, true, true, true, true, false], // Mon-Fri active, Sun=0, Sat=6
    startDate: "20231001",
    endDate: "20231031",
  };

  it("returns active service ID when date is within range and day is active", () => {
    // 2023-10-04 is a Wednesday
    const date = new Date("2023-10-04T12:00:00Z");
    const result = getActiveServiceIds([baseCalendarEntry], date);

    expect(result.size).toBe(1);
    expect(result.has("service_1")).toBe(true);
  });

  it("does not return service ID when date is before start date", () => {
    // 2023-09-27 is a Wednesday, but before startDate '20231001'
    const date = new Date("2023-09-27T12:00:00Z");
    const result = getActiveServiceIds([baseCalendarEntry], date);

    expect(result.size).toBe(0);
  });

  it("does not return service ID when date is after end date", () => {
    // 2023-11-01 is a Wednesday, but after endDate '20231031'
    const date = new Date("2023-11-01T12:00:00Z");
    const result = getActiveServiceIds([baseCalendarEntry], date);

    expect(result.size).toBe(0);
  });

  it("does not return service ID when date falls on an inactive day", () => {
    // 2023-10-08 is a Sunday
    const date = new Date("2023-10-08T12:00:00Z");
    const result = getActiveServiceIds([baseCalendarEntry], date);

    expect(result.size).toBe(0);
  });

  it("handles multiple calendar entries correctly", () => {
    const calendar: CalendarEntry[] = [
      baseCalendarEntry, // Active Mon-Fri, 20231001-20231031
      {
        serviceId: "service_weekend",
        days: [true, false, false, false, false, false, true], // Sat-Sun active
        startDate: "20231001",
        endDate: "20231031",
      },
      {
        serviceId: "service_future",
        days: [true, true, true, true, true, true, true],
        startDate: "20231101",
        endDate: "20231130",
      },
    ];

    // 2023-10-07 is a Saturday
    const date1 = new Date("2023-10-07T12:00:00Z");
    const result1 = getActiveServiceIds(calendar, date1);
    expect(result1.size).toBe(1);
    expect(result1.has("service_weekend")).toBe(true);

    // 2023-10-04 is a Wednesday
    const date2 = new Date("2023-10-04T12:00:00Z");
    const result2 = getActiveServiceIds(calendar, date2);
    expect(result2.size).toBe(1);
    expect(result2.has("service_1")).toBe(true);

    // 2023-11-05 is a Sunday
    const date3 = new Date("2023-11-05T12:00:00Z");
    const result3 = getActiveServiceIds(calendar, date3);
    expect(result3.size).toBe(1);
    expect(result3.has("service_future")).toBe(true);
  });

  it("returns an empty set when calendar is empty", () => {
    const date = new Date("2023-10-04T12:00:00Z");
    const result = getActiveServiceIds([], date);

    expect(result.size).toBe(0);
  });

  describe("KL timezone boundary (issue #127)", () => {
    // The ~8h skew window is 16:00-24:00 UTC: UTC wall-clock says "today" but
    // KL-local (UTC+8) has already rolled into "tomorrow". GTFS calendars are
    // authored in KL-local, so service selection must follow KL-local too.

    // days index: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    const mondayOnly: CalendarEntry = {
      serviceId: "monday",
      days: [false, true, false, false, false, false, false], // Mon active
      startDate: "20231001",
      endDate: "20231031",
    };
    const tuesdayOnly: CalendarEntry = {
      serviceId: "tuesday",
      days: [false, false, true, false, false, false, false], // Tue active
      startDate: "20231001",
      endDate: "20231031",
    };
    const calendar = [mondayOnly, tuesdayOnly];

    it("selects KL-local day-of-week across the 16:00-24:00 UTC boundary", () => {
      // 2023-10-16T17:00:00Z: UTC Monday 17:00 -> KL Tuesday 01:00.
      // Before the fix, getActiveServiceIds used UTC day (Monday) and wrongly
      // returned the monday service; KL-local must return the tuesday service.
      const date = new Date("2023-10-16T17:00:00Z");
      const result = getActiveServiceIds(calendar, date);

      expect(result.size).toBe(1);
      expect(result.has("tuesday")).toBe(true);
      expect(result.has("monday")).toBe(false);
    });

    it("selects KL-local calendar date across the UTC midnight boundary", () => {
      // A service whose KL-local date window starts on 2023-10-17. At
      // 2023-10-16T16:30:00Z the UTC date is still the 16th, but KL-local has
      // crossed into the 17th (00:30) — the service must now be in range.
      const dateBounded: CalendarEntry = {
        serviceId: "starts_17th",
        days: [true, true, true, true, true, true, true],
        startDate: "20231017",
        endDate: "20231031",
      };
      const date = new Date("2023-10-16T16:30:00Z"); // KL: 2023-10-17 00:30
      const result = getActiveServiceIds([dateBounded], date);

      expect(result.size).toBe(1);
      expect(result.has("starts_17th")).toBe(true);
    });
  });
});
