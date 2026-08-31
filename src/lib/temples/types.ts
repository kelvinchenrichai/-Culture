/** 座標可信程度：政府資料自帶座標 / 人工核實 / 事後 geocode / 完全沒有座標 */
export type CoordinateStatus = 'government' | 'verified' | 'geocoded' | 'missing';

export type TempleSource = { name: string; datasetId?: string; updatedAt?: string };

export type Temple = {
  id: string;
  name: string;
  /** 別名 / 簡稱，用於搜尋與 dedupe 輔助判斷 */
  aliases: string[];
  /** 原始政府資料的主祀神祇欄位，不覆蓋，永遠保留 */
  rawMainDeity?: string;
  /** 對應到 deityAliases 標準化後的神明 id（例如 'tudigong'），查不到就是 undefined */
  normalizedDeityId?: string;
  religion?: string;
  city: string;
  district?: string;
  /** 原始地址，永遠保留，不做覆蓋 */
  rawAddress: string;
  /** 正規化後的地址（臺/台、全形/半形空格等），用於 dedupe 與顯示 */
  normalizedAddress: string;
  phone?: string;
  lat?: number;
  lng?: number;
  sources: TempleSource[];
  coordinateStatus: CoordinateStatus;
};

export type NearbyTemple = Temple & { distanceKm: number };
