import { describe, it, expect } from 'vitest';
import { searchRailStops, getRailSchedule } from '../src/rail-schedule';

describe('searchRailStops', () => {
  it('searches for rail stops by name case-insensitively', async () => {
    // mock Env
    const env: any = {
      DB: {
        prepare: (query: string) => {
          expect(query).toContain('WHERE LOWER(stop_name) LIKE LOWER(?)');
          return {
            bind: (...args: any[]) => {
              expect(args[0]).toBe('%kL%'); // Check if query binds parameter correctly with wildcards
              return {
                all: async () => ({
                  results: [
                    { stop_id: '1', stop_name: 'KL Sentral', lat: 3.134, lon: 101.686 },
                    { stop_id: '2', stop_name: 'KLCC', lat: 3.158, lon: 101.711 }
                  ]
                })
              };
            }
          };
        }
      }
    };

    const results = await searchRailStops(env, 'kL');
    expect(results).toHaveLength(2);
    expect(results[0].stop_name).toBe('KL Sentral');
    expect(results[1].stop_name).toBe('KLCC');
  });

  it('handles empty results and limits to 20', async () => {
    let capturedQuery = '';
    const env: any = {
      DB: {
        prepare: (query: string) => {
          capturedQuery = query;
          return {
            bind: (...args: any[]) => ({
              all: async () => ({
                results: []
              })
            })
          };
        }
      }
    };

    const results = await searchRailStops(env, 'Unknown');
    expect(capturedQuery).toContain('LIMIT 20');
    expect(results).toHaveLength(0);
  });
});
