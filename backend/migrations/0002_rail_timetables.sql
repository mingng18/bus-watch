-- Rail static timetables schema
-- Stores the rapid-rail-kl GTFS static schedule.
-- All IDs are GTFS string IDs (not integers).

CREATE TABLE rail_stops (
  stop_id   TEXT PRIMARY KEY,
  stop_name TEXT NOT NULL,
  lat       REAL NOT NULL,
  lon       REAL NOT NULL
);

CREATE TABLE rail_routes (
  route_id         TEXT PRIMARY KEY,
  route_short_name TEXT NOT NULL,
  route_long_name  TEXT NOT NULL
);

CREATE TABLE rail_trips (
  trip_id    TEXT PRIMARY KEY,
  route_id   TEXT NOT NULL,
  service_id TEXT NOT NULL,
  headsign   TEXT NOT NULL,
  direction  INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_rail_trips_route ON rail_trips(route_id);

CREATE TABLE rail_stop_times (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  trip_id      TEXT NOT NULL,
  stop_id      TEXT NOT NULL,
  stop_seq     INTEGER NOT NULL,
  arrival_time TEXT NOT NULL   -- HH:MM:SS (may exceed 24h for GTFS overnight)
);
CREATE INDEX idx_rst_stop ON rail_stop_times(stop_id);
CREATE INDEX idx_rst_trip ON rail_stop_times(trip_id);
CREATE UNIQUE INDEX idx_rst_unique ON rail_stop_times(trip_id, stop_id);

-- Metadata: tracks last successful ingestion
CREATE TABLE rail_ingest_meta (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
