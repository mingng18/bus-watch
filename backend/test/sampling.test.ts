import { describe, it, expect } from 'vitest';
import { sampleBusPositions } from '../src/sampling';

describe('sampling logic', () => {
  it('should be defined', () => {
    expect(sampleBusPositions).toBeDefined();
  });
});
