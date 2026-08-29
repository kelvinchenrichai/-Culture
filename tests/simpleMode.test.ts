import { describe, expect, it } from 'vitest';
import { readStoredValue, SIMPLE_MODE_STORAGE_KEY } from '../src/hooks/useElderMode';

describe('simple mode persistence (Part A6)', () => {
  it('falls back to the default value when there is no window (SSR / test environment)', () => {
    expect(readStoredValue(false)).toBe(false);
    expect(readStoredValue(true)).toBe(true);
  });

  it('reads a previously stored value back from localStorage-like storage', () => {
    const store = new Map<string, string>();
    const fakeWindow = { localStorage: { getItem: (key: string) => store.get(key) ?? null, setItem: (key: string, v: string) => void store.set(key, v) } };
    (globalThis as any).window = fakeWindow;
    try {
      store.set(SIMPLE_MODE_STORAGE_KEY, 'true');
      expect(readStoredValue(false)).toBe(true);
      store.set(SIMPLE_MODE_STORAGE_KEY, 'false');
      expect(readStoredValue(true)).toBe(false);
    } finally {
      delete (globalThis as any).window;
    }
  });

  it('does not throw when storage access is blocked (e.g. private browsing)', () => {
    (globalThis as any).window = { localStorage: { getItem: () => { throw new Error('blocked'); } } };
    try {
      expect(readStoredValue(true)).toBe(true);
    } finally {
      delete (globalThis as any).window;
    }
  });
});
