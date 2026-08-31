# Temple Data Pipeline

`scripts/import-national-temples.ts` 是全國寺廟資料的 build-time importer。這份文件說明它怎麼運作、
怎麼重跑、以及它跟 runtime 之間的關係。

## 為什麼需要這支 script

Primary source 是台灣政府資料開放平台的「全國宗教資訊系統資料－寺廟」（Dataset 8203）。使用者的
瀏覽器**不可以**直接打 `data.gov.tw`——這是 build-time / 開發機才能做的事，runtime 只讀這支 script
產出的 static JSON（`public/data/temples/national-temples.json`）。

## Pipeline 步驟

```
download → parse → normalize → validate → dedupe → 寫出 static JSON
```

1. **Download**：沒給 `--input` 時，會先打 CKAN dataset metadata API
   (`https://data.gov.tw/api/v2/rest/dataset/8203`) 找出目前的 resource 下載網址，再下載該
   resource。刻意不寫死一個檔案連結，因為政府資料集的 resource url 會隨版本變動。
2. **Parse**：支援 JSON（純陣列、`{records:[...]}`、CKAN 的 `{result:{records:[...]}}` 三種形狀）、
   CSV（內建一個很小的 CSV parser，支援雙引號跳脫）、以及 XML（`--input` 檔名是 `.xml` 或內容以
   `<?xml` 開頭時自動偵測；內建一個極簡 flat-XML parser，只處理「同層重複節點、無巢狀、無屬性」
   這種常見的政府資料集匯出形狀——dataset 8203 實測就是這個形狀，見下方「目前的資料狀態」）。
3. **Normalize**：
   - 地址 → `src/lib/temples/addressNormalize.ts` 的 `normalizeAddress`（台/臺、全形/半形空白
     與數字），`rawAddress` 永遠保留原文。
   - 主祀神祇 → `src/lib/temples/deityAliases.ts` 的 `normalizeDeityName`，查不到就是
     `undefined`，`rawMainDeity` 永遠保留原文。
   - 座標 → 轉數字並檢查是否落在台灣本島＋外島的合理範圍（緯度 21–26.5、經度 118–123.5），
     不合理的座標視為缺漏（`coordinateStatus: 'missing'`），不會把明顯錯誤的座標寫進資料。
4. **Validate**：缺名稱或缺地址的記錄會被跳過並記錄原因，不會混進輸出。
5. **Dedupe**：`src/lib/temples/dedupe.ts`，key 是「正規化廟名 + 正規化地址」。只有名字跟地址都
   吻合才合併——全台同名的福德宮、天后宮太多，光比對名字會誤合併不同的廟。合併時集合
   `sources` / `aliases`，保留座標可信度最高（`government` > `verified` > `geocoded` > `missing`）
   的那筆座標。
6. **輸出**：
   - `public/data/temples/national-temples.json`：完整的去重後結果，runtime fetch 這個檔案。
   - `data/temples/missing-coordinates.json`：`coordinateStatus === 'missing'` 的子集，供 Part D
     （地方政府座標 enrichment）之後使用。

## 失敗時的行為（Part P）

下載失敗（網路被擋、逾時、dataset 網址改變）時，script 會印出清楚的 `BLOCKED` 訊息並以非 0 結束
——**不會**用空陣列或假資料覆蓋既有的輸出檔。目前這個雲端開發環境的網路白名單會擋掉
`data.gov.tw`（詳見 [data-sources.md](./data-sources.md)），所以：

```
$ pnpm run data:update:temples
[import-national-temples] 沒有指定 --input，嘗試直接從 data.gov.tw 下載 dataset 8203 ...
========================================================================
BLOCKED：無法從 data.gov.tw 取得全國寺廟資料。
原因：dataset metadata HTTP 403
...
========================================================================
```

## 怎麼重跑取得全量資料

在一個能連到 `data.gov.tw` 的環境：

```bash
pnpm run data:update:temples
```

或是手動從 data.gov.tw 下載匯出檔（XML/CSV/JSON 皆可，會自動偵測格式）之後：

```bash
pnpm exec tsx scripts/import-national-temples.ts --input path/to/exported-file.xml
```

兩種情況都不需要改任何程式碼，跑完就會更新 `public/data/temples/national-temples.json` 與
`data/temples/missing-coordinates.json`。

## 目前的資料狀態

**2026-08-29 全量匯入完成。** 使用者親自從 data.gov.tw 下載 dataset 8203 的官方 XML 匯出檔
（下載流程的眉角——`XML` 按鈕其實是跳轉到 API 頁面顯示原始文字，要用 Ctrl+S 另存——記在
[data-sources.md](./data-sources.md)），用 `--input` 匯入，取得 12,423 筆全國寺廟真實資料，
95.9% 有政府自帶座標。詳細數字、六都座標覆蓋率見 [data-coverage.md](./data-coverage.md)。
`fixtures/temples/national-temples-raw-sample.json` 的 5 筆 REAL SAMPLE 繼續留著當 pipeline
單元測試用的固定小型 fixture，不會被刪除，但正式輸出已經是全量資料。

匯入這份真實資料時，才發現原本沒看過真實匯出檔時猜測的欄位名稱（`縣市`/`行政區`分開兩欄、
`緯度`/`經度`）跟 dataset 8203 實際欄位（只有一個 `行政區` 欄位、其實是縣市層級；座標欄位叫
`WGS84X`/`WGS84Y`）對不起來——`normalizeRecord` 現在同時支援兩種形狀，並新增
`extractDistrictFromAddress` 從地址字串切出鄉鎮市區，兩種形狀都有測試覆蓋
（`tests/importNationalTemples.test.ts`）。

## Runtime 怎麼讀這份資料

`src/hooks/useTemples.ts` 在瀏覽器裡 fetch `/data/temples/national-temples.json`；fetch 失敗
（離線等情況）時退回 `src/data/temples/temples.ts` 內建的離線保底常數。**這兩者從全量匯入之後
不再是同一份資料**——`public/data/temples/national-temples.json` 現在有 12,423 筆（8MB+），
如果離線保底也 import 這整份 JSON，Vite 會把它直接內嵌進 JS bundle，讓每個使用者第一次打開網站
都要多下載好幾 MB。所以 `temples.ts` 改成手動維護一個很小的「知名寺廟」子集（5 筆，原本
pipeline 驗證用的 REAL SAMPLE），只在「連不到伺服器」時當保底避免畫面空白，正常情況（有網路）
永遠是 fetch 到的全量資料在運作。`tests/templeOfflineFallback.test.ts` 有迴歸測試守住
「離線保底陣列必須維持很小」這件事。

## 尚未建立（Part D，P2）

`TempleCoordinateProvider` 架構（`NationalTempleProvider` / `NewTaipeiTempleCoordinateProvider` /
未來其他地方政府 provider）本輪未動工。`data/temples/missing-coordinates.json` 已經有輸出機制，
之後接上地方政府 open data 或（謹慎使用、遵守 rate limit 的）Nominatim offline enrichment 時，
可以直接讀這個檔案當輸入清單。
