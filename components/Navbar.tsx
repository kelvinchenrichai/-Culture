import React from 'react';
import { Calendar, Type, Share2, Sparkles } from 'lucide-react';

interface NavbarProps {
  isElderMode: boolean;
  onToggleElderMode: () => void;
  onOpenShareModal: () => void;
  currentViewTitle?: string;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isElderMode,
  onToggleElderMode,
  onOpenShareModal,
  currentViewTitle,
  onGoHome,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F5F2ED]/95 backdrop-blur-md border-b border-[#E8E1D5] transition-all">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={onGoHome}
          aria-label="回到首頁"
          className="flex items-center space-x-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A63A28]/50 rounded-xl"
          id="btn-brand-home"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#A63A28] flex items-center justify-center text-white shadow-sm shadow-[#A63A28]/25 group-hover:scale-105 transition-transform">
            <span className="font-serif-tc font-bold text-lg">吉</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className={`font-serif-tc font-bold tracking-wide text-[#2C2C2C] ${isElderMode ? 'text-2xl' : 'text-xl'}`}>
                今日好日
              </span>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[#A63A28]/10 text-[#A63A28] font-medium border border-[#A63A28]/20">
                民俗生活指南
              </span>
            </div>
            <p className="text-xs text-[#736B63] tracking-tight">
              {currentViewTitle ? `正在瀏覽：${currentViewTitle}` : '把傳統民俗，變成每個人都看得懂的生活指南'}
            </p>
          </div>
        </button>

        {/* Right Actions: Large Text Mode Toggle & Share Card */}
        <div className="flex items-center space-x-2">
          {/* Elder Mode / Large Text Toggle */}
          <button
            onClick={onToggleElderMode}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              isElderMode
                ? 'bg-[#2C2C2C] text-white border-[#2C2C2C] shadow-sm'
                : 'bg-white text-[#5C554E] border-[#E8E1D5] hover:bg-[#FDF9F3]'
            }`}
            title="切換簡易模式（長輩友善：大字、少選項、進階資料收起）"
            aria-pressed={isElderMode}
            id="btn-toggle-elder-mode"
          >
            <Type className="w-3.5 h-3.5" />
            <span>{isElderMode ? '簡易模式 (開啟)' : '切換簡易模式'}</span>
          </button>

          {/* Quick Share Card Button */}
          <button
            onClick={onOpenShareModal}
            className="p-2 rounded-xl bg-white border border-[#E8E1D5] text-[#5C554E] hover:text-[#A63A28] hover:border-[#A63A28]/40 hover:bg-[#FDF9F3] transition-colors"
            title="製作今日分享卡 (LINE / IG)"
            id="btn-quick-share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
