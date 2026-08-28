# Phase 2 UI × Real Services

已接真實 flow：首頁日期/農曆/宜忌/神明事件、自然語言搜尋、剪髮/搬家/拜拜/開工決策、今日神明、附近寺廟 Haversine sample、今日宜忌分享卡。

仍屬 mock/editorial：找好日子、拜拜教學、首頁生活一句。首頁生活一句在 development 明確顯示 `EDITORIAL SAMPLE`。

Source policy：LunarData primary；lunar-javascript verification。跨來源不合併、不同結果只設 `hasConflict`。Rule Engine 永遠讀 primary arrays。Production missing data 顯示 unavailable，不使用 mock fallback。
