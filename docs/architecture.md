# Architecture

```text
React UI (existing prototype)
  → ViewModel / service migration seam
    → CalendarService → LunarDataProvider / LunarJsProvider
    → rule engine / deity / temple / share-card services
```

`data/mockData.ts` 保留既有 UI mock（包含未經資料支持的分數/文案），不供規則引擎使用。Domain code 是 browser-compatible TypeScript、JSON、SVG 與 Haversine math，可移植至 Cloudflare。

LunarData 是 POC primary source；未內嵌日期回傳 `null`，絕不補造。回答狀態只用 `recommended`、`neutral`、`not_recommended`、`unknown`；若宜忌衝突，忌優先以避免過度建議。`needsAI` 只有 metadata，沒有 AI API。

Upstream 將 components 攤平在根目錄，但 imports 指向 `components/` / `data/`；本分支只恢復預期目錄，不重設計 UI。Vite SPA 保留，Astro/Next.js/SSR/SSG 留待 SEO Scale Phase 評估。
