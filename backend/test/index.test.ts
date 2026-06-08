import { describe, it, expect, vi, beforeEach } from 'vitest';
import worker from '../src/index';

vi.mock('../src/sampling', () => ({
  sampleBusPositions: vi.fn().mockRejectedValue(new Error('Mocked sampling error')),
  aggregateTravelTimes: vi.fn(),
  cleanupOldPositions: vi.fn(),
}));

vi.mock('../src/gtfs-realtime', () => ({
  fetchVehiclePositions: vi.fn()
}));

vi.mock('../src/prasarana-socketio', () => ({
  fetchPrasaranaBuses: vi.fn()
}));

vi.mock('../src/rail-ingest', () => ({
  ingestRailTimetables: vi.fn()
}));

vi.mock('../src/gtfs-static', () => ({
  fetchAndParseAgency: vi.fn()
}));

describe('index.ts scheduled tasks', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('handles errors gracefully in sampling and aggregation tasks', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const mockEnv = {
      KV: {
        get: vi.fn(),
        put: vi.fn()
      },
      DB: {}
    } as any;

    const mockEvent = { cron: '*/5 * * * *' } as any;
    const mockCtx = {} as any;

    if (worker.scheduled) {
      await worker.scheduled(mockEvent, mockEnv, mockCtx);
    }

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to run sampling and aggregation tasks:',
      expect.any(Error)
    );
  });
});
