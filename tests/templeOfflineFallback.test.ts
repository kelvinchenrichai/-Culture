import { describe, expect, it } from 'vitest';
import { TEMPLES } from '../src/data/temples/temples';

describe('TEMPLES (offline fallback constant)', () => {
  it('stays a small hand-curated subset, not the full national dataset bundled into JS', () => {
    // Regression guard: this file used to `import generated from '.../national-temples.json'`,
    // which was fine at 5 sample records but would inline several MB of JSON straight into the
    // JS bundle now that the real dataset has thousands of records. If this starts failing because
    // someone re-wired TEMPLES back to the full generated file, that's the bug to fix, not this test.
    expect(TEMPLES.length).toBeLessThan(50);
  });

  it('every entry is a real, identifiable temple (has id/name/coordinates), not empty placeholders', () => {
    for (const t of TEMPLES) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.lat).toBeDefined();
      expect(t.lng).toBeDefined();
    }
  });
});
