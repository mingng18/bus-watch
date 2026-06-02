import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getActiveServiceIds, fetchAndParseAgency } from '../src/gtfs-static';
import { CalendarEntry } from '../src/types';
import * as fflate from 'fflate';

vi.mock('fflate', () => ({
  unzipSync: vi.fn()
}));

describe('getActiveServiceIds', () => {
  it('returns active service IDs for a given date', () => {
    const calendar: CalendarEntry[] = [
      {
        serviceId: 's1',
        startDate: '20230101',
        endDate: '20231231',
        days: [false, true, true, true, true, true, false], // Mon-Fri
      },
      {
        serviceId: 's2',
        startDate: '20230101',
        endDate: '20231231',
        days: [true, false, false, false, false, false, true], // Sat-Sun
      }
    ];

    // 2023-05-17 is a Wednesday (day 3)
    const wednesday = new Date('2023-05-17T12:00:00Z');
    const activeWed = getActiveServiceIds(calendar, wednesday);
    expect(activeWed.has('s1')).toBe(true);
    expect(activeWed.has('s2')).toBe(false);

    // 2023-05-20 is a Saturday (day 6)
    const saturday = new Date('2023-05-20T12:00:00Z');
    const activeSat = getActiveServiceIds(calendar, saturday);
    expect(activeSat.has('s1')).toBe(false);
    expect(activeSat.has('s2')).toBe(true);
  });

  it('respects start and end dates', () => {
    const calendar: CalendarEntry[] = [
      {
        serviceId: 's1',
        startDate: '20230601',
        endDate: '20230630',
        days: [true, true, true, true, true, true, true],
      }
    ];

    const may = new Date('2023-05-31T12:00:00Z');
    expect(getActiveServiceIds(calendar, may).has('s1')).toBe(false);

    const june = new Date('2023-06-15T12:00:00Z');
    expect(getActiveServiceIds(calendar, june).has('s1')).toBe(true);

    const july = new Date('2023-07-01T12:00:00Z');
    expect(getActiveServiceIds(calendar, july).has('s1')).toBe(false);
  });
});

describe('fetchAndParseAgency', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws an error for unknown agency', async () => {
    await expect(fetchAndParseAgency('unknown-agency')).rejects.toThrow('Unknown agency: unknown-agency');
  });

  it('throws an error if fetch fails', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404
    });

    await expect(fetchAndParseAgency('rapid-bus-kl')).rejects.toThrow('Failed to fetch rapid-bus-kl: 404');
  });

  it('fetches and parses agency data correctly', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0))
    });

    const mockUnzipSync = vi.mocked(fflate.unzipSync);
    mockUnzipSync.mockReturnValue({
      'stops.txt': new Uint8Array(new TextEncoder().encode('stop_id,stop_name,stop_lat,stop_lon,location_type,parent_station\ns1,Stop 1,3.1,101.6,,p1\n')),
      'routes.txt': new Uint8Array(new TextEncoder().encode('route_id,route_short_name,route_long_name,route_type\nr1,100,Route 100,3\nr2,MRT,MRT Route,1\n')),
      'trips.txt': new Uint8Array(new TextEncoder().encode('trip_id,route_id,service_id,trip_headsign,direction_id\nt1,r1,s1,Headsign 1,0\nt2,r2,s1,Headsign 2,1\n')),
      'stop_times.txt': new Uint8Array(new TextEncoder().encode('trip_id,arrival_time,departure_time,stop_id,stop_sequence\nt1,08:00:00,08:00:00,s1,1\nt2,09:00:00,09:00:00,s1,1\n')),
      'calendar.txt': new Uint8Array(new TextEncoder().encode('service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date\ns1,1,1,1,1,1,0,0,20230101,20231231\n'))
    });

    const result = await fetchAndParseAgency('rapid-bus-kl');

    expect(global.fetch).toHaveBeenCalledWith('https://api.data.gov.my/gtfs-static/prasarana?category=rapid-bus-kl');

    // Check parsed data
    expect(result.stops.length).toBe(1);
    expect(result.stops[0].id).toBe('s1');
    expect(result.stops[0].type).toBe('rail'); // Because it is served by t2 which is route r2 (type 1 => rail)

    expect(result.routes.length).toBe(2);
    expect(result.routes[0].id).toBe('r1');
    expect(result.routes[0].type).toBe(3);

    expect(result.trips.length).toBe(2);
    expect(result.trips[0].id).toBe('t1');

    expect(result.tripStops['t1'].length).toBe(1);
    expect(result.tripStops['t1'][0].stopId).toBe('s1');

    expect(result.calendar.length).toBe(1);
    expect(result.calendar[0].serviceId).toBe('s1');
  });
});
