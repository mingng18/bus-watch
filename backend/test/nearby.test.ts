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
import { findNearbyStops, findNearbyPrasaranaBuses } from "../src/nearby";
import {
  Stop,
  Route,
  Trip,
  VehiclePosition,
  ScheduleEntry,
  PrasaranaBus,
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
  },
  {
    id: "t2",
    routeId: "r2",
    serviceId: "weekday",
    headsign: "KL Sentral",
    directionId: 0,
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
describe("findNearbyPrasaranaBuses", () => {
  it("returns valid buses within radius, matches routes, and ignores invalid trip_rev_kinds", () => {
    const buses: PrasaranaBus[] = [
      {
        bus_no: "B1",
        route: "300",
        latitude: 3.1295,
        longitude: 101.675,
        speed: 0,
        dir: 1,
        trip_rev_kind: "02",
        provider: "P",
        captain_id: "C1",
        dt_gps: "",
        dt_received: "",
      },
      {
        bus_no: "B2",
        route: "300",
        latitude: 3.2,
        longitude: 101.7,
        speed: 0,
        dir: 1,
        trip_rev_kind: "02",
        provider: "P",
        captain_id: "C2",
        dt_gps: "",
        dt_received: "",
      },
      {
        bus_no: "B3",
        route: "300",
        latitude: 3.1296,
        longitude: 101.6751,
        speed: 0,
        dir: 1,
        trip_rev_kind: "01",
        provider: "P",
        captain_id: "C3",
        dt_gps: "",
        dt_received: "",
      },
    ];

    const result = findNearbyPrasaranaBuses(
      buses,
      routes,
      trips,
      3.129,
      101.6755,
      500,
    );

    expect(result.length).toBe(1);
    expect(result[0].busNo).toBe("B1");
    expect(result[0].destination).toBe("");
    expect(result[0].routeId).toBe("30");
  });
});
