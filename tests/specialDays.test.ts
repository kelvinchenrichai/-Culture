import { describe, expect, it } from 'vitest';
import { isTianSheDay, findUpcomingSpecialDays, TIAN_SHE_DAY_EXPLANATION } from '../src/lib/calendar/specialDays';
import type { CalendarDay } from '../src/lib/calendar/types';

const baseDay: Omit<CalendarDay, 'date' | 'weekday'> = {
  lunar: { month: '一月', day: '一', display: '一月一' },
  good: [],
  bad: [],
  deityBirthdays: [],
  sources: ['LunarData'],
  primarySource: 'LunarData',
  verificationSources: [],
  hasConflict: false,
};

describe('isTianSheDay', () => {
  it('is true when goodDayGods includes 天赦', () => {
    expect(isTianSheDay({ goodDayGods: ['天赦', '天醫'] })).toBe(true);
  });
  it('is false when goodDayGods is missing or does not include 天赦', () => {
    expect(isTianSheDay({ goodDayGods: undefined })).toBe(false);
    expect(isTianSheDay({ goodDayGods: ['天醫'] })).toBe(false);
  });
});

// TIAN_SHE_DAY_EXPLANATION 只是通書裡的固定說明文字，這裡順手守住它不會被誤刪成空字串。
it('TIAN_SHE_DAY_EXPLANATION is non-empty traditional-almanac wording', () => {
  expect(TIAN_SHE_DAY_EXPLANATION.length).toBeGreaterThan(10);
});

describe('findUpcomingSpecialDays', () => {
  // 2026-03-05 這種真實資料裡，天赦日當天 deityInfo 自己也會放一筆同名「天赦日」事件——
  // 這個測試守住「不會因此在分享/列表裡重複出現兩次天赦日」這個 dedupe 邏輯。
  const days: Record<string, CalendarDay> = {
    '2026-03-05': {
      ...baseDay,
      date: '2026-03-05',
      weekday: '星期四',
      goodDayGods: ['天赦', '天醫'],
      deityDayEvents: [{ eventName: '天赦日', description: '天赦日是道教中上天赦免罪過的日子。' }],
    },
    '2026-03-06': {
      ...baseDay,
      date: '2026-03-06',
      weekday: '星期五',
      deityDayEvents: [{ eventName: '文昌帝君聖誕' }],
    },
    '2026-03-07': {
      ...baseDay,
      date: '2026-03-07',
      weekday: '星期六',
      // 沒有天赦、也沒有 deityDayEvents，不應該出現在結果裡
    },
  };

  const provider = { getDay: (date: string) => days[date] ?? null };

  it('only returns days that have a deity event or are 天赦日', async () => {
    const results = await findUpcomingSpecialDays(provider, '2026-03-05', 3);
    expect(results.map((r) => r.date)).toEqual(['2026-03-05', '2026-03-06']);
  });

  it('dedupes the self-named 天赦日 deityDayEvent against the isTianShe flag', async () => {
    const results = await findUpcomingSpecialDays(provider, '2026-03-05', 1);
    expect(results[0].isTianShe).toBe(true);
    expect(results[0].deityEvents).toEqual([]);
  });

  it('keeps unrelated deity events untouched on non-天赦日 days', async () => {
    const results = await findUpcomingSpecialDays(provider, '2026-03-06', 1);
    expect(results[0].isTianShe).toBe(false);
    expect(results[0].deityEvents).toEqual([{ eventName: '文昌帝君聖誕' }]);
  });
});
