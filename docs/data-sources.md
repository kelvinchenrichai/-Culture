# Data Sources

## LunarData — REAL DATA, PARTIAL RANGE

https://github.com/donma/LunarData（MIT）提供 1970–2100 按年月拆分的離線 JSON/JS。Phase 2 提供 2026 全年 12 個月份，置於 `public/` 並按月讀取；其他年份明確無資料。

## lunar-javascript — REAL CALCULATION LIBRARY

https://github.com/6tail/lunar-javascript（MIT）作獨立計算與交叉驗證。不同結果不會被靜默合併。

## cnlunar — PARTIAL

https://github.com/OPN48/cnlunar（MIT）適合 offline validation / future generator；本 POC 未加入 Python runtime。

## 全國宗教資訊系統資料－寺廟（Dataset 8203）— REAL SOURCE, 全量已匯入

| 項目 | 內容 |
| --- | --- |
| Name | 全國宗教資訊系統資料－寺廟 |
| URL | https://data.gov.tw/dataset/8203 |
| Dataset ID | 8203 |
| License | 政府資料開放授權條款第 1 版 |
| Last fetched | 2026-08-29，使用者手動從瀏覽器下載，交給本專案匯入（見下方下載流程） |
| Format | XML（`OpenData_3` 陣列），編號/寺廟名稱/主祀神祇/行政區/地址/教別/登記別/統一編號/電話/負責人/其他/WGS84X/WGS84Y |
| Usage | `scripts/import-national-temples.ts` 的 primary source，輸出 `public/data/temples/national-temples.json` 供 runtime fetch |
| Limitations | 這個雲端開發環境依然連不上 `data.gov.tw`（HTTPS CONNECT 被白名單擋掉，代理回 403）——這次是使用者親自下載後用 `--input` 匯入，不是這個環境自己連線成功。資料集本身的 resource 下載網址可能隨版本變動，`pnpm run data:update:temples`（不加 `--input`）在能連線的環境還是會先打 dataset metadata API 找目前的 resource url。 |

### 下載流程眉角（2026-08-29 實測）

這個 dataset 的「資料集上架方式」是「系統介接程式」，代表 data.gov.tw 頁面上的 `XML` 按鈕**不是**
觸發瀏覽器下載，而是跳轉到一個 API 端點、把 XML 內容直接顯示成網頁（看起來像一堆 `<...>` 純文字）。
正確做法是等頁面顯示原始 XML 之後，用瀏覽器的「另存新檔」（Ctrl+S / Cmd+S）存成 `.xml` 檔案——
如果只是等瀏覽器跳出下載提示，會一直卡住。如果連按鈕都沒反應，通常是快顯視窗被瀏覽器/外掛封鎖，
需要放行 data.gov.tw 的快顯視窗。CKAN dataset metadata API（`https://data.gov.tw/api/v2/rest/
dataset/8203`）也可以直接在網址列打開，會回傳這個 dataset 目前登記的 resource 網址。

### 匯入結果

全量匯入 **12,423 筆**，95.9% 有政府自帶座標（`coordinateStatus: government`），詳細數字與
六都座標覆蓋率見 [data-coverage.md](./data-coverage.md)。原本 `fixtures/temples/
national-temples-raw-sample.json` 的 5 筆 REAL SAMPLE（龍山寺、霞海城隍廟、行天宮、松山慈祐宮、
保安宮）繼續留著當 pipeline 單元測試用的固定小型 fixture，不會被刪除，但正式輸出
（`public/data/temples/national-temples.json`）已經是全量資料，不再是這 5 筆樣本。

使用者下載的原始 XML 檔案本身（約 6MB）沒有提交進 repo——只有 importer 處理過的輸出
（`public/data/temples/national-temples.json`）進版控，這份原始檔可以隨時從 data.gov.tw
用上面的方法重新下載，不需要额外保存一份，保持 repo 精簡。

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
