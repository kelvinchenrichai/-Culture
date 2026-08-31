import type { SourceReference } from '../provenance/types';

export type FestivalDateStatus = 'parsed' | 'partial' | 'unparsed';

export type ReligiousFestival = {
  id: string;
  name: string;
  templeName?: string;
  normalizedTempleId?: string;
  category?: string;
  /** 政府資料原文日期欄位，永遠保留，不管有沒有 parse 成功。 */
  rawDateText: string;
  parsedStartDate?: string;
  parsedEndDate?: string;
  city?: string;
  district?: string;
  address?: string;
  sources: SourceReference[];
  dateStatus: FestivalDateStatus;
};
