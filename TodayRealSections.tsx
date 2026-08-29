import React, { useState } from 'react';
import { AlertCircle, CalendarDays, CheckCircle2, ChevronDown, Flame, Search, Sparkles, XCircle } from 'lucide-react';
import type { TodayViewModel } from '../src/viewmodels/types';
export function TodayRealSections({ today, isElderMode, onQuery, onDecision, onDeities }: { today: TodayViewModel; isElderMode: boolean; onQuery: (query: string) => void; onDecision: (label: string) => void; onDeities: () => void }) {
  const [query, setQuery] = useState('');
  if (today.state !== 'success') return <div className="bg-[#FDF9F3] rounded-2xl p-8 border border-[#E8E1D5] text-center"><CalendarDays className={`w-8 h-8 mx-auto text-[#A63A28] ${today.state === 'loading' ? 'animate-pulse' : ''}`} /><h2 className="font-serif-tc font-bold text-xl mt-3">{today.summary.title}</h2><p className="text-base text-[#736B63] mt-1">{today.summary.description}</p></div>;
  const dev = import.meta.env.DEV;
  // A1：簡易模式第一屏只優先回答「今天幾號？農曆幾號？」，把細節（衝突提示等）留給一般模式。
  return <>
    <section className="bg-[#FDF9F3] rounded-2xl p-5 md:p-6 border border-[#E8E1D5] shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#A63A28] via-[#D49B44] to-[#A63A28]" />
      {dev && <span className="absolute right-4 top-4 text-[10px] px-2 py-1 rounded-full bg-[#EBF5ED] text-[#2E7D32] font-bold">REAL</span>}
      <div className="pb-4 border-b border-[#E8E1D5]"><div className="flex flex-wrap items-center gap-2"><h1 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-4xl' : 'text-2xl'}`}>{today.date.solarDisplay}</h1><span className={`px-2.5 py-0.5 rounded-full bg-[#A63A28]/10 text-[#A63A28] font-semibold ${isElderMode ? 'text-base' : 'text-sm'}`}>{today.date.weekday}</span></div><p className={`font-serif-tc font-semibold text-[#A63A28] mt-1.5 ${isElderMode ? 'text-2xl' : 'text-base'}`}>農曆 {today.date.lunarDisplay}</p></div>
      <div className="py-4"><div className="flex items-start gap-2"><Sparkles className="w-5 h-5 text-[#D49B44] mt-0.5"/><div><h2 className={`font-serif-tc font-bold ${isElderMode ? 'text-xl' : 'text-lg'}`}>{today.summary.title}</h2><p className={`text-[#5C554E] mt-1 ${isElderMode ? 'text-lg' : 'text-sm'}`}>{today.summary.description}</p></div></div>{today.source.hasConflict && !isElderMode && <div className="mt-3 flex gap-2 p-2.5 rounded-xl bg-[#FFF8E8] text-[#7A5A13] text-xs"><AlertCircle className="w-4 h-4 shrink-0"/><span>不同曆法來源有不同說法；本站日常判斷仍依 LunarData，其他來源只作驗證。</span></div>}</div>
    </section>
    {/* A6：搜尋框在簡易模式降低優先，收進折疊區，避免長輩第一眼被輸入框卡住 */}
    <details className="bg-[#FDF9F3] rounded-2xl border border-[#E8E1D5] shadow-sm" open={!isElderMode}>
      <summary className="flex items-center gap-2 p-4 cursor-pointer select-none list-none">
        <Search className="w-4 h-4 text-[#736B63]" />
        <span className="font-serif-tc font-bold text-[#2C2C2C]">我想查事情</span>
        <ChevronDown className="w-4 h-4 text-[#736B63] ml-auto" />
      </summary>
      <form onSubmit={e => { e.preventDefault(); if (query.trim()) onQuery(query.trim()); }} className="px-4 pb-4"><div className="flex gap-2"><div className="relative flex-1"><Search className="absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 text-[#736B63]"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="例如：今天可以剪頭髮嗎？" className="w-full pl-9 pr-3 py-3 rounded-xl bg-white border border-[#E8E1D5] text-base focus:outline-none focus:border-[#A63A28]" id="input-rule-query"/></div><button className="px-4 rounded-xl bg-[#A63A28] text-white font-semibold text-sm min-h-[44px]" id="btn-rule-query">查詢</button></div><p className="text-[11px] text-[#736B63] mt-2">支援剪頭髮、搬家、拜拜、開工、結婚、出行，以及今天／明天／後天。</p></form>
    </details>
    {!isElderMode && <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ActionList title="今天適合" icon={<CheckCircle2 className="w-5 h-5 text-[#2E7D32]"/>} actions={today.goodActions} empty="今日沒有列出宜事項" onDecision={onDecision}/>
      <ActionList title="今天不建議" icon={<XCircle className="w-5 h-5 text-[#A63A28]"/>} actions={today.badActions} empty="今日沒有列出忌事項" onDecision={onDecision}/>
    </section>}
    {!isElderMode && <section className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Flame className="w-5 h-5 text-[#A63A28]"/><h2 className="font-serif-tc font-bold text-lg">今天拜什麼？</h2></div><button onClick={onDeities} className="text-xs text-[#A63A28] font-semibold">查看神明資料</button></div><div className="mt-3 pt-3 border-t border-[#E8E1D5]">{today.deityBirthdays.length ? today.deityBirthdays.map(item => <div key={item.name} className="p-3 rounded-xl bg-white border border-[#E8E1D5]"><strong>{item.name}</strong>{dev && <span className="ml-2 text-[10px] text-[#736B63]">{item.dataStatus.toUpperCase()}</span>}</div>) : <p className="text-sm text-[#5C554E]">今天沒有查到主要神明聖誕。</p>}</div></section>}
  </>;
}
function ActionList({ title, icon, actions, empty, onDecision }: { title: string; icon: React.ReactNode; actions: { id: string; label: string }[]; empty: string; onDecision: (label: string) => void }) { return <div className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm"><div className="flex items-center gap-2 pb-3 border-b border-[#E8E1D5]">{icon}<h2 className="font-serif-tc font-bold text-lg">{title}</h2></div><div className="flex flex-wrap gap-2 mt-4">{actions.length ? actions.map(action => <button key={action.id} onClick={() => onDecision(action.label)} className="px-3 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-sm hover:border-[#A63A28]/50 min-h-[44px]">{action.label}</button>) : <p className="text-sm text-[#736B63]">{empty}</p>}</div></div>; }
