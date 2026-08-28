import type { Deity } from '../../lib/deities/types';
export const DEITIES: Deity[] = [
  { id: 'tudigong', name: '福德正神', aliases: ['土地公', '伯公'], categories: ['地方守護', '民間信仰'], whatFor: ['地方平安', '生意順利'], offerings: ['水果', '茶', '糕點'], lunarBirthdays: ['二月初二'], source: 'POC editorial seed; requires source-by-field review', dataStatus: 'sample' },
  { id: 'mazu', name: '天上聖母', aliases: ['媽祖'], categories: ['海神', '民間信仰'], whatFor: ['出行平安', '海上平安'], offerings: ['水果', '鮮花', '茶'], lunarBirthdays: ['三月廿三'], source: 'POC editorial seed; requires source-by-field review', dataStatus: 'sample' },
  { id: 'guandi', name: '關聖帝君', aliases: ['關公', '恩主公'], categories: ['忠義', '商業守護'], whatFor: ['事業', '正財'], offerings: ['水果', '茶'], lunarBirthdays: ['六月廿四'], source: 'POC editorial seed; requires source-by-field review', dataStatus: 'sample' },
  { id: 'guanyin', name: '觀世音菩薩', aliases: ['觀音', '觀音佛祖'], categories: ['佛教', '慈悲'], whatFor: ['平安', '消災'], offerings: ['鮮花', '水果', '清茶'], lunarBirthdays: ['二月十九', '六月十九', '九月十九'], source: 'POC editorial seed; requires source-by-field review', dataStatus: 'sample' },
  { id: 'yuelao', name: '月下老人', aliases: ['月老'], categories: ['姻緣'], whatFor: ['求姻緣', '感情順利'], offerings: ['甜食', '水果'], lunarBirthdays: ['八月十五'], source: 'POC editorial seed; requires source-by-field review', dataStatus: 'sample' },
  { id: 'caishen', name: '財神', aliases: ['財神爺'], categories: ['財運'], whatFor: ['正財', '生意順利'], offerings: ['水果', '糕點', '茶'], lunarBirthdays: ['正月初五'], source: 'POC editorial seed; deity traditions vary', dataStatus: 'placeholder' },
];
