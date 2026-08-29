import React from 'react';
import { Sun, CheckCircle, Flame, CalendarDays, Grid2x2 } from 'lucide-react';

export type NavTab = 'today' | 'decision' | 'deity' | 'find-days' | 'guide' | 'temples' | 'more';

/** 出現在「更多」分頁裡的子項目，兩種模式共用同一個 More 頁面渲染，只是入口清單不同。 */
export const MORE_TAB_MEMBERS: NavTab[] = ['guide', 'temples'];
export const MORE_TAB_MEMBERS_SIMPLE: NavTab[] = ['decision', 'guide', 'temples'];

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  isElderMode: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  isElderMode,
}) => {
  // 簡易模式最多 4 格：首頁 / 拜拜 / 好日子 / 更多。
  // 一般模式最多 5 格：今日 / 查事生活 / 拜什麼 / 好日子 / 更多。
  const tabs = isElderMode
    ? [
        { id: 'today' as NavTab, label: '首頁', icon: Sun },
        { id: 'deity' as NavTab, label: '拜拜', icon: Flame },
        { id: 'find-days' as NavTab, label: '好日子', icon: CalendarDays },
        { id: 'more' as NavTab, label: '更多', icon: Grid2x2 },
      ]
    : [
        { id: 'today' as NavTab, label: '今日', icon: Sun },
        { id: 'decision' as NavTab, label: '查事生活', icon: CheckCircle },
        { id: 'deity' as NavTab, label: '拜什麼', icon: Flame },
        { id: 'find-days' as NavTab, label: '好日子', icon: CalendarDays },
        { id: 'more' as NavTab, label: '更多', icon: Grid2x2 },
      ];

  const moreMembers = isElderMode ? MORE_TAB_MEMBERS_SIMPLE : MORE_TAB_MEMBERS;
  const isMoreActive = activeTab === 'more' || moreMembers.includes(activeTab);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#F5F2ED]/98 backdrop-blur-lg border-t border-[#E8E1D5] shadow-lg"
      aria-label="主要導覽"
    >
      <div className="max-w-2xl mx-auto px-2 py-1 flex items-stretch justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === 'more' ? isMoreActive : activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              id={`tab-btn-${tab.id}`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={tab.label}
              className={`flex flex-col items-center justify-center rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A63A28]/50 ${
                isElderMode ? 'min-w-[64px] min-h-[56px] py-1.5 px-2' : 'min-w-[52px] min-h-[52px] py-1 px-1.5'
              } ${isActive ? 'text-[#A63A28] font-bold scale-105' : 'text-[#736B63] hover:text-[#2C2C2C]'}`}
            >
              <div
                className={`rounded-full transition-colors ${isElderMode ? 'p-2' : 'p-1.5'} ${
                  isActive ? 'bg-[#A63A28]/10' : 'bg-transparent'
                }`}
              >
                <Icon className={isElderMode ? 'w-6 h-6' : 'w-5 h-5'} aria-hidden="true" />
              </div>
              <span
                className={`tracking-tight ${
                  isElderMode ? 'text-sm font-semibold mt-0.5' : 'text-[11px] mt-0.5'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
