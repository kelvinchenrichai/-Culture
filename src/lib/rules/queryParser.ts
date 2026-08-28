import { QUERY_ALIASES, type Intent } from './intents';
export type ParsedQuery = { query: string; date: string; dateOffset: 0 | 1 | 2; intent?: Intent };
function baseInTaipei(baseDate?: string): Date {
  const text = baseDate ?? new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const [year, month, day] = text.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}
export function parseQuery(query: string, options: { baseDate?: string } = {}): ParsedQuery {
  const dateOffset: 0 | 1 | 2 = query.includes('後天') ? 2 : query.includes('明天') ? 1 : 0;
  const date = baseInTaipei(options.baseDate); date.setDate(date.getDate() + dateOffset);
  const intent = (Object.entries(QUERY_ALIASES) as [Intent, string[]][]).find(([, aliases]) => aliases.some(alias => query.includes(alias)))?.[0];
  return { query, date: date.toISOString().slice(0, 10), dateOffset, intent };
}
