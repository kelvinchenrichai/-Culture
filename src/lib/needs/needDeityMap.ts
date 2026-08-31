import type { ProvenancedField } from '../provenance/types';

/**
 * Part（Data Completion Foundation）：「拜什麼」的反向索引。
 *
 * 使用者通常不是想「查詢關聖帝君」，而是想「工作不順該拜什麼」——`NeedDeityEntry` 把常見的生活需求
 * 對應到現有的神明 id，讓 UI 可以從「需求」出發，而不是只能從「神明百科」出發。
 *
 * 語氣規則（很重要）：文案永遠不能寫成「拜 XX 就會成功／有效」這種因果斷言，只能寫成
 * 「民間信仰中，求○○常見參拜○○」這種對習俗的客觀描述。`description` 欄位本身就要遵守這個規則，
 * UI 端直接顯示這個欄位即可，不要自己在畫面上加油添醋。
 *
 * 目前 `deityIds` 只能引用 `src/data/deities/deities.ts` 已有的 6 位神明——不要因為想讓某個需求
 * 分類看起來「有對應神明」，就編一個不存在的 id 或提前引用還沒建檔的神明。查不到對應神明的需求
 * 分類，`deityIds` 就誠實留空，`note` 說明這是已知缺口（例如考試/生育/司法目前資料庫裡沒有文昌
 * 帝君、註生娘娘、城隍爺），這正好對應 Data Completion Pipeline 裡「30–50 位神明」的待補清單，
 * 不要為了填滿這個表格就提前虛構神明資料。
 */
export type NeedCategory =
  | 'wealth'
  | 'career'
  | 'romance'
  | 'family_safety'
  | 'health'
  | 'academic'
  | 'childbirth'
  | 'justice';

export type NeedDeityEntry = {
  needId: NeedCategory;
  /** 顯示用中文標籤，例如「求財」 */
  label: string;
  /** 使用者實際會想的問題，例如「最近工作不順拜什麼？」，用於搜尋/UI 提示文字 */
  commonQuestion: string;
  /** 依常見度排序，引用 src/data/deities/deities.ts 的 id；查不到對應神明時為空陣列 */
  deityIds: string[];
  /** 客觀描述習俗，不能是因果斷言（見上方語氣規則） */
  description: ProvenancedField<string>;
};

export function findNeedDeityEntry(needId: NeedCategory, entries: NeedDeityEntry[]): NeedDeityEntry | undefined {
  return entries.find((entry) => entry.needId === needId);
}

/** 給定一個神明 id，反查它對應哪些需求分類——RealDeityDetail 之後可以用這個顯示「這位神明常見於哪些需求」 */
export function findNeedsForDeity(deityId: string, entries: NeedDeityEntry[]): NeedDeityEntry[] {
  return entries.filter((entry) => entry.deityIds.includes(deityId));
}
