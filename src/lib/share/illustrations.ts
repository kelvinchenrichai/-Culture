/**
 * Part（分享卡插畫）：使用者希望分享卡能帶「神明圖片」或「山水」之類的裝飾，讓卡片看起來更
 * 精緻、更像值得收藏轉傳的「長輩圖」。這裡選的做法是純手繪 SVG 向量插畫（山巒、祥雲、蓮花、
 * 廟宇屋簷剪影），不是去網路上找廟宇或神明的照片——原因：
 *   1. 照片有明確的版權/肖像問題（尤其是特定宮廟的神像照片，未經同意商用有實際法律與信仰上的
 *      顧慮，這個專案從 Phase 5 開始就刻意避開「授權不明的網路圖片」）。
 *   2. 向量插畫可以做到跟卡片配色（米白宣紙/朱砂暖紅/墨色典雅/青竹常安）完全搭配，不會有照片
 *      色調對不上、或裁切後主體被切掉的問題。
 * 每個函式回傳一段可以直接嵌進卡片 SVG 的 `<g>...</g>` 標記，用 opacity 做成淡淡的背景裝飾，
 * 不會蓋掉文字。
 */

export type IllustrationMotif = 'mountainWater' | 'lotus' | 'cloud' | 'templeRoofline';

/** 山水剪影：適合「今日宜忌卡」「生活一句卡」這種偏日常、沉靜的內容。 */
function mountainWater(accent: string): string {
  return `<g opacity="0.16" fill="${accent}">
    <path d="M0 1180 L140 1040 L230 1120 L340 980 L470 1120 L600 1000 L760 1160 L920 1030 L1080 1150 L1080 1350 L0 1350 Z"/>
    <path d="M0 1250 L180 1150 L360 1240 L560 1130 L760 1240 L960 1150 L1080 1220 L1080 1350 L0 1350 Z" opacity="0.6"/>
  </g>
  <g opacity="0.12" stroke="${accent}" stroke-width="3" fill="none">
    <path d="M-20 1300 Q 150 1270 320 1300 T 660 1300 T 1000 1300"/>
    <path d="M-20 1320 Q 150 1295 320 1320 T 660 1320 T 1000 1320"/>
  </g>`;
}

/** 蓮花：適合神明祝壽卡——蓮花是最通用、不特定單一宗教/宮廟的祥瑞符號。 */
function lotus(accent: string): string {
  return `<g opacity="0.14" fill="${accent}" transform="translate(540,1180)">
    <path d="M0 0 C -60 -70 -170 -70 -190 10 C -140 40 -60 40 0 0 Z"/>
    <path d="M0 0 C 60 -70 170 -70 190 10 C 140 40 60 40 0 0 Z"/>
    <path d="M0 -10 C -30 -110 -30 -170 0 -220 C 30 -170 30 -110 0 -10 Z"/>
    <path d="M0 0 C -100 -30 -180 10 -170 60 C -100 80 -30 40 0 0 Z" opacity="0.7"/>
    <path d="M0 0 C 100 -30 180 10 170 60 C 100 80 30 40 0 0 Z" opacity="0.7"/>
    <ellipse cx="0" cy="40" rx="60" ry="18"/>
  </g>`;
}

/** 祥雲（如意雲紋）：適合生活決策卡——輕快、帶一點喜氣，不會太厚重。 */
function cloud(accent: string): string {
  return `<g opacity="0.14" fill="${accent}">
    <path d="M900 120 c 30 -40 90 -40 110 0 c 35 -20 80 5 75 45 c 35 5 45 55 10 75 c -10 30 -55 35 -80 15 c -20 25 -65 20 -80 -10 c -40 10 -75 -25 -60 -60 c -25 -20 -15 -65 25 -65 Z"/>
    <path d="M60 1000 c 25 -35 75 -35 95 0 c 30 -18 68 4 64 38 c 30 4 38 47 8 64 c -8 25 -47 30 -68 13 c -17 21 -55 17 -68 -8 c -34 8 -64 -21 -51 -51 c -21 -17 -13 -55 20 -56 Z"/>
  </g>`;
}

/** 廟宇屋簷剪影：適合強調「這是關於某間廟／某位神明」的內容，但刻意抽象化、不指涉特定宮廟。 */
function templeRoofline(accent: string): string {
  return `<g opacity="0.15" fill="${accent}">
    <path d="M0 220 L 160 40 C 200 0 260 0 300 40 L 460 220 L 400 220 L 300 110 C 270 80 230 80 200 110 L 100 220 Z"/>
    <rect x="60" y="220" width="340" height="18"/>
    <rect x="130" y="238" width="30" height="90"/>
    <rect x="310" y="238" width="30" height="90"/>
  </g>`;
}

const MOTIFS: Record<IllustrationMotif, (accent: string) => string> = {
  mountainWater,
  lotus,
  cloud,
  templeRoofline,
};

export function renderMotif(motif: IllustrationMotif, accent: string): string {
  return MOTIFS[motif](accent);
}
