import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Scissors,
  Home as HomeIcon,
  Flame,
  Briefcase,
  Heart,
  Plane,
  Search,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import type { CalendarDay } from '../src/lib/calendar/types';
import type { Intent } from '../src/lib/rules/intents';
import { parseQuery } from '../src/lib/rules/queryParser';
import { calendarService } from '../src/services/appServices';
import { toDecisionViewModel } from '../src/viewmodels/decisionViewModel';
import type { DecisionViewModel } from '../src/viewmodels/types';

const choices: { id: string; label: string; query: string; intent: Intent; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'haircut', label: '剪頭髮', query: '今天可以剪頭髮嗎？', intent: 'HAIRCUT', icon: Scissors },
  { id: 'worship-praying', label: '拜拜', query: '今天可以拜拜嗎？', intent: 'WORSHIP', icon: Flame },
  { id: 'moving', label: '搬家', query: '今天適合搬家嗎？', intent: 'MOVE_HOME', icon: HomeIcon },
  { id: 'opening', label: '開工', query: '今天適合開工嗎？', intent: 'START_WORK', icon: Briefcase },
  { id: 'marriage', label: '結婚', query: '今天適合結婚嗎？', intent: 'MARRIAGE', icon: Heart },
  { id: 'travel', label: '出門', query: '今天適合出行嗎？', intent: 'TRAVEL', icon: Plane },
];

const STATUS_LABEL: Record<DecisionViewModel['status'], string> = {
  recommended: '適合',
  not_recommended: '較不建議',
  neutral: '普通',
  unknown: '目前無法判斷',
};

const STATUS_TONE: Record<DecisionViewModel['status'], { text: string; bg: string; Icon: React.ComponentType<{ className?: string }> }> = {
  recommended: { text: 'text-[#2E7D32]', bg: 'bg-[#EBF5ED]', Icon: CheckCircle2 },
  not_recommended: { text: 'text-[#A63A28]', bg: 'bg-[#FDF2F0]', Icon: XCircle },
  neutral: { text: 'text-[#5C554E]', bg: 'bg-[#F2EFE9]', Icon: ShieldAlert },
  unknown: { text: 'text-[#5C554E]', bg: 'bg-[#F2EFE9]', Icon: HelpCircle },
};

export function RealDecisionView({ selectedId, initialQuery, today, isElderMode, onBack }: { selectedId: string; initialQuery?: string; today?: CalendarDay; isElderMode?: boolean; onBack: () => void }) {
  const selected = choices.find((item) => item.id === selectedId) ?? choices[0];
  const [query, setQuery] = useState(initialQuery ?? selected.query);
  const [result, setResult] = useState<DecisionViewModel>();
  const [day, setDay] = useState<CalendarDay | null>(null);
  const [unsupported, setUnsupported] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [showAlmanac, setShowAlmanac] = useState(false);

  const run = async (text: string) => {
    const parsed = parseQuery(text, { baseDate: today?.date });
    if (!parsed.intent) {
      setUnsupported(true);
      setResult(undefined);
      setDay(null);
      return;
    }
    setUnsupported(false);
    setShowWhy(false);
    setShowAlmanac(false);
    const resolvedDay = parsed.date === today?.date ? today : (await calendarService.getDay(parsed.date)) ?? undefined;
    setDay(resolvedDay ?? null);
    setResult(toDecisionViewModel(parsed.intent, text, resolvedDay ?? null));
  };

  useEffect(() => {
    const text = initialQuery ?? selected.query;
    setQuery(text);
    void run(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, initialQuery, today?.date]);

  const ActiveIcon = choices.find((c) => c.intent === result?.intent)?.icon ?? HelpCircle;
  const tone = result ? STATUS_TONE[result.status] : STATUS_TONE.unknown;

  const almanacRows: { label: string; value?: string }[] = day
    ? [
        { label: '沖煞', value: day.clash },
        { label: '財神方位', value: day.wealthDirection },
        { label: '喜神方位', value: day.blessingDirection },
        { label: '吉時', value: day.luckyHours?.join('、') },
        { label: '干支', value: day.ganzhi },
        { label: '彭祖百忌', value: day.pengTaboo },
      ].filter((row) => row.value)
    : [];

  const chipSize = isElderMode ? 'px-4 py-3 text-base min-h-[52px]' : 'px-3 py-2.5 text-sm min-h-[44px]';

  return (
    <div className="space-y-4 pb-12">
      <div className="bg-[#FDF9F3] rounded-2xl p-4 border border-[#E8E1D5]">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2.5 rounded-lg bg-white border border-[#E8E1D5] min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="返回">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className={`font-serif-tc font-bold ${isElderMode ? 'text-2xl' : 'text-xl'}`}>生活決策速查</h1>
        </div>
        <div className="flex gap-2 overflow-x-auto mt-3 pb-1">
          {choices.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setQuery(item.query);
                void run(item.query);
              }}
              className={`shrink-0 rounded-xl border font-medium transition-colors ${chipSize} ${
                item.id === selected.id ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]' : 'bg-white border-[#E8E1D5] hover:border-[#A63A28]/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <details className="bg-[#FDF9F3] rounded-2xl border border-[#E8E1D5] group open:pb-2">
        <summary className="flex items-center gap-2 p-4 cursor-pointer select-none list-none">
          <Search className="w-4 h-4 text-[#736B63]" />
          <span className="text-sm text-[#5C554E]">想問別的？直接輸入問題</span>
          <ChevronDown className="w-4 h-4 text-[#736B63] ml-auto transition-transform group-open:rotate-180" />
        </summary>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run(query);
          }}
          className="flex gap-2 px-4"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-3 rounded-xl border border-[#E8E1D5] text-sm"
            placeholder="例如：今天可以剪頭髮嗎？"
          />
          <button className="px-4 rounded-xl bg-[#2C2C2C] text-white shrink-0">查詢</button>
        </form>
      </details>

      {unsupported ? (
        <div className="bg-[#FDF9F3] rounded-2xl p-6 border border-[#E8E1D5]">
          <HelpCircle className="w-8 h-8 text-[#A63A28]" />
          <h2 className="font-bold text-lg mt-2">這個問題目前還不支援</h2>
          <p className="text-sm text-[#736B63] mt-1">目前可查：剪頭髮、搬家、拜拜、開工、結婚、出行。</p>
        </div>
      ) : (
        result && (
          <div className="bg-[#FDF9F3] rounded-2xl p-6 border border-[#E8E1D5] shadow-sm">
            {/* A3：結果直接講答案 — icon + 大字狀態 + 一句話，不用先讀一堆黃曆欄位 */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${tone.bg}`}>
                <ActiveIcon className={`w-9 h-9 ${tone.text}`} />
              </div>
              <p className={`text-[#5C554E] ${isElderMode ? 'text-xl' : 'text-lg'}`}>今天{selected.label}</p>
              <p className={`font-serif-tc font-bold ${tone.text} ${isElderMode ? 'text-4xl' : 'text-3xl'}`}>{STATUS_LABEL[result.status]}</p>
              <p className={`text-[#2C2C2C] ${isElderMode ? 'text-xl' : 'text-lg'}`}>{result.explanation}</p>
            </div>

            {/* A4：「為什麼？」折疊 — 詳細來源與驗證資訊放進去，結果優先、資料其次 */}
            <details className="mt-5 pt-4 border-t border-[#E8E1D5]" open={showWhy} onToggle={(e) => setShowWhy((e.target as HTMLDetailsElement).open)}>
              <summary className="flex items-center gap-1.5 cursor-pointer select-none list-none text-sm font-semibold text-[#A63A28]">
                為什麼？
                <ChevronDown className={`w-4 h-4 transition-transform ${showWhy ? 'rotate-180' : ''}`} />
              </summary>
              <div className="mt-3 text-sm text-[#5C554E] space-y-1.5">
                <p>判斷基準：{result.primarySource}。</p>
                {result.verificationSources.length > 0 && <p>驗證來源：{result.verificationSources.join('、')}。</p>}
                {result.hasConflict && <p>不同曆法來源間存在不同說法，本站仍以主要來源為準，不混合判定。</p>}
              </div>
            </details>

            {/* A5：進階資料折疊 — 不刪除，移進「查看更多農民曆」，預設收起 */}
            {almanacRows.length > 0 && (
              <details className="mt-3 pt-3 border-t border-[#E8E1D5]" open={showAlmanac} onToggle={(e) => setShowAlmanac((e.target as HTMLDetailsElement).open)}>
                <summary className="flex items-center gap-1.5 cursor-pointer select-none list-none text-sm font-semibold text-[#2A5C8A]">
                  查看更多農民曆
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAlmanac ? 'rotate-180' : ''}`} />
                </summary>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {almanacRows.map((row) => (
                    <div key={row.label} className="flex flex-col">
                      <dt className="text-[#736B63] text-xs">{row.label}</dt>
                      <dd className="text-[#2C2C2C] font-medium">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}
          </div>
        )
      )}
    </div>
  );
}
