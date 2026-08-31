import { describe, expect, it } from 'vitest';
import {
  computeFieldCoverage,
  computeTempleCoverage,
  computeFestivalCoverage,
  computeNeedDeityMapCoverage,
  computeImageCoverage,
} from '../src/lib/coverage/computeCoverage';
import { DEITY_PROFILES } from '../src/data/deities/deityProfiles';
import { NEED_DEITY_MAP } from '../src/data/needs/needDeityMap';
import type { Temple } from '../src/lib/temples/types';
import type { ReligiousFestival } from '../src/lib/festivals/types';
import type { ImageAsset } from '../src/lib/images/imageAsset';

describe('computeFieldCoverage', () => {
  it('counts only ProvenancedField-shaped values, ignores plain fields like id', () => {
    const result = computeFieldCoverage({
      id: 'x',
      a: { value: 1, status: 'verified', contentType: 'FACT', sources: [{ title: 's' }] },
      b: { value: 2, status: 'sample', contentType: 'FOLKLORE', sources: [] },
    });
    expect(result).toEqual({ verifiedFields: 1, totalFields: 2, pct: 50 });
  });

  it('caishen (all verified except offerings) is computed correctly against the tracked field count', () => {
    const caishen = DEITY_PROFILES.find((p) => p.id === 'caishen')!;
    const result = computeFieldCoverage(caishen as unknown as Record<string, unknown>);
    // id is a plain string, not a ProvenancedField, so it must not inflate totalFields
    expect(result.totalFields).toBe(8);
    expect(result.verifiedFields).toBeLessThan(result.totalFields); // guarded elsewhere: never 100%
  });

  it('returns 0 pct (not NaN) when there are no tracked fields at all', () => {
    expect(computeFieldCoverage({ id: 'x' })).toEqual({ verifiedFields: 0, totalFields: 0, pct: 0 });
  });
});

describe('computeTempleCoverage', () => {
  const temples: Temple[] = [
    { id: 't1', name: 'A', aliases: [], city: '臺北市', rawAddress: '', normalizedAddress: '', sources: [], coordinateStatus: 'government', lat: 25, lng: 121 },
    { id: 't2', name: 'B', aliases: [], city: '臺北市', rawAddress: '', normalizedAddress: '', sources: [], coordinateStatus: 'missing' },
    { id: 't3', name: 'C', aliases: [], city: '新北市', rawAddress: '', normalizedAddress: '', sources: [], coordinateStatus: 'government', lat: 25, lng: 121 },
  ];

  it('computes sample size, coordinate coverage, and city breakdown from real fields (no fabricated national %)', () => {
    expect(computeTempleCoverage(temples)).toEqual({
      sampleSize: 3,
      withCoordinates: 2,
      coordinateCoverageOfSamplePct: 66.7,
      byCity: { 臺北市: 2, 新北市: 1 },
    });
  });

  it('handles an empty sample without dividing by zero', () => {
    expect(computeTempleCoverage([]).coordinateCoverageOfSamplePct).toBe(0);
  });
});

describe('computeFestivalCoverage', () => {
  it('counts only dateStatus === "parsed" as covered', () => {
    const festivals = [
      { dateStatus: 'parsed' } as ReligiousFestival,
      { dateStatus: 'partial' } as ReligiousFestival,
      { dateStatus: 'unparsed' } as ReligiousFestival,
    ];
    expect(computeFestivalCoverage(festivals)).toEqual({ sampleSize: 3, parsedDates: 1, parsedCoveragePct: 33.3 });
  });
});

describe('computeNeedDeityMapCoverage', () => {
  it('matches the real NEED_DEITY_MAP: 5 of 8 needs have at least one deity, 3 known gaps', () => {
    const result = computeNeedDeityMapCoverage(NEED_DEITY_MAP);
    expect(result.totalNeeds).toBe(8);
    expect(result.needsWithDeity).toBe(5);
    expect(result.gaps.sort()).toEqual(['academic', 'childbirth', 'justice'].sort());
  });
});

describe('computeImageCoverage', () => {
  it('tallies by category and totals correctly', () => {
    const assets: ImageAsset[] = [
      { id: '1', category: 'deity', alt: 'a', source: 's', license: 'l', verified: true },
      { id: '2', category: 'deity', alt: 'a', source: 's', license: 'l', verified: true },
      { id: '3', category: 'temple', alt: 'a', source: 's', license: 'l', verified: true },
    ];
    expect(computeImageCoverage(assets)).toEqual({
      total: 3,
      byCategory: { deity: 2, temple: 1, festival: 0, offering: 0, action: 0 },
    });
  });

  it('an empty registry reports all zeros, not an error', () => {
    expect(computeImageCoverage([])).toEqual({
      total: 0,
      byCategory: { deity: 0, temple: 0, festival: 0, offering: 0, action: 0 },
    });
  });
});
