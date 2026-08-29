import type { AnswerStatus, Intent } from '../lib/rules/intents';
import type { CalendarDay } from '../lib/calendar/types';
export type DataStatus = 'real' | 'sample' | 'placeholder' | 'unavailable';
export type LoadState = 'loading' | 'success' | 'empty' | 'error';
export type TodayViewModel = {
  state: LoadState;
  date: { iso: string; solarDisplay: string; weekday: string; lunarDisplay: string };
  summary: { status: AnswerStatus; title: string; description: string };
  goodActions: { id: string; label: string }[];
  badActions: { id: string; label: string }[];
  deityBirthdays: { id?: string; name: string; dataStatus: DataStatus }[];
  sourceStatus: DataStatus;
  source: { primarySource: string; verificationSources: string[]; hasConflict: boolean };
  calendarDay?: CalendarDay;
};
export type DecisionViewModel = { query: string; date: string; intent?: Intent; status: AnswerStatus; headline: string; explanation: string; sourceStatus: DataStatus; primarySource: string; verificationSources: string[]; hasConflict: boolean; needsAI: boolean };
