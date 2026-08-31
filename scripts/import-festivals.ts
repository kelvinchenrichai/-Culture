/**
 * Part E：全國慶(祭)典資料 build-time importer。架構刻意跟
 * scripts/import-national-temples.ts 對稱（download → parse → normalize → 輸出），沒有重新發明
 * 一套不同的流程。
 *
 * Primary source：台灣政府資料開放平台，全國宗教資訊系統資料－慶(祭)典（Dataset 8209）。
 *
 * Usage:
 *   tsx scripts/import-festivals.ts --input <file.json|file.csv> [--output <path>]
 *   tsx scripts/import-festivals.ts                                   # 嘗試直接從 data.gov.tw 下載
 *
 * 跟寺廟 importer 一樣：沒有 --input 且下載失敗時，印出 BLOCKED 訊息、非 0 結束，不用假資料
 * 覆蓋既有輸出檔（Part P）。
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { parseFestivalDate } from '../src/lib/festivals/dateParser';
import { normalizeTempleName } from '../src/lib/temples/addressNormalize';
import { TEMPLES } from '../src/data/temples/temples';
import type { ReligiousFestival } from '../src/lib/festivals/types';
import type { SourceReference } from '../src/lib/provenance/types';

const DATASET_ID = '8209';
const DATASET_NAME = '全國宗教資訊系統資料－慶(祭)典（政府資料開放授權條款第1版）';
const DATASET_METADATA_URL = `https://data.gov.tw/api/v2/rest/dataset/${DATASET_ID}`;

type CliArgs = { input?: string; output: string };

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { output: 'public/data/festivals/national-festivals.json' };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--input') args.input = argv[++i];
    else if (arg === '--output') args.output = argv[++i];
  }
  return args;
}

type RawRecord = Record<string, unknown>;

function pick(row: RawRecord, ...keys: string[]): unknown {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== '') return row[key];
  }
  return undefined;
}

/** 極簡 CSV parser，跟 import-national-temples.ts 用同一套邏輯，支援雙引號跳脫。 */
function parseCsv(text: string): RawRecord[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  const pushField = () => {
    row.push(field);
    field = '';
  };
  const pushRow = () => {
    pushField();
    rows.push(row);
    row = [];
  };
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') pushField();
    else if (ch === '\n') {
      if (field.length || row.length) pushRow();
    } else if (ch === '\r') {
      // ignore
    } else field += ch;
  }
  if (field.length || row.length) pushRow();
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.trim());
  return rows.slice(1).filter((r) => r.some((cell) => cell.trim() !== '')).map((r) => Object.fromEntries(header.map((h, idx) => [h, r[idx]])));
}

function parseRawRecords(text: string, filename: string): RawRecord[] {
  const isCsv = filename.toLowerCase().endsWith('.csv');
  if (!isCsv) {
    try {
      const json = JSON.parse(text);
      if (Array.isArray(json)) return json as RawRecord[];
      if (json && Array.isArray((json as { records?: unknown }).records)) return (json as { records: RawRecord[] }).records;
      if (json && Array.isArray((json as { result?: { records?: unknown } }).result?.records)) return (json as { result: { records: RawRecord[] } }).result.records;
    } catch {
      // 可能其實是 CSV，往下用 CSV parser 試試看。
    }
  }
  return parseCsv(text);
}

/** 用正規化廟名比對既有寺廟資料，找到就填 normalizedTempleId；找不到、不確定就留 undefined，不硬猜。 */
function matchTempleId(templeName: string | undefined): string | undefined {
  if (!templeName) return undefined;
  const normalized = normalizeTempleName(templeName);
  return TEMPLES.find((t) => normalizeTempleName(t.name) === normalized)?.id;
}

function normalizeRecord(row: RawRecord, index: number, fetchedAt: string): { festival?: ReligiousFestival; skipReason?: string } {
  const name = String(pick(row, '活動名稱', '慶典名稱', 'name') ?? '').trim();
  if (!name) return { skipReason: `第 ${index + 1} 筆缺少活動名稱` };

  const templeName = (pick(row, '寺廟名稱', 'templeName') as string | undefined) || undefined;
  const rawDateText = String(pick(row, '日期', '舉辦日期', 'date') ?? '').trim();
  const parsed = parseFestivalDate(rawDateText);

  const perRecordSource = pick(row, '來源', 'source') as string | undefined;
  const sources: SourceReference[] = perRecordSource
    ? [{ title: perRecordSource }]
    : [{ title: DATASET_NAME, publisher: '政府資料開放平台', url: `https://data.gov.tw/dataset/${DATASET_ID}`, accessedAt: fetchedAt }];

  const festival: ReligiousFestival = {
    id: String(pick(row, '編號', 'id') ?? `festival-${index}`),
    name,
    templeName,
    normalizedTempleId: matchTempleId(templeName),
    category: (pick(row, '類別', 'category') as string | undefined) || undefined,
    rawDateText,
    parsedStartDate: parsed.start,
    parsedEndDate: parsed.end,
    city: (pick(row, '縣市', 'city') as string | undefined) || undefined,
    district: (pick(row, '行政區', 'district') as string | undefined) || undefined,
    address: (pick(row, '地址', 'address') as string | undefined) || undefined,
    sources,
    dateStatus: parsed.status,
  };
  return { festival };
}

async function loadInput(input: string): Promise<string> {
  return readFile(resolve(input), 'utf8');
}

async function downloadFromDataGovTw(): Promise<string> {
  const metaRes = await fetch(DATASET_METADATA_URL, { signal: AbortSignal.timeout(15000) });
  if (!metaRes.ok) throw new Error(`dataset metadata HTTP ${metaRes.status}`);
  const meta = (await metaRes.json()) as { result?: { resources?: { url?: string }[] } };
  const resourceUrl = meta.result?.resources?.find((r) => r.url)?.url;
  if (!resourceUrl) throw new Error('dataset metadata 沒有可用的 resource url');
  const dataRes = await fetch(resourceUrl, { signal: AbortSignal.timeout(30000) });
  if (!dataRes.ok) throw new Error(`resource 下載 HTTP ${dataRes.status}`);
  return dataRes.text();
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const fetchedAt = new Date().toISOString();

  let text: string;
  let sourceLabel: string;
  if (args.input) {
    text = await loadInput(args.input);
    sourceLabel = args.input;
  } else {
    console.log(`[import-festivals] 沒有指定 --input，嘗試直接從 data.gov.tw 下載 dataset ${DATASET_ID} ...`);
    try {
      text = await downloadFromDataGovTw();
      sourceLabel = DATASET_METADATA_URL;
    } catch (err) {
      console.error('='.repeat(72));
      console.error('BLOCKED：無法從 data.gov.tw 取得全國慶(祭)典資料。');
      console.error(`原因：${(err as Error).message}`);
      console.error('這通常代表目前執行環境的網路政策擋掉了 data.gov.tw，或資料集網址已變動。');
      console.error('依照專案規則，不會用假資料填充輸出檔。請改用 --input 指向手動下載的匯出檔，');
      console.error('或在可連線的環境重新執行本 script。');
      console.error('='.repeat(72));
      process.exitCode = 1;
      return;
    }
  }

  const rawRecords = parseRawRecords(text, sourceLabel);
  const festivals: ReligiousFestival[] = [];
  const skipped: string[] = [];
  rawRecords.forEach((row, index) => {
    const { festival, skipReason } = normalizeRecord(row, index, fetchedAt);
    if (festival) festivals.push(festival);
    else if (skipReason) skipped.push(skipReason);
  });

  const parsedCount = festivals.filter((f) => f.dateStatus === 'parsed').length;
  const partialCount = festivals.filter((f) => f.dateStatus === 'partial').length;
  const unparsedCount = festivals.filter((f) => f.dateStatus === 'unparsed').length;

  await mkdir(dirname(resolve(args.output)), { recursive: true });
  await writeFile(resolve(args.output), JSON.stringify(festivals, null, 2) + '\n', 'utf8');

  console.log('[import-festivals] 完成');
  console.log(`  來源：${sourceLabel}`);
  console.log(`  原始筆數：${rawRecords.length}`);
  console.log(`  格式錯誤跳過：${skipped.length}${skipped.length ? '（' + skipped.slice(0, 5).join('；') + (skipped.length > 5 ? ' ...' : '') + '）' : ''}`);
  console.log(`  日期已 parse：${parsedCount}　部分：${partialCount}　無法判斷：${unparsedCount}`);
  console.log(`  輸出：${args.output}`);
}

main().catch((err) => {
  console.error('[import-festivals] 發生未預期錯誤：', err);
  process.exitCode = 1;
});
