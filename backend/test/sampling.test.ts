import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sampleBusPositions, aggregateTravelTimes, cleanupOldPositions } from '../src/sampling';
import { Env, VehiclePosition, PrasaranaBus } from '../src/types';

describe('sampling logic', () => {
  let mockAll: any;
  let mockBatch: any;
  let mockRun: any;
  let mockBind: any;
  let mockEnv: Env;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(1700000000000)); // Timestamp: 1700000000

    mockAll = vi.fn().mockResolvedValue({ results: [] });
    mockBatch = vi.fn().mockResolvedValue([{ success: true }]);
    mockRun = vi.fn().mockResolvedValue({ success: true });
    mockBind = vi.fn().mockReturnThis();

    mockEnv = {
      KV: {} as any,
      DB: {
        prepare: vi.fn().mockReturnValue({
          bind: mockBind,
          all: mockAll,
          run: mockRun
        }),
        batch: mockBatch
      } as any
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('sampleBusPositions', () => {
    it('should execute without error with empty arrays', async () => {
      const vehicles: VehiclePosition[] = [];
      const prasaranaBuses: PrasaranaBus[] = [];
      await expect(sampleBusPositions(mockEnv, vehicles, prasaranaBuses)).resolves.not.toThrow();
      expect(mockBatch).not.toHaveBeenCalled();
    });

    it('should insert new GTFS vehicles when no prior positions exist', async () => {
      const vehicles: VehiclePosition[] = [{
        tripId: 't1', routeId: 'r1', lat: 3.14, lon: 101.68, timestamp: 1700000000, currentStopSequence: 1, stopId: 's1'
      }];
      await sampleBusPositions(mockEnv, vehicles, []);

      expect(mockEnv.DB.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO bus_positions'));
      expect(mockBind).toHaveBeenCalledWith('t1', 'r1', 'gtfs', 3.14, 101.68, 1700000000);
      expect(mockBatch).toHaveBeenCalledTimes(1);
    });

    it('should skip GTFS vehicles without tripId or routeId', async () => {
      const vehicles = [{
        tripId: '', routeId: 'r1', lat: 3.14, lon: 101.68, timestamp: 1700000000, currentStopSequence: 1, stopId: 's1'
      }] as VehiclePosition[];
      await sampleBusPositions(mockEnv, vehicles, []);

      expect(mockBind).not.toHaveBeenCalled();
      expect(mockBatch).not.toHaveBeenCalled();
    });

    it('should ignore GTFS vehicles that haven\'t moved much and haven\'t timed out', async () => {
      mockAll.mockResolvedValueOnce({
        results: [{ bus_no: 't1', lat: 3.14, lon: 101.68, ts: 1700000000 }]
      });
      const vehicles: VehiclePosition[] = [{
        tripId: 't1', routeId: 'r1', lat: 3.14, lon: 101.6801, timestamp: 1700000000, currentStopSequence: 1, stopId: 's1'
      }]; // distance is ~11m

      await sampleBusPositions(mockEnv, vehicles, []);
      expect(mockBind).not.toHaveBeenCalled();
      expect(mockBatch).not.toHaveBeenCalled();
    });

    it('should insert GTFS vehicles that have moved > 100m', async () => {
      mockAll.mockResolvedValueOnce({
        results: [{ bus_no: 't1', lat: 3.14, lon: 101.68, ts: 1700000000 }]
      });
      const vehicles: VehiclePosition[] = [{
        tripId: 't1', routeId: 'r1', lat: 3.141, lon: 101.681, timestamp: 1700000000, currentStopSequence: 1, stopId: 's1'
      }]; // distance > 100m

      await sampleBusPositions(mockEnv, vehicles, []);
      expect(mockBatch).toHaveBeenCalledTimes(1);
    });

    it('should insert GTFS vehicles that have timed out (>= 300s)', async () => {
      mockAll.mockResolvedValueOnce({
        results: [{ bus_no: 't1', lat: 3.14, lon: 101.68, ts: 1700000000 - 300 }]
      });
      const vehicles: VehiclePosition[] = [{
        tripId: 't1', routeId: 'r1', lat: 3.14, lon: 101.68, timestamp: 1700000000, currentStopSequence: 1, stopId: 's1'
      }]; // Same location, but timed out

      await sampleBusPositions(mockEnv, vehicles, []);
      expect(mockBatch).toHaveBeenCalledTimes(1);
    });

    it('should insert new Prasarana vehicles when no prior positions exist', async () => {
      const prasaranaBuses: PrasaranaBus[] = [{
        bus_no: 'b1', route: 'r1', latitude: 3.14, longitude: 101.68, speed: 20, dt_gps: '2023-11-15T12:26:40Z',
        dir: null, trip_rev_kind: '', provider: '', captain_id: '', dt_received: ''
      }];
      await sampleBusPositions(mockEnv, [], prasaranaBuses);

      expect(mockEnv.DB.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO bus_positions'));
      // timestamp parsed from dt_gps: 1700051200
      expect(mockBind).toHaveBeenCalledWith('b1', 'r1', 'prasarana', 3.14, 101.68, 20, Math.floor(new Date('2023-11-15T12:26:40Z').getTime() / 1000));
      expect(mockBatch).toHaveBeenCalledTimes(1);
    });

    it('should handle Prasarana vehicles with invalid dt_gps', async () => {
      const prasaranaBuses: PrasaranaBus[] = [{
        bus_no: 'b1', route: 'r1', latitude: 3.14, longitude: 101.68, speed: 20, dt_gps: 'invalid-date',
        dir: null, trip_rev_kind: '', provider: '', captain_id: '', dt_received: ''
      }];
      await sampleBusPositions(mockEnv, [], prasaranaBuses);

      // Fallback to current time (1700000000)
      expect(mockBind).toHaveBeenCalledWith('b1', 'r1', 'prasarana', 3.14, 101.68, 20, 1700000000);
      expect(mockBatch).toHaveBeenCalledTimes(1);
    });

    it('should ignore Prasarana vehicles that haven\'t moved much and haven\'t timed out', async () => {
      mockAll.mockResolvedValueOnce({
        results: [{ bus_no: 'b1', lat: 3.14, lon: 101.68, ts: 1700000000 }]
      });
      const prasaranaBuses: PrasaranaBus[] = [{
        bus_no: 'b1', route: 'r1', latitude: 3.14, longitude: 101.6801, speed: 0, dt_gps: new Date(1700000000000).toISOString(),
        dir: null, trip_rev_kind: '', provider: '', captain_id: '', dt_received: ''
      }];

      await sampleBusPositions(mockEnv, [], prasaranaBuses);
      expect(mockBind).not.toHaveBeenCalled();
      expect(mockBatch).not.toHaveBeenCalled();
    });

    it('should batch inserts in chunks of 100', async () => {
      const vehicles: VehiclePosition[] = Array.from({ length: 250 }, (_, i) => ({
        tripId: `t${i}`, routeId: 'r1', lat: 3.14, lon: 101.68, timestamp: 1700000000, currentStopSequence: 1, stopId: 's1'
      }));

      await sampleBusPositions(mockEnv, vehicles, []);

      expect(mockBatch).toHaveBeenCalledTimes(3); // 100, 100, 50
      expect(mockBatch.mock.calls[0][0].length).toBe(100);
      expect(mockBatch.mock.calls[1][0].length).toBe(100);
      expect(mockBatch.mock.calls[2][0].length).toBe(50);
    });
  });

  describe('aggregateTravelTimes', () => {
    it('aggregateTravelTimes should execute without error', async () => {
      await expect(aggregateTravelTimes(mockEnv)).resolves.not.toThrow();
    });
  });

  describe('cleanupOldPositions', () => {
    it('cleanupOldPositions should call DB prepare', async () => {
      await cleanupOldPositions(mockEnv);
      expect(mockEnv.DB.prepare).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM bus_positions'));
      expect(mockRun).toHaveBeenCalled();
    });
  });
});
