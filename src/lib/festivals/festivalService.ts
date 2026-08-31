import type { ReligiousFestival } from './types';

export type GetUpcomingFestivalsOptions = {
  from: string;
  days: number;
  city?: string;
  district?: string;
};

/**
 * Part E3。只回傳日期有把握（dateStatus !== 'unparsed' 且至少有 parsedStartDate）的慶典，
 * 跟 from~from+days 這段期間有重疊的活動，依開始日期排序。`unparsed` 的紀錄不會被排進「即將
 * 舉行」清單——把日期不確定的活動當成「快到了」顯示，比完全不顯示更容易誤導使用者。
 */
export function getUpcomingFestivals(options: GetUpcomingFestivalsOptions, festivals: ReligiousFestival[]): ReligiousFestival[] {
  const { from, days, city, district } = options;
  const fromTime = new Date(`${from}T00:00:00Z`).getTime();
  if (Number.isNaN(fromTime)) return [];
  const toTime = fromTime + days * 24 * 60 * 60 * 1000;

  return festivals
    .filter((f) => !city || f.city === city)
    .filter((f) => !district || f.district === district)
    .filter((f) => {
      if (f.dateStatus === 'unparsed' || !f.parsedStartDate) return false;
      const startTime = new Date(`${f.parsedStartDate}T00:00:00Z`).getTime();
      const endTime = f.parsedEndDate ? new Date(`${f.parsedEndDate}T00:00:00Z`).getTime() : startTime;
      if (Number.isNaN(startTime) || Number.isNaN(endTime)) return false;
      return endTime >= fromTime && startTime <= toTime;
    })
    .sort((a, b) => (a.parsedStartDate! < b.parsedStartDate! ? -1 : a.parsedStartDate! > b.parsedStartDate! ? 1 : 0));
}
