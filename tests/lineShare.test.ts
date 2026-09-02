import { describe, expect, it } from 'vitest';
import { buildLineShareUrl, SITE_URL } from '../src/lib/share/lineShare';

// Part（bug fix round）：這輪修的其中一個真實 bug 是「分享到 LINE 的文字完全沒有帶網站連結」——
// 朋友收到訊息看不到、也點不回網站，等於分享沒有辦法幫網站帶來新使用者。這裡守住「預設一定要
// 帶網址」這個規則，避免以後改壞。
describe('buildLineShareUrl', () => {
  it('includes the site link by default so recipients can click back to the site', () => {
    const url = buildLineShareUrl('今天是好日子');
    expect(url.startsWith('https://line.me/R/msg/text/?')).toBe(true);
    const decoded = decodeURIComponent(url.replace('https://line.me/R/msg/text/?', ''));
    expect(decoded).toContain('今天是好日子');
    expect(decoded).toContain(SITE_URL);
  });

  it('can omit the site link when explicitly asked (e.g. very short temple share texts)', () => {
    const url = buildLineShareUrl('順路廟', { includeSiteLink: false });
    const decoded = decodeURIComponent(url.replace('https://line.me/R/msg/text/?', ''));
    expect(decoded).toBe('順路廟');
    expect(decoded).not.toContain(SITE_URL);
  });
});
