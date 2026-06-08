import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchAndParseAgency } from '../src/gtfs-static';

describe('fetchAndParseAgency', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('throws error for unknown agency', async () => {
    await expect(fetchAndParseAgency('unknown-agency')).rejects.toThrow(
      'Unknown agency: unknown-agency',
    );
  });

  it('throws error on GTFS fetch failure', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(fetchAndParseAgency('rapid-bus-kl')).rejects.toThrow(
      'Failed to fetch rapid-bus-kl: 500',
    );
  });
});
