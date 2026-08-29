export type CalendarDay = {
  date: string;
  weekday: string;
  lunar: { year?: string; month: string; day: string; display: string };
  good: string[];
  bad: string[];
  solarTerm?: string;
  clash?: string;
  luckyHours?: string[];
  deityBirthdays: string[];
  sources: string[];
  primarySource: string;
  verificationSources: string[];
  hasConflict: boolean;
  verification?: CalendarDay[];
  /** 干支（日柱），例如 "丁未" */
  ganzhi?: string;
  /** 財神方位，例如 "西南" */
  wealthDirection?: string;
  /** 喜神方位，例如 "正南" */
  blessingDirection?: string;
  /** 彭祖百忌（原文，未逐條 parse），例如 "丁不剃頭 頭必生瘡,未不服藥 毒氣入腸" */
  pengTaboo?: string;
};

export interface CalendarProvider {
  readonly name: string;
  getDay(date: string): Promise<CalendarDay | null> | CalendarDay | null;
}
