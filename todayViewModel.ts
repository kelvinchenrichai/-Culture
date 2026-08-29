import type { CalendarDay } from '../lib/calendar/types';
import { DeityService } from '../lib/deities/deityService';
import type { TodayViewModel } from './types';
const actionId = (label: string, index: number) => `${label.replace(/\s/g, '-')}-${index}`;
export function unavailableToday(date: string, state: 'loading' | 'error' = 'error'): TodayViewModel {
  return { state, date: { iso: date, solarDisplay: date, weekday: '', lunarDisplay: '' }, summary: { status: 'unknown', title: state === 'loading' ? '正在讀取今日資料' : '今日資料暫時無法取得', description: state === 'loading' ? '請稍候' : '請稍後再試' }, goodActions: [], badActions: [], deityBirthdays: [], sourceStatus: 'unavailable', source: { primarySource: 'LunarData', verificationSources: ['lunar-javascript'], hasConflict: false } };
}
export function toTodayViewModel(day: CalendarDay, deityService = new DeityService()): TodayViewModel {
  const birthdays = day.deityBirthdays.map(name => { const deity = deityService.find(name)[0]; return { id: deity?.id, name, dataStatus: deity?.dataStatus === 'verified' ? 'real' as const : deity?.dataStatus ?? 'sample' as const }; });
  const status = day.bad.includes('諸事不宜') ? 'not_recommended' : day.good.length ? 'recommended' : day.bad.length ? 'not_recommended' : 'neutral';
  return { state: 'success', date: { iso: day.date, solarDisplay: day.date.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$1年 $2月 $3日'), weekday: day.weekday, lunarDisplay: day.lunar.display }, summary: { status, title: status === 'recommended' ? '今日有傳統宜行事項' : status === 'not_recommended' ? '今日安排宜保守' : '今日宜忌沒有明確指示', description: '以下內容依本站主要農民曆資料源整理，不使用氣場分數。' }, goodActions: day.good.map((label, index) => ({ id: actionId(label, index), label })), badActions: day.bad.map((label, index) => ({ id: actionId(label, index), label })), deityBirthdays: birthdays, sourceStatus: 'real', source: { primarySource: day.primarySource, verificationSources: day.verificationSources, hasConflict: day.hasConflict }, calendarDay: day };
}
