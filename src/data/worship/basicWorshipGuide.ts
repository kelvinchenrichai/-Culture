import type { WorshipGuide } from '../../lib/worship/types';

/**
 * Part H：Simple Mode「拜拜」預設流程。
 *
 * 誠實的來源狀況：台灣拜拜的實際習慣因地區、廟宇而有不小差異，我們找不到一份「政府/官方寺廟/
 * 文化主管機關/博物館/學術」等級、逐條可稽核的單一權威文獻可以引用（搜尋過內政部全國宗教資訊網、
 * 監督寺廟條例等官方管道，都是行政/法規層級的資料，不是參拜禮儀說明）。這裡的內容整理自公開媒體
 * 對台灣民俗的介紹報導，跟本站既有 prototype 內容交叉比對後保留較沒有爭議的部分，
 * 因此誠實標記為 `status: 'sample'`、`contentType: 'FOLKLORE'`，不是 'verified'。
 *
 * 不要因為想要有『驗證過』的內容，就把這份資料的 status 改成 verified——沒有找到夠格的
 * 來源時，保持 sample 才是對的。
 */
const SOURCES = [
  {
    title: '圖解台灣民俗：廟宇拜拜七步驟，左進右出不走中門',
    url: 'https://www.thenewslens.com/article/117891',
    publisher: '關鍵評論網 The News Lens',
    accessedAt: '2026-08-29',
    note: '整理自公開媒體報導與多篇民俗介紹文章交叉比對，非單一官方文獻；台灣各地廟宇、族群習慣仍有差異，這裡呈現的是較普遍流傳的通用版本，實際請以現場廟方公告為準。',
  },
];

export const BASIC_WORSHIP_GUIDE: WorshipGuide = {
  id: 'basic-worship',
  occasion: '一般日常參拜',
  title: '拜拜基本流程',
  preparation: {
    value: ['準備清香、水果或點心等供品', '進廟前先把雙手洗乾淨', '衣著整齊、手機轉靜音，保持恭敬的心態'],
    status: 'sample',
    contentType: 'FOLKLORE',
    sources: SOURCES,
  },
  offerings: {
    value: [
      '清香（現在多數廟宇提倡環保，一爐一柱香即可，心誠最重要）',
      '水果或餅乾等點心（依個人狀況準備即可，不需要求多求貴）',
      '金紙（依各廟規定不同，部分廟宇已不燒金紙，建議先詢問廟方）',
    ],
    status: 'sample',
    contentType: 'FOLKLORE',
    sources: SOURCES,
  },
  steps: {
    value: [
      '面對廟門，從右手邊「龍門」進入、左手邊「虎門」離開，避免走中間正門，也避免踩踏門檻',
      '先到廟外向天公爐上香行禮，再進入正殿參拜主神',
      '依廟方動線參拜左右配祀神明，若供桌下有虎爺，最後再拜虎爺',
      '上香後等候約 10 到 15 分鐘讓香燃燒過半，雙手合十向神明道謝再收供品；金紙送到廟方指定的金爐焚化即可',
    ],
    status: 'sample',
    contentType: 'FOLKLORE',
    sources: SOURCES,
  },
  etiquette: {
    value: [
      '這是台灣民間流傳已久的參拜習慣，不同廟宇、不同地區可能有些微差異，實際請以現場廟方公告為準',
      '生理期、身體不適等現代觀念上並不影響參拜，心誠與身體舒適比形式更重要',
      '插香用左手或右手、金紙怎麼處理等細節，各地說法不完全一致，沒有絕對對錯，不需要因此焦慮',
    ],
    status: 'sample',
    contentType: 'FOLKLORE',
    sources: SOURCES,
  },
  notes: {
    value: [
      '先說自己的稱謂與基本資料，例如：「弟子／信女○○○，住在○○市○○區」',
      '說明今天來的原因與感謝，例如：「今天前來向○○神明請安，感謝平日庇佑」',
      '具體說出想祈求的事，內容越明確越好，避免不合情理的祈求',
      '在心裡默念即可，不需要出聲，也不會打擾其他香客',
    ],
    status: 'sample',
    contentType: 'FOLKLORE',
    sources: SOURCES,
  },
};
