import React, { useState } from 'react';
import { DayInfo } from '../types';
import { Sparkles, Clock, Compass, ShieldAlert, ChevronDown, ChevronUp, Share2 } from 'lucide-react';

interface TodaySummaryCardProps {
  dayInfo: DayInfo;
  isElderMode: boolean;
  onOpenShareModal: () => void;
  onOpenDecision: (queryId: string) => void;
}

export const TodaySummaryCard: React.FC<TodaySummaryCardProps> = ({
  dayInfo,
  isElderMode,
  onOpenShareModal,
  onOpenDecision,
}) => {
  const [showAllHours, setShowAllHours] = useState(false);

  return (
    <div className="bg-[#FDF9F3] rounded-2xl p-5 md:p-6 border border-[#E8E1D5] shadow-sm relative overflow-hidden">
      {/* Decorative top cultural subtle banner */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#A63A28] via-[#D49B44] to-[#A63A28]" />

      {/* Date Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-[#E8E1D5]">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-3xl' : 'text-2xl'}`}>
              {dayInfo.solarDate}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full bg-[#A63A28]/10 text-[#A63A28] font-semibold border border-[#A63A28]/20 ${isElderMode ? 'text-base' : 'text-sm'}`}>
              {dayInfo.weekday}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[#5C554E]">
            <span className={`font-serif-tc font-semibold text-[#A63A28] ${isElderMode ? 'text-lg' : 'text-base'}`}>
              農曆 {dayInfo.lunarDate}
            </span>
            <span className="text-[#C8C2B7]">•</span>
            <span className={`px-2 py-0.5 rounded-md bg-[#F2EFE9] text-[#5C554E] ${isElderMode ? 'text-sm' : 'text-xs'}`}>
              {dayInfo.solarTerm}
            </span>
            <span className="text-[#C8C2B7]">•</span>
            <span className={`text-[#736B63] ${isElderMode ? 'text-sm' : 'text-xs'}`}>
              {dayInfo.ganZhi}
            </span>
          </div>
        </div>

        {/* Big Verdict Seal Stamp */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="bg-[#A63A28] text-white px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm shadow-[#A63A28]/25">
            <Sparkles className="w-4 h-4 text-[#FFE58F]" />
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-white/80 font-medium leading-none">今日氣場</div>
              <div className={`font-serif-tc font-bold leading-tight ${isElderMode ? 'text-2xl' : 'text-xl'}`}>
                {dayInfo.overallVerdict} <span className="text-xs font-normal opacity-90">({dayInfo.score}分)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Second Core Summary (Section 1 requirement) */}
      <div className="py-4">
        <div className="flex items-start space-x-2">
          <div className="seal-stamp text-xs px-2 py-0.5 mt-0.5 shrink-0">
            今日概覽
          </div>
          <p className={`text-[#2C2C2C] font-medium leading-relaxed ${isElderMode ? 'text-lg' : 'text-base'}`}>
            {dayInfo.summary}
          </p>
        </div>

        {/* Clash & Directions Quick Pill Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-dashed border-[#E2DAD0]">
          <div className="flex items-center space-x-2 text-[#5C554E] bg-white px-3 py-2 rounded-xl border border-[#E8E1D5]">
            <ShieldAlert className="w-4 h-4 text-[#A63A28] shrink-0" />
            <div className={`leading-tight ${isElderMode ? 'text-sm font-medium' : 'text-xs'}`}>
              <span className="text-[#736B63]">沖煞注意：</span>
              <strong className="text-[#2C2C2C] ml-1">{dayInfo.clashZodiac}</strong>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[#5C554E] bg-white px-3 py-2 rounded-xl border border-[#E8E1D5]">
            <Compass className="w-4 h-4 text-[#D49B44] shrink-0" />
            <div className={`leading-tight ${isElderMode ? 'text-sm font-medium' : 'text-xs'}`}>
              <span className="text-[#736B63]">吉神方位：</span>
              <span className="text-[#2C2C2C] ml-1">財神在 <strong>{dayInfo.wealthDirection}</strong> · 喜神在 {dayInfo.blessingDirection}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auspicious Hours Accordion */}
      <div className="pt-2 border-t border-[#E8E1D5]">
        <button
          onClick={() => setShowAllHours(!showAllHours)}
          className="w-full flex items-center justify-between py-2 text-left text-[#5C554E] hover:text-[#A63A28] transition-colors focus:outline-none"
          id="btn-toggle-hours"
        >
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-[#736B63]" />
            <span className={`font-medium ${isElderMode ? 'text-base' : 'text-sm'}`}>
              今日吉時指南（最旺辦事時段）
            </span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-[#EBF5ED] text-[#2E7D32] font-semibold border border-[#2E7D32]/20">
              4 個大吉時辰
            </span>
          </div>
          {showAllHours ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAllHours && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#E8E1D5]">
            {dayInfo.auspiciousHours.map((hour, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  hour.auspicious
                    ? 'bg-[#F9FAF8] border-[#DCE8DC] text-[#2E7D32]'
                    : 'bg-white border-[#E8E1D5] text-[#736B63]'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm px-1.5 py-0.5 rounded bg-white shadow-2xs border border-inherit">
                    {hour.branch}
                  </span>
                  <span className="text-xs font-medium text-[#2C2C2C]">{hour.timeRange}</span>
                </div>
                <span className={`text-xs font-semibold ${hour.auspicious ? 'text-[#2E7D32]' : 'text-[#736B63]'}`}>
                  {hour.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
