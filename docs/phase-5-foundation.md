# Phase 5 — Data Completion Foundation

這份文件是這一輪（`feature/data-completion-foundation` 分支，接續 P2 的
`feature/folklore-data-content`）的總覽。跟前幾輪不同的是，這輪的性質是「架構」而不是
「內容」——目的是把「補資料」變成一條有固定形狀、可以重複跑的工作線（Data Completion
Pipeline），而不是每次想到什麼就臨時補什麼。

最後更新：2026-08-29。

## 為什麼是這個範圍

上一輪（P2）把找好日子、拜拜教學、神明 provenance 三個「外殼已經好用但內容不夠真」的地方
補上了架構跟第一批真實內容。這一輪原本的方向討論（使用者的 Data Completion Pipeline
藍圖）點出下一步真正的瓶頸是**資料覆蓋率、可信度、圖片與內容豐富度**，並列出 6 類具體缺口：
全台寺廟、寺廟 GPS、30–50 位神明、神明生日交叉驗證、真實慶典活動、合法圖片。

其中全台寺廟／寺廟 GPS／全量慶典都卡在同一個環境限制——這個雲端沙盒連不上
`data.gov.tw`／`data.ntpc.gov.tw`，這不是「這輪不想做」，是需要換一個能連線的環境或由使用者
手動下載政府原始檔案才能往下走（見 [data-sources.md](./data-sources.md) 的 BLOCKED 記錄）。
所以這一輪明確只做「不需要等新資料就能先做的架構」，等原始檔案到位後可以直接套用，不用
重新設計：

1. 神明多日期模型（`regionalVariation`）——資料模型層級的改動，跟資料量無關，可以現在做。
2. Need→Deity 對照表——只需要現有 6 位神明就能建立骨架，同時誠實標出還缺哪些神明。
3. 圖片資產 schema——在真的匯入圖片之前，先把「一張圖片要記錄哪些欄位」定下來。
4. 資料完成度 Dashboard——把「現在到底有多少資料」變成可以重複產生的真實數字，而不是
   跟著感覺猜。

30–50 位神明的實際擴充、全國寺廟/GPS/慶典的全量匯入，都需要外部原始資料到位才能做，
明確留在「下一輪建議」，這輪不會為了填數字就提前虛構神明資料或政府資料。

## 完成度總覽

| 項目 | 內容 | 狀態 |
| --- | --- | --- |
| LOCAL_CUSTOM content type | 區分「地方習俗/禁忌」跟廣泛流傳的 FOLKLORE | DONE |
| 神明多日期模型 | `dates: DeityDateEvent[]`，含 `regionalVariation` 旗標 | DONE（架構＋6 位神明遷移），媽祖聖誕+飛昇兩個日期本輪查證升級為 verified |
| Need→Deity 對照表 | 8 個需求分類，5 個已對應現有神明 | DONE（骨架），3 個缺口誠實保留待神明擴充 |
| 圖片資產 schema | `ImageAsset` type + 空 registry + 驗證規則 | DONE（schema），NOT DONE（實際圖片） |
| 資料完成度 Dashboard | `pnpm run data:coverage` → `docs/data-coverage.json` + 發布成 Artifact 頁面 | DONE |
| 全台寺廟全量 / GPS / 慶典全量 | pipeline 已有，缺原始資料 | 沿用 P0/P2 狀態，本輪未變動，見下方建議 |
| 30–50 位神明擴充 | — | NOT DONE，本輪刻意不做（見下方原因） |

## 為什麼沒有一次擴充到 30–50 位神明

使用者藍圖裡特別強調：「不要讓 AI『憑知識一次寫 30 位』——這非常容易開始幻覈。」這輪如果
順手把剩下 24–44 位神明的資料寫出來，會直接違反這個明講的限制，也違反這個 repo 從 Phase 2
開始就守的「不能空口說白話標成 verified」規則。正確的路徑是使用者藍圖裡畫的那條：
神明 → 官方/文化來源 → 抽取 FACT/FOLKLORE → 來源紀錄 → 驗證 → verified，一位一位查證，
不是一次性生成。這輪把「查完之後要放進哪個資料結構」（`DeityProfile`、`dates` 多日期模型、
Need→Deity 對照表怎麼接上新神明）準備好，讓下一輪查證工作有地方放，但查證本身要等實際去
查證的那一輪才做。

## 資料完成度 Dashboard 怎麼用

```bash
pnpm run data:coverage
```

會讀取 repo 裡實際的資料檔案（`public/data/temples/`、`public/data/festivals/`、
`src/data/deities/deityProfiles.ts`、`src/data/needs/needDeityMap.ts`、
`src/data/images/imageRegistry.ts`、`src/data/worship/basicWorshipGuide.ts`），
算出真實數字寫進 `docs/data-coverage.json`。運算邏輯在
`src/lib/coverage/computeCoverage.ts`，每個函式都有 vitest 測試（`tests/computeCoverage.test.ts`）。

刻意不做的事：不會對「全國寺廟」「全國慶典」這種我們不知道真實分母（政府資料集全量筆數）的
類別算百分比——那樣算出來的數字在全量匯入後反而會「變差」，是一個會說謊的 dashboard。這兩類
只回報樣本內的原始數字加誠實註記。分母是本站自己定義的東西時（追蹤的神明欄位數、定義的需求
分類數）才算百分比。

視覺化版本發布成一頁「資料完成度帳冊」Artifact，是目前這份 JSON 的快照，不會自動連線更新——
每次補完一輪資料後，重新跑 `pnpm run data:coverage`，把新的 JSON 貼回那個頁面重新發布即可。

## 跟其他文件的關係

- 逐項技術細節：[data-coverage.md](./data-coverage.md)（數字，含拜什麼對照表、圖片資產兩個新
  章節）、[data-sources.md](./data-sources.md)（媽祖紀念日期新來源）、
  [deity-verification.md](./deity-verification.md)（神明查證過程，本輪補充媽祖 dates 部分）。
- Git 狀態、測試/build 結果：見交付時的 RESULT 報告（不寫進 repo 文件）。

## 下一輪建議（不代表這輪會開始做）

1. ~~使用者親自下載 Dataset 8203（全國寺廟）跟 Dataset 8209（慶祭典）的政府原始檔案~~
   **Dataset 8203 已完成（2026-08-29，`feature/national-temple-import` 分支）**：使用者下載
   官方 XML 匯出檔，全量匯入 12,423 筆真實寺廟資料，95.9% 有座標，見
   [data-coverage.md](./data-coverage.md)。Dataset 8209（慶祭典）同樣的路徑還沒做，維持原建議。
2. 六都寺廟 GPS enrichment：拿到新北市（Dataset 122928 或手動下載）資料後，
   `scripts/enrich-temple-coordinates.ts` 直接可用，跑完一個縣市回報一次覆蓋率，
   再往下一個縣市推進。
3. 神明擴充到 30–50 位：一次查證 3–5 位（不要一次全做），每位都要走「官方/文化來源 → FACT/
   FOLKLORE 分離 → 來源紀錄」的流程，優先補上 Need→Deity 對照表裡的 3 個缺口
   （文昌帝君/魁星、註生娘娘/臨水夫人、城隍爺）。
4. 圖片：先做「今日好日台灣神明文化插畫系統」（統一風格自製插畫，授權寫「自製插畫」，
   不用處理外部版權），比起找版權不明的網路圖片更穩。
5. Normal Mode 拜拜教學舊文章逐條轉換成 `ProvenancedField`（P2 遺留項目）。
