import { describe, expect, it } from 'vitest';
import { validateImageAsset, type ImageAsset } from '../src/lib/images/imageAsset';
import { IMAGE_ASSETS } from '../src/data/images/imageRegistry';

function baseAsset(overrides: Partial<ImageAsset> = {}): ImageAsset {
  return {
    id: 'deity-tudigong-01',
    category: 'deity',
    subjectId: 'tudigong',
    alt: '福德正神插畫',
    source: '自製插畫',
    license: '自製插畫（今日好日原創）',
    verified: true,
    ...overrides,
  };
}

describe('validateImageAsset', () => {
  it('accepts a fully-filled asset', () => {
    expect(validateImageAsset(baseAsset())).toEqual([]);
  });

  it('rejects missing alt text (accessibility requirement)', () => {
    expect(validateImageAsset(baseAsset({ alt: '' })).length).toBeGreaterThan(0);
  });

  it('rejects missing source or license', () => {
    expect(validateImageAsset(baseAsset({ source: '' })).length).toBeGreaterThan(0);
    expect(validateImageAsset(baseAsset({ license: '' })).length).toBeGreaterThan(0);
  });

  it('flags verified=true when source/license are incomplete', () => {
    expect(validateImageAsset(baseAsset({ verified: true, license: '' })).length).toBeGreaterThan(0);
  });

  it('allows verified=false even with sparse metadata beyond the required fields', () => {
    expect(validateImageAsset(baseAsset({ verified: false, attribution: undefined, originalUrl: undefined }))).toEqual([]);
  });
});

describe('IMAGE_ASSETS registry (current state)', () => {
  it('is honestly empty this round — no image has been imported yet', () => {
    expect(IMAGE_ASSETS).toEqual([]);
  });

  it('every entry (once any exist) must pass validation with no duplicate ids', () => {
    const seen = new Set<string>();
    for (const asset of IMAGE_ASSETS) {
      expect(validateImageAsset(asset)).toEqual([]);
      expect(seen.has(asset.id)).toBe(false);
      seen.add(asset.id);
    }
  });
});
