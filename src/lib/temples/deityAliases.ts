/**
 * 主祀神明 alias → normalizedDeityId 對照表（Part C5）。
 *
 * 原則：查不到可靠對應就回傳 undefined，不得亂猜或硬套一個 id——
 * `rawMainDeity` 永遠保留原始政府資料文字，這張表只負責「錦上添花」的分組，
 * 不是判斷資料正確與否的依據。
 */
export const DEITY_ALIAS_GROUPS: { id: string; aliases: string[] }[] = [
  { id: 'tudigong', aliases: ['福德正神', '土地公', '土地伯公', '福德爺'] },
  { id: 'mazu', aliases: ['天上聖母', '媽祖', '媽祖婆', '天后'] },
  { id: 'guandi', aliases: ['關聖帝君', '關公', '關帝', '恩主公'] },
  { id: 'guanyin', aliases: ['觀世音菩薩', '觀音', '觀音佛祖', '觀音大士'] },
  { id: 'xuantian', aliases: ['玄天上帝', '玄天大帝', '上帝公', '真武大帝'] },
  { id: 'baosheng', aliases: ['保生大帝', '大道公', '吳真人'] },
];

const LOOKUP: Map<string, string> = new Map();
for (const group of DEITY_ALIAS_GROUPS) {
  for (const alias of group.aliases) LOOKUP.set(alias, group.id);
}

/**
 * 把政府資料的主祀神祇原始文字對應到標準化 id。
 * 用「包含」比對（而非完全相等），因為政府資料常見「主祀：關聖帝君　配祀：...」這種複合欄位。
 * 找不到就回傳 undefined —— 呼叫端必須保留 rawMainDeity，不要因為查無對應就丟棄原始資料。
 */
export function normalizeDeityName(raw: string | undefined | null): string | undefined {
  if (!raw) return undefined;
  const text = raw.trim();
  if (!text) return undefined;
  // 先試最長的別名優先比對，避免「土地公廟」誤配到別的較短別名。
  const sortedAliases = [...LOOKUP.keys()].sort((a, b) => b.length - a.length);
  for (const alias of sortedAliases) {
    if (text.includes(alias)) return LOOKUP.get(alias);
  }
  return undefined;
}
