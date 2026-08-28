import React, { useState } from 'react';
import { LIFE_DECISIONS } from '../data/mockData';
import { LifeDecision } from '../types';
import {
  Scissors,
  Home,
  Briefcase,
  Sparkles,
  Brush,
  FileCheck,
  Car,
  Heart,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Lightbulb,
  Share2,
  ArrowLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface DecisionViewProps {
  selectedDecisionId?: string;
  isElderMode: boolean;
  onBackToHome: () => void;
  onOpenFindDays: (category: string) => void;
  onOpenShareModal: (customData?: any) => void;
}

export const DecisionView: React.FC<DecisionViewProps> = ({
  selectedDecisionId = 'haircut',
  isElderMode,
  onBackToHome,
  onOpenFindDays,
  onOpenShareModal,
}) => {
  const [currentId, setCurrentId] = useState<string>(selectedDecisionId);
  const decision: LifeDecision =
    LIFE_DECISIONS.find((d) => d.id === currentId) || LIFE_DECISIONS[0];

  const getIcon = (name: string) => {
    switch (name) {
      case 'Scissors':
        return <Scissors className="w-5 h-5" />;
      case 'Home':
        return <Home className="w-5 h-5" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Brush':
        return <Brush className="w-5 h-5" />;
      case 'FileCheck':
        return <FileCheck className="w-5 h-5" />;
      case 'Car':
        return <Car className="w-5 h-5" />;
      case 'Heart':
        return <Heart className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header & Decision Selector Pills */}
      <div className="bg-[#FDF9F3] rounded-2xl p-4 border border-[#E8E1D5] shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
          <div className="flex items-center space-x-2">
            <button
              onClick={onBackToHome}
              className="p-1.5 rounded-lg bg-white border border-[#E8E1D5] text-[#5C554E] hover:text-[#A63A28]"
              id="btn-back-home-from-decision"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-xl' : 'text-lg'}`}>
                生活決策速查
              </h2>
              <p className="text-xs text-[#736B63]">點選想查的事情，5 秒知道「能不能做」</p>
            </div>
          </div>
        </div>

        {/* Quick Question Pills Horizontal Scroller */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-3 pb-1">
          {LIFE_DECISIONS.map((item) => {
            const isSelected = item.id === currentId;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentId(item.id)}
                id={`pill-decision-${item.id}`}
                className={`shrink-0 flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#2C2C2C] text-white shadow-sm'
                    : 'bg-white text-[#5C554E] border border-[#E8E1D5] hover:bg-[#FAF6F0]'
                }`}
              >
                <span>{item.query}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    item.isSuitable
                      ? isSelected
                        ? 'bg-[#2E7D32] text-white'
                        : 'bg-[#EBF5ED] text-[#2E7D32]'
                      : isSelected
                      ? 'bg-[#A63A28] text-white'
                      : 'bg-[#A63A28]/10 text-[#A63A28]'
                  }`}
                >
                  {item.verdict}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Core Decision Hero Card (Section 2 requirement) */}
      <div className="bg-[#FDF9F3] rounded-2xl p-5 md:p-6 border border-[#E8E1D5] shadow-sm relative overflow-hidden">
        {/* Top Accent bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 ${
            decision.isSuitable ? 'bg-[#2E7D32]' : 'bg-[#A63A28]'
          }`}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E1D5]">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                decision.isSuitable
                  ? 'bg-[#EBF5ED] text-[#2E7D32] border border-[#2E7D32]/25'
                  : 'bg-[#A63A28]/10 text-[#A63A28] border border-[#A63A28]/20'
              }`}
            >
              {getIcon(decision.iconName)}
            </div>
            <div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white text-[#736B63] font-medium border border-[#E8E1D5]">
                {decision.category}
              </span>
              <h1
                className={`font-serif-tc font-bold text-[#2C2C2C] mt-0.5 ${
                  isElderMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                }`}
              >
                {decision.title}
              </h1>
            </div>
          </div>

          {/* Giant Verdict Badge */}
          <div className="self-start sm:self-auto">
            <div
              className={`px-4 py-2.5 rounded-2xl flex items-center space-x-2 shadow-sm ${
                decision.isSuitable
                  ? 'bg-[#EBF5ED] text-[#2E7D32] border border-[#C2E0C7]'
                  : 'bg-[#FDF2F0] text-[#A63A28] border border-[#F5D5CF]'
              }`}
            >
              {decision.isSuitable ? (
                <CheckCircle2 className="w-7 h-7" />
              ) : (
                <XCircle className="w-7 h-7" />
              )}
              <div>
                <div className="text-[10px] tracking-wider uppercase font-semibold opacity-80 leading-none">
                  今日結論
                </div>
                <div className={`font-serif-tc font-bold leading-tight ${isElderMode ? 'text-3xl' : 'text-2xl'}`}>
                  {decision.verdict}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Short & Detailed Reason */}
        <div className="py-4 space-y-3">
          <div className="p-3.5 rounded-xl bg-white border border-[#E8E1D5]">
            <span className="text-xs font-bold text-[#A63A28] uppercase tracking-wider block mb-1">
              民俗氣場說明
            </span>
            <p className={`text-[#2C2C2C] font-medium leading-relaxed ${isElderMode ? 'text-lg' : 'text-base'}`}>
              {decision.shortReason}
            </p>
          </div>

          <p className={`text-[#5C554E] leading-relaxed ${isElderMode ? 'text-base' : 'text-sm'}`}>
            {decision.detailedExplanation}
          </p>

          {/* Warm Life Advice */}
          <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-[#F6FAF6] border border-[#E1EDE0] text-[#2E7D32]">
            <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" />
            <div className={`leading-relaxed ${isElderMode ? 'text-base font-medium' : 'text-xs font-medium'}`}>
              <strong className="font-bold">生活貼心提醒：</strong>
              {decision.lifeAdvice}
            </div>
          </div>
        </div>

        {/* Best Hours & Avoid Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E8E1D5]">
          <div className="p-3 rounded-xl bg-white border border-[#E8E1D5]">
            <div className="flex items-center space-x-1.5 text-[#2E7D32] mb-1.5">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold">建議時段（吉時安排）</span>
            </div>
            <ul className="space-y-1">
              {decision.bestHours.map((h, i) => (
                <li key={i} className={`text-[#2C2C2C] font-medium ${isElderMode ? 'text-base' : 'text-xs'}`}>
                  • {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#F5D5CF]">
            <div className="flex items-center space-x-1.5 text-[#A63A28] mb-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-xs font-bold">避開時段</span>
            </div>
            <ul className="space-y-1">
              {decision.avoidHours.map((h, i) => (
                <li key={i} className={`text-[#5C554E] ${isElderMode ? 'text-base' : 'text-xs'}`}>
                  • {h}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Practical Custom Tips */}
        <div className="mt-4 pt-3 border-t border-[#E8E1D5]">
          <h4 className="text-xs font-bold text-[#736B63] mb-2 uppercase tracking-wide">
            民俗小撇步
          </h4>
          <div className="space-y-1.5">
            {decision.customTips.map((tip, i) => (
              <div key={i} className="flex items-start space-x-2 text-xs text-[#5C554E]">
                <span className="text-[#A63A28] font-bold">•</span>
                <span className={isElderMode ? 'text-sm' : 'text-xs'}>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons Row: Share & Find Good Days */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-5 pt-4 border-t border-[#E8E1D5]">
          <button
            onClick={() => onOpenFindDays(decision.query)}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-[#2C2C2C] text-white hover:bg-[#1A1A1A] transition-all font-semibold flex items-center justify-center space-x-2 text-sm shadow-sm"
            id="btn-find-next-days"
          >
            <Calendar className="w-4 h-4 text-[#FFE58F]" />
            <span>找最近適合「{decision.query}」的日子</span>
          </button>

          <button
            onClick={() =>
              onOpenShareModal({
                title: decision.title,
                primaryText: `${decision.verdict}！${decision.shortReason}`,
                subtitle: decision.lifeAdvice,
                categoryName: decision.query,
                style: 'decision-ticket'
              })
            }
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-[#A63A28]/10 text-[#A63A28] hover:bg-[#A63A28]/15 border border-[#A63A28]/20 transition-all font-semibold flex items-center justify-center space-x-2 text-sm"
            id="btn-share-decision-card"
          >
            <Share2 className="w-4 h-4" />
            <span>分享結果給 LINE 好友 / 親友</span>
          </button>
        </div>
      </div>

      {/* Next Upcoming Auspicious Days for this activity */}
      <div className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#A63A28]" />
            <h3 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-xl' : 'text-lg'}`}>
              接下來適合「{decision.query}」的好日子
            </h3>
          </div>
          <button
            onClick={() => onOpenFindDays(decision.query)}
            className="text-xs font-semibold text-[#A63A28] hover:underline flex items-center"
            id="btn-see-more-days"
          >
            更多吉日 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {decision.nextAuspiciousDays.map((day, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white border border-[#E8E1D5] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#2C2C2C] text-sm">{day.solarDate}</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[#EBF5ED] text-[#2E7D32] font-semibold border border-[#2E7D32]/20">
                    吉
                  </span>
                </div>
                <div className="text-xs text-[#A63A28] font-medium mb-1.5">
                  農曆 {day.lunarDate}
                </div>
                <p className="text-xs text-[#5C554E] leading-tight">{day.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
