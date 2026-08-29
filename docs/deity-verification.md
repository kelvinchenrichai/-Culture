# Deity Verification（Part F）

這份文件記錄「優先 6 位神明」的欄位級 provenance 現況：哪些欄位已核實、來源是什麼、
哪些欄位還是民間習俗整理，以及查證過程中實際發生了什麼（包含查不到的部分）。

最後更新：2026-08-29（Phase 4 P2，feature/folklore-data-content 分支）。

## 資料模型

`src/lib/provenance/types.ts` 的 `ProvenancedField<T>`：

```ts
type ProvenancedField<T> = {
  value: T;
  status: 'verified' | 'sample' | 'placeholder' | 'unavailable';
  contentType: 'FACT' | 'FOLKLORE' | 'EDITORIAL';
  sources: SourceReference[];
};
```

規則只有一條，但很重要：`status === 'verified'` 一定要有至少一個 `sources`
（`isValidProvenancedField` 會檢查），不能空口說白話標成 verified。這條規則有測試覆蓋
（`tests/deityProfiles.test.ts`），也套用在 worship guide 上（`tests/worshipGuide.test.ts`）。

`src/lib/deities/deityProfile.ts` 的 `DeityProfile` 疊加在既有 `Deity`/`DeityService`
之外（today 頁、神明列表用的那個扁平結構完全沒動），`components/RealDeityDetail.tsx`
在神明詳細頁多顯示一段「逐欄位資料來源」，有資料就顯示，沒有就跟以前一樣。

## 查證過程（誠實記錄，不是「規劃要做」）

查證順序：先試內政部「全國宗教資訊網」（religion.moi.gov.tw），這是最對口的政府資料源
（有寺廟神祇介紹的知識頁），但這個雲端環境連不上這個網域——`WebFetch` 兩次都回報
`ROBOTS_DISALLOWED` / `ConnectTimeout`，跟 `data.gov.tw` 被擋的狀況是同一類（網路白名單），
不是查無此頁——實際搜尋確認 `religion.moi.gov.tw/Knowledge/Content?ci=2&cid=241`（天上聖母）、
`cid=286`（關聖帝君）都存在，只是連不上。

改查文化部「國家文化記憶庫」（tcmb.culture.tw），這個網域可以連上，而且剛好有 4 位的
神祇介紹頁：

| id | 名稱 | 來源頁面 |
| --- | --- | --- |
| tudigong | 福德正神／土地公 | https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Place&id=247133 |
| guanyin | 觀音佛祖 | https://tcmb.culture.tw/zh-tw/detail?id=247138&indexCode=Culture_Place |
| yuelao | 月下老人 | https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Place&id=247148 |
| caishen | 五路財神（玄壇真君） | https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Place&id=247150 |

媽祖、關聖帝君在 `tcmb.culture.tw` 上沒找到等價的「神祇介紹」系列頁（有搜尋但只找到寺廟/
文物條目，不是神祇本身的介紹頁），這兩位這輪維持既有的 `sample` 內容。

## 逐位現況

| id | name/aliases | birthday | beliefs | commonPrayers | culturalBackground |
| --- | --- | --- | --- | --- | --- |
| tudigong | verified | sample | verified | sample | verified |
| mazu | sample | sample | sample | sample | sample |
| guandi | sample | sample | sample | sample | sample |
| guanyin | verified | sample | verified | verified | verified |
| yuelao | verified | sample | verified | verified | verified |
| caishen | verified | **verified**（正月初五） | verified | verified | verified |

**沒有任何一位神明是全欄位 verified**（`tests/deityProfiles.test.ts` 有一條測試專門守這件事）。
即使是查證最完整的財神/月老/觀音，`birthday` 跟 `offerings` 這幾個欄位還是 sample——來源頁面
沒有明確寫聖誕日期（財神除外，來源明確寫「正月初五」）或供品清單，不能因為其他欄位查到了，
就順便把整筆資料當成已核實。

### 財神的修正

原本 `data/deities/deities.ts`（Phase 2 seed）的 `caishen` 是最籠統的「財神爺」，
`dataStatus: 'placeholder'`。查證後發現這其實有一個具體、有名有姓的版本：
**玄壇真君（趙公明），俗稱武財神**，是五路財神之首。`DeityProfile` 裡把這個更精確的身份
資訊補上（別稱包含 財神/財神爺/玄壇元帥/趙公明/趙元帥/黑虎將軍/武財神），聖誕明確為
**正月初五**（來源逐字寫「聖誕：正月初五（玄壇真君巡遊人間之日）」）。這是這輪查證裡
最實質的一筆修正——原本的 placeholder 現在有了具體、可稽核的內容。

## 沒做 / 已知落差

- 媽祖、關聖帝君：religion.moi.gov.tw 連不上，這兩位的欄位級 provenance 這輪等於沒做。
  不是「決定不做」，是環境限制；換一個能連線的環境，兩支 fetch 就能補上。
- 6 位以外的神明（`data/deities/deities.ts` 目前只有這 6 筆，沒有超出範圍）。
- `offerings`（供品）欄位在 6 位裡全部維持 sample——查到的政府/文化來源頁面都沒有明確列出
  供品清單，這是這類介紹頁的通性（著重信仰由來與文化背景，不是拜拜實務指南），不是查證不夠
  努力。
