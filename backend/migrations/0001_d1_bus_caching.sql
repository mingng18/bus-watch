-- backend/migrations/0001_d1_bus_caching.sql
CREATE TABLE bus_positions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bus_no TEXT NOT NULL,
  route TEXT NOT NULL,
  source TEXT NOT NULL,
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  speed REAL,
  timestamp INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX idx_positions_bus_route ON bus_positions(bus_no, route, timestamp);

CREATE TABLE travel_times (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  route TEXT NOT NULL,
  from_stop_id TEXT NOT NULL,
  to_stop_id TEXT NOT NULL,
  from_lat REAL NOT NULL,
  from_lon REAL NOT NULL,
  to_lat REAL NOT NULL,
  to_lon REAL NOT NULL,
  avg_seconds INTEGER NOT NULL,
  sample_count INTEGER NOT NULL DEFAULT 1,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX idx_travel_unique ON travel_times(route, from_stop_id, to_stop_id);
