import type { NeedDeityEntry } from '../../lib/needs/needDeityMap';

/**
 * 這份清單只涵蓋 `src/data/deities/deities.ts` 目前已有的 6 位神明。三個明顯缺神明的需求分類
 * （考試、生育、司法）刻意保留在清單裡、`deityIds` 留空，而不是整條刪掉——這樣才看得出「這是還沒
 * 補的資料缺口」，而不是「這個產品沒想過這個需求」。等 30–50 位神明的資料補齊後（文昌帝君、魁星、
 * 註生娘娘、臨水夫人、城隍爺等），再回來把對應的 `deityIds` 補上即可，不需要改這份清單的結構。
 */
export const NEED_DEITY_MAP: NeedDeityEntry[] = [
  {
    needId: 'wealth',
    label: '求財',
    commonQuestion: '最近想改善財運，該拜什麼？',
    deityIds: ['caishen', 'tudigong'],
    description: {
      value: '民間信仰中，求財運常見參拜財神（正財、偏財皆有信眾祈求）與土地公（地方財源、生意順利）。',
      status: 'sample',
      contentType: 'FOLKLORE',
      sources: [],
    },
  },
  {
    needId: 'career',
    label: '事業／工作',
    commonQuestion: '最近工作不順，該拜什麼？',
    deityIds: ['guandi', 'tudigong'],
    description: {
      value: '民間信仰中，求事業順利常見參拜關聖帝君（忠義、商業守護）與土地公（地方與生意的守護神）。',
      status: 'sample',
      contentType: 'FOLKLORE',
      sources: [],
    },
  },
  {
    needId: 'romance',
    label: '姻緣',
    commonQuestion: '想求姻緣，該拜什麼？',
    deityIds: ['yuelao'],
    description: {
      value: '民間信仰中，求姻緣常見參拜月下老人，典出唐朝「定婚店」的姻緣故事。',
      status: 'sample',
      contentType: 'FOLKLORE',
      sources: [],
    },
  },
  {
    needId: 'family_safety',
    label: '家庭／平安',
    commonQuestion: '想為家人祈求平安，該拜什麼？',
    deityIds: ['mazu', 'guanyin'],
    description: {
      value: '民間信仰中，求家庭與出行平安常見參拜媽祖（海上與出行平安的守護神）與觀世音菩薩（消災、平安）。',
      status: 'sample',
      contentType: 'FOLKLORE',
      sources: [],
    },
  },
  {
    needId: 'health',
    label: '健康',
    commonQuestion: '身體不太好，習俗上會拜什麼祈求健康？',
    deityIds: ['guanyin'],
    description: {
      value: '民間信仰中，祈求健康、消災常見參拜觀世音菩薩；保生大帝等專司醫藥的神明目前尚未列入本站的神明資料庫（見已知缺口）。',
      status: 'sample',
      contentType: 'FOLKLORE',
      sources: [],
    },
  },
  {
    needId: 'academic',
    label: '學業／考試',
    commonQuestion: '快考試了，習俗上會拜什麼？',
    deityIds: [],
    description: {
      value: '民間信仰中，考生常見參拜文昌帝君、魁星，但這兩位神明目前尚未列入本站的神明資料庫，屬於已知缺口，待後續補齊。',
      status: 'placeholder',
      contentType: 'FOLKLORE',
      sources: [],
    },
  },
  {
    needId: 'childbirth',
    label: '生育／小孩',
    commonQuestion: '想求子或祈求孩子平安，習俗上會拜什麼？',
    deityIds: [],
    description: {
      value: '民間信仰中，求子、祈求孩童平安常見參拜註生娘娘、臨水夫人，但這兩位神明目前尚未列入本站的神明資料庫，屬於已知缺口，待後續補齊。',
      status: 'placeholder',
      contentType: 'FOLKLORE',
      sources: [],
    },
  },
  {
    needId: 'justice',
    label: '司法／公平',
    commonQuestion: '遇到不公平的事，習俗上會拜什麼？',
    deityIds: [],
    description: {
      value: '民間信仰中，求公道、化解官司常見參拜城隍爺，但城隍爺目前尚未列入本站的神明資料庫，屬於已知缺口，待後續補齊。',
      status: 'placeholder',
      contentType: 'FOLKLORE',
      sources: [],
    },
  },
];
