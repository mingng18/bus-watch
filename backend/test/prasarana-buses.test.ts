import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPrasaranaBuses } from "../src/index";
import * as prasaranaModule from "../src/prasarana-socketio";

// Mock KVNamespace
const mockKv = {
  get: vi.fn(),
  put: vi.fn(),
};

vi.mock("../src/prasarana-socketio", () => ({
  fetchPrasaranaBuses: vi.fn(),
}));

// Suppress console.error during tests to avoid noise
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
  vi.resetAllMocks();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe("getPrasaranaBuses", () => {
  it("handles fetchPrasaranaBuses error and returns cached buses and error string", async () => {
    // Setup KV to return a cached result.
    // getKvJson calls kv.get(key, 'json'), so we mock what get returns.
    const cachedData = {
      ts: Date.now() - 100000, // old enough to trigger a fetch (needs to be > 60000)
      buses: [
        {
          bus_no: "B1",
          route: "R1",
          lat: 1,
          lon: 1,
          speed: 0,
          heading: 0,
          timestamp: 0,
        },
      ],
    };
    mockKv.get.mockResolvedValue(cachedData);

    // Make fetchPrasaranaBuses throw an error
    vi.mocked(prasaranaModule.fetchPrasaranaBuses).mockRejectedValue(
      new Error("API failure"),
    );

    const result = await getPrasaranaBuses(mockKv as any);

    expect(result.buses).toEqual(cachedData.buses);
    expect(result.error).toBe("API failure");
    expect(console.error).toHaveBeenCalledWith(
      "Failed to fetch Prasarana buses:",
      "API failure",
    );
  });

  it("handles fetchPrasaranaBuses error without cache and falls back to empty array", async () => {
    // Setup KV to return no cache
    mockKv.get.mockResolvedValue(null);

    // Make fetchPrasaranaBuses throw an error without message
    vi.mocked(prasaranaModule.fetchPrasaranaBuses).mockRejectedValue(
      "String error",
    );

    const result = await getPrasaranaBuses(mockKv as any);

    expect(result.buses).toEqual([]);
    expect(result.error).toBeUndefined(); // Since it's a string, err?.message is undefined
    expect(console.error).toHaveBeenCalledWith(
      "Failed to fetch Prasarana buses:",
      "String error",
    );
  });

  it("handles fetchPrasaranaBuses success", async () => {
    // Setup KV to return no cache
    mockKv.get.mockResolvedValue(null);

    const mockBuses = [
      {
        bus_no: "B1",
        route: "R1",
        lat: 1,
        lon: 1,
        speed: 0,
        heading: 0,
        timestamp: 0,
      },
    ];

    // Make fetchPrasaranaBuses return success
    vi.mocked(prasaranaModule.fetchPrasaranaBuses).mockResolvedValue(mockBuses);

    const result = await getPrasaranaBuses(mockKv as any);

    expect(result.buses).toEqual(mockBuses);
    expect(result.error).toBeUndefined();
    expect(mockKv.put).toHaveBeenCalledWith(
      "prasarana:buses",
      expect.any(String),
    );
  });

  it("returns cached buses if they are less than 60s old without fetching", async () => {
    // Setup KV to return a recent cached result.
    const cachedData = {
      ts: Date.now() - 30000, // < 60000, so it should just return cache
      buses: [
        {
          bus_no: "B1",
          route: "R1",
          lat: 1,
          lon: 1,
          speed: 0,
          heading: 0,
          timestamp: 0,
        },
      ],
    };
    mockKv.get.mockResolvedValue(cachedData);

    const result = await getPrasaranaBuses(mockKv as any);

    expect(result.buses).toEqual(cachedData.buses);
    expect(prasaranaModule.fetchPrasaranaBuses).not.toHaveBeenCalled();
  });
});
