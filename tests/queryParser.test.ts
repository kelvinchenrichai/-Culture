import { describe, expect, it } from 'vitest';
import { parseQuery } from '../src/lib/rules/queryParser';
describe('intent and date parser', () => {
  it('parses today haircut', () => expect(parseQuery('今天可以剪頭髮嗎', { baseDate: '2026-08-29' })).toMatchObject({ intent: 'HAIRCUT', date: '2026-08-29', dateOffset: 0 }));
  it('parses tomorrow moving', () => expect(parseQuery('明天可以搬家嗎', { baseDate: '2026-08-29' })).toMatchObject({ intent: 'MOVE_HOME', date: '2026-08-30', dateOffset: 1 }));
  it('parses deity day after tomorrow', () => expect(parseQuery('後天拜什麼', { baseDate: '2026-08-29' })).toMatchObject({ intent: 'DEITY_TODAY', date: '2026-08-31', dateOffset: 2 }));
});
