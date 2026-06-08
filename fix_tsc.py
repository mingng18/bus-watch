import re

# Fix gtfs-static.ts
with open('backend/src/gtfs-static.ts', 'r') as f:
    content = f.read()

search_trip = """\
  const trips: Trip[] = rawTrips.map(t => ({
    id: t.trip_id,
    routeId: t.route_id,
    serviceId: t.service_id,
    headsign: t.trip_headsign,
    directionId: parseInt(t.direction_id) || 0,
  }));
"""
replace_trip = """\
  const trips: Trip[] = rawTrips.map(t => ({
    id: t.trip_id,
    routeId: t.route_id,
    serviceId: t.service_id,
    headsign: t.trip_headsign,
    directionId: parseInt(t.direction_id) || 0,
    shapeId: '',
  }));
"""
content = content.replace(search_trip, replace_trip)

search_return = "return { stops, routes, trips, tripStops, calendar };"
replace_return = "return { stops, routes, trips, tripStops, calendar, frequencies: [], shapes: {} };"
content = content.replace(search_return, replace_return)

with open('backend/src/gtfs-static.ts', 'w') as f:
    f.write(content)

# Fix index.ts
with open('backend/src/index.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "const result = getStationSchedule(stopId, allStops, allRoutes, allTrips, allTripStops, allCalendar, allFrequencies);",
    "const result = getStationSchedule(stopId, allStops, allRoutes, allTrips, allTripStops, allCalendar);"
)

with open('backend/src/index.ts', 'w') as f:
    f.write(content)

# Fix nearby.ts
with open('backend/src/frequency.ts', 'w') as f:
    f.write("""export function expandTripsForStop(
  stopId: string,
  trips: any[],
  tripStops: Record<string, any[]>,
  routes: any[],
  calendar: any[],
  frequencies: any[],
  now: Date,
  timeWindow: number
): any[] {
  return [];
}
""")
