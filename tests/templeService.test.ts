import { describe, expect, it } from 'vitest';
import { distanceKm, findNearbyTemples } from '../src/lib/temples/templeService';
const temples = [{ id: 'near', name: 'Near', address: '', latitude: 25.001, longitude: 121, source: 'test' }, { id: 'far', name: 'Far', address: '', latitude: 25.1, longitude: 121, source: 'test' }];
describe('temple distance', () => {
  it('calculates distance', () => expect(distanceKm(25, 121, 25.001, 121)).toBeGreaterThan(0));
  it('filters radius and sorts', () => expect(findNearbyTemples({ lat: 25, lng: 121, radiusKm: 20, temples }).map(t => t.id)).toEqual(['near', 'far']));
  it('filters outside radius', () => expect(findNearbyTemples({ lat: 25, lng: 121, radiusKm: 1, temples })).toHaveLength(1));
});
