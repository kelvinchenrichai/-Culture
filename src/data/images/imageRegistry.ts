import type { ImageAsset } from '../../lib/images/imageAsset';

/**
 * 目前刻意是空的。
 *
 * 這一輪（Data Completion Foundation）只建立 schema 跟驗證規則，沒有實際匯入任何圖片——理由見
 * docs/image-assets.md（上一輪 P2 的稽核結果是 0 張來源不明圖片，代表現有 UI 用的都是 icon/SVG，
 * 沒有真的照片/插畫）。放一張圖片進來之前，必須先填完整這裡的 `ImageAsset` schema，不能只丟一個
 * 檔案路徑就上線——沒有 source/license 的圖片，未來要嘛沒辦法証明能合法使用，要嘛完全沒辦法追溯。
 *
 * 之後最可能的路徑（見 docs/phase-5-foundation.md 的路線圖）：先做「今日好日台灣神明文化插畫系統」
 * （統一風格的自製插畫，license 直接寫「自製插畫（今日好日原創）」，不用煩惱外部授權），而不是先
 * 去找版權不明的網路圖片。
 */
export const IMAGE_ASSETS: ImageAsset[] = [];
