# Data Sources

## LunarData — REAL DATA, PARTIAL RANGE

https://github.com/donma/LunarData（MIT）提供 1970–2100 按年月拆分的離線 JSON/JS。Phase 2 提供 2026 全年 12 個月份，置於 `public/` 並按月讀取；其他年份明確無資料。

## lunar-javascript — REAL CALCULATION LIBRARY

https://github.com/6tail/lunar-javascript（MIT）作獨立計算與交叉驗證。不同結果不會被靜默合併。

## cnlunar — PARTIAL

https://github.com/OPN48/cnlunar（MIT）適合 offline validation / future generator；本 POC 未加入 Python runtime。

## Taiwan Government temple data — REAL SOURCE, IMPORT PARTIAL

https://data.gov.tw/dataset/8203 適用政府資料開放授權條款第 1 版。minimal JSON importer 可 normalize 常見欄位；全量 XML、地址地理編碼、去重與更新自動化未完成。repo 中五間寺廟是 `REAL SAMPLE`，不是全量政府匯入。

## Deities — SAMPLE / PLACEHOLDER

六筆 normalized seed 只驗證 schema/service；供品與誕辰傳統需在 production 前做逐欄位編輯驗證。
