import type { CalendarDay, CalendarProvider } from './types';
export type LunarDataMonth = { year: number; month: number; days: RawDay[] };
type RawDay = { gregorian: string; weekDay: string; lunar: { yearGanzhi?: string; monthName: string; dayName: string }; auspicious?: string[]; inauspicious?: string[]; solarTerm?: { name?: string }; clashDetail?: string; clashDirection?: string; auspiciousHours?: string[]; deityBirthday?: string[] };
export type LunarMonthLoader = (year: number, month: number) => Promise<LunarDataMonth | null>;
const defaultLoader: LunarMonthLoader = async (year, month) => { const response = await fetch(`/data/calendar/${year}/${String(month).padStart(2, '0')}.json`); return response.ok ? response.json() as Promise<LunarDataMonth> : null; };
export class LunarDataProvider implements CalendarProvider {
  readonly name = 'LunarData'; private readonly cache = new Map<string, Promise<LunarDataMonth | null>>();
  constructor(private readonly loadMonth: LunarMonthLoader = defaultLoader) {}
  async getDay(date: string): Promise<CalendarDay | null> {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date); if (!match) return null;
    const year = Number(match[1]); const month = Number(match[2]); const key = `${year}-${month}`;
    if (!this.cache.has(key)) this.cache.set(key, this.loadMonth(year, month));
    const raw = (await this.cache.get(key)!)?.days.find(day => day.gregorian === date); if (!raw) return null;
    const display = `${raw.lunar.yearGanzhi ? `${raw.lunar.yearGanzhi}年 ` : ''}${raw.lunar.monthName}${raw.lunar.dayName}`;
    return { date: raw.gregorian, weekday: raw.weekDay, lunar: { year: raw.lunar.yearGanzhi, month: raw.lunar.monthName, day: raw.lunar.dayName, display }, good: raw.auspicious ?? [], bad: raw.inauspicious ?? [], solarTerm: raw.solarTerm?.name, clash: [raw.clashDetail, raw.clashDirection && `煞${raw.clashDirection}`].filter(Boolean).join('・'), luckyHours: raw.auspiciousHours ?? [], deityBirthdays: raw.deityBirthday ?? [], sources: ['LunarData'], primarySource: 'LunarData', verificationSources: [], hasConflict: false };
  }
}
