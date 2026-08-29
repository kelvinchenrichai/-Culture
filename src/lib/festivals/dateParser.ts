/**
 * Part E2：政府慶典資料的日期欄位格式不穩定（可能是單一日期、日期範圍、農曆日期、或純文字描述），
 * 這裡只做「有把握才 parse，沒把握就老實說 unparsed」，不做任何猜測性轉換。
 */

export type ParsedFestivalDate = {
  status: 'parsed' | 'partial' | 'unparsed';
  start?: string;
  end?: string;
};

const SINGLE_DATE = /(\d{2,4})[年\-/](\d{1,2})[月\-/](\d{1,2})日?/;
const RANGE_SEPARATOR = /至|到|～|~|[\s]-[\s]/;

/** 民國年（2-3 碼、小於 200）轉西元年；本來就是西元年（大於 1900）原樣返回；其餘視為無法判斷。 */
function normalizeYear(rawYear: string): number | undefined {
  const y = Number(rawYear);
  if (!Number.isFinite(y)) return undefined;
  if (y > 1900) return y;
  if (y < 200) return y + 1911;
  return undefined;
}

function toIsoDate(year: number, month: number, day: number): string | undefined {
  if (month < 1 || month > 12 || day < 1 || day > 31) return undefined;
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return undefined;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseSingle(text: string): string | undefined {
  const match = SINGLE_DATE.exec(text);
  if (!match) return undefined;
  const year = normalizeYear(match[1]);
  if (!year) return undefined;
  return toIsoDate(year, Number(match[2]), Number(match[3]));
}

export function parseFestivalDate(rawDateText: string): ParsedFestivalDate {
  const text = rawDateText.trim();
  if (!text) return { status: 'unparsed' };
  // 農曆日期沒有可靠的萬年曆轉換來源可用（跟本站曆法政策一樣：不猜農曆↔西元對應），一律 unparsed。
  if (text.includes('農曆')) return { status: 'unparsed' };

  const parts = text
    .split(RANGE_SEPARATOR)
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    const start = parseSingle(parts[0]);
    const end = parseSingle(parts[parts.length - 1]);
    if (start && end) return { status: 'parsed', start, end };
    if (start || end) return { status: 'partial', start, end };
    return { status: 'unparsed' };
  }

  const single = parseSingle(text);
  if (single) return { status: 'parsed', start: single, end: single };
  return { status: 'unparsed' };
}
