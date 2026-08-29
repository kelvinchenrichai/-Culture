import { describe, expect, it } from 'vitest';
import { normalizeAddress, normalizeTempleName } from '../src/lib/temples/addressNormalize';
import { normalizeDeityName } from '../src/lib/temples/deityAliases';
import { dedupeTemples } from '../src/lib/temples/dedupe';
import type { Temple } from '../src/lib/temples/types';

function makeTemple(overrides: Partial<Temple>): Temple {
  return {
    id: 'id', name: 'name', aliases: [], city: '臺北市', rawAddress: '', normalizedAddress: '',
    sources: [{ name: 'test' }], coordinateStatus: 'missing', ...overrides,
  };
}

describe('normalizeAddress (Part C3)', () => {
  it('collapses 台/臺 into 臺', () => expect(normalizeAddress('台北市大安區')).toBe('臺北市大安區'));
  it('converts full-width spaces and digits to half-width and strips whitespace', () => {
    expect(normalizeAddress('臺北市　中山區　中山北路２段')).toBe('臺北市中山區中山北路2段');
  });
  it('keeps rawAddress untouched by not mutating the input', () => {
    const raw = '台北市 中山區';
    normalizeAddress(raw);
    expect(raw).toBe('台北市 中山區');
  });
  it('returns empty string for missing input rather than throwing', () => expect(normalizeAddress(undefined)).toBe(''));
});

describe('normalizeTempleName', () => {
  it('normalizes 台/臺 and strips decorative brackets', () => expect(normalizeTempleName('台北（霞海城隍廟）')).toBe('臺北霞海城隍廟'));
});

describe('normalizeDeityName (Part C5 alias table)', () => {
  it.each([
    ['福德正神', 'tudigong'],
    ['土地公', 'tudigong'],
    ['天上聖母', 'mazu'],
    ['媽祖婆', 'mazu'],
    ['關聖帝君', 'guandi'],
    ['關公', 'guandi'],
    ['觀世音菩薩', 'guanyin'],
    ['玄天上帝', 'xuantian'],
    ['保生大帝', 'baosheng'],
    ['大道公', 'baosheng'],
  ])('maps %s -> %s', (raw, expected) => expect(normalizeDeityName(raw)).toBe(expected));

  it('returns undefined instead of guessing for an unknown deity', () => expect(normalizeDeityName('霞海城隍')).toBeUndefined());
  it('returns undefined for empty input', () => expect(normalizeDeityName(undefined)).toBeUndefined());
  it('matches inside a compound field like "主祀：關聖帝君　配祀：..."', () => expect(normalizeDeityName('主祀：關聖帝君　配祀：韋馱尊者')).toBe('guandi'));
});

describe('dedupeTemples (Part C4)', () => {
  it('merges records that share the same normalized name + address, combining sources', () => {
    const a = makeTemple({ id: 'a', name: '福德宮', normalizedAddress: '臺北市大安區忠孝東路1號', sources: [{ name: 'sourceA' }], coordinateStatus: 'missing' });
    const b = makeTemple({ id: 'a-dup', name: '福德宮', normalizedAddress: '臺北市大安區忠孝東路1號', sources: [{ name: 'sourceB' }], lat: 25, lng: 121, coordinateStatus: 'government' });
    const { deduped, duplicatesRemoved } = dedupeTemples([a, b]);
    expect(duplicatesRemoved).toBe(1);
    expect(deduped).toHaveLength(1);
    // 合併後應該保留座標可信度最高的那筆座標，並集合兩邊的 sources。
    expect(deduped[0].coordinateStatus).toBe('government');
    expect(deduped[0].lat).toBe(25);
    expect(deduped[0].sources.map((s) => s.name)).toEqual(['sourceA', 'sourceB']);
  });

  it('does NOT merge same-name temples at different addresses (全台同名福德宮/天后宮太多)', () => {
    const a = makeTemple({ id: 'a', name: '福德宮', normalizedAddress: '臺北市大安區忠孝東路1號' });
    const b = makeTemple({ id: 'b', name: '福德宮', normalizedAddress: '高雄市苓雅區四維路1號' });
    const { deduped, duplicatesRemoved } = dedupeTemples([a, b]);
    expect(duplicatesRemoved).toBe(0);
    expect(deduped).toHaveLength(2);
  });

  it('leaves a single record untouched', () => {
    const a = makeTemple({ id: 'solo' });
    const { deduped, duplicatesRemoved } = dedupeTemples([a]);
    expect(deduped).toEqual([a]);
    expect(duplicatesRemoved).toBe(0);
  });
});
