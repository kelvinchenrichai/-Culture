import React, { useState } from 'react';
import { DEITIES_LIST, UPCOMING_DEITY_EVENTS, TODAY_INFO } from '../data/mockData';
import { Deity } from '../types';
import {
  Flame,
  Calendar,
  Sparkles,
  ChevronRight,
  Heart,
  Gift,
  Clock,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface DeitiesViewProps {
  isElderMode: boolean;
  onSelectDeity: (deityId: string) => void;
  onOpenGuide: (guideId?: string) => void;
}

export const DeitiesView: React.FC<DeitiesViewProps> = ({
  isElderMode,
  onSelectDeity,
  onOpenGuide,
}) => {
  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner: Today's Worship / Birthday Context (Prompt Section 3 requirement) */}
      <div className="bg-[#FDF9F3] rounded-2xl p-5 md:p-6 border border-[#E8E1D5] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#A63A28] to-[#D49B44]" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E1D5]">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#A63A28]/10 text-[#A63A28] flex items-center justify-center border border-[#A63A28]/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-2xl' : 'text-xl'}`}>
                今天拜什麼？
              </h2>
              <p className="text-xs text-[#736B63]">
                今日節慶、神明誕辰與誠心參拜指南
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenGuide('basic-flow')}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-semibold text-[#5C554E] hover:text-[#A63A28] hover:border-[#A63A28]/40 self-start sm:self-auto"
            id="btn-open-worship-basics"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>拜拜基本流程教學</span>
          </button>
        </div>

        {/* Today's Special Worship Highlight */}
        <div className="mt-4 p-4 rounded-xl bg-white border border-[#E8E1D5]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="seal-stamp-filled text-[11px] px-2 py-0.5">
                今日敬拜推薦
              </span>
              <span className="font-serif-tc font-bold text-[#2C2C2C] text-base">
                {TODAY_INFO.todayDeityEvent?.deityName}
              </span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#A63A28]/10 text-[#A63A28] font-semibold border border-[#A63A28]/20">
              農曆十六「作牙」
            </span>
          </div>

          <p className={`text-[#5C554E] mt-2.5 leading-relaxed ${isElderMode ? 'text-base' : 'text-xs'}`}>
            {TODAY_INFO.todayDeityEvent?.description}
          </p>

          <div className="mt-3 pt-2.5 border-t border-dashed border-[#E8E1D5] flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="text-[#736B63]">
              <span className="text-[#736B63]">推薦供品：</span>
              <strong className="text-[#2C2C2C] ml-1">{TODAY_INFO.todayDeityEvent?.offeringsSummary}</strong>
            </div>

            <button
              onClick={() => onSelectDeity('tudigong')}
              className="px-3 py-1.5 rounded-lg bg-[#A63A28] text-white hover:bg-[#8C2E1F] font-semibold text-xs transition-colors flex items-center space-x-1"
              id="btn-view-tudigong-detail"
            >
              <span>查看土地公完整教學</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Deity Birthdays (近期重要神明日) */}
      <div className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#A63A28]" />
            <h3 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-xl' : 'text-lg'}`}>
              近期重要神明誕辰 / 節日
            </h3>
          </div>
          <span className="text-xs text-[#736B63]">提早準備供品</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {UPCOMING_DEITY_EVENTS.map((evt, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white border border-[#E8E1D5] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#A63A28] px-2 py-0.5 rounded-full bg-[#A63A28]/10 border border-[#A63A28]/20">
                      農曆 {evt.lunarDate}
                    </span>
                    <span className="font-serif-tc font-bold text-sm text-[#2C2C2C]">
                      {evt.deityName}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[#736B63] mb-2">國曆：{evt.solarDate}</div>
                <p className="text-xs text-[#5C554E] leading-relaxed mb-2">{evt.summary}</p>
                <div className="text-[11px] text-[#6E665E] bg-[#FAF6F0] p-2 rounded-lg border border-[#E8E1D5]">
                  <span className="text-[#736B63]">推薦供品：</span>
                  <span className="text-[#2C2C2C] font-medium ml-1">{evt.offerings}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#E8E1D5] flex justify-end">
                <button
                  onClick={() => onSelectDeity(evt.deityId)}
                  className="text-xs font-semibold text-[#A63A28] hover:underline flex items-center"
                  id={`btn-upcoming-deity-${idx}`}
                >
                  查看參拜教學 <ArrowRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Directory of Major Taiwanese Deities */}
      <div className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
          <div>
            <h3 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-xl' : 'text-lg'}`}>
              常用神明百科與參拜手冊
            </h3>
            <p className="text-xs text-[#736B63]">點擊神明查看故事、求什麼、供品與拜拜口訣</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
          {DEITIES_LIST.map((deity) => (
            <button
              key={deity.id}
              onClick={() => onSelectDeity(deity.id)}
              className="text-left p-4 rounded-xl bg-white border border-[#E8E1D5] hover:border-[#A63A28]/50 hover:bg-[#FDF6F4] transition-all group flex flex-col justify-between focus:outline-none"
              id={`btn-deity-card-${deity.id}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-full bg-[#A63A28]/10 text-[#A63A28] font-serif-tc font-bold text-sm flex items-center justify-center border border-[#A63A28]/20 group-hover:scale-105 transition-transform">
                      {deity.name.charAt(0)}
                    </span>
                    <div>
                      <h4 className={`font-serif-tc font-bold text-[#2C2C2C] group-hover:text-[#A63A28] transition-colors ${isElderMode ? 'text-lg' : 'text-base'}`}>
                        {deity.name}
                      </h4>
                      <span className="text-[11px] text-[#736B63]">{deity.honoricTitle}</span>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#A63A28]/10 text-[#A63A28] font-semibold border border-[#A63A28]/20">
                    {deity.tag}
                  </span>
                </div>

                <p className={`text-[#5C554E] line-clamp-2 mt-1 leading-relaxed ${isElderMode ? 'text-sm' : 'text-xs'}`}>
                  {deity.shortIntro}
                </p>

                {/* Domains Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {deity.domains.slice(0, 3).map((dom, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-[#FAF6F0] text-[#5C554E] border border-[#E8E1D5]"
                    >
                      {dom}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-[#E8E1D5] text-xs">
                <span className="text-[#736B63]">生辰：{deity.birthdayLunar}</span>
                <span className="text-[#A63A28] font-semibold flex items-center group-hover:translate-x-0.5 transition-transform">
                  查看教學 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
