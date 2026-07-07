import { describe, it, expect } from 'vitest';
import { timingSafeEqual } from 'hono/utils/buffer';

describe('timingSafeEqual', () => {
  it('should compare strings of different lengths', async () => {
    const isMatch = await timingSafeEqual('abc', 'abcd');
    expect(isMatch).toBe(false);
  });
});
