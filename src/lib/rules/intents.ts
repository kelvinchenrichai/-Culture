export type Intent = 'HAIRCUT' | 'MOVE_HOME' | 'WORSHIP' | 'START_WORK' | 'MARRIAGE' | 'TRAVEL' | 'DEITY_TODAY';
export type AnswerStatus = 'recommended' | 'neutral' | 'not_recommended' | 'unknown';
export const QUERY_ALIASES: Record<Intent, string[]> = {
  HAIRCUT: ['剪頭髮', '剪髮', '理髮', '剪頭毛'], MOVE_HOME: ['搬家', '入宅', '遷居', '搬新家'],
  WORSHIP: ['拜拜', '祭祀', '拜神'], START_WORK: ['開工', '開市'], MARRIAGE: ['結婚', '嫁娶', '婚嫁'],
  TRAVEL: ['旅行', '旅遊', '出行', '遠行'], DEITY_TODAY: ['今天拜什麼', '今天誰生日', '今天什麼神生日', '今天有什麼神', '神明生日', '拜什麼'],
};
export const CALENDAR_TERMS: Record<Exclude<Intent, 'DEITY_TODAY'>, string[]> = {
  HAIRCUT: ['理髮', '剃頭', '剪髮'], MOVE_HOME: ['入宅', '移徙', '遷居'], WORSHIP: ['祭祀', '祈福'],
  START_WORK: ['開市', '開工'], MARRIAGE: ['嫁娶', '結婚'], TRAVEL: ['出行', '遠行'],
};
