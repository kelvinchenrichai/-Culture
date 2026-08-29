import { useEffect, useState } from 'react';
import { TEMPLES } from '../data/temples/temples';
import type { Temple } from '../lib/temples/types';

export type TemplesLoadState = 'loading' | 'success' | 'error';

/**
 * Part C1：Runtime 只讀 import-national-temples.ts 產出的 static JSON，
 * 不會在瀏覽器裡直接打 data.gov.tw。
 *
 * fetch 失敗（離線、路徑錯誤等）時退回打包進 bundle 的 TEMPLES 常數，
 * 兩者其實是同一份產出檔（見 src/data/temples/temples.ts 的說明），
 * 純粹是「連不到伺服器」時的離線保底，不是另一份資料。
 */
export function useTemples(): { temples: Temple[]; state: TemplesLoadState } {
  const [temples, setTemples] = useState<Temple[]>(TEMPLES);
  const [state, setState] = useState<TemplesLoadState>('loading');

  useEffect(() => {
    let active = true;
    fetch('/data/temples/national-temples.json')
      .then((res) => (res.ok ? (res.json() as Promise<Temple[]>) : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        if (!active) return;
        setTemples(data);
        setState('success');
      })
      .catch(() => {
        if (!active) return;
        // 離線保底：繼續使用 bundle 內建的 TEMPLES，不讓使用者看到空白畫面。
        setTemples(TEMPLES);
        setState('success');
      });
    return () => {
      active = false;
    };
  }, []);

  return { temples, state };
}
