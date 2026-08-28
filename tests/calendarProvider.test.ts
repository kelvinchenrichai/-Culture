import { describe, expect, it } from 'vitest';
import { LunarDataProvider } from '../src/lib/calendar/lunarDataProvider';
describe('LunarData provider', () => {
  it('normalizes a bundled date', () => expect(new LunarDataProvider().getDay('2026-08-29')).toMatchObject({ date: '2026-08-29', weekday: '星期六', sources: [expect.stringContaining('LunarData')] }));
  it('returns null outside bundled months', () => expect(new LunarDataProvider().getDay('2026-03-01')).toBeNull());
});
