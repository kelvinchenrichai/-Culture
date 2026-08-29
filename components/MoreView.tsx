import React from 'react';
import { BookOpen, CheckCircle, MapPin, ChevronRight } from 'lucide-react';
import type { NavTab } from './BottomNav';

type MoreItem = { tab: NavTab; title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> };

const ALL_ITEMS: Record<string, MoreItem> = {
  decision: { tab: 'decision', title: '查事生活', subtitle: '搬家、買車、大掃除等其他生活決策', icon: CheckCircle },
  guide: { tab: 'guide', title: '拜拜教學', subtitle: '準備供品、上香步驟，一步一步教你', icon: BookOpen },
  temples: { tab: 'temples', title: '附近寺廟', subtitle: '找離你最近、可以導航的寺廟', icon: MapPin },
};

/**
 * 「更多」分頁：把沒放進底部導覽的功能，用大按鈕列出來。
 * 簡易模式跟一般模式共用同一個頁面，只是清單內容不同（由父層傳入 `members`）。
 */
export function MoreView({ members, isElderMode, onNavigate }: { members: NavTab[]; isElderMode: boolean; onNavigate: (tab: NavTab) => void }) {
  const items = members.map((tab) => ALL_ITEMS[tab]).filter(Boolean);
  return (
    <div className="space-y-3 pb-12">
      <h1 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-2xl' : 'text-xl'}`}>更多功能</h1>
      <div className="space-y-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.tab}
              onClick={() => onNavigate(item.tab)}
              className="w-full flex items-center gap-4 p-5 rounded-2xl bg-[#FDF9F3] border border-[#E8E1D5] shadow-sm text-left hover:border-[#A63A28]/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A63A28]/50 min-h-[64px]"
            >
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#A63A28]/10 text-[#A63A28] flex items-center justify-center">
                <Icon className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-xl' : 'text-lg'}`}>{item.title}</div>
                <p className={`text-[#736B63] mt-0.5 ${isElderMode ? 'text-base' : 'text-sm'}`}>{item.subtitle}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#736B63] shrink-0" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
