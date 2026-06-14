-- backend/migrations/0004_travel_times_buckets.sql
-- Issue #133: aggregate travel times needs to bucket by day-of-week and
-- time-of-day so a Tuesday-morning crawl isn't averaged with a Saturday-night
-- empty-road sprint. The original 0001 table only keyed on
-- (route, from_stop_id, to_stop_id), so it could only hold one global average
-- per stop pair. Add the two bucketing columns and widen the unique index.
--
-- day_of_week: JS day index (0=Sun..6=Sat) in KL-local time (see time-kl.ts).
-- time_bucket: KL-local hour (0..23) the from-stop passage occurred in.
-- spread_seconds: mean absolute deviation of the samples (robust spread signal
--   for the ETA confidence window — cheaper + more interpretable than variance).

ALTER TABLE travel_times ADD COLUMN day_of_week INTEGER NOT NULL DEFAULT 0;
ALTER TABLE travel_times ADD COLUMN time_bucket INTEGER NOT NULL DEFAULT 0;
ALTER TABLE travel_times ADD COLUMN spread_seconds INTEGER NOT NULL DEFAULT 0;

-- Drop the old unique index (route, from_stop_id, to_stop_id) and replace it
-- with one that includes the bucketing columns. SQLite can't ALTER an index in
-- place, so DROP + CREATE.
DROP INDEX IF EXISTS idx_travel_unique;
CREATE UNIQUE INDEX idx_travel_unique
  ON travel_times(route, from_stop_id, to_stop_id, day_of_week, time_bucket);
