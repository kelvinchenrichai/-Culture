import type { CalendarDay, CalendarProvider } from './types';
export class CalendarService {
  constructor(private readonly providers: CalendarProvider[]) {}
  async getDay(date: string): Promise<CalendarDay | null> {
    for (const provider of this.providers) { const result = await provider.getDay(date); if (result) return result; }
    return null;
  }
}
export * from './types';
export * from './lunarDataProvider';
export * from './lunarJsProvider';
