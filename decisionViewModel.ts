import type { CalendarDay } from '../lib/calendar/types';
import { evaluateIntent } from '../lib/rules/ruleEngine';
import type { Intent } from '../lib/rules/intents';
import type { DecisionViewModel } from './types';
const statusText = { recommended: '今天適合安排', neutral: '今日農民曆沒有特別列為宜或忌', not_recommended: '今天傳統農民曆較不建議安排', unknown: '目前資料不足，暫時無法判斷' } as const;
export function toDecisionViewModel(intent: Intent, query: string, day: CalendarDay | null): DecisionViewModel {
  const answer = evaluateIntent(intent, day, query);
  return { query, date: day?.date ?? '', intent, status: answer.status, headline: statusText[answer.status], explanation: answer.reason, sourceStatus: day ? 'real' : 'unavailable', primarySource: day?.primarySource ?? 'LunarData', verificationSources: day?.verificationSources ?? [], hasConflict: day?.hasConflict ?? false, needsAI: answer.needsAI };
}
