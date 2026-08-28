import { CalendarService } from '../lib/calendar/calendarService';
import { LunarDataProvider } from '../lib/calendar/lunarDataProvider';
import { LunarJsProvider } from '../lib/calendar/lunarJsProvider';
export const calendarService = new CalendarService(new LunarDataProvider(), [new LunarJsProvider()]);
export function taipeiToday(): string { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
