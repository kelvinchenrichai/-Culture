import React, { useState } from 'react';
import { TEMPLES_LIST } from '../data/mockData';
import { Temple } from '../types';
import {
  MapPin,
  Search,
  Navigation,
  Phone,
  Clock,
  Star,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Compass
} from 'lucide-react';

interface TemplesViewProps {
  initialSearchQuery?: string;
  isElderMode: boolean;
  onSelectTempleDeity?: (deityId: string) => void;
}

export const TemplesView: React.FC<TemplesViewProps> = ({
  initialSearchQuery = '',
  isElderMode,
  onSelectTempleDeity,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCity, setSelectedCity] = useState<string>('全部');
  const [selectedDeityFilter, setSelectedDeityFilter] = useState<string>('全部');
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);

  const cities = ['全部', '台北市', '新北市', '苗栗縣', '台中市', '南投縣', '屏東縣'];
  const deityFilters = ['全部', '土地公', '媽祖', '觀世音菩薩', '關聖帝君', '月老'];

  const filteredTemples = TEMPLES_LIST.filter((temple) => {
    const matchesSearch =
      temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temple.mainDeity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temple.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temple.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCity = selectedCity === '全部' || temple.city === selectedCity;

    const matchesDeity =
      selectedDeityFilter === '全部' ||
      temple.mainDeity.includes(selectedDeityFilter) ||
      temple.tags.includes(selectedDeityFilter);

    return matchesSearch && matchesCity && matchesDeity;
  });

  const handleSimulateGPS = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setLocationSuccess(true);
      setTimeout(() => setLocationSuccess(false), 3000);
    }, 800);
  };

  const handleOpenGoogleMaps = (temple: Temple) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      temple.name + ' ' + temple.address
    )}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header & Search Bar */}
      <div className="bg-[#FDF9F3] rounded-2xl p-4 border border-[#E8E1D5] shadow-sm">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-[#E8E1D5]">
          <div className="w-9 h-9 rounded-xl bg-[#EBF3FB] text-[#2A5C8A] flex items-center justify-center border border-[#2A5C8A]/20">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-2xl' : 'text-xl'}`}>
              附近寺廟與信仰地圖
            </h2>
            <p className="text-xs text-[#736B63]">
              尋訪周遭香火鼎盛的土地公、媽祖、觀音與關帝廟
            </p>
          </div>
        </div>

        {/* Search Input & Location Button */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-3">
          <div className="relative w-full flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#736B63]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋廟名、神明（如：土地公、月老）或地區..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs focus:outline-none focus:border-[#A63A28] text-[#2C2C2C]"
              id="input-search-temples"
            />
          </div>

          <button
            onClick={handleSimulateGPS}
            disabled={isLocating}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#2A5C8A] text-white hover:bg-[#1E466B] transition-all text-xs font-semibold flex items-center justify-center space-x-1.5 shrink-0 shadow-2xs"
            id="btn-gps-locate"
          >
            <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? '定位中...' : locationSuccess ? '已更新附近距離' : '定位我的位置'}</span>
          </button>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-3 border-t border-[#E8E1D5] mt-3">
          <span className="text-[11px] text-[#736B63] font-bold shrink-0 mr-1">地區：</span>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              id={`filter-city-${city}`}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCity === city
                  ? 'bg-[#2C2C2C] text-white'
                  : 'bg-white text-[#5C554E] border border-[#E8E1D5] hover:bg-[#FAF6F0]'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Deity Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-2">
          <span className="text-[11px] text-[#736B63] font-bold shrink-0 mr-1">主祀：</span>
          {deityFilters.map((deity) => (
            <button
              key={deity}
              onClick={() => setSelectedDeityFilter(deity)}
              id={`filter-deity-${deity}`}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedDeityFilter === deity
                  ? 'bg-[#A63A28] text-white'
                  : 'bg-white text-[#5C554E] border border-[#E8E1D5] hover:bg-[#FAF6F0]'
              }`}
            >
              {deity}
            </button>
          ))}
        </div>
      </div>

      {/* Temples List Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#736B63]">
            共找到 {filteredTemples.length} 間推薦廟宇
          </span>
          <span className="text-[11px] text-[#2A5C8A] font-semibold">
            依香火與距離排序
          </span>
        </div>

        {filteredTemples.length > 0 ? (
          filteredTemples.map((temple) => (
            <div
              key={temple.id}
              className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm hover:border-[#2A5C8A]/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-[#E8E1D5]">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-2xl' : 'text-xl'}`}>
                      {temple.name}
                    </h3>
                    <div className="flex items-center text-xs font-bold text-[#D49B44]">
                      <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                      <span>{temple.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-[#A63A28] font-semibold mt-0.5">
                    <span>主祀：{temple.mainDeity}</span>
                    <span className="text-[#C8C2B7]">•</span>
                    <span className="text-[#5C554E]">{temple.city} {temple.district}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 self-start sm:self-auto px-2.5 py-1 rounded-lg bg-white border border-[#E8E1D5] text-xs font-semibold text-[#2A5C8A]">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>約 {temple.distanceKm} 公里</span>
                </div>
              </div>

              {/* Highlights & Tags */}
              <div className="py-3">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {temple.highlights.map((hl, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded-full bg-[#A63A28]/10 text-[#A63A28] font-semibold border border-[#A63A28]/20"
                    >
                      {hl}
                    </span>
                  ))}
                </div>

                <div className="space-y-1 text-xs text-[#5C554E] mt-2">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#736B63] shrink-0" />
                    <span>{temple.address}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#736B63] shrink-0" />
                    <span>開放時間：{temple.openingHours}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-[#E8E1D5]">
                <button
                  onClick={() => handleOpenGoogleMaps(temple)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#2C2C2C] text-white hover:bg-[#1A1A1A] font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-2xs"
                  id={`btn-nav-temple-${temple.id}`}
                >
                  <Navigation className="w-3.5 h-3.5 text-[#FFE58F]" />
                  <span>開啟 Google 地圖導航</span>
                </button>

                <a
                  href={`tel:${temple.phone.replace(/[^0-9]/g, '')}`}
                  className="px-3 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-[#5C554E] hover:text-[#A63A28] text-xs font-semibold flex items-center justify-center space-x-1"
                  id={`btn-call-temple-${temple.id}`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>撥打電話</span>
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#FDF9F3] rounded-2xl p-8 text-center text-[#736B63] border border-[#E8E1D5]">
            <MapPin className="w-8 h-8 mx-auto text-[#2A5C8A] opacity-40 mb-2" />
            <p className="font-bold text-sm text-[#2C2C2C]">沒有找到相符的寺廟</p>
            <p className="text-xs mt-1">請嘗試縮小關鍵字或切換「全部地區」</p>
          </div>
        )}
      </div>
    </div>
  );
};
