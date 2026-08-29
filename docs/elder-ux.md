# Elder UX / Simple Mode

這份文件記錄「簡易模式」（原本叫 elder mode / 大字模式）這輪重做了什麼、為什麼這樣做，以及還缺什麼。

## 出發點

重做前，`isElderMode` 是一個單純的 boolean prop，被傳進 15 個元件，實際效果只有把
Tailwind 字級從 `text-xl` 換成 `text-2xl`。這是「長輩模式 = 放大字」最典型的反面教材：
沒有重新安排資訊層級，長輩打開 app 看到的東西跟一般人一模一樣，只是字比較大。

這輪的目標是把它改成真正的資訊架構決策，同時**不**大改既有視覺設計（米白/朱砂/墨色配色與版型維持）。

## 做了什麼

### 狀態持久化

`src/hooks/useElderMode.ts` 把簡易模式狀態存進 `localStorage`（key: `jrho:simple-mode`），
SSR / 無 `window` 環境（測試）安全，storage 被封鎖（例如隱私瀏覽模式）時退回記憶體內狀態，不會噴錯。

### 首頁第一屏（Part A1）

`components/TodayRealSections.tsx`：簡易模式下，自由輸入的查詢框被收進一個預設收起的
`<details>`（Part A6：搜尋框降低優先），「今天適合 / 今天不建議」清單與「今天拜什麼」區塊在簡易模式
下整個隱藏——這些細節在一般模式才顯示。第一屏只留：日期、農曆日期、一句話摘要。

### Icon First 大按鈕（Part A1/A2）

新元件 `components/SimpleHomeActions.tsx`：6 個固定順序的大按鈕（剪頭髮 / 拜拜 / 搬家 / 開工 /
結婚 / 出門），每個都是「大 icon + 大文字」，最小點擊區 112px 高（遠高於 spec 要求的 52px），
不依賴任何小字說明就能懂在幹嘛。

一般模式維持原本的 `QuickEntryGrid`（列表式、含 badge 說明），因為一般模式的使用者本來就預期看到
比較密的資訊。

### 結果直接講答案（Part A3/A4/A5）

`components/RealDecisionView.tsx` 整個重做：

1. 第一眼看到：intent 對應的大 icon → 「今天{行為}」→ 大字狀態詞（適合／較不建議／普通／目前無法
   判斷）→ 一句話理由。狀態詞與詳細判斷邏輯（`AnswerStatus`）對應如下：

   | AnswerStatus | 顯示狀態詞 |
   | --- | --- |
   | recommended | 適合 |
   | not_recommended | 較不建議 |
   | neutral | 普通 |
   | unknown | 目前無法判斷 |

2. 「為什麼？」是一個預設收起的 `<details>`，裡面才放判斷基準（primarySource）、驗證來源
   （verificationSources）、來源衝突提示（hasConflict）。
3. 「查看更多農民曆」也是預設收起的 `<details>`，裡面放沖煞、財神方位、喜神方位、吉時、干支、
   彭祖百忌——這些欄位**沒有被刪掉**，只是移到收起區。為了讓這些欄位有得顯示，
   `src/lib/calendar/types.ts` 的 `CalendarDay` 新增了 `ganzhi` / `wealthDirection` /
   `blessingDirection` / `pengTaboo` 四個 optional 欄位，由 `LunarDataProvider` 從既有的
   2026 全年 JSON（本來就有 `dayGanzhi` / `luckyDirection` / `pengTaboo` 這些欄位，只是先前
   normalize 時被丟掉）填入，不是新的資料來源。

### Navigation（Part A8）

`components/BottomNav.tsx`：簡易模式 4 格（首頁 / 拜拜 / 好日子 / 更多），一般模式 5 格
（今日 / 查事生活 / 拜什麼 / 好日子 / 更多）。原本是每個功能各自佔一格（6 格：今日/決策/神明/
好日子/教學/寺廟），現在把「拜拜教學」「附近寺廟」（一般模式再加「查事生活」）收進新的
`components/MoreView.tsx`，用大按鈕列表呈現，不是塞進一個不起眼的選單。

### Typography 與觸控範圍（Part A7）

觸及到的元件裡，body 文字調整到 16px（`text-base`）以上、卡片主文字 18–24px、核心答案（決策結果的
狀態詞）在簡易模式下是 36px（`text-4xl`）。導覽列 tap target 在簡易模式下是 64×56px，一般模式
52×52px，均高於 WCAG 建議的 44px。

### 視覺素材（Part A9）

沒有引入任何神明或寺廟照片——現有畫面本來就只用 `lucide-react` 圖示，沒有來源不明的照片問題，
這條規則本輪維持現狀即可，不需要新增程式碼。

## 驗證

- 用 Playwright + 內建 Chromium 對「一般模式首頁」「簡易模式首頁」「簡易模式決策結果」三個畫面，
  在 360 / 375 / 390 / 430 / 768px 五個寬度分別截圖並檢查
  `document.documentElement.scrollWidth`，5×3 = 15 個組合皆無 horizontal overflow。
- 螢幕截圖人工檢視：簡易模式首頁在 360px 寬下，日期、農曆、Icon First 按鈕、底部導覽都清楚可讀，
  沒有文字截斷或版面跑掉。

## 沒做 / 已知落差（誠實列出，不要當作已完成）

- 沒有做 `FindDaysView.tsx`、`WorshipGuideView.tsx`、`RealDeitiesView.tsx`、`RealDeityDetail.tsx`
  的簡易模式深度重排——這幾個畫面目前只有原本就有的 `isElderMode` 字級切換，還沒套用「資訊分層」
  的同一套原則。這是下一輪最值得先做的項目（見 handoff 報告的 NEXT 10 TASKS）。
- 沒有加入 `@testing-library/react` 做元件層級的互動測試（例如「點擊 Icon First 按鈕後正確導向
  決策頁」），目前的測試只涵蓋 hook 的純邏輯部分（`tests/simpleMode.test.ts`）與 Playwright 的
  視覺/overflow 驗證。
- ErrorBoundary（Part K1）沒有專屬的自動化測試，只靠手動驗證與 build/tsc 通過。
