import { describe, expect, it } from 'vitest';
import { findSuitableDates, nextDaysRange } from '../src/lib/rules/findSuitableDates';
import type { CalendarDay } from '../src/lib/calendar/types';

function makeDay(date: string, overrides: Partial<CalendarDay> = {}): CalendarDay {
  return {
    date,
    weekday: '週一',
    lunar: { month: '一月', day: '初一', display: '一月初一' },
    good: [],
    bad: [],
    deityBirthdays: [],
    sources: ['LunarData'],
    primarySource: 'LunarData',
    verificationSources: [],
    hasConflict: false,
    ...overrides,
  };
}

describe('findSuitableDates', () => {
  it('only returns days where the primary source explicitly lists 宜 for that action', async () => {
    const days: Record<string, CalendarDay | null> = {
      '2026-01-01': makeDay('2026-01-01', { good: ['理髮'] }),
      '2026-01-02': makeDay('2026-01-02', { good: ['入宅'] }),
      '2026-01-03': makeDay('2026-01-03', { good: [] }),
    };
    const summary = await findSuitableDates({ action: 'HAIRCUT', from: '2026-01-01', to: '2026-01-03' }, (d) => days[d] ?? null);
    expect(summary.results.map((r) => r.date)).toEqual(['2026-01-01']);
    expect(summary.results[0].status).toBe('recommended');
    expect(summary.results[0].matchedGoodTerms).toEqual(['理髮']);
    expect(summary.queriedDays).toBe(3);
    expect(summary.unavailableDays).toBe(0);
  });

  it('treats an explicit 忌 as excluding the day even if 宜 also lists other terms', async () => {
    const days: Record<string, CalendarDay | null> = {
      '2026-02-01': makeDay('2026-02-01', { good: ['理髮'], bad: ['理髮'] }),
    };
    const summary = await findSuitableDates({ action: 'HAIRCUT', from: '2026-02-01', to: '2026-02-01' }, (d) => days[d] ?? null);
    expect(summary.results).toHaveLength(0);
  });

  it('honestly distinguishes "no recommended day" from "no data available"', async () => {
    // All days available but none list the action as 宜 → real empty result, not a data gap.
    const noneGood = await findSuitableDates(
      { action: 'MOVE_HOME', from: '2026-03-01', to: '2026-03-03' },
      (d) => makeDay(d, { good: ['理髮'] }), // present but irrelevant to MOVE_HOME
    );
    expect(noneGood.results).toHaveLength(0);
    expect(noneGood.queriedDays).toBe(3);
    expect(noneGood.unavailableDays).toBe(0);

    // Calendar has no data for this range at all → data gap, caller must word this differently.
    const noData = await findSuitableDates({ action: 'MOVE_HOME', from: '2030-01-01', to: '2030-01-03' }, () => null);
    expect(noData.results).toHaveLength(0);
    expect(noData.queriedDays).toBe(3);
    expect(noData.unavailableDays).toBe(3);
  });

  it('respects limit and stops querying once enough recommended days are found', async () => {
    let calls = 0;
    const getDay = (date: string) => {
      calls += 1;
      return makeDay(date, { good: ['理髮'] });
    };
    const summary = await findSuitableDates({ action: 'HAIRCUT', from: '2026-01-01', to: '2026-01-10', limit: 2 }, getDay);
    expect(summary.results).toHaveLength(2);
    expect(calls).toBe(2);
  });

  it('does not crash and skips days with unavailable data mixed with available days', async () => {
    const days: Record<string, CalendarDay | null> = {
      '2026-04-01': null,
      '2026-04-02': makeDay('2026-04-02', { good: ['入宅'] }),
      '2026-04-03': null,
    };
    const summary = await findSuitableDates({ action: 'MOVE_HOME', from: '2026-04-01', to: '2026-04-03' }, (d) => days[d]);
    expect(summary.results.map((r) => r.date)).toEqual(['2026-04-02']);
    expect(summary.unavailableDays).toBe(2);
  });

  it('returns an empty range for an invalid or reversed date range instead of throwing', async () => {
    const summary = await findSuitableDates({ action: 'HAIRCUT', from: '2026-05-10', to: '2026-05-01' }, () => makeDay('x'));
    expect(summary.queriedDays).toBe(0);
    expect(summary.results).toHaveLength(0);
  });
});

describe('nextDaysRange', () => {
  it('builds an inclusive N-day range starting from the given date', () => {
    expect(nextDaysRange('2026-01-01', 30)).toEqual({ from: '2026-01-01', to: '2026-01-30' });
    expect(nextDaysRange('2026-01-01', 1)).toEqual({ from: '2026-01-01', to: '2026-01-01' });
  });
});
