import React from 'react';
import { Flame, Sparkles, ChevronRight, Calendar } from 'lucide-react';
import { DayInfo } from '../types';

interface DeityCardProps {
  dayInfo: DayInfo;
  isElderMode: boolean;
  onOpenDeityDetail: (deityId: string) => void;
  onOpenGuide: (guideId?: string) => void;
}

export const DeityCard: React.FC<DeityCardProps> = ({
  dayInfo,
  isElderMode,
  onOpenDeityDetail,
  onOpenGuide,
}) => {
  const event = dayInfo.todayDeityEvent;

  return (
    <div className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm relative overflow-hidden">
      {/* Decorative corner accent */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#A63A28]/10 text-[#A63A28] flex items-center justify-center border border-[#A63A28]/20">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-xl' : 'text-lg'}`}>
              今天拜什麼？
            </h3>
            <p className="text-xs text-[#736B63]">今日敬神祈福指南與習俗建議</p>
          </div>
        </div>
        <button
          onClick={() => onOpenDeityDetail(event?.deityId || 'tudigong')}
          className="text-xs font-semibold text-[#A63A28] hover:underline flex items-center"
          id="btn-view-all-deities"
        >
          查看全神明 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>

      {event && (
        <div className="mt-4 p-4 rounded-xl bg-white border border-[#E8E1D5] relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <span className="w-9 h-9 rounded-full bg-[#A63A28]/10 text-[#A63A28] font-serif-tc font-bold text-sm flex items-center justify-center border border-[#A63A28]/20 shadow-2xs">
                福
              </span>
              <div>
                <h4 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-lg' : 'text-base'}`}>
                  {event.deityName}
                </h4>
                <p className="text-xs text-[#A63A28] font-medium">{event.title}</p>
              </div>
            </div>

            <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#A63A28]/10 text-[#A63A28] font-semibold self-start sm:self-auto border border-[#A63A28]/20">
              農曆十六「作牙」
            </span>
          </div>

          <p className={`text-[#5C554E] mt-3 leading-relaxed ${isElderMode ? 'text-base' : 'text-xs'}`}>
            {event.description}
          </p>

          {/* Offerings snippet */}
          <div className="mt-3 pt-2.5 border-t border-dashed border-[#E8E1D5] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="text-[#736B63]">
              <span className="text-[#736B63] font-medium">推薦供品：</span>
              <span className="text-[#2C2C2C] font-medium ml-1">{event.offeringsSummary}</span>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => onOpenGuide('basic-flow')}
                className="px-2.5 py-1 rounded-lg bg-[#FAF6F0] border border-[#E2DAD0] text-[#5C554E] hover:text-[#A63A28] font-medium transition-colors"
                id="btn-quick-guide-flow"
              >
                看參拜步驟
              </button>
              <button
                onClick={() => onOpenDeityDetail(event.deityId)}
                className="px-3 py-1 rounded-lg bg-[#A63A28] text-white hover:bg-[#8C2E1F] font-semibold transition-colors shadow-2xs"
                id="btn-quick-deity-detail"
              >
                神明詳情
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
