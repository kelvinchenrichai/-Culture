import type { DeityProfile } from '../../lib/deities/deityProfile';
import type { SourceReference } from '../../lib/provenance/types';

/**
 * Part F：優先 6 位神明的欄位級 provenance。
 *
 * 來源政策（F3）：優先政府/官方寺廟/文化主管機關/博物館/學術，不用 SEO 農場或沒有來源的部落格
 * 當 verified 的依據。這裡實際查證後的結果：
 *
 * - 文化部「國家文化記憶庫」（tcmb.culture.tw）有土地公、觀音、月老、財神（玄壇真君）的神祇介紹頁，
 *   內容拿來當 verified 的依據。
 * - 內政部「全國宗教資訊網」（religion.moi.gov.tw）本來就有天上聖母、關聖帝君的介紹頁
 *   （cid=241 / cid=286），但這個雲端環境連不上 religion.moi.gov.tw（WebFetch 回報
 *   `ROBOTS_DISALLOWED` / connect timeout，跟 data.gov.tw 被擋的狀況同一類）。所以媽祖、
 *   關聖帝君兩位這一輪仍然是 `sample`，不是查無資料，是環境連不到，誠實記錄在
 *   docs/deity-verification.md，換一個能連線的環境重跑就能補上。
 * - 農曆聖誕日期：除了財神（來源明確寫「正月初五」）之外，其餘幾位的聖誕日期在查到的頁面裡都沒有
 *   明確列出，所以維持 `sample`（沿用既有資料），不能因為「大家都這樣講」就升級成 verified。
 *
 * 不要因為想要更多 verified 欄位，就把這裡的 status 往上調——找不到夠格來源時，維持 sample
 * 才是對的（F4）。
 */

const TCMB_TUDIGONG: SourceReference = {
  title: '福德正神／土地公',
  url: 'https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Place&id=247133',
  publisher: '文化部 國家文化記憶庫',
  accessedAt: '2026-08-29',
};

const TCMB_GUANYIN: SourceReference = {
  title: '觀音佛祖',
  url: 'https://tcmb.culture.tw/zh-tw/detail?id=247138&indexCode=Culture_Place',
  publisher: '文化部 國家文化記憶庫',
  accessedAt: '2026-08-29',
};

const TCMB_YUELAO: SourceReference = {
  title: '月下老人',
  url: 'https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Place&id=247148',
  publisher: '文化部 國家文化記憶庫',
  accessedAt: '2026-08-29',
};

const TCMB_CAISHEN: SourceReference = {
  title: '五路財神',
  url: 'https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Place&id=247150',
  publisher: '文化部 國家文化記憶庫',
  accessedAt: '2026-08-29',
};

export const DEITY_PROFILES: DeityProfile[] = [
  {
    id: 'tudigong',
    name: { value: '福德正神', status: 'verified', contentType: 'FACT', sources: [TCMB_TUDIGONG] },
    aliases: { value: ['土地公', '土治公', '伯公', '后土', '社神'], status: 'verified', contentType: 'FACT', sources: [TCMB_TUDIGONG] },
    birthday: { value: ['二月初二'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    beliefs: {
      value: ['地方與土地的守護神，守護聚落、農田、墓地、農田水渠、山等，職能廣泛且貼近日常生活'],
      status: 'verified',
      contentType: 'FACT',
      sources: [TCMB_TUDIGONG],
    },
    commonPrayers: { value: ['地方平安', '生意順利'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    offerings: { value: ['水果', '茶', '糕點'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    worshipSteps: { value: ['準備水果、糕點等供品，上香行禮，說明祈求事項'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    culturalBackground: {
      value:
        '源於古代「立樹或立石為社神」的傳統，民間也常說某些生前行善或有地方功績的人，死後託夢而成為土地公。土地公在臺灣民間神譜裡地位不高，卻是最常見、最親民的神祇。',
      status: 'verified',
      contentType: 'FACT',
      sources: [TCMB_TUDIGONG],
    },
  },
  {
    id: 'mazu',
    name: { value: '天上聖母', status: 'sample', contentType: 'FOLKLORE', sources: [] },
    aliases: { value: ['媽祖', '天后'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    birthday: { value: ['三月廿三'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    beliefs: { value: ['海上與出行平安的守護神，臺灣民間信仰中信眾最多的神祇之一'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    commonPrayers: { value: ['出行平安', '海上平安'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    offerings: { value: ['水果', '鮮花', '茶'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    worshipSteps: { value: ['準備水果、鮮花等供品，上香行禮，說明祈求事項'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    culturalBackground: {
      value:
        '內政部「全國宗教資訊網」原有天上聖母的官方介紹頁（religion.moi.gov.tw），但這個環境目前連不上該網域（WebFetch 回報 timeout），這輪無法查證引用，因此维持既有 sample 內容，未升級為 verified。',
      status: 'sample',
      contentType: 'FOLKLORE',
      sources: [],
    },
  },
  {
    id: 'guandi',
    name: { value: '關聖帝君', status: 'sample', contentType: 'FOLKLORE', sources: [] },
    aliases: { value: ['關公', '恩主公', '武聖'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    birthday: { value: ['六月廿四'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    beliefs: { value: ['忠義象徵，商業與正財的守護神'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    commonPrayers: { value: ['事業', '正財'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    offerings: { value: ['水果', '茶'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    worshipSteps: { value: ['準備水果、茶等供品，上香行禮，說明祈求事項'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    culturalBackground: {
      value:
        '內政部「全國宗教資訊網」原有關聖帝君的官方介紹頁（religion.moi.gov.tw），但這個環境目前連不上該網域（WebFetch 回報 timeout），這輪無法查證引用，因此維持既有 sample 內容，未升級為 verified。',
      status: 'sample',
      contentType: 'FOLKLORE',
      sources: [],
    },
  },
  {
    id: 'guanyin',
    name: { value: '觀世音菩薩', status: 'verified', contentType: 'FACT', sources: [TCMB_GUANYIN] },
    aliases: {
      value: ['觀音菩薩', '觀自在菩薩', '光世音菩薩', '觀音佛祖', '觀音大士', '觀音娘娘', '白衣大士'],
      status: 'verified',
      contentType: 'FACT',
      sources: [TCMB_GUANYIN],
    },
    birthday: { value: ['二月十九', '六月十九', '九月十九'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    beliefs: {
      value: ['大乘佛教西方極樂世界教主阿彌陀佛座下的上首菩薩，與大勢至菩薩並稱「西方三聖」，信眾一心稱念聖號可離苦得樂'],
      status: 'verified',
      contentType: 'FACT',
      sources: [TCMB_GUANYIN],
    },
    commonPrayers: { value: ['平安', '消災'], status: 'verified', contentType: 'FACT', sources: [TCMB_GUANYIN] },
    offerings: { value: ['鮮花', '水果', '清茶'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    worshipSteps: { value: ['準備鮮花、水果、清茶等素供，上香行禮，稱念聖號'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    culturalBackground: {
      value: '東亞民間普遍敬仰崇拜的菩薩，臺灣民間信仰常見於家堂神畫「觀音漆」，有「家家阿彌陀，戶戶觀世音」之譽。',
      status: 'verified',
      contentType: 'FACT',
      sources: [TCMB_GUANYIN],
    },
  },
  {
    id: 'yuelao',
    name: { value: '月下老人', status: 'verified', contentType: 'FACT', sources: [TCMB_YUELAO] },
    aliases: { value: ['月老', '月老公', '月老爺', '月老星君'], status: 'verified', contentType: 'FACT', sources: [TCMB_YUELAO] },
    birthday: { value: ['八月十五'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    beliefs: { value: ['掌管男女姻緣之神，典出唐朝李復言《續幽怪錄・定婚店》的姻緣故事'], status: 'verified', contentType: 'FACT', sources: [TCMB_YUELAO] },
    commonPrayers: { value: ['求姻緣', '感情順利'], status: 'verified', contentType: 'FACT', sources: [TCMB_YUELAO] },
    offerings: { value: ['甜食', '水果'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    worshipSteps: { value: ['準備甜食、水果等供品，上香行禮，說明自身姻緣祈求'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    culturalBackground: {
      value: '形象為白鬍長鬚、臉泛紅光的慈祥老者，左手持姻緣簿、右手拄拐杖，是華人世界對愛情有所期待者虔誠信奉的神祇。',
      status: 'verified',
      contentType: 'FACT',
      sources: [TCMB_YUELAO],
    },
  },
  {
    id: 'caishen',
    name: { value: '玄壇真君', status: 'verified', contentType: 'FACT', sources: [TCMB_CAISHEN] },
    aliases: { value: ['財神', '財神爺', '玄壇元帥', '趙公明', '趙元帥', '黑虎將軍', '武財神'], status: 'verified', contentType: 'FACT', sources: [TCMB_CAISHEN] },
    birthday: { value: ['正月初五'], status: 'verified', contentType: 'FACT', sources: [TCMB_CAISHEN] },
    beliefs: {
      value: ['道教神祇，居五路財神之首（中路武財神），與東路蕭升、南路陳九公、西路曹寶、北路姚少司並稱五路財神，代表各行各業'],
      status: 'verified',
      contentType: 'FACT',
      sources: [TCMB_CAISHEN],
    },
    commonPrayers: { value: ['正財', '生意順利'], status: 'verified', contentType: 'FACT', sources: [TCMB_CAISHEN] },
    offerings: { value: ['水果', '糕點', '茶'], status: 'sample', contentType: 'FOLKLORE', sources: [] },
    worshipSteps: {
      value: ['商家多於正月初五開工日、十二月十六尾牙日祭拜，祈求財運與生意興旺'],
      status: 'verified',
      contentType: 'FACT',
      sources: [TCMB_CAISHEN],
    },
    culturalBackground: {
      value: '與福德正神（土地公）並列為公司、商家的財神與守護神祇，善使鐵鞭、以神虎為座騎，專司除瘟禳災、主持公道，錢財交易及公正亦屬其所司。',
      status: 'verified',
      contentType: 'FACT',
      sources: [TCMB_CAISHEN],
    },
  },
];

export function findDeityProfile(id: string): DeityProfile | undefined {
  return DEITY_PROFILES.find((profile) => profile.id === id);
}
