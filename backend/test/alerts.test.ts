import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  parseAlerts,
  fetchAlerts,
  getCachedAlerts,
  ALERTS_KV_KEY,
  ALERTS_CACHE_TTL_MS,
} from "../src/alerts";
import { Env } from "../src/types";

const FIXTURE = readFileSync(
  join(__dirname, "fixtures/myrapid-sitemap.xml"),
  "utf8",
);

// --- helpers -------------------------------------------------------------

/** Minimal KV stub backed by an in-memory Map. */
function makeKV(store = new Map<string, unknown>()) {
  const kv = {
    store,
    async get(key: string, type?: string) {
      const v = store.get(key);
      if (v === undefined) return null;
      return type === "json" ? v : String(v);
    },
    async put(key: string, value: string) {
      store.set(key, JSON.parse(value));
    },
  };
  return kv;
}

function makeEnv(kv: ReturnType<typeof makeKV>): Env {
  return { KV: kv as any, DB: {} as any };
}

// -------------------------------------------------------------------------

describe("parseAlerts", () => {
  it("extracts and normalizes the known disruption patterns from the fixture", () => {
    const alerts = parseAlerts(FIXTURE);

    // 9 <url> entries minus the homepage minus the MPO event post = 7 alerts.
    expect(alerts).toHaveLength(7);

    // Newest first.
    expect(alerts[0].date).toBe("2026-06-14T04:00:00.000Z"); // 12:00 +08:00 => 04:00 UTC
    expect(alerts[alerts.length - 1].date).toBe("2026-06-12T08:20:12.000Z");

    // Road closure — severe, routes extracted from slug.
    const closure = alerts.find((a) => a.id.startsWith("info-penutupan-jalan"));
    expect(closure).toBeDefined();
    expect(closure!.severity).toBe("severe");
    expect(closure!.affectedLines).toEqual([
      "151",
      "171",
      "173",
      "180",
      "190",
      "202",
      "220",
      "250",
    ]);
    expect(closure!.title).toBe(
      "Road closure — routes 151, 171, 173, 180, 190, 202, 220, 250",
    );

    // Traffic disruption — warning.
    const traffic = alerts.find((a) => a.id.startsWith("info-gangguan-trafik"));
    expect(traffic!.severity).toBe("warning");
    expect(traffic!.affectedLines).toEqual(["173"]);

    // Bus delay — warning, count from slug, no explicit routes.
    const busDelay = alerts.find((a) => a.id.startsWith("kelewatan-bas"));
    expect(busDelay!.severity).toBe("warning");
    expect(busDelay!.title).toBe("Bus delay — 4 route(s) affected");
    expect(busDelay!.affectedLines).toEqual([]);

    // Rail line updates — info, line name title-cased.
    const lineUpdate = alerts.find((a) =>
      a.id.startsWith("kemas-kini-laluan-ampang"),
    );
    expect(lineUpdate!.severity).toBe("info");
    expect(lineUpdate!.affectedLines).toEqual(["Ampang Sri Petaling"]);
    expect(lineUpdate!.title).toBe("Line update — Ampang Sri Petaling line");

    // Service restored — info.
    const restored = alerts.find((a) => a.id.startsWith("perkhidmatan-pulih"));
    expect(restored!.severity).toBe("info");
    expect(restored!.title).toBe("Service restored — Putrajaya line");

    // Train delay — warning.
    const trainDelay = alerts.find((a) => a.id.startsWith("kelewatan-tren"));
    expect(trainDelay!.severity).toBe("warning");
    expect(trainDelay!.title).toBe("Train delay — Putrajaya line");

    // Frequency update — info.
    const freq = alerts.find((a) => a.id.startsWith("kemas-kini-kekerapan"));
    expect(freq!.severity).toBe("info");
    expect(freq!.title).toBe("Frequency update — Kajang line");
    expect(freq!.affectedLines).toEqual(["Kajang"]);
  });

  it("excludes the homepage and non-disruption posts (events/promos)", () => {
    const alerts = parseAlerts(FIXTURE);
    expect(
      alerts.some((a) => a.id === "malaysian-philharmonic-orchestra"),
    ).toBe(false);
    expect(alerts.some((a) => a.url === "https://myrapid.com.my/")).toBe(false);
  });

  it("returns alerts sorted newest-first with a stable order for equal dates", () => {
    const xml = `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>https://myrapid.com.my/info-gangguan-trafik-laluan-100-2/</loc><lastmod>2026-06-10T10:00:00+08:00</lastmod></url>
      <url><loc>https://myrapid.com.my/info-gangguan-trafik-laluan-200-1/</loc><lastmod>2026-06-12T10:00:00+08:00</lastmod></url>
      <url><loc>https://myrapid.com.my/info-gangguan-trafik-laluan-300-3/</loc><lastmod>2026-06-12T10:00:00+08:00</lastmod></url>
    </urlset>`;
    const alerts = parseAlerts(xml);
    // Two share the same date — they must be ordered by id (info-gangguan-trafik-laluan-200 < ...-300).
    expect(alerts.map((a) => a.id)).toEqual([
      "info-gangguan-trafik-laluan-200-1",
      "info-gangguan-trafik-laluan-300-3",
      "info-gangguan-trafik-laluan-100-2",
    ]);
  });

  it("drops unrecognized slug patterns instead of surfacing them as alerts", () => {
    const xml = `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>https://myrapid.com.my/some-random-promo-post/</loc><lastmod>2026-06-10T10:00:00+08:00</lastmod></url>
    </urlset>`;
    expect(parseAlerts(xml)).toEqual([]);
  });
});

describe("parseAlerts — robustness", () => {
  it("returns [] for empty input", () => {
    expect(parseAlerts("")).toEqual([]);
  });

  it("returns [] for input with no <url> blocks", () => {
    expect(
      parseAlerts(
        '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
      ),
    ).toEqual([]);
  });

  it("tolerates malformed / truncated XML without throwing", () => {
    const malformed =
      "<urlset><url><loc>https://myrapid.com.my/info-penutupan-jalan-laluan-100-9/</loc><lastmod>not-a-date</lastmod></url>"; // no closing tags
    const alerts = parseAlerts(malformed);
    expect(alerts).toHaveLength(1);
    // Bad date falls back to epoch, not a throw.
    expect(alerts[0].date).toBe(new Date(0).toISOString());
  });

  it("skips <url> entries that have no <loc>", () => {
    const xml = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url><lastmod>2026-06-10T10:00:00+08:00</lastmod></url>
      <url><loc>https://myrapid.com.my/info-gangguan-trafik-laluan-777-1/</loc><lastmod>2026-06-10T10:00:00+08:00</lastmod></url>
    </urlset>`;
    const alerts = parseAlerts(xml);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].id).toBe("info-gangguan-trafik-laluan-777-1");
  });
});

describe("fetchAlerts", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("parses the sitemap body on HTTP 200", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(FIXTURE, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const env = makeEnv(makeKV());
    const alerts = await fetchAlerts();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(alerts.length).toBe(7);
  });

  it("returns [] (does not throw) when the source returns a non-200 status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("", { status: 403 })),
    );
    const env = makeEnv(makeKV());
    expect(await fetchAlerts()).toEqual([]);
  });

  it("returns [] (does not throw) when fetch rejects", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down")),
    );
    const env = makeEnv(makeKV());
    expect(await fetchAlerts()).toEqual([]);
  });
});

describe("getCachedAlerts", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-14T00:00:00Z"));
  });

  it("serves the cached list without fetching while within the TTL", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const kv = makeKV();
    const cachedAlerts = [
      {
        id: "cached-1",
        title: "Cached",
        summary: "Cached",
        date: "2026-06-13T00:00:00.000Z",
        affectedLines: [],
        severity: "info",
        url: "https://myrapid.com.my/cached",
      },
    ];
    kv.store.set(ALERTS_KV_KEY, { ts: Date.now(), alerts: cachedAlerts });

    const env = makeEnv(kv);
    const result = await getCachedAlerts(env);
    expect(result).toEqual(cachedAlerts);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("re-fetches and re-caches after the TTL elapses", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(FIXTURE, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const kv = makeKV();
    // Stale cache: timestamp well past TTL.
    kv.store.set(ALERTS_KV_KEY, {
      ts: Date.now() - ALERTS_CACHE_TTL_MS - 1,
      alerts: [],
    });

    const env = makeEnv(kv);
    const result = await getCachedAlerts(env);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.length).toBe(7);
    // New cache written.
    const stored = kv.store.get(ALERTS_KV_KEY) as any;
    expect(stored.alerts.length).toBe(7);
    expect(stored.ts).toBe(Date.now());
  });

  it("serves stale cache when a fresh fetch comes back empty", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("", { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);
    const kv = makeKV();
    const staleAlerts = [
      {
        id: "stale-1",
        title: "Stale",
        summary: "Stale",
        date: "2026-06-01T00:00:00.000Z",
        affectedLines: [],
        severity: "warning",
        url: "https://myrapid.com.my/stale",
      },
    ];
    kv.store.set(ALERTS_KV_KEY, {
      ts: Date.now() - ALERTS_CACHE_TTL_MS - 1,
      alerts: staleAlerts,
    });

    const env = makeEnv(kv);
    const result = await getCachedAlerts(env);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    // Fresh fetch failed — stale cache served instead of an empty array.
    expect(result).toEqual(staleAlerts);
  });

  it("returns [] when there is no cache and the fresh fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("", { status: 500 })),
    );
    const env = makeEnv(makeKV()); // empty KV
    expect(await getCachedAlerts(env)).toEqual([]);
  });

  it('returns fetched alerts even if KV.put throws an error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(FIXTURE, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const kv = makeKV();
    // Simulate KV.put failure
    kv.put = vi.fn().mockRejectedValue(new Error('KV write timeout'));

    const env = makeEnv(kv);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await getCachedAlerts(env);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.length).toBe(7); // Should still return fetched alerts
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'alerts: KV put failed:',
      'KV write timeout'
    );

    consoleErrorSpy.mockRestore();
  });

  it("ignores KV.get errors and proceeds to fetch fresh alerts", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(FIXTURE, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const kv = makeKV();
    kv.get = vi.fn().mockRejectedValue(new Error("KV read failed"));

    const env = makeEnv(kv);
    const result = await getCachedAlerts(env);

    expect(kv.get).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.length).toBe(7);
  });
});
