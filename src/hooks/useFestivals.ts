import { useEffect, useState } from 'react';
import { FESTIVALS } from '../data/festivals/festivals';
import type { ReligiousFestival } from '../lib/festivals/types';

export type FestivalsLoadState = 'loading' | 'success' | 'error';

/** 跟 useTemples 同一個 fetch-with-fallback 模式。 */
export function useFestivals(): { festivals: ReligiousFestival[]; state: FestivalsLoadState } {
  const [festivals, setFestivals] = useState<ReligiousFestival[]>(FESTIVALS);
  const [state, setState] = useState<FestivalsLoadState>('loading');

  useEffect(() => {
    let active = true;
    fetch('/data/festivals/national-festivals.json')
      .then((res) => (res.ok ? (res.json() as Promise<ReligiousFestival[]>) : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        if (!active) return;
        setFestivals(data);
        setState('success');
      })
      .catch(() => {
        if (!active) return;
        setFestivals(FESTIVALS);
        setState('success');
      });
    return () => {
      active = false;
    };
  }, []);

  return { festivals, state };
}
