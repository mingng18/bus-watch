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
import { findNearbyStops, findNearbyPrasaranaBuses, nearestFromStopOnRoute } from "../src/nearby";
import {
  Stop,
  Route,
  Trip,
  VehiclePosition,
  ScheduleEntry,
  TripStopEntry,
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
    const result = findNearbyStops({
      stops,
      routes,
      trips,
      tripStops: schedule as any,
      calendar: [],
      frequencies: [],
      vehicles,
      lat: 3.129,
      lon: 101.6755,
      radiusM: 500,
    });
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result[0].distance_m).toBeLessThan(200);
  });

  it("excludes stops beyond radius", () => {
    const result = findNearbyStops({
      stops,
      routes,
      trips,
      tripStops: schedule as any,
      calendar: [],
      frequencies: [],
      vehicles,
      lat: 3.129,
      lon: 101.6755,
      radiusM: 500,
    });
    const ids = result.map((s) => s.id);
    expect(ids).not.toContain("s3");
  });

  it("includes bus realtime arrivals", () => {
    const result = findNearbyStops({
      stops,
      routes,
      trips,
      tripStops: schedule as any,
      calendar: [],
      frequencies: [],
      vehicles,
      lat: 3.129,
      lon: 101.6755,
      radiusM: 500,
    });
    const busStop = result.find((s) => s.id === "s2");
    expect(busStop).toBeDefined();
    expect(busStop!.arrivals.length).toBeGreaterThan(0);
    expect(busStop!.arrivals[0].isRealtime).toBe(true);
    expect(busStop!.arrivals[0].route).toBe("300");
  });

  it("includes rail scheduled arrivals", () => {
    const result = findNearbyStops({
      stops,
      routes,
      trips,
      tripStops: schedule as any,
      calendar: [],
      frequencies: [],
      vehicles,
      lat: 3.129,
      lon: 101.6755,
      radiusM: 500,
    });
    const railStop = result.find((s) => s.id === "s1");
    expect(railStop).toBeDefined();
    expect(railStop!.arrivals.length).toBeGreaterThan(0);
    expect(railStop!.arrivals[0].isRealtime).toBe(false);
  });
});
describe("findNearbyPrasaranaBuses", () => {
  const routes: Route[] = [
    { id: "r1", shortName: "250", longName: "Route 250", type: 3 },
    { id: "r2", shortName: "300", longName: "Route 300", type: 3 },
  ];

  const trips: Trip[] = [
    {
      id: "t1",
      routeId: "r1",
      serviceId: "weekday",
      headsign: "Wangsa Maju",
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

  it("returns buses within radius sorted by ETA", () => {
    // Both buses near Wangsa Maju (lat: 3.2045, lon: 101.7317)
    const lat = 3.2045;
    const lon = 101.7317;
    const buses = [
      {
        bus_no: "B1",
        route: "250",
        latitude: 3.2046,
        longitude: 101.7318,
        speed: 20,
        dir: null,
        trip_rev_kind: "00",
        provider: "A",
        captain_id: "C1",
        dt_gps: "",
        dt_received: "",
      }, // Very close, fast
      {
        bus_no: "B2",
        route: "250",
        latitude: 3.205,
        longitude: 101.732,
        speed: 10,
        dir: null,
        trip_rev_kind: "00",
        provider: "A",
        captain_id: "C2",
        dt_gps: "",
        dt_received: "",
      }, // Slightly further, slow
      {
        bus_no: "B3",
        route: "250",
        latitude: 3.3,
        longitude: 101.8,
        speed: 40,
        dir: null,
        trip_rev_kind: "00",
        provider: "A",
        captain_id: "C3",
        dt_gps: "",
        dt_received: "",
      }, // Far away
    ];

    const result = findNearbyPrasaranaBuses(
      buses,
      routes,
      trips,
      lat,
      lon,
      1000,
    );

    expect(result.length).toBe(2);
    expect(result[0].busNo).toBe("B1"); // Should be faster, thus first
    expect(result[1].busNo).toBe("B2");
    expect(result[0].minutes).toBeLessThanOrEqual(result[1].minutes);
    expect(result[0].destination).toBe("");
  });

  it("excludes specific trip_rev_kind values", () => {
    const lat = 3.2045;
    const lon = 101.7317;
    const buses = [
      {
        bus_no: "B1",
        route: "250",
        latitude: 3.2046,
        longitude: 101.7318,
        speed: 20,
        dir: null,
        trip_rev_kind: "01",
        provider: "",
        captain_id: "",
        dt_gps: "",
        dt_received: "",
      },
      {
        bus_no: "B2",
        route: "250",
        latitude: 3.2046,
        longitude: 101.7318,
        speed: 20,
        dir: null,
        trip_rev_kind: "03",
        provider: "",
        captain_id: "",
        dt_gps: "",
        dt_received: "",
      },
      {
        bus_no: "B3",
        route: "250",
        latitude: 3.2046,
        longitude: 101.7318,
        speed: 20,
        dir: null,
        trip_rev_kind: "05",
        provider: "",
        captain_id: "",
        dt_gps: "",
        dt_received: "",
      },
      {
        bus_no: "B4",
        route: "250",
        latitude: 3.2046,
        longitude: 101.7318,
        speed: 20,
        dir: null,
        trip_rev_kind: "00",
        provider: "",
        captain_id: "",
        dt_gps: "",
        dt_received: "",
      },
    ];

    const result = findNearbyPrasaranaBuses(
      buses,
      routes,
      trips,
      lat,
      lon,
      1000,
    );

    expect(result.length).toBe(1);
    expect(result[0].busNo).toBe("B4");
  });

  it("normalizes route codes", () => {
    const lat = 3.2045;
    const lon = 101.7317;
    const buses = [
      {
        bus_no: "B1",
        route: "2500",
        latitude: 3.2046,
        longitude: 101.7318,
        speed: 20,
        dir: null,
        trip_rev_kind: "00",
        provider: "",
        captain_id: "",
        dt_gps: "",
        dt_received: "",
      },
    ];

    const result = findNearbyPrasaranaBuses(
      buses,
      routes,
      trips,
      lat,
      lon,
      1000,
    );

    expect(result.length).toBe(1);
    expect(result[0].routeShortName).toBe("250");
    expect(result[0].destination).toBe("Wangsa Maju");
  });

  it("uses fallback speed calculation when speed is <= 0", () => {
    const lat = 3.2045;
    const lon = 101.7317;
    const buses = [
      {
        bus_no: "B1",
        route: "250",
        latitude: 3.205,
        longitude: 101.732,
        speed: 0,
        dir: null,
        trip_rev_kind: "00",
        provider: "",
        captain_id: "",
        dt_gps: "",
        dt_received: "",
      },
      {
        bus_no: "B2",
        route: "250",
        latitude: 3.205,
        longitude: 101.732,
        speed: -5,
        dir: null,
        trip_rev_kind: "00",
        provider: "",
        captain_id: "",
        dt_gps: "",
        dt_received: "",
      },
    ];

    const result = findNearbyPrasaranaBuses(
      buses,
      routes,
      trips,
      lat,
      lon,
      1000,
    );

    expect(result.length).toBe(2);
    // Even with 0 or negative speed, it should return a valid minutes estimation > 0
    expect(result[0].minutes).toBeGreaterThan(0);
    expect(result[1].minutes).toBeGreaterThan(0);
  });
});

describe("nearestFromStopOnRoute", () => {
  it("returns null if stops array is empty", () => {
    expect(nearestFromStopOnRoute(3.1, 101.6, [])).toBeNull();
  });

  it("returns the only stop if there is only one", () => {
    const stops: TripStopEntry[] = [
      {
        stopId: "1",
        stopName: "Stop 1",
        lat: 3.2,
        lon: 101.7,
        arrivalTime: "",
        departureTime: "",
        sequence: 1,
      },
    ];
    expect(nearestFromStopOnRoute(3.1, 101.6, stops)).toEqual(stops[0]);
  });

  it("returns the closest stop among multiple stops", () => {
    const stops: TripStopEntry[] = [
      {
        stopId: "1",
        stopName: "Stop 1",
        lat: 3.2,
        lon: 101.7,
        arrivalTime: "",
        departureTime: "",
        sequence: 1,
      }, // Far
      {
        stopId: "2",
        stopName: "Stop 2",
        lat: 3.101,
        lon: 101.601,
        arrivalTime: "",
        departureTime: "",
        sequence: 2,
      }, // Closest
      {
        stopId: "3",
        stopName: "Stop 3",
        lat: 3.15,
        lon: 101.65,
        arrivalTime: "",
        departureTime: "",
        sequence: 3,
      }, // Mid
    ];
    // 3.1, 101.6 is closest to 3.101, 101.601 (stopId 2)
    expect(nearestFromStopOnRoute(3.1, 101.6, stops)).toEqual(stops[1]);
  });
});
