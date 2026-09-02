/**
 * Part（bug fix round /「小節日」擴充）：LunarData 的原始月份 JSON 其實每天都帶一個很完整的
 * `deityInfo` 陣列（神明/節日名稱、稱號、描述、供奉建議、祈求項目…），但過去 `lunarDataProvider`
 * 只把名字字串（`deityBirthday: string[]`）取出來，其餘欄位全部在轉成 `CalendarDay` 這一步被丟掉。
 * 這個型別讓完整內容可以流到 UI 層，而不是每次都要回頭重新解析原始 JSON。
 */
export interface DeityDayEvent {
  /** 事件本身的名稱，例如「阿彌陀佛聖誕」「南斗下降」「臘八節」——不一定是「XX聖誕」的格式。 */
  eventName: string;
  /** 對應的神明/主體名稱，例如「阿彌陀佛」；节日類事件（如臘八節）可能沒有對應單一神明。 */
  deityName?: string;
  title?: string;
  /** 農曆日期原文，例如「農曆十一月十七」。 */
  lunarDate?: string;
  description?: string;
  /** 原始資料裡對神像/場景的文字描述（不是圖片檔案），例如「結跏趺坐，手結接引印」。 */
  imageDescription?: string;
  temple?: string;
  blessing?: string;
  note?: string;
}

export type CalendarDay = {
  date: string;
  weekday: string;
  lunar: { year?: string; month: string; day: string; display: string };
  good: string[];
  bad: string[];
  solarTerm?: string;
  clash?: string;
  luckyHours?: string[];
  deityBirthdays: string[];
  /** 上面 deityBirthdays 的完整版本，含描述/祈求/宮廟等欄位；來源同樣是 LunarData。 */
  deityDayEvents?: DeityDayEvent[];
  /** 當日「善神」清單原文（例如「天赦」「天醫」），用來判斷天赦日等特殊日子。 */
  goodDayGods?: string[];
  badDayGods?: string[];
  sources: string[];
  primarySource: string;
  verificationSources: string[];
  hasConflict: boolean;
  verification?: CalendarDay[];
  /** 干支（日柱），例如 "丁未" */
  ganzhi?: string;
  /** 財神方位，例如 "西南" */
  wealthDirection?: string;
  /** 喜神方位，例如 "正南" */
  blessingDirection?: string;
  /** 彭祖百忌（原文，未逐條 parse），例如 "丁不剃頭 頭必生瘡,未不服藥 毒氣入腸" */
  pengTaboo?: string;
};

export interface CalendarProvider {
  readonly name: string;
  getDay(date: string): Promise<CalendarDay | null> | CalendarDay | null;
}
