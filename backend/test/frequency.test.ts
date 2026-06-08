import { describe, it, expect } from "vitest";
import { expandTripsForStop } from "../src/frequency";

describe("expandTripsForStop", () => {
  it("returns an empty array as the stub implementation", () => {
    const result = expandTripsForStop(
      "stop1",
      [],
      {},
      [],
      [],
      [],
      new Date(),
      120,
    );
    expect(result).toEqual([]);
  });

  it("safely handles empty array and object inputs", () => {
    const result = expandTripsForStop("", [], {}, [], [], [], new Date(), 0);
    expect(result).toEqual([]);
  });

  it("safely accepts typical mock data without error", () => {
    const mockTrips = [
      {
        id: "t1",
        routeId: "r1",
        serviceId: "s1",
        headsign: "HS",
        directionId: 0,
        shapeId: "sh1",
      },
    ];
    const mockTripStops = {
      t1: [
        {
          stopId: "stop1",
          stopName: "Stop 1",
          lat: 0,
          lon: 0,
          arrivalTime: "08:00:00",
          departureTime: "08:00:00",
          sequence: 1,
        },
      ],
    };
    const mockRoutes = [
      { id: "r1", shortName: "R1", longName: "Route 1", type: 3 },
    ];
    const mockCalendar = [
      {
        serviceId: "s1",
        days: [true, true, true, true, true, true, true],
        startDate: "20250101",
        endDate: "20251231",
      },
    ];
    const mockFrequencies = [
      {
        tripId: "t1",
        startTime: "06:00:00",
        endTime: "23:00:00",
        headwaySecs: 600,
      },
    ];

    const result = expandTripsForStop(
      "stop1",
      mockTrips,
      mockTripStops,
      mockRoutes,
      mockCalendar,
      mockFrequencies,
      new Date("2025-06-01T12:00:00Z"),
      120,
    );
    expect(result).toEqual([]);
  });
});
