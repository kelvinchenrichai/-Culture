# Data Sources

## LunarData — REAL DATA, PARTIAL RANGE

https://github.com/donma/LunarData（MIT）提供 1970–2100 按年月拆分的離線 JSON/JS。Phase 2 提供 2026 全年 12 個月份，置於 `public/` 並按月讀取；其他年份明確無資料。

## lunar-javascript — REAL CALCULATION LIBRARY

https://github.com/6tail/lunar-javascript（MIT）作獨立計算與交叉驗證。不同結果不會被靜默合併。

## cnlunar — PARTIAL

https://github.com/OPN48/cnlunar（MIT）適合 offline validation / future generator；本 POC 未加入 Python runtime。

## 全國宗教資訊系統資料－寺廟（Dataset 8203）— REAL SOURCE, DOWNLOAD BLOCKED

| 項目 | 內容 |
| --- | --- |
| Name | 全國宗教資訊系統資料－寺廟 |
| URL | https://data.gov.tw/dataset/8203 |
| Dataset ID | 8203 |
| License | 政府資料開放授權條款第 1 版 |
| Last fetched | 未成功（見下方 BLOCKED） |
| Usage | `scripts/import-national-temples.ts` 的 primary source，輸出 `public/data/temples/national-temples.json` 供 runtime fetch |
| Limitations | 需要 build-time 網路存取；資料集的 resource 下載網址可能隨版本變動，pipeline 是先打 dataset metadata API 找出目前的 resource url，而不是寫死一個檔案連結 |

**BLOCKED（2026-08-29）**：這個雲端開發環境的網路白名單會擋掉對 `data.gov.tw` 的 HTTPS CONNECT（代理回 403，policy denial，非資料集本身的問題）。`pnpm run data:update:temples` 在此環境執行會印出清楚的 BLOCKED 訊息並以非 0 結束，不會用假資料覆蓋既有輸出。

目前 `public/data/temples/national-temples.json` 的 5 筆資料，是把這個 repo 原本就有、可公開查證的 5 間知名台北寺廟（龍山寺、霞海城隍廟、行天宮、松山慈祐宮、保安宮）重新整理成政府資料集常見欄位格式，存成
`fixtures/temples/national-temples-raw-sample.json`（明確標記 `REAL SAMPLE`），再跑過真正的 pipeline 產生的，藉此驗證 pipeline 本身能跑通。**這不是全量政府資料**，詳細覆蓋範圍見 [data-coverage.md](./data-coverage.md)。

換一個能連到 `data.gov.tw` 的環境重跑 `pnpm run data:update:temples`（不加 `--input`），或用 `--input <手動下載的匯出檔>`，就能取得全量資料，不需要改任何程式碼。詳見 [temple-data-pipeline.md](./temple-data-pipeline.md)。

## 新北市寺廟資料（Dataset 122928）— NOT YET INTEGRATED

| 項目 | 內容 |
| --- | --- |
| URL | https://data.gov.tw/dataset/122928 |
| Usage | Part D（GPS enrichment）規劃的地方政府座標補完來源之一，含 WGS84 lat/lng |
| Status | 尚未建立 `TempleCoordinateProvider` 架構，本輪未動工（P2） |

## 全國宗教簡介與祭典活動資料（Dataset 8209）— NOT YET INTEGRATED

| 項目 | 內容 |
| --- | --- |
| URL | https://data.gov.tw/dataset/8209 |
| Usage | Part F（慶祭典）規劃的 primary source |
| Status | `scripts/import-festivals.ts` 尚未建立，本輪未動工（P2） |

## Deities — SAMPLE / PLACEHOLDER

六筆 normalized seed 只驗證 schema/service；供品與誕辰傳統需在 production 前做逐欄位編輯驗證，見 Part G（本輪未動工，仍是 P2）。
