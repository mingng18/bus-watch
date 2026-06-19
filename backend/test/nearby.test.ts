import { vi } from "vitest";
vi.mock("../src/frequency", () => ({
  expandTripsForStop: () => [
    {
      line: "Kelana Jaya",
      destination: "Gombak",
      minutesUntil: 5,
    },
  ],
}));
import { describe, it, expect } from "vitest";
import { findNearbyStops, findNearbyBusRoutes } from "../src/nearby";
import {
  Stop,
  Route,
  Trip,
  VehiclePosition,
  ScheduleEntry,
} from "../src/types";

const stops: Stop[] = [
  {
    id: "s1",
    name: "Bangsar LRT",
    lat: 3.1295,
    lon: 101.675,
    type: "rail",
    parentStation: "",
  },
  {
    id: "s2",
    name: "Bus Stop A",
    lat: 3.13,
    lon: 101.676,
    type: "bus",
    parentStation: "",
  },
  {
    id: "s3",
    name: "Far Stop",
    lat: 3.2,
    lon: 101.7,
    type: "bus",
    parentStation: "",
  },
];

const routes: Route[] = [
  { id: "r1", shortName: "Kelana Jaya", longName: "Kelana Jaya Line", type: 1 },
  { id: "r2", shortName: "300", longName: "Route 300", type: 3 },
];

const trips: Trip[] = [
  {
    id: "t1",
    routeId: "r1",
    serviceId: "weekday",
    headsign: "Gombak",
    directionId: 0,
    shapeId: "",
  },
  {
    id: "t2",
    routeId: "r2",
    serviceId: "weekday",
    headsign: "KL Sentral",
    directionId: 0,
    shapeId: "",
  },
];

const vehicles: VehiclePosition[] = [
  {
    tripId: "t2",
    routeId: "r2",
    lat: 3.1301,
    lon: 101.6761,
    currentStopSequence: 5,
    timestamp: 1000,
    stopId: "s2",
  },
];

const schedule: Record<string, ScheduleEntry[]> = {
  s1: [
    {
      tripId: "t1",
      routeShortName: "Kelana Jaya",
      headsign: "Gombak",
      departureTime: "22:30:00",
      directionId: 0,
    },
  ],
};

describe("findNearbyStops", () => {
  it("returns stops within radius sorted by distance", () => {
    const result = findNearbyStops(
      stops,
      routes,
      trips,
      schedule as any,
      [],
      [],
      vehicles,
      3.129,
      101.6755,
      500,
    );
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result[0].distance_m).toBeLessThan(200);
  });

  it("excludes stops beyond radius", () => {
    const result = findNearbyStops(
      stops,
      routes,
      trips,
      schedule as any,
      [],
      [],
      vehicles,
      3.129,
      101.6755,
      500,
    );
    const ids = result.map((s) => s.id);
    expect(ids).not.toContain("s3");
  });

  it("includes bus realtime arrivals", () => {
    const result = findNearbyStops(
      stops,
      routes,
      trips,
      schedule as any,
      [],
      [],
      vehicles,
      3.129,
      101.6755,
      500,
    );
    const busStop = result.find((s) => s.id === "s2");
    expect(busStop).toBeDefined();
    expect(busStop!.arrivals.length).toBeGreaterThan(0);
    expect(busStop!.arrivals[0].isRealtime).toBe(true);
    expect(busStop!.arrivals[0].route).toBe("300");
  });

  it("includes rail scheduled arrivals", () => {
    const result = findNearbyStops(
      stops,
      routes,
      trips,
      schedule as any,
      [],
      [],
      vehicles,
      3.129,
      101.6755,
      500,
    );
    const railStop = result.find((s) => s.id === "s1");
    expect(railStop).toBeDefined();
    expect(railStop!.arrivals.length).toBeGreaterThan(0);
    expect(railStop!.arrivals[0].isRealtime).toBe(false);
  });
});
describe("findNearbyBusRoutes", () => {
  it("returns routes within radius sorted by time (derived from distance)", () => {
    const result = findNearbyBusRoutes(
      routes,
      trips,
      vehicles,
      3.129,
      101.6755,
      500,
    );
    expect(result.length).toBe(1);
    expect(result[0].routeId).toBe("r2");
    expect(result[0].tripId).toBe("t2");
  });

  it("excludes routes with vehicles outside radius", () => {
    const farVehicles = [
      {
        tripId: "t1",
        routeId: "r1",
        lat: 3.2,
        lon: 101.7,
        currentStopSequence: 1,
        timestamp: 1000,
        stopId: "s3",
      },
    ];
    const result = findNearbyBusRoutes(
      routes,
      trips,
      farVehicles as any,
      3.129,
      101.6755,
      500,
    );
    expect(result.length).toBe(0);
  });

  it("handles vehicles with missing routes or trips gracefully", () => {
    const orphanVehicles = [
      {
        tripId: "t-unknown",
        routeId: "r-unknown",
        lat: 3.1301,
        lon: 101.6761,
        currentStopSequence: 1,
        timestamp: 1000,
        stopId: "s2",
      },
    ];
    const result = findNearbyBusRoutes(
      routes,
      trips,
      orphanVehicles as any,
      3.129,
      101.6755,
      500,
    );
    expect(result.length).toBe(1);
    expect(result[0].routeId).toBe("r-unknown");
    expect(result[0].routeShortName).toBe("");
    expect(result[0].destination).toBe("");
  });

  it("deduplicates multiple vehicles on the same route/trip", () => {
    const multiVehicles = [
      {
        tripId: "t2",
        routeId: "r2",
        lat: 3.1301,
        lon: 101.6761,
        currentStopSequence: 5,
        timestamp: 1000,
        stopId: "s2",
      },
      {
        tripId: "t2",
        routeId: "r2",
        lat: 3.1302,
        lon: 101.6762,
        currentStopSequence: 6,
        timestamp: 1010,
        stopId: "s2",
      },
    ];
    const result = findNearbyBusRoutes(
      routes,
      trips,
      multiVehicles as any,
      3.129,
      101.6755,
      500,
    );
    expect(result.length).toBe(1);
  });

  it("uses default radius of 1000m when not specified", () => {
    const mediumVehicles = [
      {
        tripId: "t2",
        routeId: "r2",
        lat: 3.129,
        lon: 101.684,
        currentStopSequence: 5,
        timestamp: 1000,
        stopId: "s2",
      },
    ];
    const resultWithDefault = findNearbyBusRoutes(
      routes,
      trips,
      mediumVehicles as any,
      3.129,
      101.6755,
    );
    expect(resultWithDefault.length).toBe(1);

    const resultWith500m = findNearbyBusRoutes(
      routes,
      trips,
      mediumVehicles as any,
      3.129,
      101.6755,
      500,
    );
    expect(resultWith500m.length).toBe(0);
  });
});
