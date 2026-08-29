import type { ProvenancedField } from '../provenance/types';

/**
 * Part F：神明欄位級 provenance。
 *
 * 這是既有 `Deity`/`DeityService`（today 頁面、今天拜什麼列表用的那個扁平結構）之外，
 * 額外疊加的一層。刻意不去改動 `Deity` 本身或 `DeityService` 的使用方式——那條路徑已經
 * 被 today/RealDeitiesView 等好幾個畫面依賴，貿然改結構風險大於好處。`DeityProfile` 只針對
 * 「優先 6 位神明」提供逐欄位可稽核的版本，`RealDeityDetail` 有資料就多顯示一段，沒有就
 * 維持原本行為，兩者不衝突、不互相覆蓋。
 */
/**
 * 一個神明可能有不只一個「紀念日」——聖誕（出生）、飛昇/得道（例如媽祖）、成道等，且同一個節日
 * 在不同地區/廟宇有時採用不同農曆日期。不要硬選一個當「唯一正確答案」，用陣列＋
 * `regionalVariation` 誠實表示。
 *
 * `regionalVariation: true` 表示「已經查證到不同地區/廟宇確實採用不同日期」，不是「這個日期我沒把握」
 * ——沒把握的情況用 `ProvenancedField.status: 'sample'` 表示就夠了，不要濫用這個旗標，
 * 濫用會讓「真的有地區差異」跟「單純沒查到單一日期」混在一起分不清楚。
 */
export type DeityDateEventType = 'birthday' | 'ascension' | 'enlightenment' | 'other';

export type DeityDateEvent = {
  eventType: DeityDateEventType;
  /** 顯示用標籤，例如「聖誕」「飛昇紀念日」「得道紀念日」 */
  label: string;
  /** 農曆日期，例如「三月廿三」 */
  lunarDate: string;
  /** 已查證到不同地區/廟宇確實採用不同日期時才設為 true，見上方說明 */
  regionalVariation?: boolean;
};

export type DeityProfile = {
  id: string;
  name: ProvenancedField<string>;
  aliases: ProvenancedField<string[]>;
  dates: ProvenancedField<DeityDateEvent[]>;
  beliefs: ProvenancedField<string[]>;
  commonPrayers: ProvenancedField<string[]>;
  offerings: ProvenancedField<string[]>;
  worshipSteps: ProvenancedField<string[]>;
  culturalBackground: ProvenancedField<string>;
};
