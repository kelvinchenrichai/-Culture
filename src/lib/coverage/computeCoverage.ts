/**
 * Part（Data Completion Foundation）：資料完成度計算的純函式。
 *
 * 拆出來獨立於 scripts/compute-data-coverage.ts 之外，是為了讓這些計算邏輯本身可以被 vitest
 * 直接測試，不用透過跑一支會寫檔案的 script 才能驗證。
 *
 * 設計原則（很重要，決定了這裡「能不能」算某個百分比）：只有在分母是「我們自己知道、自己定義」
 * 的東西時，才算百分比——例如「已追蹤的欄位數」「已定義的需求分類數」。像全國寺廟這種分母是
 * 「政府資料集實際筆數」但我們還沒有全量下載的情況，不能拿現有樣本數去除一個猜測的分母，
 * 那樣算出來的百分比是假的、會誤導使用者以為進度比實際高或低。這種情況只回報原始筆數 + 誠實註記，
 * 不硬湊一個百分比。
 */
import type { ProvenancedField } from '../provenance/types';
import type { Temple } from '../temples/types';
import type { ReligiousFestival } from '../festivals/types';
import type { NeedDeityEntry } from '../needs/needDeityMap';
import type { ImageAsset, ImageCategory } from '../images/imageAsset';

export type FieldCoverage = { verifiedFields: number; totalFields: number; pct: number };

function pct(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 10; // 一位小數
}

/** 給一個「全部欄位都是 ProvenancedField」的物件，算出 verified 欄位的比例。忽略 id 之類非 ProvenancedField 欄位。 */
export function computeFieldCoverage(record: Record<string, unknown>): FieldCoverage {
  let verifiedFields = 0;
  let totalFields = 0;
  for (const value of Object.values(record)) {
    if (value && typeof value === 'object' && 'status' in (value as object) && 'sources' in (value as object)) {
      totalFields += 1;
      if ((value as ProvenancedField<unknown>).status === 'verified') verifiedFields += 1;
    }
  }
  return { verifiedFields, totalFields, pct: pct(verifiedFields, totalFields) };
}

export type TempleCoverage = {
  sampleSize: number;
  withCoordinates: number;
  coordinateCoverageOfSamplePct: number;
  byCity: Record<string, number>;
};

export function computeTempleCoverage(temples: Temple[]): TempleCoverage {
  const byCity: Record<string, number> = {};
  let withCoordinates = 0;
  for (const t of temples) {
    byCity[t.city] = (byCity[t.city] ?? 0) + 1;
    if (t.lat !== undefined && t.lng !== undefined) withCoordinates += 1;
  }
  return {
    sampleSize: temples.length,
    withCoordinates,
    coordinateCoverageOfSamplePct: pct(withCoordinates, temples.length),
    byCity,
  };
}

export type FestivalCoverage = { sampleSize: number; parsedDates: number; parsedCoveragePct: number };

export function computeFestivalCoverage(festivals: ReligiousFestival[]): FestivalCoverage {
  const parsedDates = festivals.filter((f) => f.dateStatus === 'parsed').length;
  return { sampleSize: festivals.length, parsedDates, parsedCoveragePct: pct(parsedDates, festivals.length) };
}

export type NeedDeityMapCoverage = { totalNeeds: number; needsWithDeity: number; pct: number; gaps: string[] };

export function computeNeedDeityMapCoverage(entries: NeedDeityEntry[]): NeedDeityMapCoverage {
  const needsWithDeity = entries.filter((e) => e.deityIds.length > 0).length;
  const gaps = entries.filter((e) => e.deityIds.length === 0).map((e) => e.needId);
  return { totalNeeds: entries.length, needsWithDeity, pct: pct(needsWithDeity, entries.length), gaps };
}

export type ImageCoverage = { total: number; byCategory: Record<ImageCategory, number> };

export function computeImageCoverage(assets: ImageAsset[]): ImageCoverage {
  const byCategory: Record<ImageCategory, number> = { deity: 0, temple: 0, festival: 0, offering: 0, action: 0 };
  for (const a of assets) byCategory[a.category] += 1;
  return { total: assets.length, byCategory };
}
