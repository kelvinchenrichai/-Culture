/**
 * Part C：全國寺廟資料 build-time importer。
 *
 * Primary source：台灣政府資料開放平台，全國宗教資訊系統資料－寺廟（Dataset 8203）。
 *
 * 這支 script 只在 build-time / 開發機執行，瀏覽器 runtime 永遠只讀它產出的
 * static JSON（public/data/temples/national-temples.json），不會在使用者的瀏覽器裡
 * 直接打 data.gov.tw（Part C1）。
 *
 * Usage:
 *   tsx scripts/import-national-temples.ts --input <file.json|file.csv> [--output <path>] [--missing-output <path>]
 *   tsx scripts/import-national-temples.ts                                   # 嘗試直接從 data.gov.tw 下載
 *
 * 如果沒有 --input 且下載失敗（網路被擋、逾時、格式改變等），這支 script 會印出清楚的
 * BLOCKED 訊息並以非 0 結束，「不會」用假資料填充 output，也不會覆蓋既有的正式輸出檔
 * （Part P：查不到就標記 BLOCKED，不要自行造假）。
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { normalizeAddress, normalizeTempleName } from '../src/lib/temples/addressNormalize';
import { normalizeDeityName } from '../src/lib/temples/deityAliases';
import { dedupeTemples } from '../src/lib/temples/dedupe';
import type { Temple } from '../src/lib/temples/types';

const DATASET_ID = '8203';
const DATASET_NAME = '全國宗教資訊系統資料－寺廟（政府資料開放授權條款第1版）';
// data.gov.tw 的 CKAN REST API；實際 resource 下載網址會隨資料集版本變動，
// 所以先打 dataset metadata API 找出目前的 resource url，而不是寫死一個檔案連結。
const DATASET_METADATA_URL = `https://data.gov.tw/api/v2/rest/dataset/${DATASET_ID}`;

type CliArgs = { input?: string; output: string; missingOutput: string };

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { output: 'public/data/temples/national-temples.json', missingOutput: 'data/temples/missing-coordinates.json' };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--input') args.input = argv[++i];
    else if (arg === '--output') args.output = argv[++i];
    else if (arg === '--missing-output') args.missingOutput = argv[++i];
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

function toNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const n = typeof value === 'number' ? value : Number(String(value).trim());
  return Number.isFinite(n) ? n : undefined;
}

/** 極寬鬆的台灣本島＋外島座標範圍檢查，避免明顯錯誤的座標（例如 0,0 或欄位錯位）混進資料。 */
function isPlausibleTaiwanCoordinate(lat?: number, lng?: number): boolean {
  if (lat === undefined || lng === undefined) return false;
  return lat >= 21 && lat <= 26.5 && lng >= 118 && lng <= 123.5;
}

/** 極簡 CSV parser：支援雙引號包欄位與逗號跳脫，足以應付政府開放資料常見的匯出格式。 */
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
      // ignore, \n 會觸發換行
    } else field += ch;
  }
  if (field.length || row.length) pushRow();
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.trim());
  return rows.slice(1).filter((r) => r.some((cell) => cell.trim() !== '')).map((r) => Object.fromEntries(header.map((h, idx) => [h, r[idx]])));
}

const XML_ENTITY_MAP: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

function decodeXmlEntities(text: string): string {
  return text.replace(/&(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);/g, (match, entity: string) => {
    if (entity in XML_ENTITY_MAP) return XML_ENTITY_MAP[entity];
    if (entity.startsWith('#x')) return String.fromCodePoint(parseInt(entity.slice(2), 16));
    if (entity.startsWith('#')) return String.fromCodePoint(parseInt(entity.slice(1), 10));
    return match;
  });
}

/**
 * 極簡 flat-XML parser：只支援「同一層重複同名節點、節點內是純文字、沒有巢狀元素、沒有屬性
 * （root 上的 xmlns 除外）」這種資料集常見的匯出格式（例如 dataset 8203 實測就是這種形狀：
 * `<ArrayOfOpenData_3><OpenData_3><寺廟名稱>...</寺廟名稱>...</OpenData_3>...</ArrayOfOpenData_3>`）。
 * 不引入完整 XML/DOM 套件，因為目前只需要處理這一種形狀；如果之後遇到真的有巢狀結構的政府
 * XML 匯出，再擴充或換函式庫，不要為了假設中的情況先過度設計。
 */
export function parseXml(text: string): RawRecord[] {
  const withoutBom = text.replace(/^﻿/, '');
  const withoutDeclaration = withoutBom.replace(/<\?xml[^?]*\?>/i, '').trim();

  // 找出重複出現的記錄節點名稱：root 元素底下第一個子元素的 tag 名稱。
  const rootMatch = withoutDeclaration.match(/^<([^\s/>]+)[^>]*>([\s\S]*)<\/\1>\s*$/);
  const inner = rootMatch ? rootMatch[2] : withoutDeclaration;
  const firstChildMatch = inner.match(/<([^\s/>]+)[^>]*>/);
  if (!firstChildMatch) return [];
  const recordTag = firstChildMatch[1];

  const recordRegex = new RegExp(`<${recordTag}[^>]*>([\\s\\S]*?)</${recordTag}>`, 'g');
  const records: RawRecord[] = [];
  let recordMatch: RegExpExecArray | null;
  const fieldRegex = /<([^\s/>]+)(?:\s[^>]*)?(?:\/>|>([\s\S]*?)<\/\1>)/g;
  while ((recordMatch = recordRegex.exec(inner)) !== null) {
    const row: RawRecord = {};
    let fieldMatch: RegExpExecArray | null;
    fieldRegex.lastIndex = 0;
    while ((fieldMatch = fieldRegex.exec(recordMatch[1])) !== null) {
      const [, tag, value] = fieldMatch;
      row[tag] = value === undefined ? '' : decodeXmlEntities(value).trim();
    }
    records.push(row);
  }
  return records;
}

export function parseRawRecords(text: string, filename: string): RawRecord[] {
  const lower = filename.toLowerCase();
  const looksLikeXml = lower.endsWith('.xml') || /^\s*(?:﻿)?<\?xml/i.test(text);
  if (looksLikeXml) return parseXml(text);

  const isCsv = lower.endsWith('.csv');
  if (!isCsv) {
    try {
      const json = JSON.parse(text);
      if (Array.isArray(json)) return json as RawRecord[];
      if (json && Array.isArray((json as { records?: unknown }).records)) return (json as { records: RawRecord[] }).records;
      if (json && Array.isArray((json as { result?: { records?: unknown } }).result?.records)) return (json as { result: { records: RawRecord[] } }).result.records;
    } catch {
      // 不是合法 JSON，可能其實是 CSV，往下用 CSV parser 試試看。
    }
  }
  return parseCsv(text);
}

/**
 * 從地址裡切出鄉鎮市區：地址開頭通常是「{縣市}{鄉鎮市區}...」，先盡量把 city 字串當前綴
 * 拿掉，再從剩下的文字比對「幾個中文字＋區/鄉/鎮/市」這種常見的鄉鎮市區命名規則。查不到就
 * 回傳 undefined，不用猜的湊一個。
 */
export function extractDistrictFromAddress(address: string, city: string | undefined): string | undefined {
  const rest = city && address.startsWith(city) ? address.slice(city.length) : address;
  const match = rest.match(/^[一-鿿]{1,6}?(?:區|鄉|鎮|市)/);
  return match ? match[0] : undefined;
}

export function normalizeRecord(row: RawRecord, index: number, fetchedAt: string): { temple?: Temple; skipReason?: string } {
  const rawName = String(pick(row, '寺廟名稱', 'name', 'templeName') ?? '').trim();
  const rawAddress = String(pick(row, '地址', '廟址', 'address') ?? '').trim();
  if (!rawName) return { skipReason: `第 ${index + 1} 筆缺少寺廟名稱` };
  if (!rawAddress) return { skipReason: `第 ${index + 1} 筆（${rawName}）缺少地址` };

  const rawMainDeity = pick(row, '主祀神祇', 'mainDeity') as string | undefined;
  // Dataset 8203 實測欄位是 WGS84X（經度）/WGS84Y（緯度），不是「經度」「緯度」——保留舊欄位名
  // 當備用，讓 fixtures/temples/national-temples-raw-sample.json 這種手造樣本格式也還能用。
  const lat = toNumber(pick(row, '緯度', 'latitude', 'lat', 'WGS84Y'));
  const lng = toNumber(pick(row, '經度', 'longitude', 'lng', 'WGS84X'));
  const hasCoordinate = isPlausibleTaiwanCoordinate(lat, lng);

  // Dataset 8203 只有約 1/4 的記錄有「統一編號」（只有正式登記才會有），但每筆都有政府自己配發
  // 的「編號」，唯一且穩定，比合成 id 可靠很多，優先使用。
  const id = String(pick(row, '編號', '統一編號', 'id') ?? `temple-${normalizeTempleName(rawName)}-${index}`);

  // 樣本 fixture 格式是「縣市」+「行政區」（縣市/鄉鎮市區分開兩個欄位）；dataset 8203 實測格式
  // 只有一個「行政區」欄位，內容其實是縣市層級（例如「臺南市」），鄉鎮市區本身沒有獨立欄位，
  // 只能從地址裡切。兩種格式都要能吃，用「有沒有獨立的縣市欄位」來判斷是哪一種。
  const rawCityField = pick(row, '縣市', 'city') as string | undefined;
  const rawAdminField = pick(row, '行政區', 'district') as string | undefined;
  let city: string;
  let district: string | undefined;
  if (rawCityField) {
    city = rawCityField;
    district = rawAdminField || extractDistrictFromAddress(rawAddress, city);
  } else {
    city = rawAdminField ?? '';
    district = extractDistrictFromAddress(rawAddress, city);
  }

  const temple: Temple = {
    id,
    name: rawName,
    aliases: [],
    rawMainDeity: rawMainDeity || undefined,
    normalizedDeityId: normalizeDeityName(rawMainDeity),
    religion: (pick(row, '教別', 'religion') as string | undefined) || undefined,
    city,
    district,
    rawAddress,
    normalizedAddress: normalizeAddress(rawAddress),
    phone: (pick(row, '電話', 'phone') as string | undefined) || undefined,
    lat: hasCoordinate ? lat : undefined,
    lng: hasCoordinate ? lng : undefined,
    sources: [{ name: DATASET_NAME, datasetId: DATASET_ID, updatedAt: fetchedAt }],
    coordinateStatus: hasCoordinate ? 'government' : 'missing',
  };
  return { temple };
}

async function loadInput(input: string): Promise<string> {
  return readFile(resolve(input), 'utf8');
}

/** 嘗試直接從 data.gov.tw 抓 dataset metadata、找出可下載的 resource，再下載該 resource。 */
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
    console.log(`[import-national-temples] 沒有指定 --input，嘗試直接從 data.gov.tw 下載 dataset ${DATASET_ID} ...`);
    try {
      text = await downloadFromDataGovTw();
      sourceLabel = DATASET_METADATA_URL;
    } catch (err) {
      console.error('='.repeat(72));
      console.error('BLOCKED：無法從 data.gov.tw 取得全國寺廟資料。');
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
  const temples: Temple[] = [];
  const skipped: string[] = [];
  rawRecords.forEach((row, index) => {
    const { temple, skipReason } = normalizeRecord(row, index, fetchedAt);
    if (temple) temples.push(temple);
    else if (skipReason) skipped.push(skipReason);
  });

  const { deduped, duplicatesRemoved } = dedupeTemples(temples);
  const withCoords = deduped.filter((t) => t.coordinateStatus !== 'missing');
  const withoutCoords = deduped.filter((t) => t.coordinateStatus === 'missing');

  await mkdir(dirname(resolve(args.output)), { recursive: true });
  await writeFile(resolve(args.output), JSON.stringify(deduped, null, 2) + '\n', 'utf8');

  await mkdir(dirname(resolve(args.missingOutput)), { recursive: true });
  await writeFile(resolve(args.missingOutput), JSON.stringify(withoutCoords, null, 2) + '\n', 'utf8');

  console.log('[import-national-temples] 完成');
  console.log(`  來源：${sourceLabel}`);
  console.log(`  原始筆數：${rawRecords.length}`);
  console.log(`  格式錯誤跳過：${skipped.length}${skipped.length ? '（' + skipped.slice(0, 5).join('；') + (skipped.length > 5 ? ' ...' : '') + '）' : ''}`);
  console.log(`  去重後：${deduped.length}（移除重複 ${duplicatesRemoved} 筆）`);
  console.log(`  有座標：${withCoords.length}　沒有座標：${withoutCoords.length}`);
  console.log(`  輸出：${args.output}`);
  console.log(`  缺座標清單：${args.missingOutput}`);
}

main().catch((err) => {
  console.error('[import-national-temples] 發生未預期錯誤：', err);
  process.exitCode = 1;
});
