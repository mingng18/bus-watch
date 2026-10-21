-- Retention cleanup filters timestamp without a route; the existing
-- (route, timestamp) index cannot efficiently serve that query.
CREATE INDEX idx_bus_positions_timestamp ON bus_positions(timestamp);
