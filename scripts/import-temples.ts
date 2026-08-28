import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , input, output = 'temples.normalized.json'] = process.argv;
if (!input) throw new Error('Usage: pnpm import:temples <input.json> [output.json]');
const records = JSON.parse(readFileSync(resolve(input), 'utf8')) as Record<string, unknown>[];
const value = (row: Record<string, unknown>, ...keys: string[]) => keys.map(key => row[key]).find(Boolean);
const normalized = records.map((row, index) => ({
  id: String(value(row, '統一編號', 'id') ?? `temple-${index + 1}`),
  name: String(value(row, '寺廟名稱', 'name') ?? ''),
  mainDeity: value(row, '主祀神祇', 'mainDeity'), city: value(row, '縣市', 'city'), district: value(row, '行政區', 'district'),
  address: String(value(row, '地址', 'address') ?? ''), phone: value(row, '電話', 'phone'),
  latitude: value(row, '緯度', 'latitude'), longitude: value(row, '經度', 'longitude'),
  source: '全國宗教資訊系統資料－寺廟（政府資料開放授權條款第1版）',
}));
writeFileSync(resolve(output), JSON.stringify(normalized, null, 2));
console.log(`Imported ${normalized.length} records to ${output}`);
