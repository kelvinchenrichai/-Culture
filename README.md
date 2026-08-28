# 今日好日 — 台灣民俗生活指南

把台灣傳統民俗轉成一般人看得懂的生活指南。第一階段 POC 保留原有 React/Vite UI，新增離線日曆 adapter、規則引擎、神明/寺廟服務與分享卡，不串大型語言模型。

## Setup / Testing

```bash
pnpm install
pnpm dev
pnpm test
pnpm lint
pnpm build
pnpm validate:calendar
```

不需要 `GEMINI_API_KEY` 或其他 API key。

## Data Sources

- LunarData（MIT）：內嵌 2026 年 1、2、6、8、12 月真實 JSON；資料範圍為 PARTIAL。
- lunar-javascript（MIT）：農曆、節氣及宜忌交叉驗證。
- cnlunar（MIT）：已研究，Python offline validation 尚未整合。
- 全國宗教資訊系統資料－寺廟（政府資料開放授權條款第 1 版）：importer 已建立，全量匯入/地理編碼尚未完成。
- 神明 seed：明確標為 `sample` / `placeholder`。
- `data/mockData.ts`：UI MOCK CONTENT，不進入正式規則引擎。

詳見 [資料來源](docs/data-sources.md)、[架構](docs/architecture.md)、[驗證報告](docs/validation-report.md)。

## POC Status

| Capability | Status |
| --- | --- |
| Calendar lookup (bundled months) / normalization | DONE |
| lunar-javascript comparison | DONE |
| Intent/date parser / rule engine | DONE |
| Deity service | DONE (sample data) |
| Nearby temple calculation | DONE |
| Government temple importer | PARTIAL |
| SVG share card | DONE |
| UI migration from mock to services | PARTIAL |
| cnlunar comparison | PARTIAL |
| AI fallback | NOT DONE (intentionally) |

正式發佈前應保留各資料來源 attribution，並為神明內容補齊逐欄位可稽核來源。
