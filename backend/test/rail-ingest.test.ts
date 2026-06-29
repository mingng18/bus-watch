import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ingestRailTimetables } from '../src/rail-ingest';
import { zipSync, strToU8 } from 'fflate';

describe('ingestRailTimetables', () => {
  let mockEnv: any;
  let mockDb: any;
  let mockStmt: any;

  beforeEach(() => {
    mockStmt = {
      bind: vi.fn().mockReturnThis(),
      run: vi.fn().mockResolvedValue({ success: true }),
      all: vi.fn().mockResolvedValue({ results: [], success: true }),
    };
    mockDb = {
      prepare: vi.fn().mockReturnValue(mockStmt),
      batch: vi.fn().mockResolvedValue([{ success: true }]),
    };
    mockEnv = { DB: mockDb };
    global.fetch = vi.fn();
  });

  it('should fetch GTFS zip, parse and ingest into D1', async () => {
    const mockZip = zipSync({
      'stops.txt': strToU8('stop_id,stop_name,stop_lat,stop_lon\nS1,Stop 1,3.14,101.68\nS2,Stop 2,3.15,101.69'),
      'routes.txt': strToU8('route_id,route_short_name,route_long_name,route_type\nR1,R1Short,R1Long,1\nR2,R2Short,R2Long,3'), // R1 is rail (1), R2 is bus (3)
      'trips.txt': strToU8('route_id,service_id,trip_id,trip_headsign,direction_id\nR1,Svc1,T1,H1,0\nR2,Svc1,T2,H2,0'),
      'stop_times.txt': strToU8('trip_id,arrival_time,departure_time,stop_id,stop_sequence\nT1,10:00:00,10:01:00,S1,1\nT1,10:05:00,10:06:00,S2,2\nT2,11:00:00,11:01:00,S1,1')
    });

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      arrayBuffer: vi.fn().mockResolvedValue(mockZip.buffer)
    } as any);

    const result = await ingestRailTimetables(mockEnv);

    // Assert fetch was called
    expect(global.fetch).toHaveBeenCalledWith('https://api.data.gov.my/gtfs-static/prasarana?category=rapid-rail-kl', expect.objectContaining({ signal: expect.any(AbortSignal) }));

    // stops: S1, S2 (2 stmts)
    // routes: R1 (1 stmt)
    // trips: T1 (1 stmt)
    // stop_times: T1-S1, T1-S2 (2 stmts)
    // Total inserted: 2 + 1 + 1 + 2 = 6
    expect(result.inserted).toBe(6);

    // Verify DB batch was called correctly
    expect(mockDb.batch).toHaveBeenCalled();

    // Verify metadata insert
    expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO rail_ingest_meta'));

    // Additional specific verifications
    // Check that we filter out bus routes (R2) and their trips/stops
    // Verify bindings for stops
    expect(mockStmt.bind).toHaveBeenCalledWith('S1', 'Stop 1', 3.14, 101.68);
    expect(mockStmt.bind).toHaveBeenCalledWith('S2', 'Stop 2', 3.15, 101.69);

    // Verify bindings for routes
    expect(mockStmt.bind).toHaveBeenCalledWith('R1', 'R1Short', 'R1Long');
    // Ensure R2 wasn't bound
    expect(mockStmt.bind).not.toHaveBeenCalledWith('R2', 'R2Short', 'R2Long');

    // Verify bindings for trips
    expect(mockStmt.bind).toHaveBeenCalledWith('T1', 'R1', 'Svc1', 'H1', 0);
    // Ensure T2 wasn't bound
    expect(mockStmt.bind).not.toHaveBeenCalledWith('T2', 'R2', 'Svc1', 'H2', 0);

    // Verify bindings for stop_times
    expect(mockStmt.bind).toHaveBeenCalledWith('T1', 'S1', 1, '10:00:00', '10:01:00');
    expect(mockStmt.bind).toHaveBeenCalledWith('T1', 'S2', 2, '10:05:00', '10:06:00');
  });

  it('should throw if fetch fails', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 404
    } as any);

    await expect(ingestRailTimetables(mockEnv)).rejects.toThrow('GTFS fetch failed: 404');
  });

  it('should handle optional fields and fallback values', async () => {
    const mockZip = zipSync({
      'stops.txt': strToU8('stop_id,stop_name,stop_lat,stop_lon\nS1,Stop 1,3.14,101.68'),
      'routes.txt': strToU8('route_id,route_short_name,route_long_name,route_type\nR1,,,1'),
      'trips.txt': strToU8('route_id,service_id,trip_id,trip_headsign,direction_id\nR1,Svc1,T1,,\nR1,Svc1,T2,,invalid_dir'),
      'stop_times.txt': strToU8('trip_id,arrival_time,departure_time,stop_id,stop_sequence\nT1,10:00:00,,S1,1')
    });

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      arrayBuffer: vi.fn().mockResolvedValue(mockZip.buffer)
    } as any);

    const result = await ingestRailTimetables(mockEnv);

    expect(result.inserted).toBe(5); // 1 stop + 1 route + 2 trips + 1 stop_time

    // Empty route names fallback to ''
    expect(mockStmt.bind).toHaveBeenCalledWith('R1', '', '');

    // Empty headsign fallbacks to '', direction_id fallbacks to 0
    expect(mockStmt.bind).toHaveBeenCalledWith('T1', 'R1', 'Svc1', '', 0);
    expect(mockStmt.bind).toHaveBeenCalledWith('T2', 'R1', 'Svc1', '', 0);

    // Empty departure_time fallbacks to arrival_time
    expect(mockStmt.bind).toHaveBeenCalledWith('T1', 'S1', 1, '10:00:00', '10:00:00');
  });
});
