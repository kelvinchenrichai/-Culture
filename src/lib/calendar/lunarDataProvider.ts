import type { CalendarDay, CalendarProvider, DeityDayEvent } from './types';
export type LunarDataMonth = { year: number; month: number; days: RawDay[] };
type RawDeityInfo = { name: string; info?: { name?: string; title?: string; birthday?: string; description?: string; image?: string; temple?: string; blessing?: string; note?: string } };
type RawDay = { gregorian: string; weekDay: string; lunar: { yearGanzhi?: string; monthName: string; dayName: string }; auspicious?: string[]; inauspicious?: string[]; solarTerm?: { name?: string }; clashDetail?: string; clashDirection?: string; auspiciousHours?: string[]; deityBirthday?: string[]; deityInfo?: RawDeityInfo[]; goodGods?: string[]; badGods?: string[]; dayGanzhi?: { full?: string }; luckyDirection?: { 財神?: string; 喜神?: string }; pengTaboo?: string };
export type LunarMonthLoader = (year: number, month: number) => Promise<LunarDataMonth | null>;
const defaultLoader: LunarMonthLoader = async (year, month) => { const response = await fetch(`/data/calendar/${year}/${String(month).padStart(2, '0')}.json`); return response.ok ? response.json() as Promise<LunarDataMonth> : null; };

/**
 * Part（「小節日」擴充）：把原始 `deityInfo` 陣列轉成 `DeityDayEvent[]`。這裡刻意逐欄位對應、
 * 不做任何加工或補充——LunarData 原始資料裡本來就沒有的欄位（例如某個節日沒有 temple）就是
 * undefined，不會自己腦補一個看起來合理的答案。
 */
function toDeityDayEvents(raw?: RawDeityInfo[]): DeityDayEvent[] {
  return (raw ?? []).map((item) => ({
    eventName: item.name,
    deityName: item.info?.name,
    title: item.info?.title,
    lunarDate: item.info?.birthday,
    description: item.info?.description,
    imageDescription: item.info?.image,
    temple: item.info?.temple,
    blessing: item.info?.blessing,
    note: item.info?.note,
  }));
}

export class LunarDataProvider implements CalendarProvider {
  readonly name = 'LunarData'; private readonly cache = new Map<string, Promise<LunarDataMonth | null>>();
  constructor(private readonly loadMonth: LunarMonthLoader = defaultLoader) {}
  async getDay(date: string): Promise<CalendarDay | null> {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date); if (!match) return null;
    const year = Number(match[1]); const month = Number(match[2]); const key = `${year}-${month}`;
    if (!this.cache.has(key)) this.cache.set(key, this.loadMonth(year, month));
    const raw = (await this.cache.get(key)!)?.days.find(day => day.gregorian === date); if (!raw) return null;
    const display = `${raw.lunar.yearGanzhi ? `${raw.lunar.yearGanzhi}年 ` : ''}${raw.lunar.monthName}${raw.lunar.dayName}`;
    return { date: raw.gregorian, weekday: raw.weekDay, lunar: { year: raw.lunar.yearGanzhi, month: raw.lunar.monthName, day: raw.lunar.dayName, display }, good: raw.auspicious ?? [], bad: raw.inauspicious ?? [], solarTerm: raw.solarTerm?.name, clash: [raw.clashDetail, raw.clashDirection && `煞${raw.clashDirection}`].filter(Boolean).join('・'), luckyHours: raw.auspiciousHours ?? [], deityBirthdays: raw.deityBirthday ?? [], deityDayEvents: toDeityDayEvents(raw.deityInfo), goodDayGods: raw.goodGods ?? [], badDayGods: raw.badGods ?? [], sources: ['LunarData'], primarySource: 'LunarData', verificationSources: [], hasConflict: false, ganzhi: raw.dayGanzhi?.full, wealthDirection: raw.luckyDirection?.財神, blessingDirection: raw.luckyDirection?.喜神, pengTaboo: raw.pengTaboo };
  }
}
