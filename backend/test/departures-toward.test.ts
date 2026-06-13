import { describe, it, expect } from 'vitest';
import { getDeparturesTowardDestination } from '../src/departures-toward';
import { Stop, Route, Trip, TripStopEntry, CalendarEntry } from '../src/types';

const stops: Stop[] = [
  { id: 'current', name: 'Current Stop', lat: 3.0, lon: 101.0, type: 'rail', parentStation: '' },
  { id: 'dest', name: 'Destination Stop', lat: 3.1, lon: 101.1, type: 'rail', parentStation: '' },
];

const routes: Route[] = [
  { id: 'r1', shortName: 'Line A', longName: 'Line A Long', type: 1 },
];

// t1: current -> dest (heads toward destination)
// t2: dest -> current (goes away from destination)
// t3: current only, never reaches dest
const trips: Trip[] = [
  { id: 't1', routeId: 'r1', serviceId: 'wk', headsign: 'Toward Dest', directionId: 0 },
  { id: 't2', routeId: 'r1', serviceId: 'wk', headsign: 'Away From Dest', directionId: 1 },
  { id: 't3', routeId: 'r1', serviceId: 'wk', headsign: 'Short Trip', directionId: 0 },
];

const tripStops: Record<string, TripStopEntry[]> = {
  t1: [
    { stopId: 'current', stopName: 'Current Stop', lat: 3.0, lon: 101.0, arrivalTime: '08:30:00', departureTime: '08:30:30', sequence: 1 },
    { stopId: 'dest', stopName: 'Destination Stop', lat: 3.1, lon: 101.1, arrivalTime: '08:40:00', departureTime: '08:40:30', sequence: 2 },
  ],
  t2: [
    { stopId: 'dest', stopName: 'Destination Stop', lat: 3.1, lon: 101.1, arrivalTime: '08:32:00', departureTime: '08:32:30', sequence: 1 },
    { stopId: 'current', stopName: 'Current Stop', lat: 3.0, lon: 101.0, arrivalTime: '08:42:00', departureTime: '08:42:30', sequence: 2 },
  ],
  t3: [
    { stopId: 'current', stopName: 'Current Stop', lat: 3.0, lon: 101.0, arrivalTime: '08:34:00', departureTime: '08:34:30', sequence: 1 },
    { stopId: 'other', stopName: 'Other Stop', lat: 3.2, lon: 101.2, arrivalTime: '08:44:00', departureTime: '08:44:30', sequence: 2 },
  ],
};

const calendar: CalendarEntry[] = [
  { serviceId: 'wk', days: [true, true, true, true, true, true, true], startDate: '20260101', endDate: '20261231' },
];

describe('getDeparturesTowardDestination', () => {
  it('only includes trips that reach the destination after the current stop', () => {
    const result = getDeparturesTowardDestination('current', 'dest', stops, routes, trips, tripStops, calendar);
    expect(result.stopName).toBe('Current Stop');
    expect(result.departures.length).toBe(1);
    expect(result.departures[0].destination).toBe('Toward Dest');
  });

  it('excludes trips going the opposite direction', () => {
    const result = getDeparturesTowardDestination('current', 'dest', stops, routes, trips, tripStops, calendar);
    // t2 visits dest BEFORE current, so it must be excluded.
    expect(result.departures.find(d => d.destination === 'Away From Dest')).toBeUndefined();
  });

  it('excludes trips that never reach the destination', () => {
    const result = getDeparturesTowardDestination('current', 'dest', stops, routes, trips, tripStops, calendar);
    expect(result.departures.find(d => d.destination === 'Short Trip')).toBeUndefined();
  });

  it('respects the limit parameter', () => {
    // Add a second toward-destination trip to exercise the limit.
    const extraTrips: Trip[] = [
      ...trips,
      { id: 't4', routeId: 'r1', serviceId: 'wk', headsign: 'Also Toward', directionId: 0 },
    ];
    const extraTripStops = {
      ...tripStops,
      t4: [
        { stopId: 'current', stopName: 'Current Stop', lat: 3.0, lon: 101.0, arrivalTime: '08:50:00', departureTime: '08:50:30', sequence: 1 },
        { stopId: 'dest', stopName: 'Destination Stop', lat: 3.1, lon: 101.1, arrivalTime: '09:00:00', departureTime: '09:00:30', sequence: 2 },
      ],
    };
    const result = getDeparturesTowardDestination('current', 'dest', stops, routes, extraTrips, extraTripStops, calendar, 1);
    expect(result.departures.length).toBe(1);
  });

  it('returns sorted by departure time', () => {
    const result = getDeparturesTowardDestination('current', 'dest', stops, routes, trips, tripStops, calendar);
    expect(result.departures.length).toBe(1);
    // Single result; verify it is the earliest toward-dest departure.
    expect(result.departures[0].departureTime).toBe('08:30:30');
  });

  it('throws for unknown stop', () => {
    expect(() => getDeparturesTowardDestination('unknown', 'dest', stops, routes, trips, tripStops, calendar)).toThrow();
  });
});
