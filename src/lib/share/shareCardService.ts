import type { CalendarDay } from '../calendar/types';
const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]!));
export class ShareCardService {
  createSvg(day: CalendarDay, brand = '今日好日'): string {
    const good = day.good.slice(0, 4).join('・') || '無明確記載'; const bad = day.bad.slice(0, 4).join('・') || '無明確記載';
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"><rect width="1080" height="1080" fill="#FDF9F3"/><rect x="55" y="55" width="970" height="970" rx="40" fill="none" stroke="#A63A28" stroke-width="6"/><text x="540" y="160" text-anchor="middle" font-size="58" fill="#A63A28" font-family="serif">${escapeXml(brand)}</text><text x="540" y="245" text-anchor="middle" font-size="38" fill="#2C2C2C">${day.date}　${escapeXml(day.weekday)}</text><text x="540" y="305" text-anchor="middle" font-size="32" fill="#5C554E">農曆 ${escapeXml(day.lunar.display)}</text><text x="130" y="445" font-size="52" fill="#2E7D32">宜</text><text x="230" y="445" font-size="34" fill="#2C2C2C">${escapeXml(good)}</text><text x="130" y="595" font-size="52" fill="#A63A28">忌</text><text x="230" y="595" font-size="34" fill="#2C2C2C">${escapeXml(bad)}</text><text x="540" y="850" text-anchor="middle" font-size="30" fill="#736B63">看懂傳統，安心過生活</text><text x="540" y="940" text-anchor="middle" font-size="22" fill="#736B63">資料來源：${escapeXml(day.sources.join('、'))}</text></svg>`;
  }
}

/**
 * Part（bug fix round）：原本這個 service 有寫測試，但完全沒有被 ShareCardModal 接上——
 * 使用者在畫面上看到的「精美卡片」其實只是網頁上的即時預覽，沒有任何存成圖片的按鈕，
 * 長輩想轉傳到 LINE 只能傳純文字。這個函式產生一張跟分享卡通用內容對應的 1080x1350
 * SVG（直式、适合手機直向轉傳），給 ShareCardModal 轉成 PNG 下載用。
 */
export interface GenericCardTheme {
  bg: string;
  bgAccent?: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
}

export const CARD_THEMES: Record<'paper' | 'vermilion' | 'dark' | 'green', GenericCardTheme> = {
  paper: { bg: '#FFFFFF', border: '#E8E1D5', text: '#2C2C2C', textMuted: '#736B63', accent: '#A63A28' },
  vermilion: { bg: '#FFF5F2', border: '#F2C0B8', text: '#2C2C2C', textMuted: '#7A5347', accent: '#A63A28' },
  dark: { bg: '#22201E', border: '#38332E', text: '#FAF6F0', textMuted: '#B8AFA6', accent: '#E8B14A' },
  green: { bg: '#F2F7F3', border: '#CDE3D1', text: '#2C2C2C', textMuted: '#5C7A63', accent: '#2E7D32' },
};

export interface GenericCardContent {
  eyebrow: string;
  title: string;
  lines: string[];
  quote?: string;
  footer: string;
}

/**
 * 把一段文字依照每行大約可放的字數做斷行，避免長句子在圖卡裡被裁掉或擠在一起。
 * 優先在標點/空格（、。· ：，）附近斷行，避免像「農民曆列宜」被硬切成「農民曆列宜」
 * 跟單獨一行的「：剃頭」這種不自然的斷法；找不到合適標點才退回硬斷。
 */
const BREAK_CHARS = ['、', '。', '，', '·', ' ', '：', '；'];
function wrapText(value: string, maxCharsPerLine: number): string[] {
  if (value.length <= maxCharsPerLine) return [value];
  const rows: string[] = [];
  let rest = value;
  while (rest.length > maxCharsPerLine) {
    const window = rest.slice(0, maxCharsPerLine + 1);
    let breakAt = -1;
    for (let i = window.length - 1; i >= Math.floor(maxCharsPerLine * 0.5); i -= 1) {
      if (BREAK_CHARS.includes(window[i])) {
        breakAt = i + 1; // 標點留在上一行
        break;
      }
    }
    if (breakAt === -1) breakAt = maxCharsPerLine;
    rows.push(rest.slice(0, breakAt).trimEnd());
    rest = rest.slice(breakAt).trimStart();
  }
  if (rest) rows.push(rest);
  return rows;
}

export function createGenericShareCardSvg(content: GenericCardContent, theme: GenericCardTheme): string {
  const width = 1080;
  const height = 1350;
  const lineRows = content.lines.flatMap((line) => wrapText(line, 20));
  let y = 560;
  const lineSvgs = lineRows
    .map((line) => {
      const svg = `<text x="90" y="${y}" font-size="40" fill="${theme.text}" font-family="'Noto Serif TC', serif">${escapeXml(line)}</text>`;
      y += 66;
      return svg;
    })
    .join('');
  const quoteRows = content.quote ? wrapText(content.quote, 22) : [];
  let quoteY = y + 60;
  const quoteSvgs = quoteRows
    .map((line) => {
      const svg = `<text x="540" y="${quoteY}" text-anchor="middle" font-size="32" font-style="italic" fill="${theme.textMuted}" font-family="'Noto Serif TC', serif">${escapeXml(line)}</text>`;
      quoteY += 48;
      return svg;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${theme.bg}"/>
    <rect x="50" y="50" width="${width - 100}" height="${height - 100}" rx="36" fill="none" stroke="${theme.border}" stroke-width="4"/>
    <text x="${width - 130}" y="200" text-anchor="middle" font-size="140" fill="${theme.accent}" opacity="0.12" font-family="'Noto Serif TC', serif">吉</text>
    <text x="90" y="220" font-size="34" fill="${theme.accent}" font-family="'Noto Sans TC', sans-serif" font-weight="700">${escapeXml(content.eyebrow)}</text>
    <text x="90" y="320" font-size="64" fill="${theme.text}" font-family="'Noto Serif TC', serif" font-weight="900">${escapeXml(content.title)}</text>
    <line x1="90" y1="380" x2="${width - 90}" y2="380" stroke="${theme.border}" stroke-width="3"/>
    ${lineSvgs}
    ${quoteSvgs}
    <line x1="90" y1="${height - 150}" x2="${width - 90}" y2="${height - 150}" stroke="${theme.border}" stroke-width="3"/>
    <text x="90" y="${height - 95}" font-size="28" fill="${theme.textMuted}" font-family="'Noto Sans TC', sans-serif">${escapeXml(content.footer)}</text>
    <text x="${width - 90}" y="${height - 95}" text-anchor="end" font-size="28" fill="${theme.textMuted}" font-family="'Noto Sans TC', sans-serif">culture-as5.pages.dev</text>
  </svg>`;
}
