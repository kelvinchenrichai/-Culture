export interface SuitableItem {
  name: string;
  category: string;
  description: string;
  tag?: string;
}

export interface UnsuitableItem {
  name: string;
  category: string;
  reason: string;
}

export interface AuspiciousHour {
  timeRange: string;
  branch: string; // 子、丑、寅...
  auspicious: boolean;
  name: string;
}

export interface DayInfo {
  solarDate: string; // e.g. "2025年3月15日"
  weekday: string; // e.g. "星期六"
  lunarDate: string; // e.g. "乙巳年 二月十六"
  solarTerm?: string; // e.g. "驚蟄"
  zodiacYear: string; // e.g. "蛇年"
  ganZhi: string; // e.g. "乙巳年 己卯月 癸亥日"
  overallVerdict: '大吉' | '吉' | '平' | '注意';
  summary: string;
  score: number; // 1-100
  clashZodiac: string; // 沖煞 e.g. "沖蛇 煞西"
  wealthDirection: string; // 財神方位 e.g. "正南方"
  blessingDirection: string; // 喜神方位 e.g. "東南方"
  emotionalQuote: {
    content: string;
    subtext: string;
    tag: string;
  };
  suitableActivities: SuitableItem[];
  unsuitableActivities: UnsuitableItem[];
  auspiciousHours: AuspiciousHour[];
  todayDeityEvent?: {
    isBirthday: boolean;
    deityName: string;
    title: string;
    description: string;
    offeringsSummary: string;
    deityId: string;
  };
}

export interface LifeDecision {
  id: string;
  query: string; // e.g. "剪頭髮"
  title: string; // e.g. "今天可以剪頭髮嗎？"
  isSuitable: boolean;
  verdict: '適合' | '不建議' | '平順可行';
  shortReason: string;
  detailedExplanation: string;
  lifeAdvice: string;
  bestHours: string[];
  avoidHours: string[];
  nextAuspiciousDays: {
    solarDate: string;
    lunarDate: string;
    weekday: string;
    description: string;
  }[];
  customTips: string[];
  category: '生活打理' | '工作財運' | '居家安居' | '人際感情' | '健康祈福';
  iconName: string;
}

export interface Deity {
  id: string;
  name: string;
  honoricTitle: string; // e.g. "福德正神"
  folkName: string; // e.g. "土地公 / 伯公"
  birthdayLunar: string; // e.g. "二月初二、八月十五"
  upcomingBirthdaySolar: string; // e.g. "2025年3月1日"
  domains: string[]; // e.g. ["招財求偏財", "保佑居家平安", "農作豐收", "商家開工"]
  shortIntro: string;
  fullStory: string;
  recommendedOfferings: {
    category: string;
    items: string[];
    meaning: string;
  }[];
  tabooOfferings: string[];
  bestWorshipTimes: string;
  steps: {
    stepNumber: number;
    title: string;
    action: string;
  }[];
  prayerTemplate: {
    forGeneral: string;
    forBusiness: string;
    tips: string;
  };
  famousTemples: {
    name: string;
    city: string;
    highlight: string;
  }[];
  color: string;
  tag: string;
}

export interface WorshipGuide {
  id: string;
  title: string;
  subtitle: string;
  category: '基礎入門' | '拜拜供品' | '求籤問事' | '節慶習俗' | '生活解惑';
  readTime: string;
  targetAudience: string;
  summary: string;
  steps: {
    step: number;
    title: string;
    details: string;
    tip?: string;
  }[];
  keyChecklist: string[];
  commonMisconceptions: {
    question: string;
    answer: string;
  }[];
}

export interface Temple {
  id: string;
  name: string;
  mainDeity: string;
  city: string;
  district: string;
  address: string;
  distanceKm: number;
  openingHours: string;
  highlights: string[];
  phone: string;
  tags: string[];
  mapQuery: string;
  rating: number;
}

export interface AuspiciousDay {
  id: string;
  category: '剪頭髮' | '搬家入宅' | '開工開業' | '祈福拜拜' | '買車過戶' | '簽約交易' | '訂婚結婚';
  solarDate: string;
  lunarDate: string;
  weekday: string;
  clashZodiac: string;
  bestHours: string;
  suitabilityScore: number;
  highlight: string;
  reason: string;
}

export type ShareCardStyle = 'cultural-minimal' | 'daily-quote' | 'deity-blessing' | 'decision-ticket';

export interface ShareCardData {
  title: string;
  subtitle: string;
  dateText: string;
  lunarText: string;
  primaryText: string;
  secondaryText?: string;
  blessingTag?: string;
  categoryName?: string;
  style: ShareCardStyle;
}
