import { describe, expect, it } from 'vitest';
import { isValidProvenancedField, type ProvenancedField } from '../src/lib/provenance/types';
import { BASIC_WORSHIP_GUIDE } from '../src/data/worship/basicWorshipGuide';
import type { WorshipGuide } from '../src/lib/worship/types';

const FIELD_KEYS: (keyof WorshipGuide)[] = ['preparation', 'offerings', 'steps', 'etiquette', 'notes'];

describe('isValidProvenancedField', () => {
  it('rejects a verified field with no sources', () => {
    const field: ProvenancedField<string> = { value: 'x', status: 'verified', contentType: 'FACT', sources: [] };
    expect(isValidProvenancedField(field)).toBe(false);
  });

  it('accepts a verified field that cites at least one source', () => {
    const field: ProvenancedField<string> = { value: 'x', status: 'verified', contentType: 'FACT', sources: [{ title: 'gov dataset' }] };
    expect(isValidProvenancedField(field)).toBe(true);
  });

  it('does not require sources for sample/placeholder/unavailable', () => {
    (['sample', 'placeholder', 'unavailable'] as const).forEach((status) => {
      expect(isValidProvenancedField({ value: 'x', status, contentType: 'FOLKLORE', sources: [] })).toBe(true);
    });
  });
});

describe('BASIC_WORSHIP_GUIDE schema', () => {
  it('has every field populated with non-empty content', () => {
    for (const key of FIELD_KEYS) {
      const field = BASIC_WORSHIP_GUIDE[key] as ProvenancedField<string[]> | undefined;
      expect(field, `${key} should exist`).toBeTruthy();
      expect(field!.value.length).toBeGreaterThan(0);
    }
  });

  it('is honestly labeled sample/FOLKLORE, not verified, because no authoritative single source was found', () => {
    for (const key of FIELD_KEYS) {
      const field = BASIC_WORSHIP_GUIDE[key] as ProvenancedField<string[]> | undefined;
      expect(field!.status).toBe('sample');
      expect(field!.contentType).toBe('FOLKLORE');
    }
  });

  it('every field is internally consistent with the verified-requires-source rule', () => {
    for (const key of FIELD_KEYS) {
      const field = BASIC_WORSHIP_GUIDE[key] as ProvenancedField<string[]> | undefined;
      expect(isValidProvenancedField(field!)).toBe(true);
    }
  });

  it('does not use absolute/certainty language that would misrepresent folklore as fact', () => {
    // 這裡故意不禁「絕對」整個詞，因為「沒有絕對對錯」本身就是恰當的 hedge 用語；
    // 真正要抓的是「一定要」「保證」「絕對是」這種把民間習俗講成鐵律的說法。
    const bannedPhrases = ['一定要', '絕對是', '保證'];
    for (const key of FIELD_KEYS) {
      const field = BASIC_WORSHIP_GUIDE[key] as ProvenancedField<string[]> | undefined;
      for (const line of field!.value) {
        for (const phrase of bannedPhrases) {
          expect(line.includes(phrase), `"${line}" should not contain "${phrase}"`).toBe(false);
        }
      }
    }
  });
});
