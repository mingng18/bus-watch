-- backend/migrations/0005_bus_positions_timestamp_index.sql
CREATE INDEX idx_bus_positions_timestamp ON bus_positions(timestamp);
