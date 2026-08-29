/**
 * Part D：地方政府座標 enrichment CLI（目前實作：新北市寺廟資料，Dataset 122928）。
 *
 * 這支 script 只是把 src/lib/temples/coordinateEnrichment.ts 的比對邏輯接上檔案 I/O，
 * 真正的比對規則（conservative match、confidence 分級）在那個檔案，有獨立測試覆蓋
 * （tests/coordinateEnrichment.test.ts）。
 *
 * Usage:
 *   tsx scripts/enrich-temple-coordinates.ts --input <新北市原始檔.json|.csv>
 *     [--temples public/data/temples/national-temples.json]
 *     [--review-output data/temples/coordinate-review.json]
 *
 * 誠實記錄：這支 script 這一輪沒有實際跑過真的新北市資料——data.gov.tw／data.ntpc.gov.tw
 * 在這個雲端環境都連不上（跟 dataset 8203/8209 一樣被網路白名單擋掉，見
 * docs/data-sources.md）。這裡只完成架構本身，換一個能連線的環境、或手動下載新北市資料後
 * 用 --input 帶進來，就能實際跑（不需要改任何程式碼）。
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { matchCoordinateCandidates, applyHighConfidenceMatches, type CandidateCoordinateRecord } from '../src/lib/temples/coordinateEnrichment';
import type { Temple } from '../src/lib/temples/types';

const DATASET_NAME = '新北市寺廟資料（政府資料開放授權條款第1版）';
const DATASET_ID = '122928';

type CliArgs = { input?: string; temples: string; reviewOutput: string };

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { temples: 'public/data/temples/national-temples.json', reviewOutput: 'data/temples/coordinate-review.json' };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--input') args.input = argv[++i];
    else if (arg === '--temples') args.temples = argv[++i];
    else if (arg === '--review-output') args.reviewOutput = argv[++i];
  }
  return args;
}

function pick(row: Record<string, unknown>, ...keys: string[]): unknown {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== '') return row[key];
  }
  return undefined;
}

function toCandidate(row: Record<string, unknown>): CandidateCoordinateRecord | undefined {
  const name = String(pick(row, '寺廟名稱', 'name') ?? '').trim();
  const lat = Number(pick(row, '緯度', 'latitude', 'lat'));
  const lng = Number(pick(row, '經度', 'longitude', 'lng'));
  if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;
  return {
    name,
    address: (pick(row, '地址', 'address') as string | undefined) || undefined,
    district: (pick(row, '行政區', 'district') as string | undefined) || undefined,
    mainDeity: (pick(row, '主祀神祇', 'mainDeity') as string | undefined) || undefined,
    lat,
    lng,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input) {
    console.error('用法：tsx scripts/enrich-temple-coordinates.ts --input <新北市原始檔.json|.csv>');
    console.error('這支 script 沒有「直接從 data.gov.tw 下載」的分支——新北市資料集網址目前這個');
    console.error('環境連不上，跟其他 dataset 一樣被網路白名單擋掉，見 docs/data-sources.md。');
    process.exitCode = 1;
    return;
  }

  const raw = JSON.parse(await readFile(resolve(args.input), 'utf8'));
  const records: Record<string, unknown>[] = Array.isArray(raw) ? raw : (raw.records ?? raw.result?.records ?? []);
  const candidates = records.map(toCandidate).filter((c): c is CandidateCoordinateRecord => Boolean(c));

  const temples: Temple[] = JSON.parse(await readFile(resolve(args.temples), 'utf8'));
  const matches = matchCoordinateCandidates(temples, candidates);
  const highMatches = matches.filter((m) => m.confidence === 'high');
  const reviewMatches = matches.filter((m) => m.confidence !== 'high');

  const { updated, appliedCount } = applyHighConfidenceMatches(temples, highMatches, {
    name: DATASET_NAME,
    datasetId: DATASET_ID,
    updatedAt: new Date().toISOString(),
  });

  await writeFile(resolve(args.temples), JSON.stringify(updated, null, 2) + '\n', 'utf8');
  await writeFile(resolve(args.reviewOutput), JSON.stringify(reviewMatches, null, 2) + '\n', 'utf8');

  console.log('[enrich-temple-coordinates] 完成');
  console.log(`  候選座標筆數：${candidates.length}`);
  console.log(`  high confidence 自動套用：${appliedCount}`);
  console.log(`  medium/low confidence 待人工複核：${reviewMatches.length}（已寫入 ${args.reviewOutput}）`);
}

main().catch((err) => {
  console.error('[enrich-temple-coordinates] 發生未預期錯誤：', err);
  process.exitCode = 1;
});
