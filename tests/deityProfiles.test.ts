import { describe, expect, it } from 'vitest';
import { DEITY_PROFILES, findDeityProfile } from '../src/data/deities/deityProfiles';
import { isValidProvenancedField } from '../src/lib/provenance/types';
import type { DeityProfile } from '../src/lib/deities/deityProfile';

const FIELD_KEYS: (keyof DeityProfile)[] = ['name', 'aliases', 'dates', 'beliefs', 'commonPrayers', 'offerings', 'worshipSteps', 'culturalBackground'];

describe('DEITY_PROFILES provenance integrity', () => {
  it('covers exactly the 6 priority deities named in the spec', () => {
    expect(DEITY_PROFILES.map((p) => p.id).sort()).toEqual(['caishen', 'guandi', 'guanyin', 'mazu', 'tudigong', 'yuelao'].sort());
  });

  it('every field on every profile obeys the verified-requires-source rule', () => {
    for (const profile of DEITY_PROFILES) {
      for (const key of FIELD_KEYS) {
        const field = profile[key] as { status: string; sources: unknown[] };
        expect(isValidProvenancedField(field as any), `${profile.id}.${key}`).toBe(true);
      }
    }
  });

  it('never blanket-upgrades an entire deity to verified — no profile is 100% verified fields', () => {
    // Guards against the exact anti-pattern the spec calls out: "把整筆神明資料全部一起升級成 verified".
    for (const profile of DEITY_PROFILES) {
      const statuses = FIELD_KEYS.map((key) => (profile[key] as { status: string }).status);
      const allVerified = statuses.every((s) => s === 'verified');
      expect(allVerified, `${profile.id} should not have every field verified`).toBe(false);
    }
  });

  it('every verified field actually cites a real source with a URL', () => {
    for (const profile of DEITY_PROFILES) {
      for (const key of FIELD_KEYS) {
        const field = profile[key] as { status: string; sources: { url?: string }[] };
        if (field.status === 'verified') {
          expect(field.sources.length, `${profile.id}.${key} verified but no sources`).toBeGreaterThan(0);
          expect(field.sources.every((s) => Boolean(s.url)), `${profile.id}.${key} verified source missing url`).toBe(true);
        }
      }
    }
  });

  it('guandi remains sample-only this round (religion.moi.gov.tw was unreachable, not skipped)', () => {
    const profile = findDeityProfile('guandi')!;
    for (const key of FIELD_KEYS) {
      expect((profile[key] as { status: string }).status, `guandi.${key}`).toBe('sample');
    }
  });

  it('mazu: dates upgraded to verified this round, everything else stays sample', () => {
    const profile = findDeityProfile('mazu')!;
    expect(profile.dates.status).toBe('verified');
    for (const key of FIELD_KEYS.filter((k) => k !== 'dates')) {
      expect((profile[key] as { status: string }).status, `mazu.${key}`).toBe('sample');
    }
  });

  it('mazu has two distinct, differently-sourced date events (birthday + ascension), not a fabricated regional-variation flag', () => {
    const mazu = findDeityProfile('mazu')!;
    expect(mazu.dates.value).toHaveLength(2);
    expect(mazu.dates.value.map((d) => d.eventType).sort()).toEqual(['ascension', 'birthday']);
    expect(mazu.dates.value.find((d) => d.eventType === 'birthday')?.lunarDate).toBe('三月廿三');
    expect(mazu.dates.value.find((d) => d.eventType === 'ascension')?.lunarDate).toBe('九月初九');
    // No genuine cross-region date conflict was found for these two dates — regionalVariation must not be
    // fabricated just because the model supports it.
    expect(mazu.dates.value.every((d) => !d.regionalVariation)).toBe(true);
    expect(mazu.dates.sources.length).toBeGreaterThanOrEqual(2);
  });

  it('caishen dates is verified as 正月初五 per the cited government-culture source', () => {
    const caishen = findDeityProfile('caishen')!;
    expect(caishen.dates.status).toBe('verified');
    expect(caishen.dates.value).toEqual([{ eventType: 'birthday', label: '聖誕', lunarDate: '正月初五' }]);
  });

  it('findDeityProfile returns undefined for an unknown id instead of throwing', () => {
    expect(findDeityProfile('not-a-real-deity')).toBeUndefined();
  });
});
