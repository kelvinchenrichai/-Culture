import React, { useState } from 'react';
import { WORSHIP_GUIDES } from '../data/mockData';
import { WorshipGuide as PrototypeWorshipGuide } from '../types';
import { BASIC_WORSHIP_GUIDE } from '../src/data/worship/basicWorshipGuide';
import type { ProvenancedField } from '../src/lib/provenance/types';
import { useFestivals } from '../src/hooks/useFestivals';
import { getUpcomingFestivals } from '../src/lib/festivals/festivalService';
import { taipeiToday } from '../src/services/appServices';
import {
  BookOpen,
  ShoppingBag,
  Footprints,
  MessageSquare,
  ShieldAlert,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Info,
  PartyPopper,
} from 'lucide-react';

/** Part E4：拜拜頁小範圍顯示最近的廟會與祭典。Simple Mode 最多 3 筆，一般模式不特別限制（目前資料量本來就小）。 */
function UpcomingFestivalsSection({ limit }: { limit?: number }) {
  const { festivals } = useFestivals();
  const upcoming = getUpcomingFestivals({ from: taipeiToday(), days: 180 }, festivals);
  const shown = typeof limit === 'number' ? upcoming.slice(0, limit) : upcoming;

  return (
    <div className="bg-[#FDF9F3] rounded-2xl p-4 border border-[#E8E1D5] shadow-sm">
      <div className="flex items-center space-x-2 mb-3">
        <PartyPopper className="w-4 h-4 text-[#A63A28]" />
        <h3 className="text-sm font-bold text-[#2C2C2C]">最近的廟會與祭典</h3>
      </div>
      {shown.length > 0 ? (
        <div className="space-y-2">
          {shown.map((f) => (
            <div key={f.id} className="p-3 rounded-xl bg-white border border-[#E8E1D5] text-sm">
              <div className="font-bold text-[#2C2C2C]">{f.name}</div>
              <div className="text-xs text-[#736B63] mt-0.5">
                {f.parsedStartDate}
                {f.parsedEndDate && f.parsedEndDate !== f.parsedStartDate ? ` ～ ${f.parsedEndDate}` : ''}
                {f.city ? `・${f.city}${f.district ?? ''}` : ''}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[#736B63]">目前這個地區近期沒有收錄中的廟會或祭典資料，還在陸續補充中。</p>
      )}
    </div>
  );
}

interface WorshipGuideViewProps {
  selectedGuideId?: string;
  isElderMode: boolean;
  onNavigateToDeity: (deityId: string) => void;
  onOpenShareModal: () => void;
}

type SimpleSection = { id: string; label: string; icon: React.ComponentType<{ className?: string }>; field: ProvenancedField<string[]> };

const SOURCE_NOTE_LABEL: Record<ProvenancedField<unknown>['status'], string> = {
  verified: '已核實',
  sample: '民間習俗整理（非官方逐條驗證）',
  placeholder: '待補充',
  unavailable: '暫無資料',
};

/**
 * Part H：Simple Mode 拜拜教學。
 *
 * H1 spec 的四個大按鈕（準備什麼/怎麼拜/怎麼說/注意什麼）跟 `WorshipGuide` 的欄位不是
 * 一對一，這裡做分組：「準備什麼」= preparation + offerings；「怎麼拜」= steps；
 * 「怎麼說」= notes（祈求腳本）；「注意什麼」= etiquette。
 */
function SimpleWorshipFlow({ isElderMode }: { isElderMode: boolean }) {
  const guide = BASIC_WORSHIP_GUIDE;
  const sections: SimpleSection[] = [
    {
      id: 'prepare',
      label: '準備什麼',
      icon: ShoppingBag,
      field: { ...guide.preparation, value: [...guide.preparation.value, ...guide.offerings.value] },
    },
    { id: 'how', label: '怎麼拜', icon: Footprints, field: guide.steps },
    { id: 'say', label: '怎麼說', icon: MessageSquare, field: guide.notes ?? { value: [], status: 'unavailable', contentType: 'FOLKLORE', sources: [] } },
    { id: 'caution', label: '注意什麼', icon: ShieldAlert, field: guide.etiquette },
  ];
  const [activeId, setActiveId] = useState<string>('prepare');
  const active = sections.find((s) => s.id === activeId) ?? sections[0];

  return (
    <div className="space-y-4 pb-12">
      <div className="bg-[#FDF9F3] rounded-2xl p-4 border border-[#E8E1D5] shadow-sm">
        <div className="flex items-center space-x-2.5 pb-3">
          <div className="w-9 h-9 rounded-xl bg-[#A63A28]/10 text-[#A63A28] flex items-center justify-center border border-[#A63A28]/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-tc font-bold text-2xl text-[#2C2C2C]">{guide.title}</h2>
            <p className="text-xs text-[#736B63]">一般日常參拜，想清楚知道每一步該做什麼</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {sections.map((section) => {
            const Icon = section.icon;
            const isSelected = section.id === activeId;
            return (
              <button
                key={section.id}
                onClick={() => setActiveId(section.id)}
                id={`btn-worship-section-${section.id}`}
                aria-pressed={isSelected}
                className={`flex flex-col items-center justify-center gap-2 rounded-2xl border py-5 px-2 min-h-[96px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A63A28]/50 ${
                  isSelected ? 'bg-[#2C2C2C] border-[#2C2C2C] text-white shadow-sm' : 'bg-white border-[#E8E1D5] text-[#2C2C2C]'
                }`}
              >
                <Icon className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-[#A63A28]'}`} />
                <span className="font-serif-tc font-bold text-lg">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm space-y-3">
        {active.field.value.map((line, index) => (
          <div key={index} className="p-4 rounded-xl bg-white border border-[#E8E1D5] flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-full bg-[#A63A28] text-white flex items-center justify-center font-bold shrink-0">{index + 1}</div>
            <p className="text-lg text-[#2C2C2C] leading-relaxed">{line}</p>
          </div>
        ))}

        <div className="flex items-start gap-2 text-xs text-[#736B63] bg-[#FAF6F0] rounded-xl p-3 border border-[#E8E1D5]">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {SOURCE_NOTE_LABEL[active.field.status]}
            {active.field.sources.length > 0 && `：${active.field.sources[0].publisher ?? active.field.sources[0].title}`}
            ，不同廟宇、地區習慣可能不同，實際請以現場廟方公告為準。
          </span>
        </div>
      </div>

      <UpcomingFestivalsSection limit={3} />
    </div>
  );
}

/**
 * Normal Mode：維持既有的多主題文章瀏覽器（拜拜供品、求籤問事等），這些內容本輪沒有逐條
 * 轉換成新的 provenance 結構（見 docs/phase-4-p2.md 的 PARTIAL 說明），但補上頁面層級的
 * 誠實提示，避免讓讀者把整篇文章誤會成官方核實過的事實。
 */
function NormalWorshipGuideBrowser({ isElderMode, selectedGuideId }: { isElderMode: boolean; selectedGuideId: string }) {
  const [currentId, setCurrentId] = useState<string>(selectedGuideId);
  const guide: PrototypeWorshipGuide = WORSHIP_GUIDES.find((g) => g.id === currentId) || WORSHIP_GUIDES[0];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4 pb-12">
      <div className="bg-[#FDF9F3] rounded-2xl p-4 border border-[#E8E1D5] shadow-sm">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-[#E8E1D5]">
          <div className="w-9 h-9 rounded-xl bg-[#A63A28]/10 text-[#A63A28] flex items-center justify-center border border-[#A63A28]/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-tc font-bold text-xl text-[#2C2C2C]">拜拜實用教學手冊</h2>
            <p className="text-xs text-[#736B63]">像教長輩一樣清楚、簡單、有條理，新手也不慌張</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
          {WORSHIP_GUIDES.map((item) => {
            const isSelected = item.id === currentId;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentId(item.id)}
                id={`btn-guide-tab-${item.id}`}
                className={`p-2.5 rounded-xl text-left transition-all border ${
                  isSelected ? 'bg-[#2C2C2C] text-white border-[#2C2C2C] shadow-sm' : 'bg-white text-[#5C554E] border-[#E8E1D5] hover:bg-[#FAF6F0]'
                }`}
              >
                <div className="text-[10px] font-semibold opacity-70 mb-0.5">{item.category}</div>
                <div className="font-bold text-xs line-clamp-1">{item.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-[#736B63] bg-[#FDF9F3] rounded-xl p-3 border border-[#E8E1D5]">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#A63A28]" />
        <span>以下內容整理自台灣民間流傳的拜拜習俗，不是逐條核實的官方文獻，不同廟宇與地區可能有差異，請以現場廟方說明為準。</span>
      </div>

      <div className="bg-[#FDF9F3] rounded-2xl p-5 md:p-6 border border-[#E8E1D5] shadow-sm relative">
        <div className="pb-4 border-b border-[#E8E1D5]">
          <div className="flex items-center space-x-2 text-xs text-[#736B63] mb-1.5">
            <span className="px-2 py-0.5 rounded-full bg-[#A63A28]/10 text-[#A63A28] font-semibold border border-[#A63A28]/20">{guide.category}</span>
            <span>•</span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              閱讀時間約 {guide.readTime}
            </span>
          </div>

          <h1 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>{guide.title}</h1>
          <p className="text-xs text-[#A63A28] font-medium mt-1">{guide.subtitle}</p>
          <p className={`text-[#5C554E] mt-3 leading-relaxed ${isElderMode ? 'text-lg' : 'text-sm'}`}>{guide.summary}</p>
        </div>

        <div className="py-5 space-y-4">
          <h3 className="text-xs font-bold text-[#736B63] uppercase tracking-wider">詳細步驟圖解說明</h3>
          <div className="space-y-3">
            {guide.steps.map((step) => (
              <div key={step.step} className="p-4 rounded-xl bg-white border border-[#E8E1D5] flex items-start space-x-3.5">
                <div className="w-7 h-7 rounded-full bg-[#A63A28] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 shadow-2xs">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-[#2C2C2C] ${isElderMode ? 'text-lg' : 'text-base'}`}>{step.title}</h4>
                  <p className={`text-[#5C554E] mt-1 whitespace-pre-line leading-relaxed ${isElderMode ? 'text-base' : 'text-xs'}`}>{step.details}</p>
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

        <div className="mt-5 pt-4 border-t border-[#E8E1D5]">
          <h4 className="text-xs font-bold text-[#736B63] uppercase tracking-wider mb-3">常見疑問與迷思解答</h4>
          <div className="space-y-2">
            {guide.commonMisconceptions.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="rounded-xl border border-[#E8E1D5] overflow-hidden bg-white">
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
                    <div className="px-3 pb-3 pt-1 text-xs text-[#5C554E] leading-relaxed border-t border-[#E8E1D5] bg-[#FAF6F0]">{faq.answer}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <UpcomingFestivalsSection />
    </div>
  );
}

export const WorshipGuideView: React.FC<WorshipGuideViewProps> = ({ selectedGuideId = 'basic-flow', isElderMode }) => {
  return isElderMode ? <SimpleWorshipFlow isElderMode={isElderMode} /> : <NormalWorshipGuideBrowser isElderMode={isElderMode} selectedGuideId={selectedGuideId} />;
};
