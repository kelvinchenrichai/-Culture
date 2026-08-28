# Architecture

```text
React UI (existing prototype)
  → ViewModel / service migration seam
    → CalendarService → LunarDataProvider / LunarJsProvider
    → rule engine / deity / temple / share-card services
```

`data/mockData.ts` 保留既有 UI mock（包含未經資料支持的分數/文案），不供規則引擎使用。Domain code 是 browser-compatible TypeScript、JSON、SVG 與 Haversine math，可移植至 Cloudflare。

LunarData 是 primary source；lunar-javascript 是 verification source。跨來源永不合併，Rule Engine 只依 primary 判定並以 `hasConflict` 記錄差異。同一 primary 自身若同一 action 同時出現在宜與忌，才採忌優先。回答狀態只用 `recommended`、`neutral`、`not_recommended`、`unknown`。

2026 月資料位於 `public/data/calendar/2026/MM.json`，按月 fetch/cache。lunar-javascript 使用 dynamic import。Production 缺資料時輸出 `unavailable`，永不回退 mock 日期；Dev badge 顯示資料狀態。

Upstream 將 components 攤平在根目錄，但 imports 指向 `components/` / `data/`；本分支只恢復預期目錄，不重設計 UI。Vite SPA 保留，Astro/Next.js/SSR/SSG 留待 SEO Scale Phase 評估。
