import { describe, expect, it } from 'vitest';
import { distanceKm, findNearbyTemples, findNearbyTemplesWithExpansion } from '../src/lib/temples/templeService';
import type { Temple } from '../src/lib/temples/types';

function makeTemple(overrides: Partial<Temple>): Temple {
  return {
    id: 'temple', name: 'Temple', aliases: [], city: '臺北市', rawAddress: '', normalizedAddress: '',
    sources: [], coordinateStatus: 'verified', ...overrides,
  };
}

const temples: Temple[] = [
  makeTemple({ id: 'near', name: 'Near', lat: 25.001, lng: 121 }),
  makeTemple({ id: 'far', name: 'Far', lat: 25.1, lng: 121 }),
];

describe('temple distance', () => {
  it('calculates distance', () => expect(distanceKm(25, 121, 25.001, 121)).toBeGreaterThan(0));
  it('filters radius and sorts', () => expect(findNearbyTemples({ lat: 25, lng: 121, radiusKm: 20, temples }).map((t) => t.id)).toEqual(['near', 'far']));
  it('filters outside radius', () => expect(findNearbyTemples({ lat: 25, lng: 121, radiusKm: 1, temples })).toHaveLength(1));
});

describe('findNearbyTemplesWithExpansion (Part E1: 5→10→20→30km auto expansion)', () => {
  it('does not expand when the smallest radius already has results', () => {
    const { results, radiusKm, expanded } = findNearbyTemplesWithExpansion({ lat: 25, lng: 121, temples });
    expect(radiusKm).toBe(5);
    expect(expanded).toBe(false);
    expect(results.map((t) => t.id)).toEqual(['near']);
  });

  it('expands the radius step by step until it finds something', () => {
    const farTemples: Temple[] = [makeTemple({ id: 'far-only', name: 'Far only', lat: 25.15, lng: 121 })];
    const { results, radiusKm, expanded } = findNearbyTemplesWithExpansion({ lat: 25, lng: 121, temples: farTemples });
    expect(expanded).toBe(true);
    expect(radiusKm).toBeGreaterThan(5);
    expect(results.map((t) => t.id)).toEqual(['far-only']);
  });

  it('stops at the widest step and reports zero results honestly instead of expanding forever', () => {
    const { results, radiusKm } = findNearbyTemplesWithExpansion({ lat: 0, lng: 0, temples });
    expect(results).toHaveLength(0);
    expect(radiusKm).toBe(30);
  });
});
