# Image / Visual Asset Audit（Part I）

這份文件記錄「Production 實際使用了哪些視覺素材、來源與授權狀態」。每次新增圖示、插畫或
照片素材時，應該回來更新這份文件。

最後稽核：2026-08-29（Phase 4 P2，feature/folklore-data-content 分支）。

## 稽核方法

搜尋了整個 repo 裡會被打包進 production bundle 的內容：`App.tsx`、`components/`、`src/`、
`styles/`、`public/`（排除 `node_modules` 與測試/腳本輸出）裡的 `<img>`、`.png`/`.jpg`/`.jpeg`/
`.svg`/`.gif`/`.webp` 檔案參照、CSS `background-image`/`url()`。結果：**沒有任何一個
result。** `public/` 目錄底下也沒有任何圖片檔案（甚至沒有 favicon）。

## 結論：目前沒有任何照片類素材，unknown-license 圖片數量為 0

| 素材類型 | 使用方式 | 來源 | 授權 | Attribution | 狀態 |
| --- | --- | --- | --- | --- | --- |
| 介面圖示 | `lucide-react`（npm 套件，`^0.546.0`），全站約 21 個檔案使用，涵蓋所有行為 icon（剪頭髮/拜拜/搬家/開工/結婚/出行等）與 UI 元件 icon | [lucide-react](https://lucide.dev/) | ISC License（開源、允許商用，`node_modules` 內附授權檔） | 套件本身在 `package.json` 依賴中列出，不需要逐檔標示 | ✅ 已授權釐清 |
| 分享卡圖片 | `src/lib/share/shareCardService.ts` 用純文字+shape 組出一份 SVG（1080×1080），沒有引用任何外部圖片或字型檔外的素材 | 本站自製（程式產生，非設計素材） | 本站所有 | 不適用 | ✅ 自製，無授權疑慮 |
| 網頁字型 | Noto Sans TC / Noto Serif TC，透過 `index.html` 的 Google Fonts CDN 載入 | Google Fonts | SIL Open Font License 1.1（開源、允許商用） | Google Fonts 本身即為公開授權字型服務，不需額外標示 | ✅ 已授權釐清 |
| 神明/ 寺廟照片 | **無** | — | — | — | ✅ 目前完全沒有使用，也還沒有解決「合法照片從哪裡來」這個問題 |
| Favicon / App icon | **無**（`index.html` 沒有 `<link rel="icon">`） | — | — | — | ⚠️ 不是授權問題，是缺件；不在 Part I 範圍內，記錄在 KNOWN ISSUES |

**Unknown-license production images：0（目標達成）。**

## 為什麼目前是 0，不是「還沒開始」

Part A9（長輩 UX 的視覺素材）在 Phase 4 P0 那一輪已經確認：現有畫面本來就只用
`lucide-react` 圖示，沒有來源不明的照片問題，這條規則當時就維持現狀、沒有新增程式碼。
這一輪的稽核是重新逐一檢查一次結論是否還成立（新增的 find-days／worship-guide／deity
provenance 功能都沒有引入任何圖片），確認沒有 regression。

## 如果之後真的要放神明 / 寺廟照片

依照專案規則（Part B），只有來源與授權明確時才能使用照片：

- 政府開放資料集本身如果附圖（例如全國宗教資訊系統資料的寺廟照片，如果有的話）需要另外
  確認該資料集的圖片授權條款是否涵蓋圖片本身，不能假設「資料開放」就等於「圖片可以隨便用」。
- 廟方官方網站或粉專的照片需要**個別取得授權**，不能直接搬運。
- 沒有合法照片來源時，維持現況（icon / 自製 SVG / 一致的文化風插畫佔位），不要為了「畫面
  好看」去網路上隨便抓圖。

## 稽核指令（供下一輪重跑）

```bash
grep -rn "\.png\|\.jpg\|\.jpeg\|\.svg\|<img\|backgroundImage\|url(" \
  --include=*.tsx --include=*.ts --include=*.css \
  App.tsx components src styles 2>/dev/null | grep -vi lucide
find public -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \
  -o -iname "*.svg" -o -iname "*.gif" -o -iname "*.webp" \)
```
