# Data Coverage

這份文件記錄「現在實際有多少資料」，不是「規劃要有多少資料」。每次跑
`pnpm run data:update:temples` 或補齊 deity/festival 資料後，應該回來更新這份文件。

最後更新：2026-08-29（Phase 4 施工，feature/elder-data-expansion 分支）。

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

尚未建立 `scripts/import-festivals.ts`（Part F，P2，本輪未動工）。Raw / Normalized / Parsed dates /
Unparsed dates 目前皆為 0。

## Deity（神明）

| dataStatus | 筆數 | id |
| --- | --- | --- |
| sample | 5 | tudigong, mazu, guandi, guanyin, yuelao |
| placeholder | 1 | caishen |
| verified（逐欄位可稽核來源） | 0 | — |

Part G（欄位級 verification、FACT/FOLKLORE/EDITORIAL 分級）本輪未動工，仍是 P2。所有神明內容目前
都標記 `sample` 或 `placeholder`，UI 與文案都不應把它們當成已核實的事實呈現。

## 已知限制

- 全國寺廟資料目前只有 5 筆 REAL SAMPLE，涵蓋率 = 0%（相對於 dataset 8203 的全量），這是本輪最大
  的已知落差。
- 沒有任何新北市在地座標 enrichment（Part D）、慶祭典（Part F）、神明逐欄位驗證（Part G）、找好日子
  服務（Part H）、拜拜教學結構化資料（Part I）——這些都還是 P2，本輪刻意沒有為了衝數量而動工。
