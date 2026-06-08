import { describe, it, expect, vi } from 'vitest';
import worker from '../src/index';

vi.mock('../src/rail-ingest', () => ({
  ingestRailTimetables: vi.fn()
}));

describe('Worker Scheduled Event', () => {
  it('handles errors during weekly rail timetable ingest', async () => {
    const mockEnv = {} as any;
    const mockCtx = {} as any;
    const mockEvent = { cron: '0 2 * * 1' } as any;

    const { ingestRailTimetables } = await import('../src/rail-ingest');
    const mockError = new Error('Test ingestion failed');
    vi.mocked(ingestRailTimetables).mockRejectedValueOnce(mockError);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await worker.scheduled(mockEvent, mockEnv, mockCtx);

    expect(ingestRailTimetables).toHaveBeenCalledWith(mockEnv);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to ingest rail timetables:', mockError);

    consoleSpy.mockRestore();
  });
});
