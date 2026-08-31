/**
 * Part F/H 共用的 provenance 原型。
 *
 * 目的：讓「這筆內容有多可信」變成資料層本身的欄位，而不是 UI 自己臆測。deity（Part F）
 * 跟 worship guide（Part H）都用同一套 `ProvenancedField<T>`，不要各自發明一套。
 */

export type SourceReference = {
  title: string;
  url?: string;
  publisher?: string;
  accessedAt?: string;
  note?: string;
};

export type ProvenanceStatus = 'verified' | 'sample' | 'placeholder' | 'unavailable';

/**
 * FACT：可查核的事實（政府資料、官方文獻、可驗證的歷史資訊）。
 * FOLKLORE：民間普遍流傳的說法/習俗，可能因地區、廟宇而異，沒有單一「正確答案」，但流傳範圍夠廣、
 * 不特別綁定某個地方或某間廟。
 * LOCAL_CUSTOM：明確綁定特定地區/廟宇/族群的習慣或禁忌（例如「某某廟規定入廟要脫帽」「某地說法忌諱
 * 某件事」），跟 FOLKLORE 的差異是：FOLKLORE 是「大家普遍這樣說」，LOCAL_CUSTOM 是「這是某個地方的
 * 說法，不是全台通用」。特別是「禁忌」類內容很容易被寫成斬釘截鐵的通則，實際上往往只是某地習慣，
 * 需要這個分類才能誠實標示，不能直接歸進 FOLKLORE 混為一談。
 * EDITORIAL：本站自己的文案/語氣內容（分享卡文案、生活一句），不是外部事實或習俗陳述。
 */
export type ContentType = 'FACT' | 'FOLKLORE' | 'LOCAL_CUSTOM' | 'EDITORIAL';

export type ProvenancedField<T> = {
  value: T;
  status: ProvenanceStatus;
  contentType: ContentType;
  sources: SourceReference[];
};

/**
 * 規則：status 是 'verified' 就一定要有至少一個來源，不能空口說白話標成 verified。
 * sample / placeholder / unavailable 沒有這個限制（sample 通常就是還沒找到可靠來源）。
 */
export function isValidProvenancedField(field: ProvenancedField<unknown>): boolean {
  return field.status !== 'verified' || field.sources.length > 0;
}
