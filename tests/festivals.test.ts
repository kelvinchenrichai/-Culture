import { describe, expect, it } from 'vitest';
import { parseFestivalDate } from '../src/lib/festivals/dateParser';
import { getUpcomingFestivals } from '../src/lib/festivals/festivalService';
import type { ReligiousFestival } from '../src/lib/festivals/types';

describe('parseFestivalDate', () => {
  it('parses a single Gregorian date', () => {
    expect(parseFestivalDate('2026年4月17日')).toEqual({ status: 'parsed', start: '2026-04-17', end: '2026-04-17' });
  });

  it('parses a date range with 至', () => {
    expect(parseFestivalDate('2026年4月17日至2026年4月26日')).toEqual({ status: 'parsed', start: '2026-04-17', end: '2026-04-26' });
  });

  it('parses ISO-style and slash-style single dates', () => {
    expect(parseFestivalDate('2026-04-17')).toEqual({ status: 'parsed', start: '2026-04-17', end: '2026-04-17' });
    expect(parseFestivalDate('2026/04/17')).toEqual({ status: 'parsed', start: '2026-04-17', end: '2026-04-17' });
  });

  it('converts a plausible ROC (民國) year to Gregorian', () => {
    // 115年 = 2026
    expect(parseFestivalDate('115年4月17日')).toEqual({ status: 'parsed', start: '2026-04-17', end: '2026-04-17' });
  });

  it('never guesses lunar-calendar dates — always unparsed', () => {
    expect(parseFestivalDate('農曆三月十五')).toEqual({ status: 'unparsed' });
  });

  it('returns unparsed for empty or unrecognizable text instead of throwing', () => {
    expect(parseFestivalDate('')).toEqual({ status: 'unparsed' });
    expect(parseFestivalDate('擇期舉行')).toEqual({ status: 'unparsed' });
  });

  it('returns partial when only one side of a range is parseable', () => {
    const result = parseFestivalDate('2026年4月17日至擇期');
    expect(result.status).toBe('partial');
    expect(result.start).toBe('2026-04-17');
    expect(result.end).toBeUndefined();
  });

  it('rejects an impossible calendar date rather than silently clamping it', () => {
    expect(parseFestivalDate('2026年2月30日')).toEqual({ status: 'unparsed' });
  });
});

function makeFestival(overrides: Partial<ReligiousFestival>): ReligiousFestival {
  return {
    id: 'f',
    name: 'Festival',
    rawDateText: '',
    sources: [],
    dateStatus: 'unparsed',
    ...overrides,
  };
}

describe('getUpcomingFestivals', () => {
  const festivals: ReligiousFestival[] = [
    makeFestival({ id: 'a', name: 'A', parsedStartDate: '2026-04-17', parsedEndDate: '2026-04-26', dateStatus: 'parsed', city: '臺中市' }),
    makeFestival({ id: 'b', name: 'B', parsedStartDate: '2026-04-19', parsedEndDate: '2026-06-16', dateStatus: 'parsed', city: '臺北市' }),
    makeFestival({ id: 'c', name: 'C (unparsed, must never appear as upcoming)', dateStatus: 'unparsed' }),
    makeFestival({ id: 'd', name: 'D (far future, out of window)', parsedStartDate: '2027-01-01', dateStatus: 'parsed' }),
  ];

  it('only returns festivals overlapping the window, sorted by start date', () => {
    const result = getUpcomingFestivals({ from: '2026-04-01', days: 60 }, festivals);
    expect(result.map((f) => f.id)).toEqual(['a', 'b']);
  });

  it('never includes an unparsed-date record, even if it would otherwise be "soon"', () => {
    const result = getUpcomingFestivals({ from: '2026-01-01', days: 3650 }, festivals);
    expect(result.some((f) => f.id === 'c')).toBe(false);
  });

  it('filters by city', () => {
    const result = getUpcomingFestivals({ from: '2026-04-01', days: 60, city: '臺北市' }, festivals);
    expect(result.map((f) => f.id)).toEqual(['b']);
  });

  it('does not crash on a mix of parsed/partial/unparsed records', () => {
    const mixed = [...festivals, makeFestival({ id: 'e', dateStatus: 'partial', parsedStartDate: '2026-04-20' })];
    expect(() => getUpcomingFestivals({ from: '2026-04-01', days: 60 }, mixed)).not.toThrow();
  });

  it('returns an empty list for an invalid from date instead of throwing', () => {
    expect(getUpcomingFestivals({ from: 'not-a-date', days: 30 }, festivals)).toEqual([]);
  });
});
