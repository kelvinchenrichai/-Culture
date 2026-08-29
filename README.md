# 今日好日 — 台灣民俗生活指南

把台灣傳統民俗轉成一般人看得懂的生活指南。Phase 2 已讓既有 React/Vite UI 的首頁、生活決策、今日神明、附近寺廟與分享卡使用真實 service flow，不串大型語言模型。

## Setup / Testing

```bash
pnpm install
pnpm dev
pnpm test
pnpm lint
pnpm build
pnpm validate:calendar
pnpm run data:validate         # 跨資料集品質檢查（temple/deity；calendar 用上面那條）
pnpm run data:update:temples   # 重跑全國寺廟 importer（見 docs/temple-data-pipeline.md）
```

不需要 `GEMINI_API_KEY` 或其他 API key。

## Data Sources

- LunarData（MIT）：`public/data/calendar/2026/` 提供 2026 全年真實 JSON，瀏覽器按月份載入。
- lunar-javascript（MIT）：農曆、節氣及宜忌交叉驗證。
- cnlunar（MIT）：已研究，Python offline validation 尚未整合。
- 全國宗教資訊系統資料－寺廟（政府資料開放授權條款第 1 版）：importer 已建立，全量匯入/地理編碼尚未完成。
- 神明 seed：明確標為 `sample` / `placeholder`。
- `data/mockData.ts`：UI MOCK CONTENT，不進入正式規則引擎。

詳見 [資料來源](docs/data-sources.md)、[架構](docs/architecture.md)、[驗證報告](docs/validation-report.md)、
[資料涵蓋範圍](docs/data-coverage.md)、[長輩 UX](docs/elder-ux.md)、[寺廟資料 pipeline](docs/temple-data-pipeline.md)。

## POC Status

| Capability | Status |
| --- | --- |
| Calendar lookup (2026 full year, monthly static fetch) | DONE |
| lunar-javascript comparison | DONE |
| Intent/date parser / rule engine | DONE |
| Deity service | DONE (sample data) |
| Nearby temple calculation | DONE，含 5→10→20→30km 自動擴大與距離格式化 |
| Government temple importer | DONE（pipeline 完整，含 dedupe/normalize/alias/validate），資料本身仍是 5 筆 REAL SAMPLE — 見 [data-coverage.md](docs/data-coverage.md) |
| Simple Mode（原「大字模式」，真正重排資訊層級） | DONE（首頁/決策結果/導覽），FindDaysView/WorshipGuideView/RealDeitiesView 尚未套用 |
| SVG share card | DONE |
| Home / decision / deity-today / temple / today-share integration | DONE |
| Find-days / worship-guide / editorial quote migration | PARTIAL |
| cnlunar comparison | PARTIAL |
| Festival importer / deity field-level verification / temple GPS enrichment / find-suitable-days service | NOT DONE（P2，見 handoff 報告） |
| AI fallback | NOT DONE (intentionally) |

正式發佈前應保留各資料來源 attribution，並為神明內容補齊逐欄位可稽核來源。
