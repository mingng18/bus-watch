import type { Env } from "./types";

// --- Source note ---------------------------------------------------------
// MyRapid's media-releases page (www.myrapid.com.my/media-releases/) and the
// WordPress REST API are both behind Incapsula bot protection — they return a
// JS challenge stub instead of HTML/JSON. No RSS/Atom feed exists.
//
// The ONE structured endpoint served unchallenged is the WordPress XML sitemap
// (post-sitemap1.xml). Each <url> carries <loc> (canonical post URL) and
// <lastmod> (ISO 8601). The post slug encodes the alert title and — for bus
// disruptions — the affected route numbers (e.g.
// `info-penutupan-jalan-laluan-151-171-173-180-55` = "road closure, routes
// 151/171/173/180... #55"). We parse the slug to derive a human-readable title,
// the affected lines/routes, and a severity heuristic.
// -------------------------------------------------------------------------

/** Where alerts are read from. Sitemap is the only unchallenged, structured source. */
export const ALERTS_SITEMAP_URL = "https://myrapid.com.my/post-sitemap1.xml";

/** KV key for the cached parsed alert list. */
export const ALERTS_KV_KEY = "alerts:recent";

/** How long a parsed alert list is served from cache before re-fetching. */
export const ALERTS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** Default number of alerts returned when no limit is requested. */
export const DEFAULT_ALERT_LIMIT = 20;

export type AlertSeverity = "info" | "warning" | "severe";

export interface Alert {
  /** Stable id derived from the post URL slug. */
  id: string;
  /** Human-readable title derived from the slug. */
  title: string;
  /** Short summary; currently mirrors the title with severity context. */
  summary: string;
  /** ISO 8601 date from the sitemap <lastmod> (UTC). */
  date: string;
  /** Affected bus routes / rail lines extracted from the slug, if any. */
  affectedLines: string[];
  /** Heuristic severity. */
  severity: AlertSeverity;
  /** Canonical MyRapid post URL. */
  url: string;
}

/**
 * Fetch the sitemap, parse alerts, and return them newest-first.
 * Never throws — on any failure returns an empty array so callers degrade
 * gracefully. Pure parsing of a raw sitemap string is in {@link parseAlerts};
 * this wrapper only does the network fetch.
 */
export async function fetchAlerts(): Promise<Alert[]> {
  let xml = "";
  try {
    const res = await fetch(ALERTS_SITEMAP_URL, {
      headers: {
        "User-Agent": "bus-watch/1.0 (+https://github.com/mingng18/bus-watch)",
      },
      cf: { cacheTtl: 60 } as any,
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error(`alerts: sitemap fetch failed (HTTP ${res.status})`);
      return [];
    }
    xml = await res.text();
  } catch (err: any) {
    console.error("alerts: sitemap fetch threw:", err?.message || err);
    return [];
  }
  return parseAlerts(xml);
}

/**
 * Fetch alerts with a short KV cache. On fetch failure, returns the last good
 * cached list (if any) so a transient source outage never blanks the UI.
 */
export async function getCachedAlerts(env: Env): Promise<Alert[]> {
  const cached = (await env.KV.get(ALERTS_KV_KEY, "json")) as {
    ts: number;
    alerts: Alert[];
  } | null;
  if (cached && Date.now() - cached.ts < ALERTS_CACHE_TTL_MS) {
    return cached.alerts;
  }

  const alerts = await fetchAlerts();
  // Only cache non-empty results — but keep the previous cache around for
  // fallback even when the fresh fetch comes back empty.
  if (alerts.length > 0) {
    try {
      await env.KV.put(
        ALERTS_KV_KEY,
        JSON.stringify({ ts: Date.now(), alerts }),
      );
    } catch (err: any) {
      console.error("alerts: KV put failed:", err?.message || err);
    }
    return alerts;
  }

  // Fresh fetch was empty/failed — serve stale cache if we have one.
  return cached?.alerts ?? [];
}

/**
 * Parse a MyRapid post sitemap XML string into a normalized alert list,
 * newest-first. Pure function (no I/O) so it is trivially testable.
 *
 * Non-disruption posts (event announcements, promotional content) are filtered
 * out by slug prefix. Anything we cannot classify is dropped rather than
 * surfaced as a false alert.
 */
export function parseAlerts(xml: string): Alert[] {
  const entries = extractUrlEntries(xml);
  const alerts: Alert[] = [];
  for (const entry of entries) {
    const alert = classifyEntry(entry);
    if (alert) alerts.push(alert);
  }
  // Newest first; stable order for equal lastmod by slug for determinism.
  alerts.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.id < b.id ? -1 : 1;
  });
  return alerts;
}

interface SitemapEntry {
  loc: string;
  lastmod: string | null;
}

/** Extract <url> blocks' <loc> + <lastmod>. Tolerant of malformed XML. */
function extractUrlEntries(xml: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const urlRe = /<url\b[^>]*>([\s\S]*?)<\/url>/gi;
  let m: RegExpExecArray | null;
  while ((m = urlRe.exec(xml)) !== null) {
    const block = m[1];
    const loc = block.match(/<loc>\s*([^<]*?)\s*<\/loc>/i)?.[1]?.trim();
    if (!loc) continue;
    const lastmod =
      block.match(/<lastmod>\s*([^<]*?)\s*<\/lastmod>/i)?.[1]?.trim() ?? null;
    entries.push({ loc, lastmod });
  }
  return entries;
}

/** Slugs that do NOT represent service disruptions and must be excluded. */
const NON_DISRUPTION_SLUGS = [
  "malaysian-philharmonic",
  "mrt-", // promotional MRT texts, not disruption notices
];

/**
 * Turn a sitemap entry into an {@link Alert}, or return null if the slug is not
 * a recognized disruption pattern. The slug vocabulary (Malay) maps to:
 *   kemas-kini-laluan-<line>            Line update / kemas kini          (info)
 *   kemas-kini-kekerapan-laluan-<line>  Frequency update                 (info)
 *   perkhidmatan-pulih-laluan-<line>    Service restored                 (info)
 *   kelewatan-bas-<n>-laluan-terjejas   Bus delay, n routes affected     (warning)
 *   kelewatan-tren-laluan-<line>        Train delay                      (warning)
 *   info-gangguan-trafik-laluan-<r...>  Traffic disruption (routes)      (warning)
 *   info-penutupan-jalan-laluan-<r...>  Road closure (routes)            (severe)
 */
function classifyEntry(entry: SitemapEntry): Alert | null {
  const loc = entry.loc;
  // Strip trailing slash, take the final path segment as the slug.
  const slug = loc.replace(/\/+$/, "").split("/").pop() ?? "";
  if (!slug) return null;

  // Skip the homepage and known non-disruption posts.
  if (loc === "https://myrapid.com.my/" || loc === "https://myrapid.com.my")
    return null;
  for (const skip of NON_DISRUPTION_SLUGS) {
    if (slug.startsWith(skip)) return null;
  }

  const parsed = parseSlug(slug);
  if (!parsed) return null;

  const lastmod = entry.lastmod ? normalizeDate(entry.lastmod) : null;

  return {
    id: slug,
    title: parsed.title,
    summary: parsed.summary,
    date: lastmod ?? new Date(0).toISOString(),
    affectedLines: parsed.affectedLines,
    severity: parsed.severity,
    url: loc,
  };
}

interface ParsedSlug {
  title: string;
  summary: string;
  affectedLines: string[];
  severity: AlertSeverity;
}

/**
 * Map a MyRapid post slug to a structured alert. Returns null for unrecognized
 * slugs so unknown content is never surfaced as a false alert.
 */
function parseSlug(slug: string): ParsedSlug | null {
  // Drop the trailing numeric post-id token (e.g. "-55", "-175") used by WP
  // for disambiguation; it is not meaningful to riders.
  const base = slug.replace(/-\d+$/, "");
  const tokens = base.split("-");

  // Bus road closure: info-penutupan-jalan-laluan-<routes...>
  if (base.startsWith("info-penutupan-jalan-laluan-")) {
    const routes = extractRoutes(tokens);
    const title = routes.length
      ? `Road closure — routes ${routes.join(", ")}`
      : "Road closure";
    return { title, summary: title, affectedLines: routes, severity: "severe" };
  }
  // Traffic disruption: info-gangguan-trafik-laluan-<routes...>
  if (base.startsWith("info-gangguan-trafik-laluan-")) {
    const routes = extractRoutes(tokens);
    const title = routes.length
      ? `Traffic disruption — routes ${routes.join(", ")}`
      : "Traffic disruption";
    return {
      title,
      summary: title,
      affectedLines: routes,
      severity: "warning",
    };
  }
  // Bus delay: kelewatan-bas-<n>-laluan-terjejas
  if (/^kelewatan-bas-\d+-laluan-terjejas$/.test(base)) {
    const n = tokens[tokens.indexOf("bas") + 1];
    const title = `Bus delay — ${n} route(s) affected`;
    return { title, summary: title, affectedLines: [], severity: "warning" };
  }
  // Train delay: kelewatan-tren-laluan-<line>
  if (base.startsWith("kelewatan-tren-laluan-")) {
    const line = lineName(tokens.slice(tokens.indexOf("laluan") + 1).join(" "));
    const title = line ? `Train delay — ${line} line` : "Train delay";
    return {
      title,
      summary: title,
      affectedLines: line ? [line] : [],
      severity: "warning",
    };
  }
  // Service restored: perkhidmatan-pulih-laluan-<line>
  if (base.startsWith("perkhidmatan-pulih-laluan-")) {
    const line = lineName(tokens.slice(tokens.indexOf("laluan") + 1).join(" "));
    const title = line ? `Service restored — ${line} line` : "Service restored";
    return {
      title,
      summary: title,
      affectedLines: line ? [line] : [],
      severity: "info",
    };
  }
  // Frequency update: kemas-kini-kekerapan-laluan-<line>
  if (base.startsWith("kemas-kini-kekerapan-laluan-")) {
    const line = lineName(tokens.slice(tokens.indexOf("laluan") + 1).join(" "));
    const title = line ? `Frequency update — ${line} line` : "Frequency update";
    return {
      title,
      summary: title,
      affectedLines: line ? [line] : [],
      severity: "info",
    };
  }
  // Line update: kemas-kini-laluan-<line>
  if (base.startsWith("kemas-kini-laluan-")) {
    const line = lineName(tokens.slice(tokens.indexOf("laluan") + 1).join(" "));
    const title = line ? `Line update — ${line} line` : "Line update";
    return {
      title,
      summary: title,
      affectedLines: line ? [line] : [],
      severity: "info",
    };
  }

  return null;
}

/** Extract trailing route numbers following the `laluan` token. */
function extractRoutes(tokens: string[]): string[] {
  const idx = tokens.indexOf("laluan");
  if (idx === -1) return [];
  return tokens.slice(idx + 1).filter(Boolean);
}

/** Title-case a hyphen-joined line name (e.g. "ampang sri petaling" -> "Ampang Sri Petaling"). */
function lineName(raw: string): string | null {
  if (!raw) return null;
  return raw
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Normalize a lastmod value to a UTC ISO string; null if unparseable. */
function normalizeDate(lastmod: string): string | null {
  const d = new Date(lastmod);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}
