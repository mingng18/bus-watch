// Performance optimization: Hoist constants and pre-calculate conversions
// outside the function body to prevent re-allocation and re-computation
// during hot execution paths (like scanning thousands of nearby stops).
const R = 6371000;
const TO_RAD = Math.PI / 180;

/**
 * Fast spatial pre-filter. Calculates a coordinate bounding box for a given radius.
 * Use this to quickly skip out-of-bounds points before running the expensive
 * haversineDistance function.
 */
export function getBoundingBox(lat: number, lon: number, radiusM: number) {
  const latDelta = radiusM / 110000;
  // Performance optimization: Avoid cos calculation if at equator, but generally
  // cache it to avoid multiple trigonometric operations.
  const lonDelta = radiusM / (110000 * Math.cos(lat * TO_RAD));
  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLon: lon - lonDelta,
    maxLon: lon + lonDelta
  };
}

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Inline lambda removed to prevent closure allocation per call.
  const dLat = (lat2 - lat1) * TO_RAD;
  const dLon = (lon2 - lon1) * TO_RAD;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * TO_RAD) * Math.cos(lat2 * TO_RAD) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
