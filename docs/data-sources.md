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

## 新北市寺廟資料（Dataset 122928）— DOWNLOAD BLOCKED，架構已建立

| 項目 | 內容 |
| --- | --- |
| URL | https://data.gov.tw/dataset/122928 |
| Usage | Part D（GPS enrichment）的地方政府座標補完來源，`scripts/enrich-temple-coordinates.ts` 的 `--input` |
| Status | Pipeline 架構（`src/lib/temples/coordinateEnrichment.ts` 的 confidence 分級比對邏輯 + CLI）已完成並有測試覆蓋，但這個環境連不到 `data.gov.tw`（同一個網路白名單擋掉，403），也連不到 `data.ntpc.gov.tw`（同樣被擋）。這輪沒有實際跑過真的新北市資料，`data/temples/coordinate-review.json` 目前不存在。換一個能連線的環境、或手動下載新北市資料後用 `--input` 帶進來即可執行，不需要改程式碼。 |

## 全國宗教資訊系統資料－慶(祭)典（Dataset 8209）— DOWNLOAD BLOCKED，2 筆 REAL SAMPLE

| 項目 | 內容 |
| --- | --- |
| URL | https://data.gov.tw/dataset/8209 |
| License | 政府資料開放授權條款第 1 版 |
| Usage | `scripts/import-festivals.ts` 的 primary source，輸出 `public/data/festivals/national-festivals.json` |
| Status | 跟寺廟資料集一樣被這個環境的網路白名單擋掉（403），importer pipeline（download 嘗試 → BLOCKED 訊息 → `--input` 手動匯入）已完成並有測試覆蓋。 |

`public/data/festivals/national-festivals.json` 目前的 2 筆資料，**不是**從 Dataset 8209 下載的，是另外查證公開新聞與官方網站取得的真實 2026 年活動：

- 2026大甲媽祖遶境進香（4/17–4/26），來源：[遠見雜誌](https://www.gvm.com.tw/article/128444)，報導引用大甲鎮瀾宮自己公告的起駕/回鑾日期。
- 2026保生文化祭（4/19–6/16），來源：[臺北旅遊網](https://www.travel.taipei/zh-tw/event-calendar/details/66369)，臺北市政府官方觀光網站。

重新整理成政府資料集可能會有的欄位形狀，存成 `fixtures/festivals/national-festivals-raw-sample.json`，明確標記 `REAL SAMPLE`，每筆記錄自己標記真正的來源（不是掛一個假的 dataset 8209 引用）。

## Deities — 6 位優先神明已補上欄位級 provenance（Part F）

`src/data/deities/deities.ts` 的 6 筆 normalized seed 維持 Phase 2 的 dataStatus（用於 today 頁等既有 UI）。這輪額外在 `src/data/deities/deityProfiles.ts` 疊加一層欄位級 provenance（`DeityProfile`，見 [deity-verification.md](./deity-verification.md)），實際查證了 4 位（土地公/觀音/月老/財神）的部分欄位，來源如下：

| 項目 | 內容 |
| --- | --- |
| Name | 文化部 國家文化記憶庫 |
| URL | https://tcmb.culture.tw/ （個別頁面見 deity-verification.md） |
| Publisher | 文化部 |
| License | 政府網站公開內容，非開放資料授權條款，此處僅作事實引用與 attribution，不做大量轉載 |
| Usage | `src/data/deities/deityProfiles.ts` 的 verified 欄位來源 |
| Limitations | 沒有找到媽祖、關聖帝君的等價頁面；內政部「全國宗教資訊網」（religion.moi.gov.tw）本來就有這兩位的介紹頁（cid=241／cid=286），但這個環境連不上該網域（WebFetch 回報 ROBOTS_DISALLOWED/timeout），這兩位這輪維持 sample。 |

## 媽祖紀念日期（Data Completion Foundation 新增）

| 項目 | 內容 |
| --- | --- |
| 聖誕（農曆三月廿三） | [傳統藝術與民俗節慶－媽祖聖誕](https://www.tao.tycg.gov.tw/News_Content.aspx?n=6277&s=648464)，桃園市桃園區公所（.gov.tw） |
| 飛昇紀念日（農曆九月初九） | [媽祖昇天祭](https://www.matsu-nsa.gov.tw/zh-TW/festivals/11)，交通部觀光署馬祖國家風景區管理處（.gov.tw） |
| Usage | `src/data/deities/deityProfiles.ts` 的 `mazu.dates`，這是這輪唯一從 sample 升級為 verified 的媽祖欄位 |
| Limitations | 兩個來源互相一致，沒有查到不同地區/廟宇採用不同日期的版本，因此 `DeityDateEvent.regionalVariation` 保持未設定；如果之後查到真的地區差異版本，再回來補這個旗標，不要提前假設有差異。 |
