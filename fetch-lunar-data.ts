import { mkdir, writeFile } from 'node:fs/promises'; import { resolve } from 'node:path';
const args = Object.fromEntries(process.argv.slice(2).map(arg => arg.replace(/^--/, '').split('='))); const year = Number(args.year); const onlyMonth = args.month ? Number(args.month) : undefined;
if (!Number.isInteger(year)) throw new Error('Usage: pnpm calendar:fetch -- --year=2026 [--month=8]');
const months = onlyMonth ? [onlyMonth] : Array.from({ length: 12 }, (_, i) => i + 1); const target = resolve('public', 'data', 'calendar', String(year)); await mkdir(target, { recursive: true });
for (const month of months) { const mm = String(month).padStart(2, '0'); const url = `https://raw.githubusercontent.com/donma/LunarData/main/${year}/${mm}.json`; const response = await fetch(url); if (!response.ok) throw new Error(`${url}: ${response.status}`); await writeFile(resolve(target, `${mm}.json`), await response.text()); console.log(`Fetched ${year}-${mm}`); }
