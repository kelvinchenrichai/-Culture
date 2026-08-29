import type { CalendarDay, CalendarProvider } from './types';
export class LunarJsProvider implements CalendarProvider {
  readonly name = 'lunar-javascript';
  async getDay(date: string): Promise<CalendarDay | null> {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date); if (!match) return null;
    const module = await import('lunar-javascript'); const lunarPackage = module.default ?? module;
    const { Solar } = lunarPackage as unknown as { Solar: { fromYmd(y: number, m: number, d: number): any } };
    const solar = Solar.fromYmd(Number(match[1]), Number(match[2]), Number(match[3])); const lunar = solar.getLunar();
    return { date, weekday: `星期${solar.getWeekInChinese()}`, lunar: { year: lunar.getYearInGanZhi(), month: `${lunar.getMonthInChinese()}月`, day: lunar.getDayInChinese(), display: `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}` }, good: lunar.getDayYi?.() ?? [], bad: lunar.getDayJi?.() ?? [], solarTerm: lunar.getJieQi?.() || undefined, clash: lunar.getDayChongDesc?.(), luckyHours: [], deityBirthdays: [], sources: ['lunar-javascript'], primarySource: 'lunar-javascript', verificationSources: [], hasConflict: false };
  }
}
