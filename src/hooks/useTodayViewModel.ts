import { useEffect, useState } from 'react';
import { calendarService, taipeiToday } from '../services/appServices';
import { toTodayViewModel, unavailableToday } from '../viewmodels/todayViewModel';
import type { TodayViewModel } from '../viewmodels/types';
export function useTodayViewModel(date = taipeiToday()) {
  const [today, setToday] = useState<TodayViewModel>(() => unavailableToday(date, 'loading'));
  useEffect(() => { let active = true; setToday(unavailableToday(date, 'loading')); calendarService.getDay(date).then(day => { if (active) setToday(day ? toTodayViewModel(day) : unavailableToday(date)); }).catch(() => { if (active) setToday(unavailableToday(date)); }); return () => { active = false; }; }, [date]);
  return today;
}
