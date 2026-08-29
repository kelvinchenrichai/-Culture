import type { Temple } from '../../lib/temples/types';

/**
 * 離線保底用的極小資料集，**不是** `scripts/import-national-temples.ts` 的完整產出。
 *
 * 這輪（Data Completion Foundation）拿到使用者親自下載的 dataset 8203 真實原始檔後，
 * `public/data/temples/national-temples.json` 已經從 5 筆樣本變成上萬筆全國真實資料
 * （見 docs/data-coverage.md）。這個檔案原本用 `import generated from
 * '../../../public/data/temples/national-temples.json'` 直接把那個 JSON 當成 TS 模組匯入——
 * 這個寫法在資料還只有 5 筆的時候沒問題，但换成全量資料後，Vite 會把整份幾 MB 的 JSON
 * 直接內嵌進 JS bundle 裡（不是當成一般靜態資源用 `fetch()` 拿，而是變成程式碼的一部分），
 * 讓每個使用者第一次打開網站都要多下載好幾 MB——這對行動網路、對長輩會用的裝置都是不小的
 * 負擔，也違背了「public JSON 只在 runtime fetch，不要進 bundle」的原始設計意圖
 * （見 docs/temple-data-pipeline.md）。
 *
 * 修法：這裡改成手動維護一個很小的「知名寺廟」子集，只在 `useTemples` fetch 失敗（離線、
 * 路徑錯誤等）時當保底，讓畫面不會整個空白，不追求跟完整資料集一致——正常情況下
 * （有網路）永遠是 fetch 到的全量資料在運作。這 5 筆是原本 pipeline 驗證用的
 * REAL SAMPLE（見 fixtures/temples/national-temples-raw-sample.json），本身就是真實、
 * 可公開查證的知名寺廟，不是編出來的假資料。
 */
export const TEMPLES: Temple[] = [
  {
    id: 'T001',
    name: '艋舺龍山寺',
    aliases: ['龍山寺'],
    rawMainDeity: '觀世音菩薩',
    normalizedDeityId: 'guanyin',
    city: '臺北市',
    district: '萬華區',
    rawAddress: '臺北市萬華區廣州街211號',
    normalizedAddress: '臺北市萬華區廣州街211號',
    phone: '02-23025162',
    lat: 25.0372,
    lng: 121.4999,
    sources: [{ name: '離線保底樣本，非 dataset 8203 全量產出' }],
    coordinateStatus: 'verified',
  },
  {
    id: 'T002',
    name: '台北霞海城隍廟',
    aliases: ['霞海城隍廟'],
    rawMainDeity: '霞海城隍',
    city: '臺北市',
    district: '大同區',
    rawAddress: '臺北市大同區迪化街一段61號',
    normalizedAddress: '臺北市大同區迪化街一段61號',
    phone: '02-25580346',
    lat: 25.0555,
    lng: 121.5102,
    sources: [{ name: '離線保底樣本，非 dataset 8203 全量產出' }],
    coordinateStatus: 'verified',
  },
  {
    id: 'T003',
    name: '行天宮',
    aliases: [],
    rawMainDeity: '關聖帝君',
    normalizedDeityId: 'guandi',
    city: '臺北市',
    district: '中山區',
    rawAddress: '臺北市中山區民權東路二段109號',
    normalizedAddress: '臺北市中山區民權東路二段109號',
    phone: '02-25027924',
    lat: 25.0627,
    lng: 121.5339,
    sources: [{ name: '離線保底樣本，非 dataset 8203 全量產出' }],
    coordinateStatus: 'verified',
  },
  {
    id: 'T004',
    name: '松山慈祐宮',
    aliases: [],
    rawMainDeity: '天上聖母',
    normalizedDeityId: 'mazu',
    city: '臺北市',
    district: '松山區',
    rawAddress: '臺北市松山區八德路四段761號',
    normalizedAddress: '臺北市松山區八德路四段761號',
    phone: '02-27652798',
    lat: 25.0504,
    lng: 121.5778,
    sources: [{ name: '離線保底樣本，非 dataset 8203 全量產出' }],
    coordinateStatus: 'verified',
  },
  {
    id: 'T005',
    name: '大龍峒保安宮',
    aliases: ['保安宮'],
    rawMainDeity: '保生大帝',
    city: '臺北市',
    district: '大同區',
    rawAddress: '臺北市大同區哈密街61號',
    normalizedAddress: '臺北市大同區哈密街61號',
    phone: '02-25951676',
    lat: 25.0731,
    lng: 121.5154,
    sources: [{ name: '離線保底樣本，非 dataset 8203 全量產出' }],
    coordinateStatus: 'verified',
  },
];
