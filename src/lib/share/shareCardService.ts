import type { CalendarDay } from '../calendar/types';
const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]!));
export class ShareCardService {
  createSvg(day: CalendarDay, brand = '今日好日'): string {
    const good = day.good.slice(0, 4).join('・') || '無明確記載'; const bad = day.bad.slice(0, 4).join('・') || '無明確記載';
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"><rect width="1080" height="1080" fill="#FDF9F3"/><rect x="55" y="55" width="970" height="970" rx="40" fill="none" stroke="#A63A28" stroke-width="6"/><text x="540" y="160" text-anchor="middle" font-size="58" fill="#A63A28" font-family="serif">${escapeXml(brand)}</text><text x="540" y="245" text-anchor="middle" font-size="38" fill="#2C2C2C">${day.date}　${escapeXml(day.weekday)}</text><text x="540" y="305" text-anchor="middle" font-size="32" fill="#5C554E">農曆 ${escapeXml(day.lunar.display)}</text><text x="130" y="445" font-size="52" fill="#2E7D32">宜</text><text x="230" y="445" font-size="34" fill="#2C2C2C">${escapeXml(good)}</text><text x="130" y="595" font-size="52" fill="#A63A28">忌</text><text x="230" y="595" font-size="34" fill="#2C2C2C">${escapeXml(bad)}</text><text x="540" y="850" text-anchor="middle" font-size="30" fill="#736B63">看懂傳統，安心過生活</text><text x="540" y="940" text-anchor="middle" font-size="22" fill="#736B63">資料來源：${escapeXml(day.sources.join('、'))}</text></svg>`;
  }
}
