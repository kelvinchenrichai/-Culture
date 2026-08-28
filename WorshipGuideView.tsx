import React, { useState } from 'react';
import { WORSHIP_GUIDES } from '../data/mockData';
import { WorshipGuide } from '../types';
import {
  BookOpen,
  ShoppingBag,
  MessageSquare,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

interface WorshipGuideViewProps {
  selectedGuideId?: string;
  isElderMode: boolean;
  onNavigateToDeity: (deityId: string) => void;
  onOpenShareModal: () => void;
}

export const WorshipGuideView: React.FC<WorshipGuideViewProps> = ({
  selectedGuideId = 'basic-flow',
  isElderMode,
  onNavigateToDeity,
  onOpenShareModal,
}) => {
  const [currentId, setCurrentId] = useState<string>(selectedGuideId);
  const guide: WorshipGuide =
    WORSHIP_GUIDES.find((g) => g.id === currentId) || WORSHIP_GUIDES[0];

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="bg-[#FDF9F3] rounded-2xl p-4 border border-[#E8E1D5] shadow-sm">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-[#E8E1D5]">
          <div className="w-9 h-9 rounded-xl bg-[#A63A28]/10 text-[#A63A28] flex items-center justify-center border border-[#A63A28]/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-2xl' : 'text-xl'}`}>
              拜拜實用教學手冊
            </h2>
            <p className="text-xs text-[#736B63]">
              像教長輩一樣清楚、簡單、有條理，新手也不慌張
            </p>
          </div>
        </div>

        {/* Tutorial Category Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
          {WORSHIP_GUIDES.map((item) => {
            const isSelected = item.id === currentId;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentId(item.id)}
                id={`btn-guide-tab-${item.id}`}
                className={`p-2.5 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-[#2C2C2C] text-white border-[#2C2C2C] shadow-sm'
                    : 'bg-white text-[#5C554E] border-[#E8E1D5] hover:bg-[#FAF6F0]'
                }`}
              >
                <div className="text-[10px] font-semibold opacity-70 mb-0.5">
                  {item.category}
                </div>
                <div className="font-bold text-xs line-clamp-1">{item.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Guide Content Card */}
      <div className="bg-[#FDF9F3] rounded-2xl p-5 md:p-6 border border-[#E8E1D5] shadow-sm relative">
        <div className="pb-4 border-b border-[#E8E1D5]">
          <div className="flex items-center space-x-2 text-xs text-[#736B63] mb-1.5">
            <span className="px-2 py-0.5 rounded-full bg-[#A63A28]/10 text-[#A63A28] font-semibold border border-[#A63A28]/20">
              {guide.category}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              閱讀時間約 {guide.readTime}
            </span>
          </div>

          <h1 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
            {guide.title}
          </h1>
          <p className="text-xs text-[#A63A28] font-medium mt-1">{guide.subtitle}</p>

          <p className={`text-[#5C554E] mt-3 leading-relaxed ${isElderMode ? 'text-lg' : 'text-sm'}`}>
            {guide.summary}
          </p>
        </div>

        {/* Step-by-Step breakdown */}
        <div className="py-5 space-y-4">
          <h3 className="text-xs font-bold text-[#736B63] uppercase tracking-wider">
            詳細步驟圖解說明
          </h3>

          <div className="space-y-3">
            {guide.steps.map((step) => (
              <div
                key={step.step}
                className="p-4 rounded-xl bg-white border border-[#E8E1D5] flex items-start space-x-3.5"
              >
                <div className="w-7 h-7 rounded-full bg-[#A63A28] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 shadow-2xs">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-[#2C2C2C] ${isElderMode ? 'text-lg' : 'text-base'}`}>
                    {step.title}
                  </h4>
                  <p className={`text-[#5C554E] mt-1 whitespace-pre-line leading-relaxed ${isElderMode ? 'text-base' : 'text-xs'}`}>
                    {step.details}
                  </p>
                  {step.tip && (
                    <div className="mt-2 text-xs text-[#2E7D32] bg-[#EBF5ED] px-2.5 py-1.5 rounded-lg border border-[#2E7D32]/25 font-medium">
                      💡 {step.tip}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Checklist Box */}
        <div className="p-4 rounded-xl bg-white border border-[#E8E1D5]">
          <h4 className="text-xs font-bold text-[#A63A28] uppercase tracking-wide mb-2 flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-1.5 text-[#2E7D32]" />
            重點精華小清單（隨身備忘）
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {guide.keyChecklist.map((item, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-[#2C2C2C]">
                <span className="text-[#A63A28] font-bold">✓</span>
                <span className={isElderMode ? 'text-sm font-medium' : 'text-xs'}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Common Misconceptions & FAQ */}
        <div className="mt-5 pt-4 border-t border-[#E8E1D5]">
          <h4 className="text-xs font-bold text-[#736B63] uppercase tracking-wider mb-3">
            常見疑問與迷思解答
          </h4>

          <div className="space-y-2">
            {guide.commonMisconceptions.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[#E8E1D5] overflow-hidden bg-white"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-3 text-left font-bold text-xs text-[#2C2C2C] flex items-center justify-between hover:text-[#A63A28]"
                  >
                    <span className="flex items-center">
                      <HelpCircle className="w-4 h-4 text-[#A63A28] mr-2 shrink-0" />
                      {faq.question}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isOpen && (
                    <div className="px-3 pb-3 pt-1 text-xs text-[#5C554E] leading-relaxed border-t border-[#E8E1D5] bg-[#FAF6F0]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
