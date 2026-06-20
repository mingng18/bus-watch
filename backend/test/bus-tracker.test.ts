import { describe, it, expect } from "vitest";
import { getBusTripProgress } from "../src/bus-tracker";
import { Route, TripStopEntry, VehiclePosition } from "../src/types";

const routeMap = new Map<string, Route>([
  ["r300", { id: "r300", shortName: "300", longName: "Route 300", type: 3 }],
]);

const tripStops: Record<string, TripStopEntry[]> = {
  t1: [
    {
      stopId: "s1",
      stopName: "Bangsar",
      lat: 3.129,
      lon: 101.675,
      arrivalTime: "08:00:00",
      departureTime: "08:00:30",
      sequence: 1,
    },
    {
      stopId: "s2",
      stopName: "TTDI",
      lat: 3.135,
      lon: 101.63,
      arrivalTime: "08:10:00",
      departureTime: "08:10:30",
      sequence: 2,
    },
    {
      stopId: "s3",
      stopName: "KL Sentral",
      lat: 3.14,
      lon: 101.682,
      arrivalTime: "08:20:00",
      departureTime: "08:20:30",
      sequence: 3,
    },
  ],
};

const vehicle: VehiclePosition = {
  tripId: "t1",
  routeId: "r300",
  lat: 3.132,
  lon: 101.65,
  currentStopSequence: 2,
  timestamp: 1000,
  stopId: "s2",
};

describe("getBusTripProgress", () => {
  it("returns trip progress with current stop highlighted", () => {
    const result = getBusTripProgress("t1", routeMap, tripStops, vehicle);
    expect(result.tripId).toBe("t1");
    expect(result.routeShortName).toBe("300");
    expect(result.destination).toBe("KL Sentral");
    expect(result.stops.length).toBe(3);
  });

  it("marks stops before current as passed", () => {
    const result = getBusTripProgress("t1", routeMap, tripStops, vehicle);
    expect(result.stops[0].passed).toBe(true);
    expect(result.stops[1].isCurrent).toBe(true);
    expect(result.stops[2].passed).toBe(false);
  });

  it("computes progress percentage", () => {
    const result = getBusTripProgress("t1", routeMap, tripStops, vehicle);
    expect(result.progressPercent).toBeGreaterThanOrEqual(0);
    expect(result.progressPercent).toBeLessThanOrEqual(100);
  });

  it("works without vehicle position", () => {
    const result = getBusTripProgress("t1", routeMap, tripStops, null);
    expect(result.busPosition).toBeNull();
    expect(result.stops.length).toBe(3);
  });

  it("throws for unknown trip", () => {
    expect(() =>
      getBusTripProgress("unknown", routeMap, tripStops, vehicle),
    ).toThrow();
  });
});
