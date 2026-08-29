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
export type DeityProfile = {
  id: string;
  name: ProvenancedField<string>;
  aliases: ProvenancedField<string[]>;
  birthday: ProvenancedField<string[]>;
  beliefs: ProvenancedField<string[]>;
  commonPrayers: ProvenancedField<string[]>;
  offerings: ProvenancedField<string[]>;
  worshipSteps: ProvenancedField<string[]>;
  culturalBackground: ProvenancedField<string>;
};
