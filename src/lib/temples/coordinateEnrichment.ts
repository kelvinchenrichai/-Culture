import type { Temple } from './types';
import { normalizeAddress, normalizeTempleName } from './addressNormalize';
import { normalizeDeityName } from './deityAliases';

/**
 * Part D：地方政府座標 enrichment 架構（TempleCoordinateProvider 的落地版本）。
 *
 * 沒有做成一個要求每個縣市自己實作的 interface class，因為目前只有一個實作
 * （新北市），先做成「可以獨立測試的 pure function」比較實際；等真的有第二個地方政府
 * provider 時，再把共用邏輯抽出來也不遲，不需要為了架構而架構。
 */

export type MatchConfidence = 'high' | 'medium' | 'low';

export type CandidateCoordinateRecord = {
  name: string;
  address?: string;
  district?: string;
  mainDeity?: string;
  lat: number;
  lng: number;
};

export type CoordinateMatchResult = {
  templeId: string;
  templeName: string;
  lat: number;
  lng: number;
  confidence: MatchConfidence;
  matchedOn: string[];
};

function isPlausibleTaiwanCoordinate(lat: number, lng: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= 21 && lat <= 26.5 && lng >= 118 && lng <= 123.5;
}

/**
 * D1：conservative match，不確定就不要 match。
 * - high：正規化廟名 + 正規化地址都吻合 → 可以自動寫入座標。
 * - medium：正規化廟名吻合，且行政區或主祀神祇至少一項也吻合，但地址對不太起來（可能是
 *   地方資料集地址格式跟全國資料集不同）→ 進 review queue，不自動套用。
 * - low：只有廟名吻合，其餘都對不上或缺資料 → 全台同名廟宇太多，一樣進 review queue。
 */
export function matchCoordinateCandidates(temples: Temple[], candidates: CandidateCoordinateRecord[]): CoordinateMatchResult[] {
  const results: CoordinateMatchResult[] = [];
  for (const candidate of candidates) {
    if (!isPlausibleTaiwanCoordinate(candidate.lat, candidate.lng)) continue;
    const candidateName = normalizeTempleName(candidate.name);
    const candidateAddress = candidate.address ? normalizeAddress(candidate.address) : undefined;
    const candidateDeity = normalizeDeityName(candidate.mainDeity);

    const nameMatches = temples.filter(
      (t) => normalizeTempleName(t.name) === candidateName || t.aliases.some((a) => normalizeTempleName(a) === candidateName),
    );

    for (const temple of nameMatches) {
      const matchedOn = ['name'];
      let confidence: MatchConfidence = 'low';

      if (candidateAddress && normalizeAddress(temple.rawAddress) === candidateAddress) {
        confidence = 'high';
        matchedOn.push('address');
      } else {
        const districtMatches = Boolean(candidate.district) && temple.district === candidate.district;
        const deityMatches = Boolean(candidateDeity) && candidateDeity === temple.normalizedDeityId;
        if (districtMatches || deityMatches) {
          confidence = 'medium';
          if (districtMatches) matchedOn.push('district');
          if (deityMatches) matchedOn.push('deity');
        }
      }

      results.push({ templeId: temple.id, templeName: temple.name, lat: candidate.lat, lng: candidate.lng, confidence, matchedOn });
    }
  }
  return results;
}

/** 只有 high confidence 才自動寫入座標；medium/low 留給 review queue，不偷偷套用（D1/D2）。 */
export function applyHighConfidenceMatches(
  temples: Temple[],
  matches: CoordinateMatchResult[],
  source: { name: string; datasetId?: string; updatedAt?: string },
): { updated: Temple[]; appliedCount: number } {
  let appliedCount = 0;
  const updated = temples.map((temple) => {
    const match = matches.find((m) => m.templeId === temple.id && m.confidence === 'high');
    if (!match) return temple;
    appliedCount += 1;
    return {
      ...temple,
      lat: match.lat,
      lng: match.lng,
      coordinateStatus: 'verified' as const,
      sources: [...temple.sources, source],
    };
  });
  return { updated, appliedCount };
}
