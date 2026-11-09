// Performance optimization: Hoist constants and pre-calculate conversions
// outside the function body to prevent re-allocation and re-computation
// during hot execution paths (like scanning thousands of nearby stops).
const R = 6371000;
export const TO_RAD = Math.PI / 180;

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Inline lambda removed to prevent closure allocation per call.
  const sinDLat2 = Math.sin((lat2 - lat1) * TO_RAD * 0.5);
  const sinDLon2 = Math.sin((lon2 - lon1) * TO_RAD * 0.5);
  const a =
    sinDLat2 * sinDLat2 +
    Math.cos(lat1 * TO_RAD) * Math.cos(lat2 * TO_RAD) * sinDLon2 * sinDLon2;
  return 12742000 * Math.asin(Math.sqrt(a)); // R * 2 = 12742000
}


export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

export function getBoundingBox(lat: number, lon: number, radiusM: number): BoundingBox {
  const latDelta = radiusM / 111000;
  const lonDelta = radiusM / (111000 * Math.max(0.0001, Math.cos(lat * TO_RAD)));
  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLon: lon - lonDelta,
    maxLon: lon + lonDelta,
  };
}
