import { describe, expect, it } from 'vitest'; import { LunarDataProvider, type LunarDataMonth } from '../src/lib/calendar/lunarDataProvider';
const month: LunarDataMonth = { year: 2026, month: 8, days: [{ gregorian: '2026-08-29', weekDay: '星期六', lunar: { yearGanzhi: '丙午', monthName: '七月小', dayName: '十七' }, auspicious: ['祭祀'], inauspicious: ['嫁娶'], deityBirthday: [], dayGanzhi: { full: '己巳' }, luckyDirection: { 財神: '西南', 喜神: '正南' }, pengTaboo: '己不破券 二比並亡' }] };
describe('LunarData provider', () => {
  const provider = new LunarDataProvider(async (year, requestedMonth) => year === 2026 && requestedMonth === 8 ? month : null);
  it('normalizes a fetched date', async () => expect(await provider.getDay('2026-08-29')).toMatchObject({ date: '2026-08-29', weekday: '星期六', primarySource: 'LunarData' }));
  it('returns null outside available months', async () => expect(await provider.getDay('2026-03-01')).toBeNull());
  it('exposes 干支/財神方位/喜神方位/彭祖百忌 for the 查看更多農民曆 collapsible (Part A5)', async () => {
    const day = await provider.getDay('2026-08-29');
    expect(day).toMatchObject({ ganzhi: '己巳', wealthDirection: '西南', blessingDirection: '正南', pengTaboo: '己不破券 二比並亡' });
  });
});
