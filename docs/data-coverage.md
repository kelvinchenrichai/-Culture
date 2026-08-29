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

| 指標 | 數值 |
| --- | --- |
| Raw 筆數（本輪來源：REAL SAMPLE fixture） | 5 |
| Parsed（格式正確可解析） | 5 |
| Normalized（地址/名稱正規化完成） | 5 |
| Duplicates removed | 0（樣本裡沒有重複） |
| With coordinates | 5（`coordinateStatus: government`） |
| Without coordinates | 0 |

**這不是全國涵蓋率，是 pipeline 驗證用的 5 筆真實樣本。** 全量下載被這個雲端環境的網路政策擋下（見
[data-sources.md](./data-sources.md) 的 BLOCKED 記錄），pipeline 本身（download → parse → normalize →
validate → dedupe → 輸出）已經完成並有測試覆蓋，換一個能連線的環境重跑
`pnpm run data:update:temples` 即可取得全量資料。

### 座標涵蓋率（依縣市）

| 縣市 | 總數 | 有座標 | 無座標 |
| --- | --- | --- | --- |
| 臺北市 | 5 | 5 | 0 |
| 新北市 | 0 | 0 | 0 |
| 桃園市 | 0 | 0 | 0 |
| 臺中市 | 0 | 0 | 0 |
| 臺南市 | 0 | 0 | 0 |
| 高雄市 | 0 | 0 | 0 |
| 其他縣市 | 0 | 0 | 0 |

全部 5 筆都在臺北市——這正是 Part E 要解決的「附近寺廟在臺北以外必定 0 筆結果」問題的根本原因。
`findNearbyTemplesWithExpansion` 的 5→10→20→30km 自動擴大與明確告知（已完成，見
[elder-ux.md](./elder-ux.md)）只能緩解「介面看起來像壞掉」，無法補上「其實沒有資料」——
這需要 Part C 的全量匯入才能真正解決。

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

- 全國寺廟資料目前只有 5 筆 REAL SAMPLE，涵蓋率 = 0%（相對於 dataset 8203 的全量）。Pipeline
  架構完成，本地檔案匯入模式（`--input`）已驗證可用，缺的是真正連得上 data.gov.tw 的環境或
  手動下載的匯出檔。
- 新北市座標 enrichment（Part D）：架構與 confidence 分級比對邏輯已完成並測試，但沒有實際跑過
  真的新北市資料（同樣被網路白名單擋掉）。
- 媽祖、關聖帝君的欄位級 provenance（Part F）：religion.moi.gov.tw 連不上，這兩位維持 sample。
- Normal Mode 的多主題拜拜教學文章（Part H）：還沒有逐條轉換成 `ProvenancedField` 結構，只加了
  頁面層級的誠實提示。
- FindDaysView/WorshipGuideView 以外的畫面（RealDeitiesView、RealDeityDetail）：Simple Mode 深度
  重排（Part A 遺留項目）本輪沒有再往下做，優先度排在 P2 內容工作之後。
- 神明資料庫目前仍只有 6 位，拜什麼對照表因此有 3 個需求分類（學業/考試、生育/小孩、司法/公平）
  查不到對應神明，見上方「拜什麼對照表」一節。
- 圖片資產 registry 目前是空的，這輪只做了 schema，沒有匯入任何一張圖片。
