import type { ReligiousFestival } from '../../lib/festivals/types';
import generated from '../../../public/data/festivals/national-festivals.json';

/**
 * scripts/import-festivals.ts 的產出（見 fixtures/festivals/national-festivals-raw-sample.json）。
 * 目前只有 2 筆 REAL SAMPLE（2026 大甲媽祖遶境進香、2026 保生文化祭）——data.gov.tw 的
 * Dataset 8209 在這個環境連不上，這 2 筆是另外查證公開新聞/官方網站取得的真實活動，
 * 不是政府資料集的全量下載。見 docs/data-coverage.md。
 *
 * 跟 temples.ts 一樣，這個陣列只作為 runtime fetch 失敗時的內建 fallback。
 */
export const FESTIVALS: ReligiousFestival[] = generated as ReligiousFestival[];
