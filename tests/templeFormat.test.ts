import { describe, expect, it } from 'vitest';
import { formatDistance, buildNavigationUrl } from '../src/lib/temples/format';

describe('formatDistance (Part E3)', () => {
  it('shows meters under 1km, rounded to the nearest 10m', () => {
    expect(formatDistance(0.65)).toBe('約 650 公尺');
    expect(formatDistance(0.234)).toBe('約 230 公尺');
  });
  it('shows kilometers to one decimal place at 1km and above', () => {
    expect(formatDistance(1.738291)).toBe('約 1.7 公里');
    expect(formatDistance(12)).toBe('約 12.0 公里');
  });
  it('handles invalid input without throwing', () => {
    expect(formatDistance(NaN)).toBe('距離未知');
    expect(formatDistance(-1)).toBe('距離未知');
  });
});

describe('buildNavigationUrl (Part E5: external maps link, no SDK/API key)', () => {
  it('prefers lat/lng when available', () => {
    const url = buildNavigationUrl({ name: '龍山寺', lat: 25.0372, lng: 121.4999 });
    expect(url).toBe('https://www.google.com/maps/search/?api=1&query=25.0372,121.4999');
  });
  it('falls back to the address when coordinates are missing', () => {
    const url = buildNavigationUrl({ name: '某廟', normalizedAddress: '臺北市大安區忠孝東路1號' });
    expect(url).toContain('https://www.google.com/maps/search/?api=1&query=');
    expect(decodeURIComponent(url.split('query=')[1])).toBe('臺北市大安區忠孝東路1號');
  });
});
