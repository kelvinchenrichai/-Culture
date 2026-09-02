import { describe, expect, it } from 'vitest';
import { ShareCardService, createGenericShareCardSvg, CARD_THEMES } from '../src/lib/share/shareCardService';
it('generates an SVG card', () => expect(new ShareCardService().createSvg({ date: '2026-08-29', weekday: '星期六', lunar: { month: '七月', day: '十七', display: '七月十七' }, good: ['祭祀'], bad: ['嫁娶'], deityBirthdays: [], sources: ['test'], primarySource: 'LunarData', verificationSources: [], hasConflict: false })).toContain('<svg'));

// Part（bug fix round）：這個 generic SVG 產生器是為了修「分享卡沒有圖片可以下載」這個 bug 新加的——
// 它是唯一真的被 ShareCardModal 接上的圖卡產生邏輯，所以要測到「內容真的有進到 SVG 裡」，
// 不是只測「回傳一個字串」。
describe('createGenericShareCardSvg', () => {
  it('embeds the title, lines, quote and footer text into the SVG', () => {
    // 標題故意用短字串（在單行斷行門檻之內），這樣才是單純測「內容有沒有進到 SVG 裡」，
    // 不會跟下面「長標題要斷行」的行為混在一起。
    const svg = createGenericShareCardSvg(
      { eyebrow: '好日子分享', title: '好日子：9/7', lines: ['適合「剪頭髮」', '農曆 丙午年 七月小廿六'], quote: '祝你順心', footer: '今日好日 · 台灣民俗生活指南' },
      CARD_THEMES.paper
    );
    expect(svg).toContain('<svg');
    expect(svg).toContain('好日子：9/7');
    expect(svg).toContain('適合「剪頭髮」');
    expect(svg).toContain('祝你順心');
    expect(svg).toContain('今日好日 · 台灣民俗生活指南');
  });

  it('escapes XML-special characters so a "&" or "<" in content cannot break the SVG', () => {
    const svg = createGenericShareCardSvg(
      { eyebrow: 'test', title: '土地公 & 財神', lines: ['A < B'], footer: 'x' },
      CARD_THEMES.dark
    );
    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).not.toContain('土地公 & 財神');
  });

  it('wraps long lines instead of letting them overflow the fixed-width card', () => {
    const longLine = '這是一段刻意寫得很長很長很長很長很長很長很長很長的供品清單內容';
    const svg = createGenericShareCardSvg({ eyebrow: 'e', title: 't', lines: [longLine], footer: 'f' }, CARD_THEMES.green);
    // 斷行後，原始的完整長句不會整段連續出現在單一個 <text> 節點裡
    expect(svg).not.toContain(`>${longLine}<`);
  });

  it('wraps a long title instead of letting it overflow the card width (bug fix round)', () => {
    // 真實案例：「生活決策卡」樣式的標題是 initialData.primaryText.split('！')[0]，只要呼叫端
    // 傳進來的 primaryText 不含「！」（例如把整段神明介紹文字當 primaryText），標題就會是一整段
    // 長文字。修之前標題是單一個沒有斷行的 <text>，下載出來的圖卡標題會直接切齊到畫面外、看不完整。
    const longTitle = '阿彌陀佛是西方極樂世界的教主，發四十八大願接引念佛眾生往生淨土';
    const svg = createGenericShareCardSvg({ eyebrow: 'e', title: longTitle, lines: ['x'], footer: 'f' }, CARD_THEMES.paper);
    expect(svg).not.toContain(`>${longTitle}<`);
    // 斷成多行後，每一行標題文字都不應該比原本的整段還長（也就是真的斷開了，不是只是巧合沒完整比對到）
    const titleTexts = [...svg.matchAll(/font-size="64"[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
    expect(titleTexts.length).toBeGreaterThan(1);
    for (const line of titleTexts) {
      expect(line.length).toBeLessThan(longTitle.length);
    }
  });

  it('truncates an extremely long title to at most 3 lines with an ellipsis', () => {
    const veryLongTitle = '一二三四五六七八九十'.repeat(10); // 100 chars，遠超過 3 行能放的量
    const svg = createGenericShareCardSvg({ eyebrow: 'e', title: veryLongTitle, lines: ['x'], footer: 'f' }, CARD_THEMES.paper);
    const titleTexts = [...svg.matchAll(/font-size="64"[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
    expect(titleTexts.length).toBe(3);
    expect(titleTexts[2].endsWith('…')).toBe(true);
  });

  it('prefers breaking at punctuation over cutting a word in half', () => {
    // 真實案例：找好日子分享卡曾經把「農民曆列宜：剃頭」硬切成「...農民曆列宜」+「：剃頭」兩行，
    // 「：」孤零零留在下一行開頭，很不自然。斷行後每一行都不應該以標點符號開頭。
    const svg = createGenericShareCardSvg(
      { eyebrow: 'e', title: 't', lines: ['農曆 丙午年 七月小廿六 · 農民曆列宜：剃頭'], footer: 'f' },
      CARD_THEMES.paper
    );
    const textLines = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
    for (const line of textLines) {
      expect(line.startsWith('：')).toBe(false);
      expect(line.startsWith('、')).toBe(false);
    }
  });
});
