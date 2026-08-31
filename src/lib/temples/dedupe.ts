import { normalizeAddress, normalizeTempleName } from './addressNormalize';
import type { Temple } from './types';

const COORDINATE_PRIORITY: Record<Temple['coordinateStatus'], number> = {
  government: 3,
  verified: 2,
  geocoded: 1,
  missing: 0,
};

/**
 * Dedupe key = 正規化廟名 + 正規化地址（Part C4）。
 *
 * 刻意只在「名字」與「地址」都吻合時才視為同一間廟——全台同名的福德宮、天后宮、
 * 慈惠宮太多，光比對名字會錯誤合併不同的廟。地址不同就當作不同的廟，
 * 「有疑問寧可保留 duplicate，不要錯誤 merge」。
 */
function dedupeKey(temple: Pick<Temple, 'name' | 'normalizedAddress'>): string {
  return `${normalizeTempleName(temple.name)}|${temple.normalizedAddress || normalizeAddress(temple.normalizedAddress)}`;
}

export function dedupeTemples(temples: Temple[]): { deduped: Temple[]; duplicatesRemoved: number } {
  const groups = new Map<string, Temple[]>();
  for (const temple of temples) {
    const key = dedupeKey(temple);
    const group = groups.get(key);
    if (group) group.push(temple);
    else groups.set(key, [temple]);
  }

  const deduped: Temple[] = [];
  let duplicatesRemoved = 0;

  for (const group of groups.values()) {
    if (group.length === 1) {
      deduped.push(group[0]);
      continue;
    }
    duplicatesRemoved += group.length - 1;
    // 同一把 key 底下的多筆記錄，視為同一間廟的不同資料來源：合併 sources / aliases，
    // 保留座標可信度最高的那筆座標，其餘欄位以第一筆為準（先到先贏，不做內容仲裁）。
    const [first, ...rest] = group;
    const best = group.reduce((acc, t) => (COORDINATE_PRIORITY[t.coordinateStatus] > COORDINATE_PRIORITY[acc.coordinateStatus] ? t : acc), first);
    const mergedAliases = Array.from(new Set(group.flatMap((t) => t.aliases)));
    const mergedSources = dedupeSources(group.flatMap((t) => t.sources));
    deduped.push({
      ...first,
      lat: best.lat,
      lng: best.lng,
      coordinateStatus: best.coordinateStatus,
      aliases: mergedAliases,
      sources: mergedSources,
      rawMainDeity: first.rawMainDeity ?? rest.find((t) => t.rawMainDeity)?.rawMainDeity,
      normalizedDeityId: first.normalizedDeityId ?? rest.find((t) => t.normalizedDeityId)?.normalizedDeityId,
    });
  }

  return { deduped, duplicatesRemoved };
}

function dedupeSources(sources: Temple['sources']): Temple['sources'] {
  const seen = new Set<string>();
  const result: Temple['sources'] = [];
  for (const source of sources) {
    const key = `${source.name}|${source.datasetId ?? ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(source);
  }
  return result;
}
