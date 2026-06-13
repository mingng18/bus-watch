import { describe, it, expect } from "vitest";
import { findNearbyRoutes } from "../src/routes";
import { Stop, Route, Trip, TripStopEntry } from "../src/types";

describe("findNearbyRoutes", () => {
  const centerLat = 3.14;
  const centerLon = 101.68;

  const mockStops: Stop[] = [
    {
      id: "s1",
      name: "Stop 1",
      lat: 3.141,
      lon: 101.681,
      type: "bus",
      parentStation: "",
    }, // close (~150m)
    {
      id: "s2",
      name: "Stop 2",
      lat: 3.142,
      lon: 101.682,
      type: "rail",
      parentStation: "",
    }, // close (~300m)
    {
      id: "s3",
      name: "Stop 3",
      lat: 3.15,
      lon: 101.69,
      type: "bus",
      parentStation: "",
    }, // far (>1km)
  ];

  const mockRoutes: Route[] = [
    { id: "r1", shortName: "100", longName: "Route 100", type: 3 }, // bus
    { id: "r2", shortName: "KJ", longName: "Kelana Jaya", type: 1 }, // rail
    { id: "r3", shortName: "200", longName: "Route 200", type: 3 }, // bus (only far stop)
  ];

  const mockTrips: Trip[] = [
    {
      id: "t1",
      routeId: "r1",
      serviceId: "1",
      headsign: "",
      directionId: 0,
      shapeId: "",
    },
    {
      id: "t2",
      routeId: "r1",
      serviceId: "1",
      headsign: "",
      directionId: 1,
      shapeId: "",
    }, // same route, diff trip
    {
      id: "t3",
      routeId: "r2",
      serviceId: "1",
      headsign: "",
      directionId: 0,
      shapeId: "",
    },
    {
      id: "t4",
      routeId: "r3",
      serviceId: "1",
      headsign: "",
      directionId: 0,
      shapeId: "",
    },
  ];

  const mockTripStops: Record<string, TripStopEntry[]> = {
    t1: [
      {
        stopId: "s1",
        stopName: "Stop 1",
        lat: 3.141,
        lon: 101.681,
        arrivalTime: "",
        departureTime: "",
        sequence: 1,
      },
      {
        stopId: "s3",
        stopName: "Stop 3",
        lat: 3.15,
        lon: 101.69,
        arrivalTime: "",
        departureTime: "",
        sequence: 2,
      },
    ],
    t2: [
      {
        stopId: "s3",
        stopName: "Stop 3",
        lat: 3.15,
        lon: 101.69,
        arrivalTime: "",
        departureTime: "",
        sequence: 1,
      },
      {
        stopId: "s1",
        stopName: "Stop 1",
        lat: 3.141,
        lon: 101.681,
        arrivalTime: "",
        departureTime: "",
        sequence: 2,
      },
    ],
    t3: [
      {
        stopId: "s2",
        stopName: "Stop 2",
        lat: 3.142,
        lon: 101.682,
        arrivalTime: "",
        departureTime: "",
        sequence: 1,
      },
    ],
    t4: [
      {
        stopId: "s3",
        stopName: "Stop 3",
        lat: 3.15,
        lon: 101.69,
        arrivalTime: "",
        departureTime: "",
        sequence: 1,
      },
    ],
  };

  it("returns unique routes within radius and maps types correctly", () => {
    const result = findNearbyRoutes(
      mockStops,
      mockRoutes,
      mockTrips,
      mockTripStops,
      centerLat,
      centerLon,
      500,
    );

    expect(result).toHaveLength(2);

    const r1Info = result.find((r) => r.id === "r1");
    expect(r1Info).toBeDefined();
    expect(r1Info?.shortName).toBe("100");
    expect(r1Info?.type).toBe("bus");

    const r2Info = result.find((r) => r.id === "r2");
    expect(r2Info).toBeDefined();
    expect(r2Info?.shortName).toBe("KJ");
    expect(r2Info?.type).toBe("rail"); // [0,1,2] -> 'rail'
  });

  it("excludes routes only served by stops outside the radius", () => {
    const result = findNearbyRoutes(
      mockStops,
      mockRoutes,
      mockTrips,
      mockTripStops,
      centerLat,
      centerLon,
      500,
    );

    // r3 is only served by s3 which is > 1km away
    const r3Info = result.find((r) => r.id === "r3");
    expect(r3Info).toBeUndefined();
  });

  it("returns empty array when no stops are within radius", () => {
    const result = findNearbyRoutes(
      mockStops,
      mockRoutes,
      mockTrips,
      mockTripStops,
      0, // far away lat
      0, // far away lon
      500,
    );
    expect(result).toEqual([]);
  });

  it("handles missing tripStops mappings gracefully", () => {
    const result = findNearbyRoutes(
      mockStops,
      mockRoutes,
      mockTrips,
      {}, // empty tripStops
      centerLat,
      centerLon,
      500,
    );
    expect(result).toEqual([]);
  });
});
