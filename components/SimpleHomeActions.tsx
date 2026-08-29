import React from 'react';
import { Scissors, Flame, Home, Briefcase, Heart, Plane } from 'lucide-react';

export type SimpleAction = { id: string; label: string; icon: React.ComponentType<{ className?: string }>; iconBg: string; iconColor: string };

// Icon First：長輩最常問的六件事。維持固定順序，不做個人化排序，降低理解負擔。
export const SIMPLE_ACTIONS: SimpleAction[] = [
  { id: 'haircut', label: '剪頭髮', icon: Scissors, iconBg: '#EBF5ED', iconColor: '#2E7D32' },
  { id: 'worship-praying', label: '拜拜', icon: Flame, iconBg: '#FDF2F0', iconColor: '#A63A28' },
  { id: 'moving', label: '搬家', icon: Home, iconBg: '#EBF3FB', iconColor: '#2A5C8A' },
  { id: 'opening', label: '開工', icon: Briefcase, iconBg: '#FFF8E8', iconColor: '#7A5A13' },
  { id: 'marriage', label: '結婚', icon: Heart, iconBg: '#FDF0F3', iconColor: '#B23A5C' },
  { id: 'travel', label: '出門', icon: Plane, iconBg: '#F2EFE9', iconColor: '#5C554E' },
];

/**
 * Part A1/A2：簡易模式首頁第一屏的大按鈕。
 * Icon First：大 icon + 大文字 + 高對比 + 大點擊範圍（>=56px），不依賴小字說明。
 */
export function SimpleHomeActions({ onSelect }: { onSelect: (actionId: string) => void }) {
  return (
    <section aria-label="今天想做什麼">
      <h2 className="font-serif-tc font-bold text-2xl text-[#2C2C2C] mb-3">今天想做什麼？</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SIMPLE_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onSelect(action.id)}
              id={`simple-action-${action.id}`}
              aria-label={action.label}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#FDF9F3] border border-[#E8E1D5] shadow-sm py-5 px-2 min-h-[112px] active:scale-[0.97] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A63A28]/50"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: action.iconBg, color: action.iconColor }}
              >
                <Icon className="w-8 h-8" />
              </div>
              <span className="font-serif-tc font-bold text-xl text-[#2C2C2C]">{action.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
