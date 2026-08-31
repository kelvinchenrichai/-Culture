import React from 'react';
import {
  Sparkles,
  Scissors,
  Flame,
  ShoppingBag,
  CalendarDays,
  MapPin,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { NavTab } from './BottomNav';

interface QuickEntryGridProps {
  onNavigateTab: (tab: NavTab) => void;
  onOpenDecision: (decisionId: string) => void;
  isElderMode: boolean;
}

export const QuickEntryGrid: React.FC<QuickEntryGridProps> = ({
  onNavigateTab,
  onOpenDecision,
  isElderMode,
}) => {
  const quickActions = [
    {
      id: 'haircut',
      title: '今天可以剪頭髮嗎？',
      subtitle: '最熱門生活決策速查',
      badge: '規則引擎查詢',
      badgeColor: 'bg-[#EBF5ED] text-[#2E7D32] border border-[#2E7D32]/20',
      icon: Scissors,
      iconBg: 'bg-[#EBF5ED] text-[#2E7D32]',
      action: () => onOpenDecision('haircut'),
    },
    {
      id: 'deity',
      title: '今天拜什麼？',
      subtitle: '神明生日與作牙提醒',
      badge: '真實日曆',
      badgeColor: 'bg-[#A63A28]/10 text-[#A63A28] border border-[#A63A28]/20',
      icon: Flame,
      iconBg: 'bg-[#A63A28]/10 text-[#A63A28]',
      action: () => onNavigateTab('deity'),
    },
    {
      id: 'guide',
      title: '拜拜要準備什麼？',
      subtitle: '供品挑選與祈願口訣',
      badge: '長輩新手教學',
      badgeColor: 'bg-[#F2EFE9] text-[#5C554E] border border-[#E2DAD0]',
      icon: ShoppingBag,
      iconBg: 'bg-[#F2EFE9] text-[#5C554E]',
      action: () => onNavigateTab('guide'),
    },
    {
      id: 'find-days',
      title: '找好日子',
      subtitle: '搬家、開工、簽約吉日',
      badge: '真實宜忌查詢',
      badgeColor: 'bg-[#A63A28]/10 text-[#A63A28] border border-[#A63A28]/20',
      icon: CalendarDays,
      iconBg: 'bg-[#A63A28]/10 text-[#A63A28]',
      action: () => onNavigateTab('find-days'),
    },
    {
      id: 'temples',
      title: '附近有什麼廟？',
      subtitle: '指標宮廟與香火導航',
      badge: '全台寺廟真實資料',
      badgeColor: 'bg-[#EBF3FB] text-[#2A5C8A] border border-[#2A5C8A]/20',
      icon: MapPin,
      iconBg: 'bg-[#EBF3FB] text-[#2A5C8A]',
      action: () => onNavigateTab('temples'),
    },
    {
      id: 'decisions-all',
      title: '我想查其他事情',
      subtitle: '搬家/買車/大掃除/告白',
      badge: '4 種規則問答',
      badgeColor: 'bg-[#FAF6F0] text-[#736B63] border border-[#E8E1D5]',
      icon: HelpCircle,
      iconBg: 'bg-[#FAF6F0] text-[#736B63]',
      action: () => onNavigateTab('decision'),
    },
  ];

  return (
    <div className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
        <div>
          <h3 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-xl' : 'text-lg'}`}>
            生活快速指南
          </h3>
          <p className="text-xs text-[#736B63]">點擊大按鈕，直接看生活建議與解答</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {quickActions.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full text-left p-4 rounded-xl bg-white border border-[#E8E1D5] hover:border-[#A63A28]/50 hover:bg-[#FDF6F4] transition-all group flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A63A28]/50"
              id={`quick-action-${item.id}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className={`font-serif-tc font-bold text-[#2C2C2C] group-hover:text-[#A63A28] transition-colors ${isElderMode ? 'text-lg' : 'text-base'}`}>
                      {item.title}
                    </span>
                  </div>
                  <p className={`text-[#736B63] mt-0.5 line-clamp-1 ${isElderMode ? 'text-sm' : 'text-xs'}`}>
                    {item.subtitle}
                  </p>
                  <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#FAF6F0] border border-[#E8E1D5] flex items-center justify-center text-[#736B63] group-hover:text-[#A63A28] group-hover:border-[#A63A28]/40 group-hover:bg-[#FDF6F4] group-hover:translate-x-0.5 transition-all shrink-0 ml-2">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
