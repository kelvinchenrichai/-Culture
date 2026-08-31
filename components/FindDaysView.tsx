import React, { useEffect, useState } from 'react';
import {
  CalendarDays,
  Scissors,
  Home as HomeIcon,
  Flame,
  Briefcase,
  Heart,
  Plane,
  Share2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { calendarService, taipeiToday } from '../src/services/appServices';
import { findSuitableDates, nextDaysRange, type SuitableDateAction, type SuitableDateResult } from '../src/lib/rules/findSuitableDates';

interface FindDaysViewProps {
  isElderMode: boolean;
  onOpenShareModal: (customData?: any) => void;
}

const ACTIONS: { id: string; label: string; action: SuitableDateAction; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'haircut', label: '剪頭髮', action: 'HAIRCUT', icon: Scissors },
  { id: 'worship-praying', label: '拜拜', action: 'WORSHIP', icon: Flame },
  { id: 'moving', label: '搬家', action: 'MOVE_HOME', icon: HomeIcon },
  { id: 'opening', label: '開工', action: 'START_WORK', icon: Briefcase },
  { id: 'marriage', label: '結婚', action: 'MARRIAGE', icon: Heart },
  { id: 'travel', label: '出門', action: 'TRAVEL', icon: Plane },
];

const SEARCH_WINDOW_DAYS = 30;
const RESULT_LIMIT = 5;

type LoadState = 'loading' | 'success' | 'error';

/**
 * Part G（找好日子）。
 *
 * 重做前這裡整頁都是 `data/mockData.ts` 的 `AUSPICIOUS_DAYS`：固定寫死 2025 年的日期、
 * 「吉度 92 分」這種假精準分數、「氣場相合」這種沒有依據的標籤。這違反 Production Safety
 * 的「no fake score」規則，所以整頁改用真正的 `findSuitableDates`（只讀 LunarData Primary
 * 的宜忌），不再顯示任何分數或排名說法。
 */
export const FindDaysView: React.FC<FindDaysViewProps> = ({ isElderMode, onOpenShareModal }) => {
  const [selectedId, setSelectedId] = useState<string>('haircut');
  const [state, setState] = useState<LoadState>('loading');
  const [results, setResults] = useState<SuitableDateResult[]>([]);
  const [unavailableDays, setUnavailableDays] = useState(0);
  const [queriedDays, setQueriedDays] = useState(0);

  const selected = ACTIONS.find((item) => item.id === selectedId) ?? ACTIONS[0];

  useEffect(() => {
    let active = true;
    setState('loading');
    const { from, to } = nextDaysRange(taipeiToday(), SEARCH_WINDOW_DAYS);
    findSuitableDates({ action: selected.action, from, to, limit: RESULT_LIMIT }, (date) => calendarService.getDay(date))
      .then((summary) => {
        if (!active) return;
        setResults(summary.results);
        setUnavailableDays(summary.unavailableDays);
        setQueriedDays(summary.queriedDays);
        setState('success');
      })
      .catch(() => {
        if (active) setState('error');
      });
    return () => {
      active = false;
    };
  }, [selected.action]);

  const allDaysUnavailable = queriedDays > 0 && unavailableDays === queriedDays;

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="bg-[#FDF9F3] rounded-2xl p-4 border border-[#E8E1D5] shadow-sm">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-[#E8E1D5]">
          <div className="w-9 h-9 rounded-xl bg-[#A63A28]/10 text-[#A63A28] flex items-center justify-center border border-[#A63A28]/20">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-2xl' : 'text-xl'}`}>找好日子</h2>
            <p className="text-xs text-[#736B63]">未來 {SEARCH_WINDOW_DAYS} 天內，農民曆列為「宜」的日期</p>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-3 pb-1">
          {ACTIONS.map((item) => {
            const Icon = item.icon;
            const isSelected = item.id === selectedId;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                id={`btn-finddays-${item.id}`}
                aria-pressed={isSelected}
                className={`shrink-0 flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                  isSelected ? 'bg-[#2C2C2C] text-white shadow-sm' : 'bg-white text-[#5C554E] border border-[#E8E1D5] hover:bg-[#FAF6F0]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {state === 'loading' && (
          <div className="bg-[#FDF9F3] rounded-2xl p-8 text-center text-[#736B63] border border-[#E8E1D5]">
            <Loader2 className="w-6 h-6 mx-auto text-[#A63A28] animate-spin mb-2" />
            <p>正在查詢「{selected.label}」的好日子…</p>
          </div>
        )}

        {state === 'error' && (
          <div className="bg-[#FDF9F3] rounded-2xl p-8 text-center text-[#736B63] border border-[#E8E1D5]">
            <AlertCircle className="w-8 h-8 mx-auto text-[#A63A28] opacity-60 mb-2" />
            <p>查詢時發生問題，請稍後再試一次。</p>
          </div>
        )}

        {state === 'success' && (
          <>
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-[#736B63]">
                「{selected.label}」未來 {SEARCH_WINDOW_DAYS} 天內共 {results.length} 個日子
              </span>
            </div>

            {allDaysUnavailable ? (
              <div className="bg-[#FDF9F3] rounded-2xl p-8 text-center text-[#736B63] border border-[#E8E1D5]">
                <CalendarDays className="w-8 h-8 mx-auto text-[#A63A28] opacity-40 mb-2" />
                <p className="font-semibold text-[#2C2C2C]">這段期間目前沒有農民曆資料可以查詢</p>
                <p className="text-xs mt-1">目前只收錄 2026 年全年資料，超出範圍暫時無法查詢。</p>
              </div>
            ) : results.length > 0 ? (
              results.map((day) => (
                <div
                  key={day.date}
                  className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm hover:border-[#A63A28]/40 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-[#E8E1D5]">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-2xl' : 'text-xl'}`}>{day.date}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#A63A28]/10 text-[#A63A28] font-semibold border border-[#A63A28]/20">
                          {day.weekday}
                        </span>
                      </div>
                      <div className="text-xs text-[#A63A28] font-semibold mt-0.5">農曆 {day.lunarDisplay}</div>
                    </div>
                    <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-[#EBF5ED] text-[#2E7D32] px-3 py-1.5 rounded-xl border border-[#C2E0C7]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-bold">農民曆列為宜</span>
                    </div>
                  </div>

                  <div className="py-3">
                    <p className={`text-[#5C554E] ${isElderMode ? 'text-base' : 'text-sm'}`}>
                      當日「宜」列有：{day.matchedGoodTerms.join('、')}
                    </p>
                    <p className="text-[11px] text-[#736B63] mt-1">資料來源：{day.primarySource}</p>
                  </div>

                  <div className="mt-1 pt-2.5 border-t border-[#E8E1D5] flex justify-end">
                    <button
                      onClick={() =>
                        onOpenShareModal({
                          title: `好日子：${day.date}`,
                          subtitle: `適合「${selected.label}」`,
                          primaryText: `${day.date}（${day.weekday}）`,
                          secondaryText: `農曆 ${day.lunarDisplay} · 農民曆列宜：${day.matchedGoodTerms.join('、')}`,
                          categoryName: selected.label,
                          style: 'cultural-minimal',
                        })
                      }
                      className="flex items-center space-x-1 text-xs text-[#736B63] hover:text-[#A63A28] font-medium min-h-[44px] px-2"
                      id={`btn-share-finddays-${day.date}`}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>分享這個好日子給親友</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#FDF9F3] rounded-2xl p-8 text-center text-[#736B63] border border-[#E8E1D5]">
                <CalendarDays className="w-8 h-8 mx-auto text-[#A63A28] opacity-40 mb-2" />
                <p className="font-semibold text-[#2C2C2C]">這段期間沒有查到明確列為「宜」的日期</p>
                <p className="text-xs mt-1">農民曆沒有特別把「{selected.label}」列為這段期間的宜行事項，不代表不能做。</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
