import type { CalendarDay, CalendarProvider } from './types';
const canonical = (value: string) => value.replaceAll('发', '髮').replaceAll('进', '進').replaceAll('开', '開').replaceAll('动', '動').replaceAll('迁', '遷').replaceAll('馀', '餘').trim();
const overlaps = (a: string[], b: string[]) => a.some(left => b.some(right => canonical(left) === canonical(right)));
const sameSet = (a: string[], b: string[]) => { const left = [...new Set(a.map(canonical))].sort(); const right = [...new Set(b.map(canonical))].sort(); return left.length === right.length && left.every((value, index) => value === right[index]); };
export class CalendarService {
  constructor(private readonly primary: CalendarProvider, private readonly verificationProviders: CalendarProvider[] = []) {}
  async getDay(date: string): Promise<CalendarDay | null> {
    const primary = await this.primary.getDay(date); if (!primary) return null;
    const verification = (await Promise.all(this.verificationProviders.map(provider => provider.getDay(date)))).filter((day): day is CalendarDay => Boolean(day));
    const lunarConflict = verification.some(day => day.lunar.day !== primary.lunar.day || !canonical(primary.lunar.month).includes(canonical(day.lunar.month).replace('月', '')));
    const termConflict = verification.some(day => day.solarTerm && primary.solarTerm && day.solarTerm !== primary.solarTerm);
    const actionConflict = verification.some(day => overlaps(primary.good, day.bad) || overlaps(primary.bad, day.good) || !sameSet(primary.good, day.good) || !sameSet(primary.bad, day.bad));
    return { ...primary, sources: [primary.primarySource, ...verification.map(day => day.primarySource)], verificationSources: verification.map(day => day.primarySource), hasConflict: lunarConflict || termConflict || actionConflict, verification };
  }
}
export * from './types'; export * from './lunarDataProvider'; export * from './lunarJsProvider';
