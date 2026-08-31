import React, { useState } from 'react';
import { Compass, MapPin, Navigation, Search, ChevronDown, LocateFixed, ShieldAlert } from 'lucide-react';
import { useTemples } from '../src/hooks/useTemples';
import { findNearbyTemplesWithExpansion } from '../src/lib/temples/templeService';
import { formatDistance, buildNavigationUrl } from '../src/lib/temples/format';
import type { NearbyTemple } from '../src/lib/temples/types';

type LocateState = 'permission' | 'loading' | 'ready' | 'denied' | 'unsupported' | 'error';

export function RealTemplesView({ isElderMode }: { isElderMode: boolean }) {
  const { temples } = useTemples();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<NearbyTemple[]>([]);
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [expanded, setExpanded] = useState(false);
  const [state, setState] = useState<LocateState>('permission');

  const locate = (test = false) => {
    setState('loading');
    const use = (lat: number, lng: number) => {
      const result = findNearbyTemplesWithExpansion({ lat, lng, temples });
      setItems(result.results);
      setRadiusKm(result.radiusKm);
      setExpanded(result.expanded);
      setState('ready');
    };
    if (test) return use(25.0478, 121.517);
    if (!navigator.geolocation) return setState('unsupported');
    navigator.geolocation.getCurrentPosition(
      (pos) => use(pos.coords.latitude, pos.coords.longitude),
      (err) => setState(err.code === err.PERMISSION_DENIED ? 'denied' : 'error'),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  const visible = items.filter((t) => `${t.name}${t.rawMainDeity ?? ''}${t.rawAddress}`.toLowerCase().includes(query.toLowerCase()));
  const cardText = isElderMode ? 'text-lg' : 'text-base';

  return (
    <div className="space-y-4 pb-12">
      <section className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5]">
        <div className="flex gap-2 items-center">
          <MapPin className="text-[#2A5C8A]" />
          <div>
            <h1 className={`font-serif-tc font-bold ${isElderMode ? 'text-2xl' : 'text-xl'}`}>附近寺廟</h1>
            <p className="text-xs text-[#736B63]">位置定位 → Haversine 距離計算 → 由近到遠排序</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#736B63]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜尋廟名、主祀或地址"
              aria-label="搜尋廟名、主祀或地址"
              className="w-full pl-9 pr-3 py-3 rounded-xl border border-[#E8E1D5] text-base"
            />
          </div>
          <button
            onClick={() => locate(false)}
            className="px-4 py-3 rounded-xl bg-[#2A5C8A] text-white font-semibold min-h-[48px]"
          >
            <Compass className={`inline w-4 h-4 mr-1 ${state === 'loading' ? 'animate-spin' : ''}`} />
            {state === 'loading' ? '定位中' : '使用我的位置'}
          </button>
        </div>
        {import.meta.env.DEV && (
          <button onClick={() => locate(true)} className="mt-2 text-xs text-[#736B63] underline">
            使用台北車站測試位置（DEV）
          </button>
        )}

        {/* E6：拒絕定位權限 — 明確告知原因與下一步，而不是靜靜地什麼都沒發生 */}
        {state === 'permission' && <p className="mt-3 text-base text-[#5C554E]">需要位置權限才能幫你找附近寺廟。</p>}
        {state === 'denied' && (
          <div className="mt-3 flex gap-2 p-3 rounded-xl bg-[#FDF2F0] text-[#A63A28] text-sm">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>需要位置權限才能幫你找附近寺廟。請到瀏覽器網址列旁邊的鎖頭／權限圖示，把「位置」改成允許，再重新整理頁面。</span>
          </div>
        )}
        {state === 'unsupported' && (
          <div className="mt-3 flex gap-2 p-3 rounded-xl bg-[#FDF2F0] text-[#A63A28] text-sm">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>這個瀏覽器不支援定位功能，暫時無法幫你找附近寺廟。</span>
          </div>
        )}
        {state === 'error' && <p className="mt-3 text-sm text-[#A63A28]">無法取得位置，請稍後再試一次。</p>}
      </section>

      {state === 'ready' && (
        <>
          {/* E7：拿到位置但資料不足，跟「沒拿到位置」要清楚區分開來，不能是一片空白 */}
          {visible.length === 0 ? (
            <section className="bg-[#FDF9F3] rounded-2xl p-6 border border-[#E8E1D5] text-center">
              <LocateFixed className="w-8 h-8 mx-auto text-[#2A5C8A]" />
              <p className={`mt-3 font-semibold text-[#2C2C2C] ${cardText}`}>已取得你的位置</p>
              <p className="mt-1 text-sm text-[#736B63]">目前這個地區（{radiusKm} 公里內）的寺廟資料仍在補充中，還沒有收錄到附近的廟宇。</p>
            </section>
          ) : (
            <>
              {/* E2：自動擴大搜尋半徑時要明確告知，不能偷偷擴大 */}
              <p className="text-sm text-[#736B63]">
                {expanded ? `附近較少資料，已為你找到 ${radiusKm} 公里內的寺廟` : `找到 ${visible.length} 間（${radiusKm} 公里內，依距離排序）`}
              </p>
              <section className="space-y-3">
                {visible.map((t) => (
                  <TempleCard key={t.id} temple={t} isElderMode={isElderMode} />
                ))}
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

function TempleCard({ temple, isElderMode }: { temple: NearbyTemple; isElderMode: boolean }) {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <article className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5]">
      <div className="flex justify-between gap-3">
        <div>
          <h2 className={`font-serif-tc font-bold ${isElderMode ? 'text-xl' : 'text-lg'}`}>{temple.name}</h2>
          <p className={`text-[#A63A28] mt-1 ${isElderMode ? 'text-base' : 'text-xs'}`}>主祀：{temple.rawMainDeity ?? '未提供'}</p>
        </div>
        <span className="text-xs text-[#2A5C8A] font-semibold whitespace-nowrap">
          <Navigation className="inline w-3.5 h-3.5" /> {formatDistance(temple.distanceKm)}
        </span>
      </div>
      <p className={`text-[#5C554E] mt-3 ${isElderMode ? 'text-base' : 'text-sm'}`}>{temple.rawAddress}</p>
      <div className="flex gap-2 mt-4">
        <a
          href={buildNavigationUrl(temple)}
          target="_blank"
          rel="noreferrer"
          className="flex-1 text-center px-4 py-3 rounded-xl bg-[#2A5C8A] text-white font-semibold min-h-[48px] flex items-center justify-center gap-1.5"
        >
          <Navigation className="w-4 h-4" /> 導航
        </a>
        <button
          onClick={() => setShowDetail((v) => !v)}
          aria-expanded={showDetail}
          aria-label={`${temple.name} 詳細資料`}
          className="px-4 py-3 rounded-xl bg-white border border-[#E8E1D5] text-[#5C554E] font-semibold min-h-[48px] flex items-center gap-1"
        >
          看詳細 <ChevronDown className={`w-4 h-4 transition-transform ${showDetail ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {showDetail && (
        <dl className="mt-3 pt-3 border-t border-[#E8E1D5] text-sm text-[#5C554E] space-y-1">
          {temple.phone && (
            <div>
              <dt className="inline text-[#736B63]">電話：</dt>
              <dd className="inline">{temple.phone}</dd>
            </div>
          )}
          <div>
            <dt className="inline text-[#736B63]">座標可信度：</dt>
            <dd className="inline">{{ government: '政府資料', verified: '人工核實', geocoded: '事後定位', missing: '無座標' }[temple.coordinateStatus]}</dd>
          </div>
          <div>
            <dt className="inline text-[#736B63]">資料來源：</dt>
            <dd className="inline">{temple.sources.map((s) => s.name).join('、') || '未提供'}</dd>
          </div>
        </dl>
      )}
    </article>
  );
}
