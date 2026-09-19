import { describe, it, expect } from 'vitest';
import { haversineDistance, getBoundingBox } from '../src/haversine';

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

describe('getBoundingBox', () => {
  it('calculates bounding box correctly at the equator', () => {
    const bbox = getBoundingBox(0, 0, 1000);
    expect(bbox.minLat).toBeCloseTo(-0.009009, 5);
    expect(bbox.maxLat).toBeCloseTo(0.009009, 5);
    expect(bbox.minLon).toBeCloseTo(-0.009009, 5);
    expect(bbox.maxLon).toBeCloseTo(0.009009, 5);
  });

  it('calculates bounding box correctly at non-equator latitudes', () => {
    const bbox = getBoundingBox(60, 0, 1000);
    expect(bbox.minLat).toBeCloseTo(59.99099, 4);
    expect(bbox.maxLat).toBeCloseTo(60.009009, 4);
    expect(bbox.minLon).toBeCloseTo(-0.018018, 4);
    expect(bbox.maxLon).toBeCloseTo(0.018018, 4);
  });

  it('clamps cosine at extreme latitudes to prevent division by zero', () => {
    const bbox = getBoundingBox(90, 0, 1000);
    expect(bbox.minLat).toBeCloseTo(89.99099, 4);
    expect(bbox.maxLat).toBeCloseTo(90.009009, 4);
    expect(bbox.minLon).toBeCloseTo(-90.09009, 4);
    expect(bbox.maxLon).toBeCloseTo(90.09009, 4);
  });
});