import { describe, it, expect } from 'vitest';
import { transit_realtime } from 'gtfs-realtime-bindings';
import {
  analyzeFeed,
  candidateFeeds,
  translatedText,
} from '../scripts/inspect-feeds';

// Each test builds a GTFS-realtime FeedMessage and encodes it to bytes, exactly
// as the live probe decodes — so the pure analyzeFeed() logic is exercised
// against realistic protobuf payloads without any network.

describe('candidateFeeds', () => {
  it('covers all three entities across both rapid-bus categories', () => {
    const feeds = candidateFeeds();
    const labels = feeds.map((f) => f.label).sort();
    expect(labels).toEqual(
      [
        'alert / rapid-bus-kl',
        'alert / rapid-bus-mrtfeeder',
        'trip-update / rapid-bus-kl',
        'trip-update / rapid-bus-mrtfeeder',
        'vehicle-position / rapid-bus-kl',
        'vehicle-position / rapid-bus-mrtfeeder',
      ].sort(),
    );
  });

  it('builds URLs following the api.data.gov.my pattern', () => {
    for (const f of candidateFeeds()) {
      expect(f.url).toMatch(
        /^https:\/\/api\.data\.gov\.my\/gtfs-realtime\/(vehicle-position|alert|trip-update)\/prasarana\?category=rapid-bus-(kl|mrtfeeder)$/,
      );
    }
  });
});

describe('translatedText', () => {
  it('returns empty string for missing translations', () => {
    expect(translatedText(null)).toBe('');
    expect(translatedText(undefined)).toBe('');
    expect(translatedText({ translation: [] })).toBe('');
  });

  it('joins translation texts', () => {
    const ts = transit_realtime.TranslatedString.create({
      translation: [
        { text: 'Bus full', language: 'en' },
        { text: 'Bas penuh', language: 'ms' },
      ],
    });
    expect(translatedText(ts)).toBe('Bus full | Bas penuh');
  });
});

describe('analyzeFeed — error / empty handling', () => {
  it('reports error status for bytes that are not a valid FeedMessage', () => {
    const report = analyzeFeed(new Uint8Array([0xff, 0xff, 0xff]), 'alert');
    expect(report.status).toBe('error');
    expect(report.rawEntityCount).toBe(0);
    expect(report.error).toBeTruthy();
  });

  it('reports empty status for a feed with no entities', () => {
    const msg = transit_realtime.FeedMessage.create({
      header: { gtfsRealtimeVersion: '2.0', timestamp: 1 },
    });
    const bytes = transit_realtime.FeedMessage.encode(msg).finish();
    const report = analyzeFeed(bytes, 'alert');
    expect(report.status).toBe('empty');
    expect(report.rawEntityCount).toBe(0);
  });
});

describe('analyzeFeed — vehicle-position', () => {
  it('counts occupancy / congestion / percentage population and names distributions', () => {
    // proto3 scalars decode to their default when unset, so the "unpopulated"
    // vehicle explicitly carries the NO_DATA_AVAILABLE / UNKNOWN_CONGESTION
    // sentinels — exactly what a real feed decodes to when the fields are
    // absent. occupation_percentage 0 is treated as not-populated.
    const msg = transit_realtime.FeedMessage.create({
      header: { gtfsRealtimeVersion: '2.0', timestamp: 2 },
      entity: [
        {
          id: 'v1',
          vehicle: {
            trip: { tripId: 't1', routeId: 'r1' },
            position: { latitude: 3.1, longitude: 101.6 },
            occupancyStatus: 1, // MANY_SEATS_AVAILABLE
            congestionLevel: 2, // STOP_AND_GO
            occupancyPercentage: 40,
          },
        },
        {
          id: 'v2',
          vehicle: {
            trip: { tripId: 't2', routeId: 'r2' },
            position: { latitude: 3.2, longitude: 101.7 },
            occupancyStatus: 7, // NO_DATA_AVAILABLE
            congestionLevel: 0, // UNKNOWN_CONGESTION_LEVEL
            occupancyPercentage: 0,
          },
        },
      ],
    });
    const buf = transit_realtime.FeedMessage.encode(msg).finish();
    const report = analyzeFeed(buf, 'vehicle-position');

    expect(report.status).toBe('ok');
    expect(report.rawEntityCount).toBe(2);
    expect(report.vehicle).toBeDefined();
    expect(report.vehicle!.entityCount).toBe(2);
    expect(report.vehicle!.occupancyStatus).toEqual({ total: 2, populated: 1 });
    expect(report.vehicle!.congestionLevel).toEqual({ total: 2, populated: 1 });
    expect(report.vehicle!.occupancyPercentage).toEqual({ total: 2, populated: 1 });
    expect(report.vehicle!.occupancyStatusCounts['MANY_SEATS_AVAILABLE']).toBe(1);
    expect(report.vehicle!.occupancyStatusCounts['NO_DATA_AVAILABLE']).toBe(1);
    expect(report.vehicle!.congestionLevelCounts['STOP_AND_GO']).toBe(1);
    expect(report.vehicle!.congestionLevelCounts['UNKNOWN_CONGESTION_LEVEL']).toBe(1);
  });
});

describe('analyzeFeed — alert', () => {
  it('detects populated header/description/cause/effect/severity/informedEntity', () => {
    // The "minimal" alert carries the UNKNOWN_* sentinels for the enum fields,
    // matching how an unset field decodes over the wire.
    const msg = transit_realtime.FeedMessage.create({
      header: { gtfsRealtimeVersion: '2.0', timestamp: 3 },
      entity: [
        {
          id: 'a1',
          alert: {
            headerText: { translation: [{ text: 'Service disruption' }] },
            descriptionText: { translation: [{ text: 'Delay due to weather' }] },
            cause: 8, // WEATHER
            effect: 3, // SIGNIFICANT_DELAYS
            severityLevel: 3, // WARNING
            informedEntity: [{ routeId: 'r1' }],
          },
        },
        {
          id: 'a2',
          alert: {
            headerText: { translation: [{ text: 'Heads up' }] },
            cause: 1, // UNKNOWN_CAUSE
            effect: 8, // UNKNOWN_EFFECT
            severityLevel: 1, // UNKNOWN_SEVERITY
          },
        },
      ],
    });
    const buf = transit_realtime.FeedMessage.encode(msg).finish();
    const report = analyzeFeed(buf, 'alert');

    expect(report.status).toBe('ok');
    expect(report.alert).toBeDefined();
    const a = report.alert!;
    expect(a.entityCount).toBe(2);
    expect(a.headerText).toEqual({ total: 2, populated: 2 });
    expect(a.descriptionText).toEqual({ total: 2, populated: 1 });
    expect(a.severityLevel).toEqual({ total: 2, populated: 1 });
    expect(a.cause).toEqual({ total: 2, populated: 1 });
    expect(a.effect).toEqual({ total: 2, populated: 1 });
    expect(a.informedEntity).toEqual({ total: 2, populated: 1 });
    expect(a.causeCounts['WEATHER']).toBe(1);
    expect(a.causeCounts['UNKNOWN_CAUSE']).toBe(1);
    expect(a.effectCounts['SIGNIFICANT_DELAYS']).toBe(1);
    expect(a.effectCounts['UNKNOWN_EFFECT']).toBe(1);
    expect(a.severityCounts['WARNING']).toBe(1);
    expect(a.severityCounts['UNKNOWN_SEVERITY']).toBe(1);
    expect(a.sampleHeaders).toEqual(['Service disruption', 'Heads up']);
  });
});

describe('analyzeFeed — trip-update', () => {
  it('counts stop_time_update / delay / timestamp and collects route_ids', () => {
    const msg = transit_realtime.FeedMessage.create({
      header: { gtfsRealtimeVersion: '2.0', timestamp: 4 },
      entity: [
        {
          id: 'tu1',
          tripUpdate: {
            trip: { tripId: 't1', routeId: 'r1' },
            timestamp: 1700000100,
            stopTimeUpdate: [
              { stopId: 's1', arrival: { delay: 120 }, departure: { delay: 120 } },
              { stopId: 's2', arrival: { delay: 60 } },
            ],
          },
        },
        {
          id: 'tu2',
          tripUpdate: {
            trip: { tripId: 't2', routeId: 'r2' },
            // no stop_time_update, no timestamp (timestamp defaults to 0)
          },
        },
      ],
    });
    const buf = transit_realtime.FeedMessage.encode(msg).finish();
    const report = analyzeFeed(buf, 'trip-update');

    expect(report.status).toBe('ok');
    expect(report.tripUpdate).toBeDefined();
    const t = report.tripUpdate!;
    expect(t.entityCount).toBe(2);
    expect(t.withStopTimeUpdate).toEqual({ total: 2, populated: 1 });
    expect(t.withDelay).toEqual({ total: 2, populated: 1 });
    expect(t.withTimestamp).toEqual({ total: 2, populated: 1 });
    expect(t.sampleRouteIds).toEqual(['r1', 'r2']);
  });
});
