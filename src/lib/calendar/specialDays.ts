import type { CalendarDay, DeityDayEvent } from './types';

/** 只需要 getDay，不強求完整 CalendarProvider（例如 name 欄位）——CalendarService 本身沒有 name。 */
type DayLookup = { getDay(date: string): Promise<CalendarDay | null> | CalendarDay | null };

/**
 * Part（「小節日」擴充）：使用者明確點名「天赦日」——這是傳統通書裡的特殊吉日，不是每天都有
 * （2026 年一整年只有 6 天），過去這個網站完全沒有算它，因為原始 `goodGods` 欄位一直被丟掉。
 * 現在資料已經接上，這裡只是單純判斷「今天的 goodDayGods 陣列裡有沒有天赦」，不是重新計算
 * 天赦日的曆法規則——規則本來就在 LunarData 裡算好了，我們只是讀出來。
 */
export function isTianSheDay(day: Pick<CalendarDay, 'goodDayGods'>): boolean {
  return (day.goodDayGods ?? []).includes('天赦');
}

/** 這句解釋是通書裡對天赦日的傳統說法（諸事不忌、特別適合化解糾紛與祈福），不是本站獨創的判定。 */
export const TIAN_SHE_DAY_EXPLANATION =
  '天赦日是傳統通書記載的特殊吉日，一年只有幾天。民間說法認為這天「天赦諸罪」，百無禁忌，特別適合化解糾紛、重新開始、祈福還願。';

export interface UpcomingSpecialDay {
  date: string;
  weekday: string;
  lunarDisplay: string;
  isTianShe: boolean;
  deityEvents: DeityDayEvent[];
}

function addDays(isoDate: string, amount: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + amount);
  return d.toISOString().slice(0, 10);
}

/**
 * Part（「小節日」擴充）：使用者要的是「平常不會注意、也不會特地去查的小節日」——神明生日、
 * 節日、天赦日——主動攤開接下來一段時間，而不是要使用者自己每天點進來看今天有沒有。
 * 只回傳「有內容」的日子（有神明事件或是天赦日），避免列表被一堆空日子灌水。
 */
export async function findUpcomingSpecialDays(
  provider: DayLookup,
  startDate: string,
  daysAhead: number
): Promise<UpcomingSpecialDay[]> {
  const dates = Array.from({ length: daysAhead }, (_, i) => addDays(startDate, i));
  const days = await Promise.all(dates.map((date) => provider.getDay(date)));
  const results: UpcomingSpecialDay[] = [];
  days.forEach((day, index) => {
    if (!day) return;
    const tianShe = isTianSheDay(day);
    // LunarData 在天赦日當天，deityInfo 裡本來就會另外放一筆同名的「天赦日」事件——
    // 這裡已經用 isTianShe 標記過了，避免呼叫端（例如分享文案）把它跟 isTianShe 重複顯示兩次。
    const events = (day.deityDayEvents ?? []).filter((event) => !(tianShe && event.eventName === '天赦日'));
    if (!tianShe && events.length === 0) return;
    results.push({
      date: dates[index],
      weekday: day.weekday,
      lunarDisplay: day.lunar.display,
      isTianShe: tianShe,
      deityEvents: events,
    });
  });
  return results;
}
