/**
 * Spike probe (issue #106): inspect Prasarana GTFS-realtime feeds.
 *
 * bus-watch only consumes the vehicle-position feed and discards occupancy /
 * congestion fields, and never fetches Alert or TripUpdate entities. This script
 * probes candidate endpoints under api.data.gov.my's
 *   /gtfs-realtime/<entity>/prasarana?category=<category>
 * pattern and decodes them with `gtfs-realtime-bindings`, reporting which fields
 * actually populate so we can decide whether service-alerts (A1) and crowding
 * (A2) features are viable.
 *
 * Design: the decoding + field-population analysis is a pure, exported function
 * (analyzeFeed) so it can be unit-tested offline. The network fetch + console
 * reporting is a thin CLI runner below. Run with:
 *
 *   npx tsx scripts/inspect-feeds.ts            # probes all candidates
 *   npx tsx scripts/inspect-feeds.ts --sample 5 # limit entities per feed
 *
 * (tsx is a dev-time TypeScript runner; not added as a dependency — install
 * ad hoc with `npm i -D tsx` or run via `node --loader tsx`.)
 */

import { transit_realtime } from 'gtfs-realtime-bindings';

// --- Candidate feed URLs ---------------------------------------------------
// api.data.gov.my follows /gtfs-realtime/<entity>/prasarana?category=<cat>.
// We probe the vehicle-position feeds bus-watch already uses (as a control) and
// the alert / trip-update entity variants that would unlock A1/A2.

export interface FeedCandidate {
  label: string;
  entity: 'vehicle-position' | 'alert' | 'trip-update';
  url: string;
}

const CATEGORIES = ['rapid-bus-kl', 'rapid-bus-mrtfeeder'];

function feedUrl(entity: FeedCandidate['entity'], category: string): string {
  return `https://api.data.gov.my/gtfs-realtime/${entity}/prasarana?category=${category}`;
}

export function candidateFeeds(): FeedCandidate[] {
  const out: FeedCandidate[] = [];
  for (const entity of ['vehicle-position', 'alert', 'trip-update'] as const) {
    for (const category of CATEGORIES) {
      out.push({
        label: `${entity} / ${category}`,
        entity,
        url: feedUrl(entity, category),
      });
    }
  }
  return out;
}

// --- Field-population analysis (pure, testable) ----------------------------

/** Translated text helper: joins translation[].text across languages. */
export function translatedText(ts: transit_realtime.ITranslatedString | null | undefined): string {
  if (!ts || !ts.translation) return '';
  return ts.translation.map((t) => t.text).filter(Boolean).join(' | ');
}

export interface FieldPresence {
  total: number;
  populated: number;
}

export interface VehicleReport {
  entityCount: number;
  occupancyStatus: FieldPresence;
  congestionLevel: FieldPresence;
  occupancyPercentage: FieldPresence;
  occupancyStatusCounts: Record<string, number>;
  congestionLevelCounts: Record<string, number>;
}

export interface AlertReport {
  entityCount: number;
  headerText: FieldPresence;
  descriptionText: FieldPresence;
  ttsHeaderText: FieldPresence;
  ttsDescriptionText: FieldPresence;
  severityLevel: FieldPresence;
  cause: FieldPresence;
  effect: FieldPresence;
  informedEntity: FieldPresence;
  causeCounts: Record<string, number>;
  effectCounts: Record<string, number>;
  severityCounts: Record<string, number>;
  sampleHeaders: string[];
}

export interface TripUpdateReport {
  entityCount: number;
  withStopTimeUpdate: FieldPresence;
  withDelay: FieldPresence;
  withTimestamp: FieldPresence;
  sampleRouteIds: string[];
}

export interface FeedReport {
  entity: FeedCandidate['entity'];
  status: 'ok' | 'empty' | 'error';
  error?: string;
  vehicle?: VehicleReport;
  alert?: AlertReport;
  tripUpdate?: TripUpdateReport;
  rawEntityCount: number;
}

function countField<T>(
  items: T[],
  isPopulated: (item: T) => boolean,
): FieldPresence {
  let populated = 0;
  for (const item of items) if (isPopulated(item)) populated++;
  return { total: items.length, populated };
}

// Enum value -> human-readable name, so distributions read as
// "MANY_SEATS_AVAILABLE: 12" rather than "1: 12".
const OCCUPANCY_STATUS_NAMES: Record<number, string> = {
  0: 'EMPTY', 1: 'MANY_SEATS_AVAILABLE', 2: 'FEW_SEATS_AVAILABLE',
  3: 'STANDING_ROOM_ONLY', 4: 'CRUSHED_STANDING_ROOM_ONLY', 5: 'FULL',
  6: 'NOT_ACCEPTING_PASSENGERS', 7: 'NO_DATA_AVAILABLE', 8: 'NOT_BOARDABLE',
};
const CONGESTION_LEVEL_NAMES: Record<number, string> = {
  0: 'UNKNOWN_CONGESTION_LEVEL', 1: 'RUNNING_SMOOTHLY', 2: 'STOP_AND_GO',
  3: 'CONGESTION', 4: 'SEVERE_CONGESTION',
};
const CAUSE_NAMES: Record<number, string> = {
  1: 'UNKNOWN_CAUSE', 2: 'OTHER_CAUSE', 3: 'TECHNICAL_PROBLEM', 4: 'STRIKE',
  5: 'DEMONSTRATION', 6: 'ACCIDENT', 7: 'HOLIDAY', 8: 'WEATHER', 9: 'MAINTENANCE',
  10: 'CONSTRUCTION', 11: 'POLICE_ACTIVITY', 12: 'MEDICAL_EMERGENCY',
};
const EFFECT_NAMES: Record<number, string> = {
  1: 'NO_SERVICE', 2: 'REDUCED_SERVICE', 3: 'SIGNIFICANT_DELAYS', 4: 'DETOUR',
  5: 'ADDITIONAL_SERVICE', 6: 'MODIFIED_SERVICE', 7: 'OTHER_EFFECT',
  8: 'UNKNOWN_EFFECT', 9: 'STOP_MOVED', 10: 'NO_EFFECT', 11: 'ACCESSIBILITY_ISSUE',
};
const SEVERITY_NAMES: Record<number, string> = {
  1: 'UNKNOWN_SEVERITY', 2: 'INFO', 3: 'WARNING', 4: 'SEVERE',
};

function nameOf(map: Record<number, string>, v: number | null | undefined): string {
  if (v == null) return '(unset)';
  return map[v] ?? String(v);
}

function tally(
  values: (number | null | undefined)[],
  names?: Record<number, string>,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const v of values) {
    const key = names ? nameOf(names, v) : v == null ? '(unset)' : String(v);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

/**
 * Decode a GTFS-realtime FeedMessage and report which fields populate, per
 * entity type. Pure: no network, no I/O — safe to unit-test with a buffer built
 * via transit_realtime.FeedMessage.encode(...).
 */
export function analyzeFeed(
  bytes: Uint8Array,
  entity: FeedCandidate['entity'],
): FeedReport {
  const report: FeedReport = { entity, status: 'ok', rawEntityCount: 0 };

  let feed: transit_realtime.IFeedMessage;
  try {
    feed = transit_realtime.FeedMessage.decode(bytes) as transit_realtime.IFeedMessage;
  } catch (err) {
    report.status = 'error';
    report.error = err instanceof Error ? err.message : String(err);
    return report;
  }

  const entities = (feed.entity || []) as transit_realtime.IFeedEntity[];
  report.rawEntityCount = entities.length;
  if (entities.length === 0) {
    report.status = 'empty';
    return report;
  }

  if (entity === 'vehicle-position') {
    const vehicles = entities
      .map((e) => e.vehicle)
      .filter((v): v is transit_realtime.IVehiclePosition => !!v);
    report.vehicle = {
      entityCount: vehicles.length,
      // proto3 scalars decode to their default when unset, so "populated" must
      // exclude the unknown/no-data sentinel rather than test for null:
      //  - occupancyStatus: NO_DATA_AVAILABLE(7) == not useful; EMPTY(0) is a
      //    legitimate value so we count it as populated.
      //  - congestionLevel: UNKNOWN_CONGESTION_LEVEL(0) == not useful.
      //  - occupancyPercentage: 0 is ambiguous (could be an empty bus or an
      //    unset field); we treat >0 as populated and flag 0 in the caveat.
      occupancyStatus: countField(
        vehicles,
        (v) => (v.occupancyStatus as unknown as number) !== 7,
      ),
      congestionLevel: countField(
        vehicles,
        (v) => (v.congestionLevel as unknown as number) !== 0,
      ),
      occupancyPercentage: countField(
        vehicles,
        (v) => (v.occupancyPercentage as unknown as number) > 0,
      ),
      occupancyStatusCounts: tally(
        vehicles.map((v) => (v.occupancyStatus as unknown as number) ?? null),
        OCCUPANCY_STATUS_NAMES,
      ),
      congestionLevelCounts: tally(
        vehicles.map((v) => (v.congestionLevel as unknown as number) ?? null),
        CONGESTION_LEVEL_NAMES,
      ),
    };
  } else if (entity === 'alert') {
    const alerts = entities
      .map((e) => e.alert)
      .filter((a): a is transit_realtime.IAlert => !!a);
    report.alert = {
      entityCount: alerts.length,
      headerText: countField(alerts, (a) => !!translatedText(a.headerText)),
      descriptionText: countField(alerts, (a) => !!translatedText(a.descriptionText)),
      ttsHeaderText: countField(alerts, (a) => !!translatedText(a.ttsHeaderText)),
      ttsDescriptionText: countField(alerts, (a) => !!translatedText(a.ttsDescriptionText)),
      // severity/cause/effect default to their UNKNOWN_* sentinels when unset;
      // count only values that carry real information.
      severityLevel: countField(
        alerts,
        (a) => (a.severityLevel as unknown as number) !== 1, // UNKNOWN_SEVERITY
      ),
      cause: countField(
        alerts,
        (a) => (a.cause as unknown as number) !== 1, // UNKNOWN_CAUSE
      ),
      effect: countField(
        alerts,
        (a) => (a.effect as unknown as number) !== 8, // UNKNOWN_EFFECT
      ),
      informedEntity: countField(alerts, (a) => !!a.informedEntity && a.informedEntity.length > 0),
      causeCounts: tally(alerts.map((a) => (a.cause as unknown as number) ?? null), CAUSE_NAMES),
      effectCounts: tally(alerts.map((a) => (a.effect as unknown as number) ?? null), EFFECT_NAMES),
      severityCounts: tally(
        alerts.map((a) => (a.severityLevel as unknown as number) ?? null),
        SEVERITY_NAMES,
      ),
      sampleHeaders: alerts
        .slice(0, 5)
        .map((a) => translatedText(a.headerText))
        .filter(Boolean),
    };
  } else {
    // trip-update
    const updates = entities
      .map((e) => e.tripUpdate)
      .filter((t): t is transit_realtime.ITripUpdate => !!t);
    const toNum = (v: unknown): number =>
      typeof v === 'number' ? v : v != null ? Number(v) : 0;
    report.tripUpdate = {
      entityCount: updates.length,
      withStopTimeUpdate: countField(updates, (t) =>
        !!t.stopTimeUpdate && t.stopTimeUpdate.length > 0,
      ),
      // delay 0 == on-time, which is a meaningful value, so presence of an
      // arrival/departure delay field counts as populated.
      withDelay: countField(updates, (t) =>
        (t.stopTimeUpdate || []).some(
          (s) => s.arrival?.delay != null || s.departure?.delay != null,
        ),
      ),
      // timestamp defaults to 0 (epoch) when unset; treat only >0 as populated.
      withTimestamp: countField(updates, (t) => toNum(t.timestamp) > 0),
      sampleRouteIds: Array.from(
        new Set(
          updates
            .map((t) => t.trip?.routeId)
            .filter((r): r is string => !!r),
        ),
      ).slice(0, 10),
    };
  }

  return report;
}

// --- CLI runner (network + reporting) --------------------------------------

function pct(p: FieldPresence): string {
  if (p.total === 0) return '0/0 (0%)';
  return `${p.populated}/${p.total} (${Math.round((p.populated / p.total) * 100)}%)`;
}

function formatReport(c: FeedCandidate, r: FeedReport): string {
  const lines: string[] = [];
  lines.push(`\n=== ${c.label} ===`);
  lines.push(`URL: ${c.url}`);
  lines.push(`status: ${r.status}${r.error ? ` — ${r.error}` : ''}`);
  lines.push(`raw entities: ${r.rawEntityCount}`);

  if (r.vehicle) {
    const v = r.vehicle;
    lines.push(`vehicles decoded: ${v.entityCount}`);
    lines.push(`  occupancyStatus:      ${pct(v.occupancyStatus)}`);
    lines.push(`  congestionLevel:      ${pct(v.congestionLevel)}`);
    lines.push(`  occupancyPercentage:  ${pct(v.occupancyPercentage)}`);
    lines.push(`  occupancyStatus distribution: ${JSON.stringify(v.occupancyStatusCounts)}`);
    lines.push(`  congestionLevel distribution: ${JSON.stringify(v.congestionLevelCounts)}`);
  }
  if (r.alert) {
    const a = r.alert;
    lines.push(`alerts decoded: ${a.entityCount}`);
    lines.push(`  headerText:          ${pct(a.headerText)}`);
    lines.push(`  descriptionText:     ${pct(a.descriptionText)}`);
    lines.push(`  ttsHeaderText:       ${pct(a.ttsHeaderText)}`);
    lines.push(`  ttsDescriptionText:  ${pct(a.ttsDescriptionText)}`);
    lines.push(`  severityLevel:       ${pct(a.severityLevel)}`);
    lines.push(`  cause:               ${pct(a.cause)}`);
    lines.push(`  effect:              ${pct(a.effect)}`);
    lines.push(`  informedEntity:      ${pct(a.informedEntity)}`);
    lines.push(`  cause distribution:      ${JSON.stringify(a.causeCounts)}`);
    lines.push(`  effect distribution:     ${JSON.stringify(a.effectCounts)}`);
    lines.push(`  severity distribution:   ${JSON.stringify(a.severityCounts)}`);
    if (a.sampleHeaders.length) {
      lines.push(`  sample headers:`);
      for (const h of a.sampleHeaders) lines.push(`    - ${h}`);
    }
  }
  if (r.tripUpdate) {
    const t = r.tripUpdate;
    lines.push(`trip updates decoded: ${t.entityCount}`);
    lines.push(`  with stop_time_update: ${pct(t.withStopTimeUpdate)}`);
    lines.push(`  with delay:            ${pct(t.withDelay)}`);
    lines.push(`  with timestamp:        ${pct(t.withTimestamp)}`);
    if (t.sampleRouteIds.length) {
      lines.push(`  sample route_ids: ${t.sampleRouteIds.join(', ')}`);
    }
  }
  return lines.join('\n');
}

async function probe(c: FeedCandidate): Promise<FeedReport> {
  const res = await fetch(c.url);
  if (!res.ok) {
    return { entity: c.entity, status: 'error', error: `HTTP ${res.status}`, rawEntityCount: 0 };
  }
  const bytes = new Uint8Array(await res.arrayBuffer());
  return analyzeFeed(bytes, c.entity);
}

async function main(): Promise<void> {
  const sampleArg = process.argv.find((a) => a.startsWith('--sample'));
  if (sampleArg) console.log(`(note: --sample only truncates display; decoding is whole-feed)`);

  console.log('Probing candidate Prasarana GTFS-realtime feeds...');
  for (const c of candidateFeeds()) {
    try {
      const report = await probe(c);
      console.log(formatReport(c, report));
    } catch (err) {
      console.log(`\n=== ${c.label} ===\nURL: ${c.url}\nstatus: error — ${err}`);
    }
  }
  console.log('\nDone. Findings summary captured in docs/feed-inspection.md.');
}

// Run only when invoked directly as a script (not when imported by tests).
const invokedDirectly =
  typeof process !== 'undefined' && process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (invokedDirectly) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
