import React from 'react';
import { Sun, CheckCircle, Flame, CalendarDays, BookOpen, MapPin } from 'lucide-react';

export type NavTab = 'today' | 'decision' | 'deity' | 'find-days' | 'guide' | 'temples';

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
  const tabs = [
    { id: 'today' as NavTab, label: '今日吉凶', icon: Sun },
    { id: 'decision' as NavTab, label: '查事生活', icon: CheckCircle },
    { id: 'deity' as NavTab, label: '今天拜啥', icon: Flame },
    { id: 'find-days' as NavTab, label: '找好日子', icon: CalendarDays },
    { id: 'guide' as NavTab, label: '拜拜教學', icon: BookOpen },
    { id: 'temples' as NavTab, label: '附近廟宇', icon: MapPin },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#F5F2ED]/98 backdrop-blur-lg border-t border-[#E8E1D5] shadow-lg">
      <div className="max-w-2xl mx-auto px-2 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              id={`tab-btn-${tab.id}`}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all ${
                isActive
                  ? 'text-[#A63A28] font-bold scale-105'
                  : 'text-[#736B63] hover:text-[#2C2C2C]'
              }`}
            >
              <div
                className={`p-1.5 rounded-full transition-colors ${
                  isActive ? 'bg-[#A63A28]/10' : 'bg-transparent'
                }`}
              >
                <Icon className={isElderMode ? 'w-5 h-5' : 'w-4.5 h-4.5'} />
              </div>
              <span
                className={`tracking-tight ${
                  isElderMode ? 'text-xs font-semibold mt-0.5' : 'text-[11px] mt-0.5'
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
