/**
 * Part（Data Completion Foundation）：圖片資產 metadata schema。
 *
 * 這個檔案本身不放任何圖片，只定義「一張圖片要記錄哪些欄位」。目的是避免重蹈很多網站的問題——
 * 圖片來源、授權條款隨時間流失，最後沒有人知道能不能繼續合法使用。每一張圖片，不論是外部授權
 * 取得還是自製插畫，都要走同一套 schema，沒有例外。
 *
 * 五個分類對應網站目前實際會用到圖片的地方：神明、寺廟、慶典、供品、拜拜動作（例如「上香」步驟圖）。
 */
export type ImageCategory = 'deity' | 'temple' | 'festival' | 'offering' | 'action';

export type ImageAsset = {
  id: string;
  category: ImageCategory;
  /** 對應的實體 id，例如神明 id（'tudigong'）、寺廟 id、慶典 id；offering/action 類別可能沒有單一對應實體 */
  subjectId?: string;
  /** 無障礙必要欄位，不可省略 */
  alt: string;
  /** 圖片來源網站或單位，例如「文化部 國家文化記憶庫」「自製插畫」 */
  source: string;
  /** 授權條款名稱，例如 'CC BY 4.0'、'政府資料開放授權條款第 1 版'、'自製插畫（今日好日原創）' */
  license: string;
  /** 依授權條款要求顯示的署名文字，自製或不需署名的授權可留空 */
  attribution?: string;
  originalUrl?: string;
  /** ISO 日期字串 */
  downloadedAt?: string;
  /** 儲存在 repo 裡的相對路徑 */
  localPath?: string;
  /** 是否已人工核對授權條款確實允許這樣使用——不是「有填 license 欄位」就等於 true */
  verified: boolean;
};

/** 回傳問題清單，空陣列代表這筆資料合格。不丟例外，讓呼叫端決定要怎麼處理（累積成報表最常見）。 */
export function validateImageAsset(asset: ImageAsset): string[] {
  const issues: string[] = [];
  if (!asset.id.trim()) issues.push('id 不可為空');
  if (!asset.alt.trim()) issues.push(`(${asset.id}) alt 不可為空，這是無障礙必要欄位`);
  if (!asset.source.trim()) issues.push(`(${asset.id}) source 不可為空`);
  if (!asset.license.trim()) issues.push(`(${asset.id}) license 不可為空`);
  if (asset.verified && (!asset.source.trim() || !asset.license.trim())) {
    issues.push(`(${asset.id}) verified=true 但 source/license 不完整，不能標記為已核實`);
  }
  return issues;
}
