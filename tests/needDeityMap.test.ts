import { describe, expect, it } from 'vitest';
import { NEED_DEITY_MAP } from '../src/data/needs/needDeityMap';
import { DEITIES } from '../src/data/deities/deities';
import { findNeedDeityEntry, findNeedsForDeity } from '../src/lib/needs/needDeityMap';

const VALID_DEITY_IDS = new Set(DEITIES.map((d) => d.id));

describe('NEED_DEITY_MAP', () => {
  it('every referenced deityId actually exists in the deity roster — never a fabricated id', () => {
    for (const entry of NEED_DEITY_MAP) {
      for (const id of entry.deityIds) {
        expect(VALID_DEITY_IDS.has(id), `${entry.needId} references unknown deity id "${id}"`).toBe(true);
      }
    }
  });

  it('needId is unique across the map', () => {
    const ids = NEED_DEITY_MAP.map((e) => e.needId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('descriptions never phrase worship as a guaranteed outcome ("拜X就會成功/有效")', () => {
    const banned = ['就會成功', '就會有效', '保證', '一定會'];
    for (const entry of NEED_DEITY_MAP) {
      for (const phrase of banned) {
        expect(entry.description.value.includes(phrase), `${entry.needId} description reads as a causal guarantee`).toBe(false);
      }
    }
  });

  it('known gaps (academic/childbirth/justice) are honestly empty, not padded with unrelated deities', () => {
    for (const needId of ['academic', 'childbirth', 'justice'] as const) {
      const entry = findNeedDeityEntry(needId, NEED_DEITY_MAP)!;
      expect(entry.deityIds).toEqual([]);
      expect(entry.description.status).toBe('placeholder');
    }
  });

  it('a non-empty deityIds entry never carries placeholder/unavailable status on its description', () => {
    for (const entry of NEED_DEITY_MAP) {
      if (entry.deityIds.length > 0) {
        expect(['placeholder', 'unavailable']).not.toContain(entry.description.status);
      }
    }
  });

  it('findNeedsForDeity reverse-looks-up correctly (e.g. tudigong appears under wealth and career)', () => {
    const needs = findNeedsForDeity('tudigong', NEED_DEITY_MAP).map((e) => e.needId);
    expect(needs.sort()).toEqual(['career', 'wealth'].sort());
  });

  it('findNeedDeityEntry returns undefined for an unknown needId', () => {
    // @ts-expect-error deliberately passing an invalid needId to check runtime behavior
    expect(findNeedDeityEntry('not-a-real-need', NEED_DEITY_MAP)).toBeUndefined();
  });
});
