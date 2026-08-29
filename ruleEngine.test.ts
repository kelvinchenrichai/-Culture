import { describe, expect, it } from 'vitest';
import { evaluateIntent } from '../src/lib/rules/ruleEngine';
import type { CalendarDay } from '../src/lib/calendar/types';
const day = (good: string[], bad: string[]): CalendarDay => ({ date: '2026-08-29', weekday: '星期六', lunar: { month: '七月', day: '十七', display: '七月十七' }, good, bad, deityBirthdays: [], sources: ['test'], primarySource: 'LunarData', verificationSources: [], hasConflict: false });
describe('rule engine', () => {
  it('recommends a good action', () => expect(evaluateIntent('HAIRCUT', day(['理髮'], []))).toMatchObject({ status: 'recommended', needsAI: false }));
  it('rejects a bad action', () => expect(evaluateIntent('HAIRCUT', day([], ['理髮']))).toMatchObject({ status: 'not_recommended' }));
  it('stays neutral without a term', () => expect(evaluateIntent('HAIRCUT', day([], []))).toMatchObject({ status: 'neutral' }));
});
