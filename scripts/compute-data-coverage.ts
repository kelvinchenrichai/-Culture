/**
 * Part（Data Completion Foundation）：資料完成度 Dashboard 的資料來源。
 *
 * 用法：pnpm run data:coverage
 *
 * 這支 script 不做任何資料匯入或修改，純粹讀取「現在 repo 裡實際有什麼資料」，算出真實數字，
 * 寫進 docs/data-coverage.json。跟 docs/data-coverage.md（人工維護的敘述性文件）不衝突——
 * 這支 script 產生的是機器可讀、每次跑都會更新的快照，數字對不上時應該以這份 JSON 為準，
 * 回頭修 .md 裡手寫的敘述，而不是反過來。
 *
 * 重要原則：全國寺廟、慶祭典這類我們只有 REAL SAMPLE、不知道政府資料集實際全量筆數的類別，
 * 這裡只回報「樣本內」的覆蓋率（例如樣本裡有幾筆有座標），不會冒充成「全國覆蓋率」——
 * 否則等全量匯入後數字反而會「變差」，變成一個會說謊的 dashboard。
 */
import { writeFile, readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  computeFieldCoverage,
  computeTempleCoverage,
  computeFestivalCoverage,
  computeNeedDeityMapCoverage,
  computeImageCoverage,
} from '../src/lib/coverage/computeCoverage';
import { DEITY_PROFILES } from '../src/data/deities/deityProfiles';
import { NEED_DEITY_MAP } from '../src/data/needs/needDeityMap';
import { IMAGE_ASSETS } from '../src/data/images/imageRegistry';
import { BASIC_WORSHIP_GUIDE } from '../src/data/worship/basicWorshipGuide';
import type { Temple } from '../src/lib/temples/types';
import type { ReligiousFestival } from '../src/lib/festivals/types';

async function readJson<T>(path: string): Promise<T | undefined> {
  try {
    return JSON.parse(await readFile(resolve(path), 'utf8')) as T;
  } catch {
    return undefined;
  }
}

async function computeCalendarCoverage() {
  const calendarRoot = resolve('public/data/calendar');
  let years: string[] = [];
  try {
    years = (await readdir(calendarRoot, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name).sort();
  } catch {
    years = [];
  }
  const monthsPresent: Record<string, number> = {};
  for (const year of years) {
    const files = await readdir(resolve(calendarRoot, year));
    monthsPresent[year] = files.filter((f) => /^\d{2}\.json$/.test(f)).length;
  }
  return {
    yearsCovered: years,
    monthsPresent,
    note: '只列出實際有 JSON 檔案的年份；其他年份 CalendarService 會誠實回傳 unavailable，不會 fallback 到假資料。',
  };
}

async function main() {
  const temples = (await readJson<Temple[]>('public/data/temples/national-temples.json')) ?? [];
  const festivals = (await readJson<ReligiousFestival[]>('public/data/festivals/national-festivals.json')) ?? [];

  const calendar = await computeCalendarCoverage();
  const templeCoverage = computeTempleCoverage(temples);
  const festivalCoverage = computeFestivalCoverage(festivals);
  const needMapCoverage = computeNeedDeityMapCoverage(NEED_DEITY_MAP);
  const imageCoverage = computeImageCoverage(IMAGE_ASSETS);

  const perDeity = DEITY_PROFILES.map((profile) => ({
    id: profile.id,
    ...computeFieldCoverage(profile as unknown as Record<string, unknown>),
  }));
  const deityTotals = perDeity.reduce(
    (acc, d) => ({ verified: acc.verified + d.verifiedFields, total: acc.total + d.totalFields }),
    { verified: 0, total: 0 },
  );

  const worshipGuideCoverage = computeFieldCoverage(BASIC_WORSHIP_GUIDE as unknown as Record<string, unknown>);

  const report = {
    generatedAt: new Date().toISOString().slice(0, 10),
    calendar,
    temples: {
      ...templeCoverage,
      note: 'REAL SAMPLE（pipeline 驗證用），不是全國覆蓋率。全國寺廟總筆數（dataset 8203）目前未知，因為這個環境連不上 data.gov.tw，所以這裡不會用一個猜測的分母算「全國座標覆蓋率」。',
    },
    festivals: {
      ...festivalCoverage,
      note: 'REAL SAMPLE，2 筆查證過的真實 2026 年活動，不是 dataset 8209 全量。',
    },
    deityProfiles: {
      deityCount: DEITY_PROFILES.length,
      fieldsTrackedPerDeity: perDeity[0]?.totalFields ?? 0,
      perDeity,
      overallVerifiedFieldPct:
        deityTotals.total === 0 ? 0 : Math.round((deityTotals.verified / deityTotals.total) * 1000) / 10,
      note: '分母是「本站追蹤的欄位數（name/aliases/dates/beliefs/commonPrayers/offerings/worshipSteps/culturalBackground）」，不是「這位神明理論上有多少可查資訊」，所以這是一個誠實、有明確定義的完成度，但不代表「這位神明的資料已經完整」。',
    },
    worshipGuide: {
      ...worshipGuideCoverage,
      note: '目前只有 1 份 Simple Mode 預設流程（basic-worship），全部欄位皆為 sample／FOLKLORE，尚未有單一權威文獻可引用為 verified，見 docs/data-coverage.md。',
    },
    needDeityMap: {
      ...needMapCoverage,
      note: '分母是本站定義的 8 個生活需求分類，不是「民間信仰理論上有多少需求分類」。gaps 是目前神明資料庫裡沒有對應神明的分類，對應 30–50 位神明擴充清單。',
    },
    images: {
      ...imageCoverage,
      note: '尚未匯入任何圖片（見 docs/image-assets.md 的稽核結果與 src/data/images/imageRegistry.ts 的說明），這是誠實的 0，不是還沒統計。',
    },
  };

  const outPath = resolve('docs/data-coverage.json');
  await writeFile(outPath, JSON.stringify(report, null, 2) + '\n', 'utf8');

  console.log('[data:coverage] 已寫入', outPath);
  console.log('[data:coverage] 摘要：');
  console.log(`  農民曆：涵蓋年份 ${calendar.yearsCovered.join('、') || '（無）'}`);
  console.log(`  寺廟樣本：${templeCoverage.sampleSize} 筆，有座標 ${templeCoverage.withCoordinates} 筆（樣本內 ${templeCoverage.coordinateCoverageOfSamplePct}%）`);
  console.log(`  慶祭典樣本：${festivalCoverage.sampleSize} 筆，日期已解析 ${festivalCoverage.parsedDates} 筆`);
  console.log(`  神明欄位級 verified 比例（${DEITY_PROFILES.length} 位 × ${perDeity[0]?.totalFields ?? 0} 欄位）：${report.deityProfiles.overallVerifiedFieldPct}%`);
  console.log(`  拜什麼對照表：${needMapCoverage.needsWithDeity}/${needMapCoverage.totalNeeds} 個需求分類已有對應神明，缺口：${needMapCoverage.gaps.join('、') || '（無）'}`);
  console.log(`  圖片資產：${imageCoverage.total} 筆`);
}

main().catch((err) => {
  console.error('[data:coverage] 發生未預期錯誤：', err);
  process.exitCode = 1;
});
