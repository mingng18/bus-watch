import { describe, it, expect, vi } from "vitest";
import {
  detectStopPassages,
  aggregateSamples,
  canonicalStopSequencesByRoute,
  type PositionSample,
} from "../src/sampling";
import {
  getHistoricalETA,
  getBatchedHistoricalETAs,
  confidenceFromSamples,
  nearestFromStopOnRoute,
} from "../src/nearby";
import { TripStopEntry } from "../src/types";

// ---- Fixtures --------------------------------------------------------------
// Two stops ~630m apart on a roughly NS line near KL latitudes. A bus trace
// walking from just south of stop A to just north of stop B over ~120s.
const STOP_A: TripStopEntry = {
  stopId: "A",
  stopName: "A",
  lat: 3.13,
  lon: 101.68,
  arrivalTime: "",
  departureTime: "",
  sequence: 1,
};
const STOP_B: TripStopEntry = {
  stopId: "B",
  stopName: "B",
  lat: 3.1357,
  lon: 101.68,
  arrivalTime: "",
  departureTime: "",
  sequence: 2,
};
const STOP_C: TripStopEntry = {
  stopId: "C",
  stopName: "C",
  lat: 3.1414,
  lon: 101.68,
  arrivalTime: "",
  departureTime: "",
  sequence: 3,
};
const SEQ_ABC: TripStopEntry[] = [STOP_A, STOP_B, STOP_C];

// ~0.00045 deg lat ≈ 50m. Points are positioned so the bus is within 80m of
// each stop at the right moments.
const T0 = 1_700_000_000; // arbitrary fixed unix-seconds base

describe("detectStopPassages", () => {
  it("detects a clean A→B→C passage and emits two inter-stop samples", () => {
    // Bus at A at T0, at B at T0+120, at C at T0+240.
    const samples: PositionSample[] = [
      { bus_no: "b1", route: "r1", lat: 3.13, lon: 101.68, timestamp: T0 },
      {
        bus_no: "b1",
        route: "r1",
        lat: 3.1357,
        lon: 101.68,
        timestamp: T0 + 120,
      },
      {
        bus_no: "b1",
        route: "r1",
        lat: 3.1414,
        lon: 101.68,
        timestamp: T0 + 240,
      },
    ];
    const legs = detectStopPassages(samples, SEQ_ABC, "r1");
    expect(legs).toHaveLength(2);
    expect(legs[0]).toMatchObject({
      route: "r1",
      from_stop_id: "A",
      to_stop_id: "B",
      seconds: 120,
    });
    expect(legs[1]).toMatchObject({
      route: "r1",
      from_stop_id: "B",
      to_stop_id: "C",
      seconds: 120,
    });
    // Both legs should share the day-of-week + time-bucket of the from passage.
    expect(legs[0].day_of_week).toBe(legs[1].day_of_week);
  });

  it("drops the leg across a skipped stop without fabricating it", () => {
    // Bus at A at T0, then jumps straight to C at T0+200 (never within 80m of
    // B). Because detection requires in-order passage, the pointer stays on B
    // and C cannot match → no sample is emitted for either leg.
    const samples: PositionSample[] = [
      { bus_no: "b1", route: "r1", lat: 3.13, lon: 101.68, timestamp: T0 },
      {
        bus_no: "b1",
        route: "r1",
        lat: 3.1414,
        lon: 101.68,
        timestamp: T0 + 200,
      },
    ];
    const legs = detectStopPassages(samples, SEQ_ABC, "r1");
    expect(legs).toHaveLength(0);
  });

  it("ignores a far GPS outlier that is not within radius of the next stop", () => {
    // A teleport far off the line between A and B must not advance the
    // pointer or produce a sample.
    const samples: PositionSample[] = [
      { bus_no: "b1", route: "r1", lat: 3.13, lon: 101.68, timestamp: T0 },
      { bus_no: "b1", route: "r1", lat: 3.5, lon: 102.0, timestamp: T0 + 60 }, // outlier
      {
        bus_no: "b1",
        route: "r1",
        lat: 3.1357,
        lon: 101.68,
        timestamp: T0 + 120,
      },
    ];
    const legs = detectStopPassages(samples, SEQ_ABC, "r1");
    expect(legs).toHaveLength(1);
    expect(legs[0]).toMatchObject({
      from_stop_id: "A",
      to_stop_id: "B",
      seconds: 120,
    });
  });

  it("caps absurd inter-stop gaps (out-of-service) and emits no sample for that leg", () => {
    // Bus at A, then dwells/out-of-service for 2h before reaching B. The 2h
    // gap exceeds MAX_INTER_STOP_SECONDS so no A→B sample is produced, but the
    // pointer still advances so a later B→C leg could be captured.
    const samples: PositionSample[] = [
      { bus_no: "b1", route: "r1", lat: 3.13, lon: 101.68, timestamp: T0 },
      {
        bus_no: "b1",
        route: "r1",
        lat: 3.1357,
        lon: 101.68,
        timestamp: T0 + 7200,
      },
      {
        bus_no: "b1",
        route: "r1",
        lat: 3.1414,
        lon: 101.68,
        timestamp: T0 + 7320,
      },
    ];
    const legs = detectStopPassages(samples, SEQ_ABC, "r1");
    // The A→B leg (7200s) is dropped; B→C (120s) survives.
    expect(legs).toHaveLength(1);
    expect(legs[0]).toMatchObject({
      from_stop_id: "B",
      to_stop_id: "C",
      seconds: 120,
    });
  });

  it("sorts an out-of-order trace by timestamp before detecting", () => {
    const samples: PositionSample[] = [
      {
        bus_no: "b1",
        route: "r1",
        lat: 3.1357,
        lon: 101.68,
        timestamp: T0 + 120,
      },
      { bus_no: "b1", route: "r1", lat: 3.13, lon: 101.68, timestamp: T0 },
      {
        bus_no: "b1",
        route: "r1",
        lat: 3.1414,
        lon: 101.68,
        timestamp: T0 + 240,
      },
    ];
    const legs = detectStopPassages(samples, SEQ_ABC, "r1");
    expect(legs).toHaveLength(2);
    expect(legs[0].seconds).toBe(120);
  });

  it("returns no samples for an empty trace or a single-stop sequence", () => {
    expect(detectStopPassages([], SEQ_ABC, "r1")).toEqual([]);
    expect(
      detectStopPassages(
        [STOP_A].map((s) => ({
          bus_no: "b1",
          route: "r1",
          lat: s.lat,
          lon: s.lon,
          timestamp: T0,
        })),
        [STOP_A],
        "r1",
      ),
    ).toEqual([]);
  });

  it("buckets day-of-week via KL-local time, not UTC", () => {
    // T0 = 1700000000 = 2023-11-14 22:13:20 UTC = 2023-11-15 06:13:20 MYT.
    // KL day-of-week for that instant is Wednesday (3). A naive UTC getDay()
    // would give Tuesday (2). Assert the KL value to lock in the helper.
    const samples: PositionSample[] = [
      { bus_no: "b1", route: "r1", lat: 3.13, lon: 101.68, timestamp: T0 },
      {
        bus_no: "b1",
        route: "r1",
        lat: 3.1357,
        lon: 101.68,
        timestamp: T0 + 120,
      },
    ];
    const legs = detectStopPassages(samples, SEQ_ABC, "r1");
    expect(legs[0].day_of_week).toBe(3); // Wednesday in MYT
    expect(legs[0].time_bucket).toBe(6); // 06:xx MYT
  });
});

describe("aggregateSamples", () => {
  it("averages samples per (route, from, to, day, hour) bucket and counts them", () => {
    const samples = [
      leg("r1", "A", "B", 5, 9, 100),
      leg("r1", "A", "B", 5, 9, 120),
      leg("r1", "A", "B", 5, 9, 140),
    ];
    const out = aggregateSamples(samples);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({
      route: "r1",
      from_stop_id: "A",
      to_stop_id: "B",
      day_of_week: 5,
      time_bucket: 9,
    });
    expect(out[0].avg_seconds).toBe(120);
    expect(out[0].sample_count).toBe(3);
    // spread = mean abs deviation from mean (120): (20+0+20)/3 ≈ 13
    expect(out[0].spread_seconds).toBe(13);
  });

  it("keeps separate buckets for different days/hours", () => {
    const samples = [
      leg("r1", "A", "B", 5, 9, 100),
      leg("r1", "A", "B", 6, 9, 200), // different day
      leg("r1", "A", "B", 5, 10, 300), // different hour
    ];
    const out = aggregateSamples(samples);
    expect(out).toHaveLength(3);
  });

  it("drops a MAD outlier so one bad leg cannot poison the mean", () => {
    // 7 clean ~120s samples + one 1500s outlier. The outlier is >3*MAD from
    // the median and should be rejected, leaving avg ≈ 120.
    const samples = [
      leg("r1", "A", "B", 5, 9, 120),
      leg("r1", "A", "B", 5, 9, 118),
      leg("r1", "A", "B", 5, 9, 122),
      leg("r1", "A", "B", 5, 9, 121),
      leg("r1", "A", "B", 5, 9, 119),
      leg("r1", "A", "B", 5, 9, 120),
      leg("r1", "A", "B", 5, 9, 120),
      leg("r1", "A", "B", 5, 9, 1500), // outlier
    ];
    const out = aggregateSamples(samples);
    expect(out).toHaveLength(1);
    expect(out[0].sample_count).toBe(7); // outlier rejected
    expect(out[0].avg_seconds).toBeGreaterThanOrEqual(118);
    expect(out[0].avg_seconds).toBeLessThanOrEqual(122);
  });

  it("does not reject anything when there are too few samples", () => {
    const samples = [
      leg("r1", "A", "B", 5, 9, 100),
      leg("r1", "A", "B", 5, 9, 1500),
    ];
    const out = aggregateSamples(samples);
    expect(out[0].sample_count).toBe(2);
  });
});

describe("canonicalStopSequencesByRoute", () => {
  it("picks the longest stop list per route as the canonical sequence", () => {
    const trips = [
      { id: "t1", routeId: "r1" },
      { id: "t2", routeId: "r1" },
    ];
    const tripStops = {
      t1: [STOP_A, STOP_B], // shorter
      t2: [STOP_A, STOP_B, STOP_C], // longer → canonical
    };
    const out = canonicalStopSequencesByRoute(trips, tripStops);
    expect(out.get("r1")!.map((s) => s.stopId)).toEqual(["A", "B", "C"]);
  });

  it("skips trips with no stop entries", () => {
    const trips = [{ id: "t1", routeId: "r1" }];
    const out = canonicalStopSequencesByRoute(trips, {});
    expect(out.has("r1")).toBe(false);
  });
});

describe("confidenceFromSamples", () => {
  it("is high with many samples and a tight spread", () => {
    expect(confidenceFromSamples(10, 15, 120)).toBe("high"); // spread/avg = 12.5%
  });
  it("is medium with a few samples or a wider spread", () => {
    expect(confidenceFromSamples(5, 60, 120)).toBe("medium"); // enough samples, spread 50%
  });
  it("is low with very few samples", () => {
    expect(confidenceFromSamples(1, 0, 120)).toBe("low");
  });
});

describe("nearestFromStopOnRoute", () => {
  it("returns the stop closest to the bus position", () => {
    // Bus midway between A and B, slightly closer to B.
    const stop = nearestFromStopOnRoute(3.133, 101.68, SEQ_ABC);
    expect(stop?.stopId).toBe("B");
  });
  it("returns null for an empty stop list", () => {
    expect(nearestFromStopOnRoute(3.13, 101.68, [])).toBeNull();
  });
});

// ---- getHistoricalETA / getBatchedHistoricalETAs --------------------------
// Mock D1: capture the bind params + return a configured row so we can assert
// the lookup keys (route, from, to, KL day/hour) and the result shape.
function mockDb(row: Record<string, number> | null) {
  const bind = vi.fn().mockReturnThis();
  const all = vi.fn().mockResolvedValue({ results: row ? [row] : [] });
  const prepare = vi.fn().mockReturnValue({ bind, all });
  const batch = vi.fn().mockResolvedValue([{ results: row ? [row] : [] }]);
  return { db: { prepare, batch } as any, bind, prepare, all, batch };
}

describe("getHistoricalETA", () => {
  it("returns ETA + confidence + isLive for a known leg", async () => {
    const { db } = mockDb({
      avg_seconds: 300,
      sample_count: 10,
      spread_seconds: 45,
    });
    // 2023-09-14 22:13:20 UTC = 2023-09-15 06:13:20 MYT (Friday, hour 6).
    const res = await getHistoricalETA(db, "r1", "A", "B", new Date(T0 * 1000));
    expect(res).not.toBeNull();
    expect(res!.minutes).toBe(5); // 300s
    expect(res!.uncertaintyMinutes).toBeCloseTo(0.75, 5); // 45s
    expect(res!.confidence).toBe("high"); // 10 samples, spread/avg = 15%
    expect(res!.isLive).toBe(false);
    expect(res!.sampleCount).toBe(10);
  });

  it("returns null when there is no matching data", async () => {
    const { db } = mockDb(null);
    const res = await getHistoricalETA(db, "r1", "A", "B");
    expect(res).toBeNull();
  });
});

describe("getBatchedHistoricalETAs", () => {
  it("returns a map keyed by route-stopId with the confidence result", async () => {
    const { db } = mockDb({
      avg_seconds: 480,
      sample_count: 4,
      spread_seconds: 60,
    });
    const map = await getBatchedHistoricalETAs(db, [
      { route: "r1", stopId: "B" },
    ]);
    const r = map.get("r1-B");
    expect(r).toBeDefined();
    expect(r!.minutes).toBe(8); // 480s
    expect(r!.confidence).toBe("medium"); // 4 samples
    expect(r!.isLive).toBe(false);
  });

  it("returns an empty map for empty input without hitting the DB", async () => {
    const prepare = vi.fn();
    const map = await getBatchedHistoricalETAs({ prepare } as any, []);
    expect(map.size).toBe(0);
    expect(prepare).not.toHaveBeenCalled();
  });
});

// ---- helper ----------------------------------------------------------------
function leg(
  route: string,
  from: string,
  to: string,
  dow: number,
  hour: number,
  seconds: number,
) {
  return {
    route,
    from_stop_id: from,
    to_stop_id: to,
    from_lat: 0,
    from_lon: 0,
    to_lat: 0,
    to_lon: 0,
    seconds,
    day_of_week: dow,
    time_bucket: hour,
  };
}
