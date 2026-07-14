import { describe, it, expect } from 'vitest';
import { fetchPrasaranaBuses } from '../src/prasarana-socketio';

describe('fetchPrasaranaBuses', () => {
  it('returns an empty array', async () => {
    const result = await fetchPrasaranaBuses('PULSE');
    expect(result).toEqual([]);
  });
});
