import type { ProvenancedField } from '../provenance/types';

/**
 * Part H：拜拜教學正式資料結構。
 *
 * `notes` 目前用來放「怎麼說」的祈求腳本（自報身家 → 說明來意 → 具體祈求 → 感謝發願），
 * 沒有為此另外開一個 schema 欄位，因為 Simple Mode 的四個按鈕（準備什麼/怎麼拜/怎麼說/
 * 注意什麼）跟這五個欄位本來就不是一對一——「準備什麼」對應 preparation + offerings，
 * 「怎麼說」對應 notes。UI 端做這個分組，資料層維持這個共用結構就好。
 */
export type WorshipGuide = {
  id: string;
  deityId?: string;
  occasion?: string;
  title: string;
  preparation: ProvenancedField<string[]>;
  offerings: ProvenancedField<string[]>;
  steps: ProvenancedField<string[]>;
  etiquette: ProvenancedField<string[]>;
  notes?: ProvenancedField<string[]>;
};
