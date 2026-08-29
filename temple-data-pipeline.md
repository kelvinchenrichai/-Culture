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
2. **Parse**：支援 JSON（純陣列、`{records:[...]}`、CKAN 的 `{result:{records:[...]}}` 三種形狀）
   與 CSV（內建一個很小的 CSV parser，支援雙引號跳脫）。
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

或是手動從 data.gov.tw 下載匯出檔（CSV 或 JSON）之後：

```bash
pnpm exec tsx scripts/import-national-temples.ts --input path/to/exported-file.csv
```

兩種情況都不需要改任何程式碼，跑完就會更新 `public/data/temples/national-temples.json` 與
`data/temples/missing-coordinates.json`。

## 目前的資料狀態

見 [data-coverage.md](./data-coverage.md)：目前是 5 筆 REAL SAMPLE（重新整理自這個 repo 原本就有的
5 間知名台北寺廟，格式化成政府資料集的欄位形狀，存在
`fixtures/temples/national-temples-raw-sample.json`），用來驗證 pipeline 本身能跑通，不是全量資料。

## Runtime 怎麼讀這份資料

`src/hooks/useTemples.ts` 在瀏覽器裡 fetch `/data/temples/national-temples.json`；fetch 失敗
（離線等情況）時退回 `src/data/temples/temples.ts` 內建的同一份資料當離線保底，兩者是同一個
pipeline 產出檔，不會分歧。

## 尚未建立（Part D，P2）

`TempleCoordinateProvider` 架構（`NationalTempleProvider` / `NewTaipeiTempleCoordinateProvider` /
未來其他地方政府 provider）本輪未動工。`data/temples/missing-coordinates.json` 已經有輸出機制，
之後接上地方政府 open data 或（謹慎使用、遵守 rate limit 的）Nominatim offline enrichment 時，
可以直接讀這個檔案當輸入清單。
