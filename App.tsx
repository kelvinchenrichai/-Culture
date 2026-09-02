import React, { useState } from 'react';
import { TODAY_INFO } from './data/mockData';
import { NavTab, BottomNav, MORE_TAB_MEMBERS, MORE_TAB_MEMBERS_SIMPLE } from './components/BottomNav';
import { Navbar } from './components/Navbar';
import { EmotionCard } from './components/EmotionCard';
import { QuickEntryGrid } from './components/QuickEntryGrid';
import { SimpleHomeActions } from './components/SimpleHomeActions';
import { MoreView } from './components/MoreView';
import { WorshipGuideView } from './components/WorshipGuideView';
import { FindDaysView } from './components/FindDaysView';
import { ShareCardModal } from './components/ShareCardModal';
import { ShareCardData } from './types';
import { TodayRealSections } from './components/TodayRealSections';
import { RealDecisionView } from './components/RealDecisionView';
import { RealDeitiesView } from './components/RealDeitiesView';
import { RealTemplesView } from './components/RealTemplesView';
import { RealDeityDetail } from './components/RealDeityDetail';
import { useTodayViewModel } from './src/hooks/useTodayViewModel';
import { useElderMode } from './src/hooks/useElderMode';

export default function App() {
  const today = useTodayViewModel();
  const [activeTab, setActiveTab] = useState<NavTab>('today');
  const [isElderMode, setIsElderMode] = useElderMode(false);
  const [selectedDecisionId, setSelectedDecisionId] = useState<string>('haircut');
  const [decisionQuery, setDecisionQuery] = useState<string | undefined>();
  const [selectedDeityId, setSelectedDeityId] = useState<string | null>(null);
  const [selectedGuideId, setSelectedGuideId] = useState<string>('basic-flow');
  const [templeSearchQuery, setTempleSearchQuery] = useState<string>('');

  // Share Card Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareModalData, setShareModalData] = useState<Partial<ShareCardData> | undefined>(undefined);

  // Navigation Helpers
  const handleOpenDecision = (decisionId: string) => {
    setDecisionQuery(undefined);
    // Map common action names to decision IDs if needed
    let mappedId = decisionId;
    if (decisionId.includes('理髮') || decisionId.includes('剪髮') || decisionId.includes('剪頭髮')) {
      mappedId = 'haircut';
    } else if (decisionId.includes('搬家') || decisionId.includes('移徙') || decisionId.includes('入宅')) {
      mappedId = 'moving';
    } else if (decisionId.includes('開工') || decisionId.includes('開業') || decisionId.includes('開市')) {
      mappedId = 'opening';
    } else if (decisionId.includes('祈福') || decisionId.includes('參拜') || decisionId.includes('拜拜')) {
      mappedId = 'worship-praying';
    } else if (decisionId.includes('掃除') || decisionId.includes('整理')) {
      mappedId = 'cleaning';
    } else if (decisionId.includes('簽約') || decisionId.includes('納財')) {
      mappedId = 'contract';
    } else if (decisionId.includes('車') || decisionId.includes('交車')) {
      mappedId = 'buycar';
    } else if (decisionId.includes('友') || decisionId.includes('約會') || decisionId.includes('會友')) {
      mappedId = 'dating';
    }

    setSelectedDecisionId(mappedId);
    setActiveTab('decision');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRuleQuery = (query: string) => {
    setDecisionQuery(query);
    setSelectedDecisionId('haircut');
    setActiveTab('decision');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDeityDetail = (deityId: string) => {
    setSelectedDeityId(deityId);
    setActiveTab('deity');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenGuide = (guideId?: string) => {
    if (guideId) setSelectedGuideId(guideId);
    setActiveTab('guide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToTemples = (searchQuery?: string) => {
    if (searchQuery) setTempleSearchQuery(searchQuery);
    setActiveTab('temples');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenShareModal = (customData?: Partial<ShareCardData>) => {
    setShareModalData(customData);
    setIsShareModalOpen(true);
  };

  const handleGoHome = () => {
    setSelectedDeityId(null);
    setActiveTab('today');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCurrentViewTitle = () => {
    switch (activeTab) {
      case 'decision':
        return '生活決策速查';
      case 'deity':
        return selectedDeityId ? '神明詳細指南' : '今天拜什麼';
      case 'find-days':
        return '找好日子';
      case 'guide':
        return '拜拜實用教學';
      case 'temples':
        return '附近廟宇地圖';
      case 'more':
        return '更多功能';
      default:
        return undefined;
    }
  };

  return (
    <div className={`min-h-screen paper-bg flex flex-col ${isElderMode ? 'text-lg' : 'text-base'}`}>
      {/* Top Navigation */}
      <Navbar
        isElderMode={isElderMode}
        onToggleElderMode={() => setIsElderMode(!isElderMode)}
        onOpenShareModal={() => handleOpenShareModal()}
        currentViewTitle={getCurrentViewTitle()}
        onGoHome={handleGoHome}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 md:py-6 mb-16">
        {/* VIEW 1: 首頁 / 今日頁 */}
        {activeTab === 'today' && (
          <div className="space-y-4 pb-12 animate-in fade-in duration-200">
            {/* 1. Today Summary Hero Card */}
            <TodayRealSections today={today} isElderMode={isElderMode} onQuery={handleRuleQuery} onDecision={handleOpenDecision} onDeities={() => { setSelectedDeityId(null); setActiveTab('deity'); }} />

            {/* 2. Big Touch Quick Entries — 簡易模式用 Icon First 大按鈕，一般模式維持完整列表 */}
            {isElderMode ? (
              <SimpleHomeActions onSelect={handleOpenDecision} />
            ) : (
              <QuickEntryGrid
                onNavigateTab={(tab) => {
                  setSelectedDeityId(null);
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenDecision={handleOpenDecision}
                isElderMode={isElderMode}
              />
            )}

            {/* Editorial layer remains visually separate from calendar facts. */}
            <div className="relative"><EmotionCard
              quote={TODAY_INFO.emotionalQuote}
              isElderMode={isElderMode}
              onOpenShareModal={() =>
                handleOpenShareModal({
                  title: '今日好日 · 生活一句',
                  primaryText: TODAY_INFO.emotionalQuote.content,
                  subtitle: TODAY_INFO.emotionalQuote.subtext,
                  style: 'daily-quote'
                })
              }
            />{import.meta.env.DEV && <span className="absolute right-4 top-4 text-[10px] px-2 py-1 rounded-full bg-[#FFF8E8] text-[#7A5A13] font-bold">EDITORIAL SAMPLE</span>}</div>

            {/* Footer Culture note */}
            <footer className="text-center py-6 text-xs text-[#736B63] space-y-1">
              <div className="flex items-center justify-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A63A28]" />
                <span className="font-serif-tc font-semibold text-[#2C2C2C]">今日好日 · 台灣民俗生活指南</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#A63A28]" />
              </div>
              <p>每天都看得懂的農民曆與拜拜助手 · 讓傳統民俗溫暖你的日常生活</p>
            </footer>
          </div>
        )}

        {/* VIEW 2: 生活決策速查頁 (「今天可以剪頭髮嗎？」等) */}
        {activeTab === 'decision' && (
          <RealDecisionView selectedId={selectedDecisionId} initialQuery={decisionQuery} today={today.calendarDay} isElderMode={isElderMode} onBack={handleGoHome} onOpenShareModal={handleOpenShareModal} />
        )}

        {/* VIEW 3: 今天拜什麼 & 神明百科 / 詳情頁 */}
        {activeTab === 'deity' && (
          <div>
            {selectedDeityId ? (
              <RealDeityDetail deityId={selectedDeityId} onBack={() => setSelectedDeityId(null)} onTemples={handleNavigateToTemples} onOpenShareModal={handleOpenShareModal} />
            ) : (
              <RealDeitiesView today={today} onSelect={(deityId) => setSelectedDeityId(deityId)} />
            )}
          </div>
        )}

        {/* VIEW 4: 找好日子頁 */}
        {activeTab === 'find-days' && (
          <FindDaysView isElderMode={isElderMode} onOpenShareModal={handleOpenShareModal} />
        )}

        {/* VIEW 5: 拜拜實用教學頁 */}
        {activeTab === 'guide' && (
          <WorshipGuideView
            selectedGuideId={selectedGuideId}
            isElderMode={isElderMode}
            onNavigateToDeity={handleOpenDeityDetail}
            onOpenShareModal={() => handleOpenShareModal()}
          />
        )}

        {/* VIEW 6: 附近寺廟地圖頁 */}
        {activeTab === 'temples' && (
          <RealTemplesView isElderMode={isElderMode} />
        )}

        {/* VIEW 7: 更多功能（沒放進底部導覽的功能入口） */}
        {activeTab === 'more' && (
          <MoreView
            members={isElderMode ? MORE_TAB_MEMBERS_SIMPLE : MORE_TAB_MEMBERS}
            isElderMode={isElderMode}
            onNavigate={(tab) => {
              setSelectedDeityId(null);
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Persistent Bottom Mobile Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          if (tab === 'deity' && activeTab === 'deity' && selectedDeityId) {
            setSelectedDeityId(null);
          } else {
            setActiveTab(tab);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isElderMode={isElderMode}
      />

      {/* Share Card Generator Modal */}
      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        initialData={shareModalData}
        isElderMode={isElderMode}
        today={today}
      />
    </div>
  );
}
