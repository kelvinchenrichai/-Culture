import type { Temple } from '../../lib/temples/types';
import generated from '../../../public/data/temples/national-temples.json';

/**
 * 這個陣列現在是 scripts/import-national-temples.ts 的產出（見該檔案與
 * fixtures/temples/national-temples-raw-sample.json），不是手key的假資料。
 *
 * 目前只有 5 筆 REAL SAMPLE（全部在臺北市）—— 因為這個雲端開發環境的網路白名單
 * 擋掉了 data.gov.tw（見 docs/data-sources.md 的 BLOCKED 記錄），還無法真的下載
 * 全國寺廟資料。Pipeline 已經就緒，換一個能連線的環境重跑
 * `pnpm run data:update:temples` 就能取得全量資料，不需要改任何程式碼。
 *
 * Runtime（RealTemplesView）改成直接 fetch `/data/temples/national-temples.json`，
 * 這個 TS 陣列只作為 fetch 失敗時的內建 fallback，兩者共用同一份產出檔，不會有兩份
 * 分歧的資料。
 */
export const TEMPLES: Temple[] = generated as Temple[];
