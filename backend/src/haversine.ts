// Performance optimization: Precompute constants and avoid inline lambda creation
const R = 6371000;
const PI_180 = Math.PI / 180;

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = (lat2 - lat1) * PI_180;
  const dLon = (lon2 - lon1) * PI_180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * PI_180) * Math.cos(lat2 * PI_180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
