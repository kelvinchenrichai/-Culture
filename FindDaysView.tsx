import React, { useState } from 'react';
import { AUSPICIOUS_DAYS } from '../data/mockData';
import { AuspiciousDay } from '../types';
import {
  CalendarDays,
  Scissors,
  Home,
  Briefcase,
  Sparkles,
  Car,
  FileCheck,
  Clock,
  ShieldAlert,
  Share2,
  CheckCircle2,
  ChevronRight,
  Filter
} from 'lucide-react';

interface FindDaysViewProps {
  initialCategory?: string;
  isElderMode: boolean;
  onOpenShareModal: (customData?: any) => void;
}

export const FindDaysView: React.FC<FindDaysViewProps> = ({
  initialCategory = '剪頭髮',
  isElderMode,
  onOpenShareModal,
}) => {
  const categories = [
    { name: '剪頭髮', icon: Scissors },
    { name: '搬家入宅', icon: Home },
    { name: '開工開業', icon: Briefcase },
    { name: '祈福拜拜', icon: Sparkles },
    { name: '買車過戶', icon: Car },
    { name: '簽約交易', icon: FileCheck },
  ];

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);

  const filteredDays = AUSPICIOUS_DAYS.filter(
    (d) => d.category === activeCategory || (activeCategory === '搬家入宅' && d.category.includes('搬家'))
  );

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="bg-[#FDF9F3] rounded-2xl p-4 border border-[#E8E1D5] shadow-sm">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-[#E8E1D5]">
          <div className="w-9 h-9 rounded-xl bg-[#A63A28]/10 text-[#A63A28] flex items-center justify-center border border-[#A63A28]/20">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-2xl' : 'text-xl'}`}>
              挑個好日子
            </h2>
            <p className="text-xs text-[#736B63]">
              選擇您要安排的事項，為您整理未來 30 天吉日精選
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-3 pb-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = cat.name === activeCategory;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                id={`btn-filter-${cat.name}`}
                className={`shrink-0 flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#2C2C2C] text-white shadow-sm'
                    : 'bg-white text-[#5C554E] border border-[#E8E1D5] hover:bg-[#FAF6F0]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Auspicious Days Card List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#736B63]">
            「{activeCategory}」近期精選好日子 ({filteredDays.length} 個吉日)
          </span>
          <span className="text-[11px] text-[#2E7D32] bg-[#EBF5ED] px-2 py-0.5 rounded-full font-semibold border border-[#2E7D32]/20">
            氣場相合
          </span>
        </div>

        {filteredDays.length > 0 ? (
          filteredDays.map((day) => (
            <div
              key={day.id}
              className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm hover:border-[#A63A28]/40 transition-all relative overflow-hidden"
            >
              {/* Top accent badge */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-[#E8E1D5]">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-2xl' : 'text-xl'}`}>
                      {day.solarDate}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#A63A28]/10 text-[#A63A28] font-semibold border border-[#A63A28]/20">
                      {day.weekday}
                    </span>
                  </div>

                  <div className="text-xs text-[#A63A28] font-semibold mt-0.5">
                    農曆 {day.lunarDate}
                  </div>
                </div>

                {/* Score badge */}
                <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-[#EBF5ED] text-[#2E7D32] px-3 py-1.5 rounded-xl border border-[#C2E0C7]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold">吉度 {day.suitabilityScore}分</span>
                </div>
              </div>

              {/* Highlight & Reason */}
              <div className="py-3">
                <div className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-lg' : 'text-base'}`}>
                  {day.highlight}
                </div>
                <p className={`text-[#5C554E] text-xs mt-1 ${isElderMode ? 'text-sm' : 'text-xs'}`}>
                  {day.reason}
                </p>
              </div>

              {/* Hours and clash */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-dashed border-[#E8E1D5] text-xs">
                <div className="flex items-center space-x-1.5 text-[#2E7D32] bg-white p-2 rounded-lg border border-[#E8E1D5]">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    <strong>推薦吉時：</strong>
                    {day.bestHours}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 text-[#736B63] bg-white p-2 rounded-lg border border-[#E8E1D5]">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#A63A28] shrink-0" />
                  <span>
                    <strong>注意避開：</strong>
                    {day.clashZodiac}
                  </span>
                </div>
              </div>

              {/* Bottom quick share button */}
              <div className="mt-3 pt-2.5 border-t border-[#E8E1D5] flex justify-end">
                <button
                  onClick={() =>
                    onOpenShareModal({
                      title: `好日推薦：${day.solarDate}`,
                      subtitle: `適合「${day.category}」`,
                      primaryText: day.highlight,
                      secondaryText: `農曆 ${day.lunarDate} · 推薦時段：${day.bestHours}`,
                      categoryName: day.category,
                      style: 'cultural-minimal'
                    })
                  }
                  className="flex items-center space-x-1 text-xs text-[#736B63] hover:text-[#A63A28] font-medium"
                  id={`btn-share-auspicious-${day.id}`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>分享這個好日子給親友</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#FDF9F3] rounded-2xl p-8 text-center text-[#736B63] border border-[#E8E1D5]">
            <CalendarDays className="w-8 h-8 mx-auto text-[#A63A28] opacity-40 mb-2" />
            <p>正在查詢最近的「{activeCategory}」吉日...</p>
          </div>
        )}
      </div>
    </div>
  );
};
