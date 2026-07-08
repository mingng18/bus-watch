import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchVehiclePositions } from '../src/gtfs-realtime';
import { transit_realtime } from 'gtfs-realtime-bindings';

describe('gtfs-realtime', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns empty array for invalid agency', async () => {
    const result = await fetchVehiclePositions('invalid-agency');
    expect(result).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('handles fetch error', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const result = await fetchVehiclePositions('rapid-bus-kl');
    expect(result).toEqual([]);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl',
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
    expect(console.error).toHaveBeenCalled();
  });

  it('handles non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);

    const result = await fetchVehiclePositions('rapid-bus-kl');
    expect(result).toEqual([]);
  });

  it('decodes valid response', async () => {
    // We need to create a valid protobuf payload
    const mockFeedMessage = {
      header: {
        gtfsRealtimeVersion: '2.0',
      },
      entity: [
        {
          id: '1',
          vehicle: {
            trip: { tripId: 't1', routeId: 'r1' },
            position: { latitude: 3.14, longitude: 101.68 },
            currentStopSequence: 5,
            timestamp: 1620000000,
            stopId: 's1'
          }
        },
        {
          id: '2',
          vehicle: {
            // Missing tripId or 0,0 coords should be skipped
            trip: { routeId: 'r2' },
            position: { latitude: 0, longitude: 0 }
          }
        }
      ]
    };

    const buffer = transit_realtime.FeedMessage.encode(mockFeedMessage).finish();
    // Using slice to get an ArrayBuffer from Uint8Array
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(arrayBuffer)
    } as Response);

    const result = await fetchVehiclePositions('rapid-bus-kl');

    expect(result).toHaveLength(1);
    // Use toBeCloseTo for floats as Protobuf serialization changes exact values slightly
    expect(result[0].lat).toBeCloseTo(3.14, 2);
    expect(result[0].lon).toBeCloseTo(101.68, 2);
    expect(result[0]).toMatchObject({
      tripId: 't1',
      routeId: 'r1',
      currentStopSequence: 5,
      timestamp: 1620000000,
      stopId: 's1'
    });
  });
});
