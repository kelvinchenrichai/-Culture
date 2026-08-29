/**
 * Part L1：跨資料集的基本品質檢查。跟 scripts/validate-calendar.ts（比對兩個曆法來源
 * 是否一致）不同，這支 script 檢查的是「資料本身有沒有明顯壞掉」：
 * 空值、非法座標、重複 id、alias 互相打架等等。
 *
 * 用法：pnpm run data:validate
 * 任何一項檢查失敗就以非 0 結束，方便串進 CI 或 pre-deploy 檢查。
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { DEITIES } from '../src/data/deities/deities';
import type { Temple } from '../src/lib/temples/types';
import type { ReligiousFestival } from '../src/lib/festivals/types';

type Issue = { area: string; message: string };

function isPlausibleTaiwanCoordinate(lat?: number, lng?: number): boolean {
  if (lat === undefined || lng === undefined) return true; // 沒座標不是這裡要抓的問題（missing 是合法狀態）
  return lat >= 21 && lat <= 26.5 && lng >= 118 && lng <= 123.5;
}

async function validateTemples(): Promise<Issue[]> {
  const issues: Issue[] = [];
  const path = resolve('public/data/temples/national-temples.json');
  let temples: Temple[];
  try {
    temples = JSON.parse(await readFile(path, 'utf8'));
  } catch (err) {
    return [{ area: 'temple', message: `讀不到 ${path}：${(err as Error).message}` }];
  }

  const seenIds = new Map<string, number>();
  temples.forEach((t, index) => {
    if (!t.name?.trim()) issues.push({ area: 'temple', message: `第 ${index + 1} 筆 (id=${t.id}) 名稱為空` });
    if (!t.rawAddress?.trim()) issues.push({ area: 'temple', message: `第 ${index + 1} 筆 (id=${t.id}, ${t.name}) 地址為空` });
    if (t.lat !== undefined && (t.lat < -90 || t.lat > 90)) issues.push({ area: 'temple', message: `${t.name} 緯度超出合法範圍：${t.lat}` });
    if (t.lng !== undefined && (t.lng < -180 || t.lng > 180)) issues.push({ area: 'temple', message: `${t.name} 經度超出合法範圍：${t.lng}` });
    if (!isPlausibleTaiwanCoordinate(t.lat, t.lng)) issues.push({ area: 'temple', message: `${t.name} 座標看起來不在台灣範圍內，可能欄位對錯：(${t.lat}, ${t.lng})` });
    if ((t.lat === undefined) !== (t.lng === undefined)) issues.push({ area: 'temple', message: `${t.name} 只有一半座標（lat/lng 其中一個缺漏）` });
    seenIds.set(t.id, (seenIds.get(t.id) ?? 0) + 1);
  });
  for (const [id, count] of seenIds) if (count > 1) issues.push({ area: 'temple', message: `id "${id}" 重複出現 ${count} 次` });

  return issues;
}

async function validateFestivals(): Promise<{ issues: Issue[]; found: boolean }> {
  const issues: Issue[] = [];
  const path = resolve('public/data/festivals/national-festivals.json');
  let festivals: ReligiousFestival[];
  try {
    festivals = JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return { issues: [], found: false }; // Part F 尚未全量匯入是合法狀態，不算失敗，NOT DONE 訊息另外印。
  }

  const seenIds = new Map<string, number>();
  for (const f of festivals) {
    if (!f.name?.trim()) issues.push({ area: 'festival', message: `id=${f.id} 活動名稱為空` });
    if (f.dateStatus === 'parsed' && (!f.parsedStartDate || !f.parsedEndDate)) {
      issues.push({ area: 'festival', message: `${f.name} 標記為 parsed 但 parsedStartDate/parsedEndDate 不完整` });
    }
    seenIds.set(f.id, (seenIds.get(f.id) ?? 0) + 1);
  }
  for (const [id, count] of seenIds) if (count > 1) issues.push({ area: 'festival', message: `id "${id}" 重複出現 ${count} 次` });

  return { issues, found: true };
}

function validateDeities(): Issue[] {
  const issues: Issue[] = [];
  const seenIds = new Map<string, number>();
  const aliasOwner = new Map<string, string>();
  for (const d of DEITIES) {
    seenIds.set(d.id, (seenIds.get(d.id) ?? 0) + 1);
    for (const alias of [d.name, ...d.aliases]) {
      const owner = aliasOwner.get(alias);
      if (owner && owner !== d.id) issues.push({ area: 'deity', message: `alias "${alias}" 同時被 ${owner} 與 ${d.id} 使用，彼此衝突` });
      else aliasOwner.set(alias, d.id);
    }
    if (!d.lunarBirthdays.length) issues.push({ area: 'deity', message: `${d.id} 沒有任何 lunarBirthdays，今天拜什麼會永遠查不到它` });
  }
  for (const [id, count] of seenIds) if (count > 1) issues.push({ area: 'deity', message: `id "${id}" 重複出現 ${count} 次` });
  return issues;
}

async function main() {
  const [templeIssues, deityIssues, festivalResult] = await Promise.all([
    validateTemples(),
    Promise.resolve(validateDeities()),
    validateFestivals(),
  ]);
  const allIssues = [...templeIssues, ...deityIssues, ...festivalResult.issues];

  console.log('[data:validate] 神明 (deities):', deityIssues.length === 0 ? 'PASS' : `${deityIssues.length} 個問題`);
  console.log('[data:validate] 寺廟 (temples):', templeIssues.length === 0 ? 'PASS' : `${templeIssues.length} 個問題`);
  console.log(
    '[data:validate] 節慶 (festivals):',
    !festivalResult.found ? '尚未產生 public/data/festivals/national-festivals.json，先跑 `pnpm run data:update:festivals`。' : festivalResult.issues.length === 0 ? 'PASS' : `${festivalResult.issues.length} 個問題`,
  );
  console.log('[data:validate] 農民曆 (calendar): 另外用 `pnpm run validate:calendar` 檢查兩個曆法來源是否一致，這裡不重複做。');

  if (allIssues.length > 0) {
    console.log('\n問題清單：');
    for (const issue of allIssues) console.log(`  [${issue.area}] ${issue.message}`);
    process.exitCode = 1;
  } else {
    console.log('\n所有已知資料集皆通過基本品質檢查。');
  }
}

main().catch((err) => {
  console.error('[data:validate] 發生未預期錯誤：', err);
  process.exitCode = 1;
});
