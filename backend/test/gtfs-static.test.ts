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
});
