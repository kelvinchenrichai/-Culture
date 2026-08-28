import { TEMPLES } from '../../data/temples/temples';
import type { NearbyTemple, Temple } from './types';
const earthRadiusKm = 6371;
const radians = (degrees: number) => degrees * Math.PI / 180;
export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const dLat = radians(bLat - aLat); const dLng = radians(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(radians(aLat)) * Math.cos(radians(bLat)) * Math.sin(dLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
export function findNearbyTemples({ lat, lng, radiusKm, temples = TEMPLES }: { lat: number; lng: number; radiusKm: number; temples?: Temple[] }): NearbyTemple[] {
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || radiusKm < 0) return [];
  return temples.filter(t => t.latitude != null && t.longitude != null).map(t => ({ ...t, distanceKm: distanceKm(lat, lng, t.latitude!, t.longitude!) })).filter(t => t.distanceKm <= radiusKm).sort((a, b) => a.distanceKm - b.distanceKm);
}
export * from './types';
