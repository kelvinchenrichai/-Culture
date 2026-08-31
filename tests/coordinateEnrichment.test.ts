import { describe, expect, it } from 'vitest';
import { matchCoordinateCandidates, applyHighConfidenceMatches } from '../src/lib/temples/coordinateEnrichment';
import type { Temple } from '../src/lib/temples/types';

// 這裡的溫度/座標全部是合成測試資料，用來驗證比對邏輯本身，不代表任何真實寺廟。

function makeTemple(overrides: Partial<Temple>): Temple {
  return {
    id: 'temple', name: 'Temple', aliases: [], city: '新北市', rawAddress: '', normalizedAddress: '',
    sources: [], coordinateStatus: 'missing', ...overrides,
  };
}

describe('matchCoordinateCandidates', () => {
  it('marks a match as high confidence only when both name and address align', () => {
    const temples = [makeTemple({ id: 't1', name: '福德宮', rawAddress: '新北市板橋區文化路一段1號', district: '板橋區' })];
    const candidates = [{ name: '福德宮', address: '新北市板橋區文化路一段1號', lat: 25.01, lng: 121.46 }];
    const [match] = matchCoordinateCandidates(temples, candidates);
    expect(match.confidence).toBe('high');
    expect(match.matchedOn).toEqual(expect.arrayContaining(['name', 'address']));
  });

  it('downgrades to medium when name matches but address does not, while district or deity does', () => {
    const temples = [makeTemple({ id: 't1', name: '福德宮', rawAddress: '新北市板橋區文化路一段1號', district: '板橋區' })];
    const candidates = [{ name: '福德宮', address: '不一樣的地址格式', district: '板橋區', lat: 25.01, lng: 121.46 }];
    const [match] = matchCoordinateCandidates(temples, candidates);
    expect(match.confidence).toBe('medium');
    expect(match.matchedOn).toContain('district');
  });

  it('falls back to low confidence when only the name matches — too many same-named temples to trust', () => {
    const temples = [makeTemple({ id: 't1', name: '天后宮', rawAddress: '某地址', district: '三重區' })];
    const candidates = [{ name: '天后宮', lat: 25.06, lng: 121.49 }];
    const [match] = matchCoordinateCandidates(temples, candidates);
    expect(match.confidence).toBe('low');
  });

  it('never matches an implausible (out-of-Taiwan) coordinate, regardless of name/address match', () => {
    const temples = [makeTemple({ id: 't1', name: '福德宮', rawAddress: '新北市板橋區文化路一段1號' })];
    const candidates = [{ name: '福德宮', address: '新北市板橋區文化路一段1號', lat: 0, lng: 0 }];
    expect(matchCoordinateCandidates(temples, candidates)).toHaveLength(0);
  });

  it('matches against a temple alias as well as its primary name', () => {
    const temples = [makeTemple({ id: 't1', name: '福德正神廟', aliases: ['福德宮'], rawAddress: '新北市板橋區文化路一段1號' })];
    const candidates = [{ name: '福德宮', address: '新北市板橋區文化路一段1號', lat: 25.01, lng: 121.46 }];
    expect(matchCoordinateCandidates(temples, candidates)).toHaveLength(1);
  });

  it('does not crash and produces no matches for an empty candidate list', () => {
    const temples = [makeTemple({ id: 't1' })];
    expect(matchCoordinateCandidates(temples, [])).toEqual([]);
  });
});

describe('applyHighConfidenceMatches', () => {
  const source = { name: '新北市寺廟資料', datasetId: '122928' };

  it('writes lat/lng and upgrades coordinateStatus only for high-confidence matches', () => {
    const temples = [
      makeTemple({ id: 'high', name: 'A', coordinateStatus: 'missing' }),
      makeTemple({ id: 'low', name: 'B', coordinateStatus: 'missing' }),
    ];
    const matches = [
      { templeId: 'high', templeName: 'A', lat: 25.01, lng: 121.46, confidence: 'high' as const, matchedOn: ['name', 'address'] },
    ];
    const { updated, appliedCount } = applyHighConfidenceMatches(temples, matches, source);
    expect(appliedCount).toBe(1);
    const updatedHigh = updated.find((t) => t.id === 'high')!;
    expect(updatedHigh.lat).toBe(25.01);
    expect(updatedHigh.coordinateStatus).toBe('verified');
    expect(updatedHigh.sources).toContainEqual(source);
    const updatedLow = updated.find((t) => t.id === 'low')!;
    expect(updatedLow.lat).toBeUndefined();
    expect(updatedLow.coordinateStatus).toBe('missing');
  });

  it('never applies a medium/low confidence match, even if passed in by mistake', () => {
    const temples = [makeTemple({ id: 't1', coordinateStatus: 'missing' })];
    const matches = [{ templeId: 't1', templeName: 'X', lat: 25, lng: 121, confidence: 'medium' as const, matchedOn: ['name'] }];
    const { updated, appliedCount } = applyHighConfidenceMatches(temples, matches, source);
    expect(appliedCount).toBe(0);
    expect(updated[0].coordinateStatus).toBe('missing');
  });
});
