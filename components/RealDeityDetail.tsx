import React from 'react'; import { ArrowLeft, Flame, CheckCircle2, Info } from 'lucide-react'; import { DEITIES } from '../src/data/deities/deities'; import { findDeityProfile } from '../src/data/deities/deityProfiles'; import type { ProvenancedField } from '../src/lib/provenance/types';

/** Part F：欄位級 provenance 徽章。verified 用綠色打勾，sample/placeholder 用中性色標「民間習俗」，不混為一談。 */
function ProvenanceRow({ label, field }: { label: string; field: ProvenancedField<string | string[]> }) {
  const display = Array.isArray(field.value) ? field.value.join('、') : field.value;
  const isVerified = field.status === 'verified';
  return (
    <div className="p-3 rounded-xl bg-white border border-[#E8E1D5]">
      <div className="flex items-center justify-between gap-2">
        <dt className="text-xs font-semibold text-[#736B63]">{label}</dt>
        <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${isVerified ? 'bg-[#EBF5ED] text-[#2E7D32] border border-[#2E7D32]/25' : 'bg-[#F2EFE9] text-[#736B63] border border-[#E8E1D5]'}`}>
          {isVerified ? <CheckCircle2 className="w-3 h-3" /> : <Info className="w-3 h-3" />}
          {isVerified ? '已核實' : '民間習俗整理'}
        </span>
      </div>
      <dd className="text-sm text-[#2C2C2C] mt-1">{display}</dd>
      {field.sources.length > 0 && (
        <p className="text-[10px] text-[#736B63] mt-1">來源：{field.sources.map((s) => s.publisher ?? s.title).join('、')}</p>
      )}
    </div>
  );
}

export function RealDeityDetail({ deityId, onBack, onTemples }: { deityId: string; onBack: () => void; onTemples: (query?: string) => void }) { const deity = DEITIES.find(item => item.id === deityId); const profile = findDeityProfile(deityId); if (!deity) return <div className="bg-[#FDF9F3] rounded-2xl p-6 border">目前沒有這筆神明資料。</div>; return <div className="space-y-4 pb-12"><section className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5]"><button onClick={onBack} className="text-sm text-[#736B63] flex items-center gap-1"><ArrowLeft className="w-4 h-4"/>返回今天拜什麼</button><div className="flex items-center gap-3 mt-4"><Flame className="w-8 h-8 text-[#A63A28]"/><div><h1 className="font-serif-tc font-bold text-2xl">{deity.name}</h1><p className="text-sm text-[#736B63]">{deity.aliases.join('、')}</p></div>{import.meta.env.DEV && <span className="ml-auto text-[10px] px-2 py-1 rounded-full bg-[#FFF8E8]">{deity.dataStatus.toUpperCase()}</span>}</div></section><section className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5]"><h2 className="font-serif-tc font-bold">目前可確認的資料欄位</h2><dl className="mt-3 space-y-3 text-sm"><div><dt className="text-[#736B63]">常見祈求</dt><dd>{deity.whatFor.join('、')}</dd></div><div><dt className="text-[#736B63]">常見供品（內容種子，正式上線前仍需編輯驗證）</dt><dd>{deity.offerings.join('、')}</dd></div><div><dt className="text-[#736B63]">農曆紀念日</dt><dd>{deity.lunarBirthdays.join('、')}</dd></div></dl><p className="text-xs text-[#A63A28] mt-4">此資料目前為 {deity.dataStatus}，未顯示未驗證的神蹟、禁忌或特殊斷言。</p><button onClick={() => onTemples(deity.name)} className="mt-4 px-4 py-2.5 rounded-xl bg-[#2C2C2C] text-white text-sm">查看相關寺廟樣本</button></section>{profile && <section className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5]"><h2 className="font-serif-tc font-bold">逐欄位資料來源（Part F）</h2><p className="text-xs text-[#736B63] mt-1 mb-3">「已核實」代表這個欄位有具體引用來源；「民間習俗整理」代表這是廣泛流傳的說法，沒有單一權威文獻，並不是不可信，只是不能當成官方認證的事實。</p><dl className="space-y-2"><ProvenanceRow label="正式名稱" field={profile.name} /><ProvenanceRow label="別稱" field={profile.aliases} /><ProvenanceRow label="農曆紀念日" field={profile.birthday} /><ProvenanceRow label="信仰內涵" field={profile.beliefs} /><ProvenanceRow label="常見祈求" field={profile.commonPrayers} /><ProvenanceRow label="文化背景" field={profile.culturalBackground} /></dl></section>}</div>; }
