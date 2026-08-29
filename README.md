# 今日好日 — 台灣民俗生活指南

把台灣傳統民俗轉成一般人看得懂的生活指南。Phase 2 已讓既有 React/Vite UI 的首頁、生活決策、今日神明、附近寺廟與分享卡使用真實 service flow，不串大型語言模型。Phase 4 P0 重做了 Simple Mode 與附近寺廟體驗；Phase 4 P2（本輪）補上找好日子、拜拜教學、神明欄位級 provenance 與慶祭典資料。

## Setup / Testing

```bash
pnpm install
pnpm dev
pnpm test
pnpm lint
pnpm build
pnpm validate:calendar
pnpm run data:validate            # 跨資料集品質檢查（temple/deity/festival；calendar 用上面那條）
pnpm run data:update:temples      # 重跑全國寺廟 importer（見 docs/temple-data-pipeline.md）
pnpm run data:update:festivals    # 重跑全國慶祭典 importer（見 docs/data-sources.md）
```

不需要 `GEMINI_API_KEY` 或其他 API key。

## Data Sources

- LunarData（MIT）：`public/data/calendar/2026/` 提供 2026 全年真實 JSON，瀏覽器按月份載入。
- lunar-javascript（MIT）：農曆、節氣及宜忌交叉驗證。
- cnlunar（MIT）：已研究，Python offline validation 尚未整合。
- 全國宗教資訊系統資料－寺廟／慶(祭)典（政府資料開放授權條款第 1 版）：importer 已建立，全量匯入待有連線的環境重跑；寺廟 5 筆、慶祭典 2 筆皆為 REAL SAMPLE。
- 文化部 國家文化記憶庫：4 位神明（土地公/觀音/月老/財神）的欄位級 provenance 來源，見 [deity-verification.md](docs/deity-verification.md)。
- 神明 seed：明確標為 `sample` / `placeholder`，逐欄位 provenance 見上。
- `data/mockData.ts`：UI MOCK CONTENT，`WORSHIP_GUIDES`（Normal Mode 拜拜教學文章）仍在使用，其餘（含找好日子的假分數資料）已停用不再進正式規則引擎。

詳見 [資料來源](docs/data-sources.md)、[架構](docs/architecture.md)、[驗證報告](docs/validation-report.md)、
[資料涵蓋範圍](docs/data-coverage.md)、[長輩 UX](docs/elder-ux.md)、[寺廟資料 pipeline](docs/temple-data-pipeline.md)、
[神明查證](docs/deity-verification.md)、[圖片授權 audit](docs/image-assets.md)、[Phase 4 P2 總覽](docs/phase-4-p2.md)。

## POC Status

| Capability | Status |
| --- | --- |
| Calendar lookup (2026 full year, monthly static fetch) | DONE |
| lunar-javascript comparison | DONE |
| Intent/date parser / rule engine | DONE |
| Deity service | DONE (sample data)，6 位優先神明另有欄位級 provenance（PARTIAL，見下） |
| Nearby temple calculation | DONE，含 5→10→20→30km 自動擴大與距離格式化 |
| Government temple importer | DONE（pipeline 完整，含 dedupe/normalize/alias/validate，含本地檔案匯入模式），資料本身仍是 5 筆 REAL SAMPLE — 見 [data-coverage.md](docs/data-coverage.md) |
| Simple Mode（原「大字模式」，真正重排資訊層級） | DONE（首頁/決策結果/導覽/找好日子/拜拜教學），RealDeitiesView/RealDeityDetail 尚未套用 |
| SVG share card | DONE |
| Home / decision / deity-today / temple / today-share integration | DONE |
| Find-suitable-days service | DONE（真實 LunarData Primary 查詢，移除原本的假吉度分數） |
| Worship guide（Simple Mode 四按鈕流程 + provenance） | DONE（Simple Mode），PARTIAL（Normal Mode 舊文章尚未轉換） |
| Deity field-level provenance | PARTIAL（6 位中 4 位有實質查證內容，媽祖/關聖帝君受網路限制維持 sample，見 [deity-verification.md](docs/deity-verification.md)） |
| Festival importer / service | DONE（pipeline），PARTIAL（2 筆 REAL SAMPLE，dataset 8209 全量待補） |
| Temple GPS enrichment（新北市） | DONE（架構 + confidence 分級比對），NOT DONE（實際執行，網路連不上） |
| Image asset licensing audit | DONE（結果：0 張來源不明圖片，見 [image-assets.md](docs/image-assets.md)） |
| Accessibility audit | PARTIAL（修正實際發現的問題，非完整逐頁 WCAG 稽核） |
| cnlunar comparison | PARTIAL |
| AI fallback | NOT DONE (intentionally) |

正式發佈前應保留各資料來源 attribution，並持續為神明內容補齊逐欄位可稽核來源（尤其媽祖、關聖帝君）。
