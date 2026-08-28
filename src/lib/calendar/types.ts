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
};

export interface CalendarProvider {
  readonly name: string;
  getDay(date: string): Promise<CalendarDay | null> | CalendarDay | null;
}
