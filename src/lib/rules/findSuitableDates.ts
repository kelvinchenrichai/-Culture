import type { CalendarDay } from '../calendar/types';
import { CALENDAR_TERMS, type AnswerStatus, type Intent } from './intents';

/**
 * Part G（找好日子）。
 *
 * 設計原則（照 Phase 4 P2 spec）：
 * - 只用 LunarData Primary 的宜/忌欄位判斷，不使用 lunar-javascript 之類的 verification source 做排序或篩選。
 *   `getDay` 回傳的 CalendarDay 是 CalendarService 合併後的結果，但 `good`/`bad` 這兩個欄位本來就是
 *   primary（LunarData）的原始值（CalendarService.getDay 用 `{...primary, ...}` 展開，verification
 *   source 只影響 `hasConflict`/`verificationSources`，不會混進 `good`/`bad`），所以直接沿用它們就符合
 *   「不用 secondary 宜忌做正式判定」的政策，不需要額外過濾。
 * - 沒有「最佳吉日」排名模型，只回傳「農民曆列為宜」的日期，用詞上不做誇大。
 * - 誠實區分「這段期間沒有宜日」跟「這段期間根本查不到資料」兩種情況，不能把資料缺漏偽裝成「沒有好日子」。
 */

export type SuitableDateAction = Exclude<Intent, 'DEITY_TODAY'>;

export type SuitableDateResult = {
  date: string;
  weekday: string;
  lunarDisplay: string;
  status: AnswerStatus;
  matchedGoodTerms: string[];
  matchedBadTerms: string[];
  primarySource: string;
};

export type FindSuitableDatesOptions = {
  action: SuitableDateAction;
  from: string;
  to: string;
  /** 最多回傳幾筆「適合」的日期。不影響查詢的天數範圍，只影響回傳筆數。 */
  limit?: number;
};

export type FindSuitableDatesSummary = {
  action: SuitableDateAction;
  from: string;
  to: string;
  /** 只包含 status === 'recommended' 的日期，已套用 limit。 */
  results: SuitableDateResult[];
  /** 這段期間實際查詢了幾天（可能因為 MAX_RANGE_DAYS 被截斷）。 */
  queriedDays: number;
  /** 這段期間裡有幾天完全查不到曆法資料（例如超出目前只有 2026 年資料的範圍）。 */
  unavailableDays: number;
};

/** 安全上限，避免不合理的日期範圍造成大量逐日查詢（目前曆法資料本來就只有 2026 一整年）。 */
const MAX_RANGE_DAYS = 120;

function enumerateDates(from: string, to: string): string[] {
  const start = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return [];
  const dates: string[] = [];
  const cursor = new Date(start);
  let guard = 0;
  while (cursor.getTime() <= end.getTime() && guard < MAX_RANGE_DAYS) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    guard += 1;
  }
  return dates;
}

const matchTerms = (values: string[], terms: string[]) => values.filter((value) => terms.some((term) => value.includes(term)));

export async function findSuitableDates(
  { action, from, to, limit }: FindSuitableDatesOptions,
  getDay: (date: string) => Promise<CalendarDay | null> | CalendarDay | null,
): Promise<FindSuitableDatesSummary> {
  const dates = enumerateDates(from, to);
  const terms = CALENDAR_TERMS[action];
  let unavailableDays = 0;
  const results: SuitableDateResult[] = [];

  for (const date of dates) {
    const day = await getDay(date);
    if (!day) {
      unavailableDays += 1;
      continue;
    }
    const matchedGoodTerms = matchTerms(day.good, terms);
    const matchedBadTerms = matchTerms(day.bad, terms);
    const status: AnswerStatus = matchedBadTerms.length > 0 ? 'not_recommended' : matchedGoodTerms.length > 0 ? 'recommended' : 'neutral';
    if (status === 'recommended') {
      results.push({
        date,
        weekday: day.weekday,
        lunarDisplay: day.lunar.display,
        status,
        matchedGoodTerms,
        matchedBadTerms,
        primarySource: day.primarySource,
      });
      if (typeof limit === 'number' && results.length >= limit) break;
    }
  }

  return { action, from, to, results, queriedDays: dates.length, unavailableDays };
}

/** 從某一天開始往後 N 天（含當天），回傳 `from`/`to` 給 findSuitableDates 用。 */
export function nextDaysRange(fromDate: string, days: number): { from: string; to: string } {
  const start = new Date(`${fromDate}T00:00:00Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + Math.max(0, days - 1));
  return { from: fromDate, to: end.toISOString().slice(0, 10) };
}
