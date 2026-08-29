# Data Coverage

這份文件記錄「現在實際有多少資料」，不是「規劃要有多少資料」。每次跑
`pnpm run data:update:temples` 或補齊 deity/festival 資料後，應該回來更新這份文件。

最後更新：2026-08-29（Phase 4 P2 施工，feature/folklore-data-content 分支，接續
feature/elder-data-expansion 的 P0 成果）。

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

Part F 這輪新增的是疊加在上面的欄位級 provenance（`src/data/deities/deityProfiles.ts`），
6 位優先神明都有 `DeityProfile`，逐欄位標記 verified/sample，沒有任何一位是全欄位 verified。
詳見 [deity-verification.md](./deity-verification.md)，完整查證過程與逐位現況都在那份文件裡，
這裡不重複。

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
