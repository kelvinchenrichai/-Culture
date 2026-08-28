import React, { useState } from 'react';
import { DEITIES_LIST } from '../data/mockData';
import { Deity } from '../types';
import {
  Flame,
  ArrowLeft,
  Calendar,
  Gift,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  MapPin,
  Share2,
  Copy,
  Check,
  ChevronRight
} from 'lucide-react';

interface DeityDetailViewProps {
  deityId: string;
  isElderMode: boolean;
  onBack: () => void;
  onNavigateToTemples: (templeSearch?: string) => void;
  onOpenShareModal: (customData?: any) => void;
}

export const DeityDetailView: React.FC<DeityDetailViewProps> = ({
  deityId,
  isElderMode,
  onBack,
  onNavigateToTemples,
  onOpenShareModal,
}) => {
  const deity: Deity =
    DEITIES_LIST.find((d) => d.id === deityId) || DEITIES_LIST[0];

  const [prayerTab, setPrayerTab] = useState<'general' | 'business'>('general');
  const [copied, setCopied] = useState(false);

  const handleCopyPrayer = () => {
    const text =
      prayerTab === 'general'
        ? deity.prayerTemplate.forGeneral
        : deity.prayerTemplate.forBusiness;
    navigator.clipboard?.writeText?.(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Navigation Top Bar */}
      <div className="bg-[#FDF9F3] rounded-2xl p-4 border border-[#E8E1D5] shadow-sm flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8E1D5] text-[#5C554E] hover:text-[#A63A28] text-xs font-semibold"
          id="btn-deity-back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回神明列表</span>
        </button>

        <button
          onClick={() =>
            onOpenShareModal({
              title: `${deity.name} · 慈悲庇佑`,
              subtitle: deity.tag,
              primaryText: deity.shortIntro,
              secondaryText: `生辰日：農曆 ${deity.birthdayLunar}`,
              style: 'deity-blessing'
            })
          }
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#A63A28]/10 text-[#A63A28] border border-[#A63A28]/20 hover:bg-[#A63A28]/15 text-xs font-semibold"
          id="btn-share-deity-card"
        >
          <Share2 className="w-4 h-4" />
          <span>分享祝壽祈福卡</span>
        </button>
      </div>

      {/* Hero Header Card */}
      <div className="bg-[#FDF9F3] rounded-2xl p-5 md:p-6 border border-[#E8E1D5] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#A63A28] via-[#D49B44] to-[#A63A28]" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E1D5]">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#A63A28]/10 text-[#A63A28] flex items-center justify-center font-serif-tc font-bold text-2xl border border-[#A63A28]/20 shadow-sm">
              {deity.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-3xl' : 'text-2xl'}`}>
                  {deity.name}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#A63A28]/10 text-[#A63A28] font-semibold border border-[#A63A28]/20">
                  {deity.honoricTitle}
                </span>
              </div>
              <p className="text-xs text-[#736B63] mt-0.5">俗稱：{deity.folkName}</p>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-[#E8E1D5] self-start sm:self-auto text-right">
            <div className="text-[10px] text-[#736B63] uppercase">重要生辰（壽誕）</div>
            <div className="font-serif-tc font-bold text-sm text-[#A63A28]">
              農曆 {deity.birthdayLunar}
            </div>
          </div>
        </div>

        {/* Short Intro & Story */}
        <div className="py-4 space-y-3">
          <p className={`text-[#2C2C2C] font-medium leading-relaxed ${isElderMode ? 'text-lg' : 'text-base'}`}>
            {deity.shortIntro}
          </p>

          <div className="p-3.5 rounded-xl bg-white border border-[#E8E1D5] text-[#5C554E] text-xs leading-relaxed">
            <strong className="text-[#2C2C2C] font-bold block mb-1">典故與民俗定位：</strong>
            {deity.fullStory}
          </div>

          {/* Domains (求什麼) */}
          <div className="mt-3">
            <span className="text-xs font-bold text-[#736B63] uppercase tracking-wider block mb-2">
              主要掌管與祈求事項
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {deity.domains.map((dom, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-white border border-[#E8E1D5] text-center text-xs font-semibold text-[#2C2C2C]"
                >
                  {dom}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Offerings and Taboos (供品準備 & 禁忌) */}
      <div className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm">
        <div className="flex items-center space-x-2 pb-3 border-b border-[#E8E1D5]">
          <Gift className="w-4 h-4 text-[#A63A28]" />
          <h3 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-xl' : 'text-lg'}`}>
            拜 {deity.name} 要準備什麼？（供品指南）
          </h3>
        </div>

        {/* Recommended Offerings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {deity.recommendedOfferings.map((offering, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white border border-[#E8E1D5] flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-[#A63A28] block mb-1">
                  {offering.category}
                </span>
                <ul className="space-y-1 my-2">
                  {offering.items.map((it, i) => (
                    <li key={i} className="text-xs text-[#2C2C2C] font-medium flex items-start space-x-1.5">
                      <span className="text-[#2E7D32]">•</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-[11px] text-[#736B63] pt-2 border-t border-[#E8E1D5]">
                {offering.meaning}
              </p>
            </div>
          ))}
        </div>

        {/* Taboo Offerings Box */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#FFF9F9] border border-[#F5D5CF]">
          <div className="flex items-center space-x-1.5 text-[#A63A28] mb-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-bold">常見供品禁忌（盡量避免）</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {deity.tabooOfferings.map((taboo, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#F5D5CF] text-[#A63A28] font-medium"
              >
                ✕ {taboo}
              </span>
            ))}
          </div>
        </div>

        {/* Best Worship Times */}
        <div className="mt-3 flex items-center space-x-2 text-xs text-[#5C554E] bg-white p-3 rounded-xl border border-[#E8E1D5]">
          <Clock className="w-4 h-4 text-[#D49B44] shrink-0" />
          <div>
            <span className="font-bold text-[#2C2C2C]">最佳參拜時間：</span>
            <span className="ml-1">{deity.bestWorshipTimes}</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Procedure */}
      <div className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm">
        <div className="flex items-center space-x-2 pb-3 border-b border-[#E8E1D5]">
          <CheckCircle className="w-4 h-4 text-[#2E7D32]" />
          <h3 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-xl' : 'text-lg'}`}>
            參拜 4 步法（照著做不慌張）
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {deity.steps.map((step) => (
            <div
              key={step.stepNumber}
              className="p-3.5 rounded-xl bg-white border border-[#E8E1D5] flex items-start space-x-3"
            >
              <div className="w-6 h-6 rounded-full bg-[#2C2C2C] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {step.stepNumber}
              </div>
              <div>
                <h4 className="font-bold text-[#2C2C2C] text-sm mb-1">{step.title}</h4>
                <p className="text-xs text-[#5C554E] leading-relaxed">{step.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prayer Incantation Template (怎麼跟神明說話) */}
      <div className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E1D5]">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-[#A63A28]" />
            <div>
              <h3 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-xl' : 'text-lg'}`}>
                拜拜口訣小抄（跟神明說話範本）
              </h3>
              <p className="text-xs text-[#736B63]">照著唸或心中默念即可，簡單真誠</p>
            </div>
          </div>

          {/* Toggle Tab */}
          <div className="flex rounded-lg bg-white p-0.5 border border-[#E8E1D5]">
            <button
              onClick={() => setPrayerTab('general')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                prayerTab === 'general'
                  ? 'bg-[#A63A28] text-white shadow-2xs'
                  : 'text-[#736B63] hover:text-[#2C2C2C]'
              }`}
            >
              日常平安版
            </button>
            <button
              onClick={() => setPrayerTab('business')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                prayerTab === 'business'
                  ? 'bg-[#A63A28] text-white shadow-2xs'
                  : 'text-[#736B63] hover:text-[#2C2C2C]'
              }`}
            >
              事業求財版
            </button>
          </div>
        </div>

        {/* Prayer Text Box */}
        <div className="mt-4 p-4 rounded-xl bg-white border border-[#E8E1D5] relative">
          <p className={`font-serif-tc text-[#2C2C2C] leading-relaxed tracking-wide ${isElderMode ? 'text-lg' : 'text-base'}`}>
            {prayerTab === 'general'
              ? deity.prayerTemplate.forGeneral
              : deity.prayerTemplate.forBusiness}
          </p>

          <div className="mt-3 pt-2.5 border-t border-dashed border-[#E8E1D5] flex items-center justify-between text-xs text-[#736B63]">
            <span>💡 提示：{deity.prayerTemplate.tips}</span>
            <button
              onClick={handleCopyPrayer}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#FAF6F0] border border-[#E2DAD0] text-[#5C554E] hover:text-[#A63A28] transition-colors"
              id="btn-copy-prayer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#2E7D32]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已複製小抄' : '複製口訣'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Famous Temples for this Deity */}
      <div className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#A63A28]" />
            <h3 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-xl' : 'text-lg'}`}>
              全台供奉 {deity.name} 指標名廟
            </h3>
          </div>
          <button
            onClick={() => onNavigateToTemples(deity.name)}
            className="text-xs font-semibold text-[#A63A28] hover:underline flex items-center"
            id="btn-see-all-temples-for-deity"
          >
            看附近更多廟 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {deity.famousTemples.map((temple, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white border border-[#E8E1D5] flex flex-col justify-between"
            >
              <div>
                <h4 className="font-bold text-[#2C2C2C] text-sm mb-1">{temple.name}</h4>
                <div className="text-xs text-[#736B63] mb-2">{temple.city}</div>
                <p className="text-xs text-[#5C554E]">{temple.highlight}</p>
              </div>

              <button
                onClick={() => onNavigateToTemples(temple.name)}
                className="mt-3 pt-2 border-t border-[#E8E1D5] text-xs text-[#A63A28] font-semibold flex items-center justify-between w-full hover:underline"
              >
                <span>查看位置</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
