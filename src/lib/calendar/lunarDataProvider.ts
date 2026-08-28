import jan from '../../data/calendar/2026-01.json';
import feb from '../../data/calendar/2026-02.json';
import jun from '../../data/calendar/2026-06.json';
import aug from '../../data/calendar/2026-08.json';
import dec from '../../data/calendar/2026-12.json';
import type { CalendarDay, CalendarProvider } from './types';

type RawDay = { gregorian: string; weekDay: string; lunar: { yearGanzhi?: string; monthName: string; dayName: string }; auspicious?: string[]; inauspicious?: string[]; solarTerm?: { name?: string }; clashDetail?: string; clashDirection?: string; auspiciousHours?: string[]; deityBirthday?: string[] };
const months = [jan, feb, jun, aug, dec] as Array<{ days: RawDay[] }>;
const dayIndex = new Map(months.flatMap(month => month.days).map(day => [day.gregorian, day]));

export class LunarDataProvider implements CalendarProvider {
  readonly name = 'LunarData';
  getDay(date: string): CalendarDay | null {
    const raw = dayIndex.get(date);
    if (!raw) return null;
    const display = `${raw.lunar.yearGanzhi ? `${raw.lunar.yearGanzhi}年 ` : ''}${raw.lunar.monthName}${raw.lunar.dayName}`;
    return { date: raw.gregorian, weekday: raw.weekDay, lunar: { year: raw.lunar.yearGanzhi, month: raw.lunar.monthName, day: raw.lunar.dayName, display }, good: raw.auspicious ?? [], bad: raw.inauspicious ?? [], solarTerm: raw.solarTerm?.name, clash: [raw.clashDetail, raw.clashDirection && `煞${raw.clashDirection}`].filter(Boolean).join('・'), luckyHours: raw.auspiciousHours ?? [], deityBirthdays: raw.deityBirthday ?? [], sources: ['LunarData (MIT, bundled 2026 POC months)'] };
  }
}
