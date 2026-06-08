import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchAndParseAgency, getActiveServiceIds } from '../src/gtfs-static';
import { zipSync, strToU8 } from 'fflate';

describe('gtfs-static', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('fetchAndParseAgency', () => {
    it('throws on unknown agency', async () => {
      await expect(fetchAndParseAgency('unknown')).rejects.toThrow('Unknown agency: unknown');
    });

    it('throws if fetch fails', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }));

      await expect(fetchAndParseAgency('rapid-bus-kl')).rejects.toThrow('Failed to fetch rapid-bus-kl: 404');
    });

    it('successfully parses valid zip buffer', async () => {
      const files = {
        'stops.txt': strToU8('stop_id,stop_name,stop_lat,stop_lon,parent_station\nS1,Stop 1,1.0,1.0,\nS2,Child Stop,1.0,1.0,S1\n'),
        'routes.txt': strToU8('route_id,route_short_name,route_long_name,route_type\nR1,R1,Route 1,3\n'),
        'trips.txt': strToU8('trip_id,route_id,service_id,trip_headsign,direction_id\nT1,R1,SV1,Dest,0\n'),
        'stop_times.txt': strToU8('trip_id,stop_id,arrival_time,departure_time,stop_sequence\nT1,S1,08:00:00,08:00:00,1\nT1,S2,08:10:00,08:10:00,2\n'),
        'calendar.txt': strToU8('service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date\nSV1,1,1,1,1,1,0,0,20230101,20231231\n'),
      };

      const zipped = zipSync(files);

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: async () => zipped.buffer,
      }));

      const data = await fetchAndParseAgency('rapid-bus-kl');

      expect(data.stops).toHaveLength(2);
      expect(data.stops[0]).toEqual({ id: 'S1', name: 'Stop 1', lat: 1.0, lon: 1.0, type: 'bus', parentStation: '' });
      expect(data.stops[1]).toEqual({ id: 'S2', name: 'Child Stop', lat: 1.0, lon: 1.0, type: 'bus', parentStation: 'S1' });

      expect(data.routes).toHaveLength(1);
      expect(data.routes[0]).toEqual({ id: 'R1', shortName: 'R1', longName: 'Route 1', type: 3 });

      expect(data.trips).toHaveLength(1);
      expect(data.trips[0]).toEqual({ id: 'T1', routeId: 'R1', serviceId: 'SV1', headsign: 'Dest', directionId: 0, shapeId: '' });

      expect(Object.keys(data.tripStops)).toHaveLength(1);
      expect(data.tripStops['T1']).toHaveLength(2);

      expect(data.calendar).toHaveLength(1);
      expect(data.calendar[0].serviceId).toBe('SV1');
    });
  });

  describe('getActiveServiceIds', () => {
    it('returns correct active services for a given date', () => {
      const calendar = [
        {
          serviceId: 'SV1',
          days: [false, true, true, true, true, true, false], // Mon-Fri
          startDate: '20230101',
          endDate: '20231231',
        },
      ];

      // Sunday, Jan 1, 2023
      const sunday = new Date('2023-01-01T12:00:00Z');
      expect(getActiveServiceIds(calendar, sunday)).toEqual(new Set());

      // Monday, Jan 2, 2023
      const monday = new Date('2023-01-02T12:00:00Z');
      expect(getActiveServiceIds(calendar, monday)).toEqual(new Set(['SV1']));
    });
  });
});
