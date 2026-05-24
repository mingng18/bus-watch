import { describe, it, expect, vi } from 'vitest';
import { sampleBusPositions, aggregateTravelTimes, cleanupOldPositions } from '../src/sampling';
import { Env, VehiclePosition, PrasaranaBus } from '../src/types';

describe('sampling logic', () => {
  const mockEnv: Env = {
    KV: {} as any,
    DB: {
      prepare: vi.fn().mockReturnValue({
        bind: vi.fn().mockReturnThis(),
        all: vi.fn().mockResolvedValue({ results: [] }),
        run: vi.fn().mockResolvedValue({ success: true })
      })
    } as any
  };

  it('sampleBusPositions should execute without error', async () => {
    const vehicles: VehiclePosition[] = [];
    const prasaranaBuses: PrasaranaBus[] = [];
    await expect(sampleBusPositions(mockEnv, vehicles, prasaranaBuses)).resolves.not.toThrow();
  });

  it('aggregateTravelTimes should execute without error', async () => {
    await expect(aggregateTravelTimes(mockEnv)).resolves.not.toThrow();
  });

  it('cleanupOldPositions should call DB prepare', async () => {
    await cleanupOldPositions(mockEnv);
    expect(mockEnv.DB.prepare).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM bus_positions'));
  });
});
