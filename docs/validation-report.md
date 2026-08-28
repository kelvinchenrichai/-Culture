# Calendar Validation Report

驗證日期：`2026-01-01`、`2026-02-17`、`2026-06-19`、`2026-08-29`、`2026-12-31`。執行 `pnpm validate:calendar` 可重現完整 JSON comparison。

Source A 是 LunarData monthly JSON；Source B 是 lunar-javascript 1.7.7。比較國曆→農曆、節氣與宜忌。

五個日期的農曆月日全部一致；顯示格式不同：LunarData 含月大小後綴，lunar-javascript 較精簡。節氣語意也不同：LunarData 提供當前節氣區間；lunar-javascript 的 `getJieQi()` 在這五個非交節日皆無值，不能直接視為矛盾。宜忌差異顯著，例如 2026-08-29 LunarData 未列理髮且列大量忌項，lunar-javascript 則列「理发」為宜；2026-06-19 與 12-31 LunarData 兩欄皆為「諸事不宜」，另一來源仍列具體項目。POC 不做 union，也不靜默選邊。

```text
Source A: LunarData（active solar-term interval；詳細繁中宜忌）
Source B: lunar-javascript（calculated lunar date；exact-transition JieQi；自身宜忌詞彙）
Difference: 顯示、節氣語意、活動清單可能不同。
Possible reason: API semantics、流派與詞彙粒度不同。
Current decision: POC 回答以 LunarData 為 primary；lunar-javascript 留作 validation evidence，衝突待人工政策。
```

cnlunar：PARTIAL（license/適用性已研究，offline execution 未加入）。
