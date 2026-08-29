import { useEffect, useState } from 'react';

/**
 * 簡易模式（長輩友善模式）狀態，持久化到 localStorage。
 *
 * 這不只是「字放大」的旗標：UI 層會依此旗標重新安排資訊層級
 * （見 components/SimpleHomeActions.tsx、RealDecisionView.tsx、BottomNav.tsx）。
 * SSR / 無 window 環境（例如測試）安全，讀不到就回傳預設值。
 */
export const SIMPLE_MODE_STORAGE_KEY = 'jrho:simple-mode';

export function readStoredValue(defaultValue: boolean): boolean {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = window.localStorage.getItem(SIMPLE_MODE_STORAGE_KEY);
    if (raw === null) return defaultValue;
    return raw === 'true';
  } catch {
    return defaultValue;
  }
}

export function useElderMode(defaultValue = false): [boolean, (next: boolean) => void] {
  const [value, setValue] = useState<boolean>(() => readStoredValue(defaultValue));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(SIMPLE_MODE_STORAGE_KEY, String(value));
    } catch {
      // 瀏覽器封鎖 storage（例如隱私模式）時，維持記憶體內狀態即可，不阻斷功能。
    }
  }, [value]);

  return [value, setValue];
}
