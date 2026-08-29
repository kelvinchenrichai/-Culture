# Phase 4 P2 — Content + Data Completion

這份文件是這一輪（`feature/folklore-data-content` 分支，接續 P0 的
`feature/elder-data-expansion`）的總覽，記錄做了什麼、為什麼這樣排優先序，以及跟其他文件的
分工。細節分散在各自的文件裡，這裡不重複貼內容，只列指標與連結。

最後更新：2026-08-29。

## 為什麼是這個順序

P0（長輩 UX、全國寺廟 pipeline 架構、附近寺廟真正可用）已經在上一輪完成並確認推上 GitHub。
這一輪的判斷是：**外殼已經好用了，現在限制產品價值的是「頁面看得到，但內容還不夠真、不夠
完整」**——具體來說是三個地方：

1. 「找好日子」整頁都是 2025 年的假資料跟「吉度 92 分」這種沒有依據的分數（Production Safety
   的明確違規，而且是使用者天天會點的頁面）。
2. 拜拜教學是一整篇密集文章，沒有任何來源標示，Simple Mode 只有放大字。
3. 神明資料全部都是同一個籠統的 `sample`／`placeholder`，沒有辦法區分「這欄位有查證」跟
   「這欄位是民間習俗整理」。

所以這輪先做 Part G（找好日子）→ Part H（拜拜教學）→ Part F（神明 provenance），這三個做完
才回頭做 Part C1（確認寺廟本地匯入模式）、Part E（慶祭典）、Part D（新北市座標架構）、
Part I（圖片授權 audit）、Part J（accessibility）。這個順序符合使用者原本的建議。

## 完成度總覽

| Part | 內容 | 狀態 |
| --- | --- | --- |
| G 找好日子 | 真正的 `findSuitableDates`，移除假分數 | DONE |
| H 拜拜教學 | Simple Mode 四按鈕流程 + provenance；Normal Mode 舊內容保留 | DONE（Simple Mode）／PARTIAL（Normal Mode 舊文章未轉換） |
| F 神明 provenance | 6 位優先神明，逐欄位 verified/sample | PARTIAL（4/6 有實質查證內容；媽祖/關聖帝君受網路限制維持 sample） |
| C1 寺廟本地匯入 | `--input` 模式（其實上一輪就有），這輪重新驗證 | DONE |
| E 慶祭典 | Importer + service + 2 筆 REAL SAMPLE + UI | DONE（pipeline）／PARTIAL（資料量，dataset 8209 連不上） |
| D 新北市座標 | Provider 架構 + confidence 分級比對 | DONE（架構）／NOT DONE（實際執行，網路連不上） |
| I 圖片授權 audit | `docs/image-assets.md` | DONE（結果：0 張來源不明圖片） |
| J Accessibility | 逐一稽核並修正可修的項目 | PARTIAL（修了實際發現的問題，非完整逐頁 WCAG 稽核） |

## 意外發現並修掉的東西

不是原本規劃的工作，但查證/稽核過程中發現的真實問題，都在對應的 commit 裡修掉了：

- `ShareCardModal.tsx` 的 hooks 呼叫順序 bug（`if (!isOpen) return null` 在 `useState` 之前），
  違反 Rules of Hooks，實際表現是分享卡開關幾次後可能整個噴錯。已修正並用 Playwright 驗證
  開關 3 次無錯誤。
- 財神資料從籠統的「財神爺」placeholder，查證後補上具體身份（玄壇真君／趙公明／武財神）與
  明確聖誕（正月初五）。

## 跟其他文件的關係

- 逐項技術細節：[data-coverage.md](./data-coverage.md)（數字）、
  [data-sources.md](./data-sources.md)（每個來源的授權/限制）、
  [deity-verification.md](./deity-verification.md)（神明查證過程）、
  [image-assets.md](./image-assets.md)（圖片授權 audit）、
  [temple-data-pipeline.md](./temple-data-pipeline.md)（寺廟 pipeline，本輪只驗證未重寫）、
  [elder-ux.md](./elder-ux.md)（P0 的長輩 UX，本輪未變動）。
- Git 狀態、測試/build 結果：見交付時的 CLAUDE HANDOFF RESULT 報告（不寫進 repo 文件）。

## 下一輪建議（不代表這輪會開始做）

1. Normal Mode 拜拜教學舊文章逐條轉換成 `ProvenancedField` 結構。
2. 換一個能連線的環境，把 `pnpm run data:update:temples`、`data:update:festivals`、
   `enrich-temple-coordinates.ts` 三支 script 對真正的政府資料集跑一次全量。
3. 補媽祖、關聖帝君的欄位級 provenance（等 religion.moi.gov.tw 連得上，或找到其他等價來源）。
4. FindDaysView/WorshipGuideView 以外畫面（RealDeitiesView、RealDeityDetail）的 Simple Mode
   深度重排（P0 遺留項目）。
