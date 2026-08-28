import { LunarDataProvider } from '../src/lib/calendar/lunarDataProvider';
import { LunarJsProvider } from '../src/lib/calendar/lunarJsProvider';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const dates = ['2026-01-01', '2026-02-17', '2026-06-19', '2026-08-29', '2026-12-31'];
const primary = new LunarDataProvider(async (year, month) => JSON.parse(await readFile(resolve('public', 'data', 'calendar', String(year), `${String(month).padStart(2, '0')}.json`), 'utf8'))); const secondary = new LunarJsProvider();
for (const date of dates) {
  const a = await primary.getDay(date); const b = await secondary.getDay(date);
  console.log(JSON.stringify({ date, LunarData: a && { lunar: a.lunar.display, solarTerm: a.solarTerm, good: a.good, bad: a.bad }, lunarJavaScript: b && { lunar: b.lunar.display, solarTerm: b.solarTerm, good: b.good, bad: b.bad }, sameLunarDay: a?.lunar.day === b?.lunar.day }, null, 2));
}
