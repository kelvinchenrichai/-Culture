import type { CalendarDay } from '../calendar/types';
import { CALENDAR_TERMS, type AnswerStatus, type Intent } from './intents';
import { parseQuery } from './queryParser';
export type RuleAnswer = { query: string; date: string; intent?: Intent; status: AnswerStatus; title: string; reason: string; confidence: 'high' | 'medium' | 'low'; sources: string[]; needsAI: boolean; deityBirthdays?: string[] };
const matches = (values: string[], terms: string[]) => values.some(value => terms.some(term => value.includes(term)));
const labels: Record<Exclude<Intent, 'DEITY_TODAY'>, string> = { HAIRCUT: '理髮', MOVE_HOME: '搬家', WORSHIP: '祭祀', START_WORK: '開工', MARRIAGE: '結婚', TRAVEL: '出行' };
export function evaluateIntent(intent: Intent, day: CalendarDay | null, query = ''): RuleAnswer {
  if (!day) return { query, date: '', intent, status: 'unknown', title: '目前沒有這天的資料', reason: '資料範圍不足，無法可靠判斷', confidence: 'low', sources: [], needsAI: true };
  if (intent === 'DEITY_TODAY') { const found = day.deityBirthdays.length > 0; return { query, date: day.date, intent, status: found ? 'recommended' : 'neutral', title: found ? `今日神明紀念：${day.deityBirthdays.join('、')}` : '今天沒有主要神明誕辰', reason: found ? '依曆法資料中的神明誕辰欄位' : '資料來源未列主要神明誕辰', confidence: 'high', sources: day.sources, needsAI: false, deityBirthdays: day.deityBirthdays }; }
  const terms = CALENDAR_TERMS[intent]; const good = matches(day.good, terms); const bad = matches(day.bad, terms);
  const status: AnswerStatus = bad ? 'not_recommended' : good ? 'recommended' : 'neutral'; const label = labels[intent];
  return { query, date: day.date, intent, status, title: status === 'recommended' ? `這天適合${label}` : status === 'not_recommended' ? `這天不建議${label}` : `這天對${label}沒有明確宜忌`, reason: good ? `「宜」列有：${day.good.filter(v => matches([v], terms)).join('、')}` : bad ? `「忌」列有：${day.bad.filter(v => matches([v], terms)).join('、')}` : '當日宜忌未列出對應項目，因此保持中性', confidence: good || bad ? 'high' : 'medium', sources: day.sources, needsAI: false };
}
export async function answerQuery(query: string, getDay: (date: string) => Promise<CalendarDay | null>, options: { baseDate?: string } = {}): Promise<RuleAnswer> {
  const parsed = parseQuery(query, options);
  if (!parsed.intent) return { query, date: parsed.date, status: 'unknown', title: '目前無法辨識這個問題', reason: '規則庫尚未涵蓋此意圖', confidence: 'low', sources: [], needsAI: true };
  return evaluateIntent(parsed.intent, await getDay(parsed.date), query);
}
export * from './intents'; export * from './queryParser';
