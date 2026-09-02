/**
 * Part（bug fix round）：LINE 分享的共用邏輯，原本散落在各元件各自組字串，
 * 而且原本的版本只帶文字、沒有帶回網站連結——朋友收到訊息後沒辦法點回來，
 * 等於分享出去的內容沒辦法幫網站帶來新的使用者。統一收在這裡，確保每一次
 * 分享都附上網址，也方便之後要換網域時只改一個地方。
 */

/** 正式站網址。之後如果換網域，只需要改這裡。 */
export const SITE_URL = 'https://culture-as5.pages.dev';

/**
 * 組出 LINE 官方的「分享到聊天/群組」深連結。
 * https://line.me/R/msg/text/?{text} 是 LINE 官方文件的公開分享格式，不需要任何 API key 或登入。
 */
export function buildLineShareUrl(text: string, options: { includeSiteLink?: boolean } = {}): string {
  const { includeSiteLink = true } = options;
  const finalText = includeSiteLink ? `${text}\n\n👉 ${SITE_URL}` : text;
  return `https://line.me/R/msg/text/?${encodeURIComponent(finalText)}`;
}

/** 開新分頁分享到 LINE。放成獨立函式方便測試（jsdom 環境可以 spy window.open）。 */
export function shareToLine(text: string, options?: { includeSiteLink?: boolean }): void {
  const url = buildLineShareUrl(text, options);
  window.open(url, '_blank');
}
