import { describe, it, expect } from 'vitest';
import { haversineDistance } from '../src/haversine';

describe('haversineDistance', () => {
  it('returns 0 for same point', () => {
    expect(haversineDistance(3.139, 101.6869, 3.139, 101.6869)).toBe(0);
  });

  it('computes distance between KL and Petaling Jaya (~15km)', () => {
    const d = haversineDistance(3.139, 101.6869, 3.1073, 101.6067);
    expect(d).toBeGreaterThan(8000);
    expect(d).toBeLessThan(12000);
  });

  it('returns meters (not kilometers)', () => {
    const d = haversineDistance(0, 0, 0, 1);
    expect(d).toBeGreaterThan(100000);
  });
});