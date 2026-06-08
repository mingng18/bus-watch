import { describe, it, expect, vi, beforeEach } from "vitest";
import { __refreshStaticData_for_test } from "../src/index";
import * as gtfsStatic from "../src/gtfs-static";

// Mock KVNamespace
const mockKv = {
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  list: vi.fn(),
  getWithMetadata: vi.fn(),
} as unknown as KVNamespace;

vi.mock("../src/gtfs-static", () => ({
  fetchAndParseAgency: vi.fn(),
}));

describe("refreshStaticData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("continues refreshing other agencies if one fails", async () => {
    const fetchAndParseAgencyMock = vi.mocked(gtfsStatic.fetchAndParseAgency);

    // AGENCIES is ['rapid-bus-kl', 'rapid-bus-mrtfeeder', 'selangor-mobility']
    // Let's make the first one fail, and the second one succeed.
    fetchAndParseAgencyMock.mockImplementation(async (agency) => {
      if (agency === "rapid-bus-kl") {
        throw new Error("Network error");
      }
      return {
        stops: [{ id: "s1" }],
        routes: [],
        trips: [],
        tripStops: {},
        calendar: [],
        frequencies: [],
        shapes: {},
      } as any;
    });

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await __refreshStaticData_for_test(mockKv);

    // Verify it called fetchAndParseAgency for all agencies
    expect(fetchAndParseAgencyMock).toHaveBeenCalledTimes(3);
    expect(fetchAndParseAgencyMock).toHaveBeenCalledWith("rapid-bus-kl");
    expect(fetchAndParseAgencyMock).toHaveBeenCalledWith("rapid-bus-mrtfeeder");
    expect(fetchAndParseAgencyMock).toHaveBeenCalledWith("selangor-mobility");

    // Verify KV.put was called for the succeeding agencies
    // 2 successful agencies * 7 put calls each = 14
    expect(mockKv.put).toHaveBeenCalledTimes(14);

    expect(mockKv.put).toHaveBeenCalledWith(
      "stops:rapid-bus-mrtfeeder",
      JSON.stringify([{ id: "s1" }]),
    );
    expect(mockKv.put).toHaveBeenCalledWith(
      "stops:selangor-mobility",
      JSON.stringify([{ id: "s1" }]),
    );

    // Verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to refresh rapid-bus-kl:",
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});
