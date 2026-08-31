# Data Coverage

這份文件記錄「現在實際有多少資料」，不是「規劃要有多少資料」。每次跑
`pnpm run data:update:temples` 或補齊 deity/festival 資料後，應該回來更新這份文件。

最後更新：2026-08-29（Data Completion Foundation 施工，feature/data-completion-foundation 分支，
接續 feature/folklore-data-content 的 P2 成果）。

**這份文件現在有一個機器可讀的對照版本**：`docs/data-coverage.json`，由
`pnpm run data:coverage` 直接讀取 repo 裡的真實資料算出來（邏輯在
`src/lib/coverage/computeCoverage.ts`，有 vitest 覆蓋）。這份 `.md` 手寫的敘述如果跟
`.json` 對不上，以 `.json` 為準——先重跑 `pnpm run data:coverage`，再回頭修這份文件，
不要反過來手動改數字。視覺化版本另外發布成一頁「資料完成度帳冊」（Artifact），
每輪補資料後手動同步更新。

## Calendar

- 涵蓋年份：2026 全年 12 個月（`public/data/calendar/2026/01.json` ~ `12.json`）。
- 其他年份：無資料，`CalendarService` 對查不到的日期回傳 `unavailable`，不 fallback 到假資料。

## Temple（全國寺廟）

**2026-08-29 全量匯入完成。** 使用者親自從 data.gov.tw 的 dataset 8203（全國宗教資訊系統資料－
寺廟）頁面下載官方原始 XML 檔案（`XML` 按鈕其實是跳轉到 API 端點顯示原始 XML，不是真的觸發下載，
用 Ctrl+S 另存才能拿到檔案——這個下載流程本身的眉角記在 [data-sources.md](./data-sources.md)），
用 importer 既有的 `--input` 本地檔案模式匯入，**不是**這個雲端環境自己連線下載的（data.gov.tw
依然被這個環境的網路白名單擋著，這點沒有變）。

| 指標 | 數值 |
| --- | --- |
| Raw 筆數（dataset 8203 官方原始檔） | 12,423 |
| 格式錯誤跳過 | 0 |
| Duplicates removed | 0（正規化廟名+地址後沒有重複） |
| With coordinates（`coordinateStatus: government`） | 11,916（95.9%） |
| Without coordinates | 507（進入 `data/temples/missing-coordinates.json`，見下方 GPS enrichment） |

這是目前的完整全國資料，不是樣本——`docs/data-coverage.json` 的 `temples.sampleSize` 欄位名稱雖然
還叫 sample，但這輪之後代表的是「全量匯入後的真實筆數」。

### 匯入過程中順便修的兩個問題

1. **importer 沒有 XML parser**：之前只驗證過 JSON/CSV 格式，這是第一次真的拿到官方 XML 匯出檔。
   新增 `parseXml`（極簡 flat-XML parser，只處理「同層重複節點、無巢狀、無屬性」這種常見的
   政府資料集匯出形狀，見 `scripts/import-national-temples.ts` 的註解），不引入完整 XML/DOM 套件。
2. **欄位對應跟原本猜的不一樣**：dataset 8203 實測欄位是 `行政區`（其實是縣市層級，例如
   「臺南市」，不是鄉鎮市區）、`WGS84X`/`WGS84Y`（經度/緯度，不是「經度」「緯度」）、`編號`
   （每筆都有的政府流水號，比只有約 1/4 記錄才有的「統一編號」更適合當 id）。之前只有 5 筆手key
   的樣本 fixture，猜測的欄位名稱剛好都猜錯了——`normalizeRecord` 現在同時支援兩種形狀（樣本
   fixture 的「縣市+行政區分開兩欄」跟 dataset 8203 實測的「只有一個行政區欄位」），並新增
   `extractDistrictFromAddress` 從地址字串切出鄉鎮市區。兩種形狀都有測試覆蓋
   （`tests/importNationalTemples.test.ts`）。

### 意外發現並修掉的 bundle 問題

`src/data/temples/temples.ts` 原本用 `import generated from '.../national-temples.json'`
把 runtime fetch 失敗時的離線保底資料，直接綁定成「pipeline 產出檔的完整內容」。這在資料只有
5 筆的時候沒問題，但換成上萬筆全量資料後，Vite 會把整份 8MB+ 的 JSON 直接內嵌進 JS bundle
（不是一般的靜態資源 fetch，是變成程式碼本身的一部分）——已經改成手動維護一個很小的「知名寺廟」
離線保底子集（5 筆，原本 pipeline 驗證用的 REAL SAMPLE），`pnpm run build` 後確認 JS bundle
大小維持原本的 ~308KB，沒有因為全量資料而膨脹。`tests/templeOfflineFallback.test.ts` 有一條
迴歸測試守住這件事（斷言離線保底陣列長度 < 50）。

`public/data/temples/national-temples.json` 本身現在是 8.47MB（gzip 後約 905KB），純粹當
runtime fetch 的靜態資源，不會進 JS bundle。這個檔案大小之後如果變成行動網路上的實際痛點
（例如量到真的很慢的載入時間），下一步可以考慮按縣市拆檔、分頁載入，這輪先不做——目前
gzip 後的大小還在合理範圍，沒有先跑去優化一個還沒被證實是問題的東西。

### 座標涵蓋率（六都，依使用者原本的排序：新北→臺北→桃園→臺中→臺南→高雄）

| 縣市 | 總數 | 有座標 | 無座標 |
| --- | --- | --- | --- |
| 新北市 | 945 | 940 | 5 |
| 臺北市 | 280 | 279 | 1 |
| 桃園市 | 317 | 292 | 25 |
| 臺中市 | 994 | 980 | 14 |
| 臺南市 | 1,670 | 1,644 | 26 |
| 高雄市 | 1,505 | 1,456 | 49 |
| 其他縣市（16 個） | 6,712 | 6,325 | 387 |

六都本身的座標覆蓋率已經是 96–99%，不需要另外跑 Part D 的地方政府座標 enrichment 就有高覆蓋率——
`src/lib/temples/coordinateEnrichment.ts` 那套 confidence 分級比對架構仍然保留，留給
`data/temples/missing-coordinates.json` 這 507 筆真正缺座標的記錄用（金門縣缺最多，78 筆），
不是全面重跑的必要條件。

**「附近寺廟在臺北以外必定 0 筆結果」的問題到這裡才算真正解決**——上一輪的 P0 只做到
「找不到資料時誠實擴大搜尋半徑並告知使用者」，這輪是真的把資料補上了。

## Festival（慶祭典）

`scripts/import-festivals.ts` 已建立（Part E），架構跟寺廟 importer 對稱。

| 指標 | 數值 |
| --- | --- |
| Raw 筆數（本輪來源：REAL SAMPLE，非 dataset 8209 下載） | 2 |
| Normalized | 2 |
| Parsed dates | 2 |
| Partial dates | 0 |
| Unparsed dates | 0 |

2 筆都是查證過的真實 2026 年活動（2026大甲媽祖遶境進香、2026保生文化祭），詳見
[data-sources.md](./data-sources.md)。Dataset 8209 本身這個環境連不上，全量匯入待補。
`getUpcomingFestivals` 已經過測試，且刻意排除 `unparsed` 記錄——不會把日期不確定的活動當成
「快到了」顯示。

## Deity（神明）

`data/deities/deities.ts` 的 dataStatus 沒有變（Phase 2 seed，today 頁等既有 UI 用這個）：

| dataStatus | 筆數 | id |
| --- | --- | --- |
| sample | 5 | tudigong, mazu, guandi, guanyin, yuelao |
| placeholder | 1 | caishen |

Part F 新增的是疊加在上面的欄位級 provenance（`src/data/deities/deityProfiles.ts`），
6 位優先神明都有 `DeityProfile`，逐欄位標記 verified/sample，沒有任何一位是全欄位 verified。
詳見 [deity-verification.md](./deity-verification.md)，完整查證過程與逐位現況都在那份文件裡，
這裡不重複。

這一輪（Data Completion Foundation）額外把單一 `birthday` 欄位換成 `dates: DeityDateEvent[]`，
支援一位神明有不只一個紀念日（聖誕／飛昇／得道），並用真實查證補上媽祖的「飛昇紀念日」
（農曆九月初九，交通部觀光署馬祖國家風景區管理處）跟既有「聖誕」（農曆三月廿三，桃園市
桃園區公所）——兩個 .gov.tw 來源互相一致、沒有查到地區差異版本，因此媽祖的 `dates` 欄位
這輪從 sample 升級為 verified，是目前 6 位神明裡唯一因為這個模型升級而變 verified 的欄位
（其餘欄位不受影響，媽祖依然不是全欄位 verified）。目前算出來的欄位級完成度（6 位 ×
8 個追蹤欄位）：verified 45.8%，逐位數字見 `docs/data-coverage.json` 的 `deityProfiles.perDeity`。

## 拜什麼對照表（Need→Deity Map）

`src/data/needs/needDeityMap.ts`（Part：Data Completion Foundation）把「使用者實際會想的
問題」（例如「最近工作不順拜什麼？」）對應到現有神明，而不是只能從神明百科查起。目前定義
8 個需求分類，5 個已有對應神明（求財、事業、姻緣、家庭平安、健康），3 個是誠實保留的缺口
（學業/考試、生育/小孩、司法/公平——分別對應文昌帝君/魁星、註生娘娘/臨水夫人、城隍爺，
這幾位神明目前都還沒建檔）。所有描述文字都限定為客觀習俗陳述（「民間信仰中，求○○常見
參拜○○」），不能寫成「拜 XX 就會成功」這種因果斷言，有測試守著banned phrase 檢查。

## 圖片資產（Image Assets）

`src/lib/images/imageAsset.ts` 定義了 schema（`deity`/`temple`/`festival`/`offering`/`action`
五個分類，每筆記錄 source/license/attribution/originalUrl/downloadedAt/verified），
`src/data/images/imageRegistry.ts` 目前刻意是空陣列——上一輪圖片授權 audit 的結論是「0 張
來源不明圖片」，代表現有 UI 用的都是 icon/SVG，還沒有真的照片或插畫。這輪只建立 schema 跟
`data:validate` 的驗證規則，沒有匯入任何圖片。

## Find Days（找好日子）

`src/lib/rules/findSuitableDates.ts` 已建立（Part G），取代原本 `FindDaysView` 完全基於
`data/mockData.ts` 的 `AUSPICIOUS_DAYS`（含假的「吉度 92 分」）。現在對 6 個已 normalize 的
action（HAIRCUT/MOVE_HOME/WORSHIP/START_WORK/MARRIAGE/TRAVEL）即時查詢真正的 LunarData
Primary 宜忌，用 2026 全年的真實資料驗證過（例如 MOVE_HOME 在 2026 年 1 月確實誠實回傳 0 筆
「宜」的日期，不是隨便造一個假結果）。

## Worship Guide（拜拜教學）

`src/data/worship/basicWorshipGuide.ts` 已建立（Part H），Simple Mode 的預設拜拜流程現在有
`ProvenancedField` 逐欄位 provenance（都是 `sample`／`FOLKLORE`，因為查不到單一權威文獻，
誠實標記，不是查證不夠努力——見該檔案的註解）。Normal Mode 的多主題文章瀏覽器
（`data/mockData.ts` 的 `WORSHIP_GUIDES`）維持既有內容，還沒有逐條轉換成新結構，屬於 PARTIAL。

## 已知限制

- ~~全國寺廟資料目前只有 5 筆 REAL SAMPLE~~ 已解決（2026-08-29）：使用者手動下載 dataset 8203
  官方原始檔，全量匯入 12,423 筆，見上方「Temple（全國寺廟）」一節。
- 507 筆寺廟（金門縣最多，78 筆）在 dataset 8203 本身就沒有座標，`data/temples/
  missing-coordinates.json` 已列出，等後續要補的話可以用地方政府 open data 或
  `coordinateEnrichment.ts` 的比對邏輯，但六都本身覆蓋率已經有 96–99%，優先度不高。
- 新北市座標 enrichment（Part D）：既有的 confidence 分級比對架構仍然保留，但已經不是六都覆蓋率
  的關鍵路徑——dataset 8203 本身就帶了新北市 940/945 筆的座標。
- 媽祖、關聖帝君的欄位級 provenance（Part F）：religion.moi.gov.tw 連不上，這兩位維持 sample。
- Normal Mode 的多主題拜拜教學文章（Part H）：還沒有逐條轉換成 `ProvenancedField` 結構，只加了
  頁面層級的誠實提示。
- FindDaysView/WorshipGuideView 以外的畫面（RealDeitiesView、RealDeityDetail）：Simple Mode 深度
  重排（Part A 遺留項目）本輪沒有再往下做，優先度排在 P2 內容工作之後。
- 神明資料庫目前仍只有 6 位，拜什麼對照表因此有 3 個需求分類（學業/考試、生育/小孩、司法/公平）
  查不到對應神明，見上方「拜什麼對照表」一節。
- 圖片資產 registry 目前是空的，這輪只做了 schema，沒有匯入任何一張圖片。
