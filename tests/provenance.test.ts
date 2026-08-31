import { describe, expect, it } from 'vitest';
import { isValidProvenancedField, type ProvenancedField } from '../src/lib/provenance/types';

describe('provenance core rules', () => {
  it('verified requires at least one source', () => {
    const noSource: ProvenancedField<string> = { value: 'x', status: 'verified', contentType: 'FACT', sources: [] };
    expect(isValidProvenancedField(noSource)).toBe(false);
    const withSource: ProvenancedField<string> = {
      value: 'x',
      status: 'verified',
      contentType: 'FACT',
      sources: [{ title: 'source' }],
    };
    expect(isValidProvenancedField(withSource)).toBe(true);
  });

  it('sample/placeholder/unavailable never require a source', () => {
    for (const status of ['sample', 'placeholder', 'unavailable'] as const) {
      const field: ProvenancedField<string> = { value: 'x', status, contentType: 'FOLKLORE', sources: [] };
      expect(isValidProvenancedField(field)).toBe(true);
    }
  });

  it('LOCAL_CUSTOM is a distinct contentType from FOLKLORE, usable like any other', () => {
    const localCustom: ProvenancedField<string> = {
      value: '某廟規定入廟需脫帽',
      status: 'sample',
      contentType: 'LOCAL_CUSTOM',
      sources: [],
    };
    expect(localCustom.contentType).toBe('LOCAL_CUSTOM');
    expect(isValidProvenancedField(localCustom)).toBe(true);
  });
});
