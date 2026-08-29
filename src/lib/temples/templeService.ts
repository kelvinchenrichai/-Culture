import { TEMPLES } from '../../data/temples/temples';
import type { NearbyTemple, Temple } from './types';

const earthRadiusKm = 6371;
const radians = (degrees: number) => (degrees * Math.PI) / 180;

export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const dLat = radians(bLat - aLat);
  const dLng = radians(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(radians(aLat)) * Math.cos(radians(bLat)) * Math.sin(dLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function findNearbyTemples({ lat, lng, radiusKm, temples = TEMPLES }: { lat: number; lng: number; radiusKm: number; temples?: Temple[] }): NearbyTemple[] {
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || radiusKm < 0) return [];
  return temples
    .filter((t) => t.lat != null && t.lng != null)
    .map((t) => ({ ...t, distanceKm: distanceKm(lat, lng, t.lat!, t.lng!) }))
    .filter((t) => t.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/** Part E1：預設 5km，找不到就依序擴大到 10 / 20 / 30km，並回報實際用了哪個半徑，讓 UI 明確告知使用者。 */
export const RADIUS_STEPS_KM = [5, 10, 20, 30] as const;

export function findNearbyTemplesWithExpansion({
  lat,
  lng,
  temples = TEMPLES,
  steps = RADIUS_STEPS_KM,
}: {
  lat: number;
  lng: number;
  temples?: Temple[];
  steps?: readonly number[];
}): { results: NearbyTemple[]; radiusKm: number; expanded: boolean } {
  for (let i = 0; i < steps.length; i += 1) {
    const radiusKm = steps[i];
    const results = findNearbyTemples({ lat, lng, radiusKm, temples });
    if (results.length > 0 || i === steps.length - 1) {
      return { results, radiusKm, expanded: i > 0 };
    }
  }
  return { results: [], radiusKm: steps[steps.length - 1] ?? 0, expanded: false };
}

export * from './types';
