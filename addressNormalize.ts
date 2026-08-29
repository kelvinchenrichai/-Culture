/**
 * Deterministic 地址正規化（Part C3）。
 *
 * 目的只是讓同一間廟在不同資料來源裡長得夠像，方便 dedupe 與顯示一致，
 * 不是要做完整地址標準化服務。永遠保留 rawAddress，這裡只回傳「正規化後」的字串。
 */
export function normalizeAddress(raw: string | undefined | null): string {
  if (!raw) return '';
  let text = raw;

  // 全形空格、Tab 一律轉半形空格，再收斂連續空白。
  text = text.replace(/[　\t]/g, ' ').replace(/\s+/g, ' ').trim();

  // 台/臺不統一是政府資料裡最常見的落差來源，全部收斂成「臺」（維持公文用字）。
  text = text.replace(/台/g, '臺');

  // 常見全形數字/符號轉半形，門牌號碼比對常因全半形不同而 dedupe 失敗。
  const fullWidthDigits = '０１２３４５６７８９';
  text = text.replace(/[０-９]/g, (ch) => String(fullWidthDigits.indexOf(ch)));
  text = text.replace(/－/g, '-').replace(/巷/g, '巷').replace(/　/g, ' ');

  // 去掉地址中間多餘的空白（政府資料常見「臺北市 大安區 忠孝東路」這種以空白分隔行政區的格式）。
  text = text.replace(/\s+/g, '');

  return text;
}

/**
 * 正規化廟名：去除全形/半形空白、常見裝飾符號，供 dedupe 用。
 * 不去除「宮」「廟」「寺」等字——那是名字的一部分，不是雜訊。
 */
export function normalizeTempleName(raw: string | undefined | null): string {
  if (!raw) return '';
  return raw
    .replace(/[　\t\s]/g, '')
    .replace(/台/g, '臺')
    .replace(/[「」『』()（）]/g, '');
}
