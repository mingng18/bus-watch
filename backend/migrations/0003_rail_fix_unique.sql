-- Fix unique index on rail_stop_times: use (trip_id, stop_seq) not (trip_id, stop_id)
-- GTFS loop routes can visit the same stop_id twice within a single trip.
DROP INDEX IF EXISTS idx_rst_unique;
CREATE UNIQUE INDEX idx_rst_unique ON rail_stop_times(trip_id, stop_seq);

-- Add departure_time column (GTFS stop_times has both arrival and departure)
ALTER TABLE rail_stop_times ADD COLUMN departure_time TEXT NOT NULL DEFAULT '';
