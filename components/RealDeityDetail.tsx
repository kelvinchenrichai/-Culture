import React from 'react'; import { ArrowLeft, Flame, CheckCircle2, Info, Share2 } from 'lucide-react'; import { DEITIES } from '../src/data/deities/deities'; import { findDeityProfile } from '../src/data/deities/deityProfiles'; import type { ProvenancedField } from '../src/lib/provenance/types'; import type { DeityDateEvent } from '../src/lib/deities/deityProfile'; import type { ShareCardData } from '../types';

/** Part：內部資料狀態代碼（sample/placeholder/verified）不能直接印給使用者看，這裡統一轉成白話說法。 */
const DATA_STATUS_LABEL: Record<string, string> = {
  verified: '已逐項查證',
  sample: '初步整理，尚未逐項查證',
  placeholder: '資料仍在補充中',
};

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

/** Part：紀念日期可能不只一個（聖誕／飛昇／得道），逐筆列出，跟其他單值欄位分開處理。 */
function DatesRow({ field }: { field: ProvenancedField<DeityDateEvent[]> }) {
  const isVerified = field.status === 'verified';
  return (
    <div className="p-3 rounded-xl bg-white border border-[#E8E1D5]">
      <div className="flex items-center justify-between gap-2">
        <dt className="text-xs font-semibold text-[#736B63]">農曆紀念日</dt>
        <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${isVerified ? 'bg-[#EBF5ED] text-[#2E7D32] border border-[#2E7D32]/25' : 'bg-[#F2EFE9] text-[#736B63] border border-[#E8E1D5]'}`}>
          {isVerified ? <CheckCircle2 className="w-3 h-3" /> : <Info className="w-3 h-3" />}
          {isVerified ? '已核實' : '民間習俗整理'}
        </span>
      </div>
      <dd className="text-sm text-[#2C2C2C] mt-1 space-y-0.5">
        {field.value.map((event, i) => (
          <div key={i}>
            {event.label}：農曆{event.lunarDate}
            {event.regionalVariation && <span className="text-[#A63A28]">（不同地區/廟宇可能採用不同日期）</span>}
          </div>
        ))}
      </dd>
      {field.sources.length > 0 && (
        <p className="text-[10px] text-[#736B63] mt-1">來源：{field.sources.map((s) => s.publisher ?? s.title).join('、')}</p>
      )}
    </div>
  );
}

export function RealDeityDetail({ deityId, onBack, onTemples, onOpenShareModal }: { deityId: string; onBack: () => void; onTemples: (query?: string) => void; onOpenShareModal?: (data: Partial<ShareCardData>) => void }) {
  const deity = DEITIES.find(item => item.id === deityId);
  const profile = findDeityProfile(deityId);
  if (!deity) return <div className="bg-[#FDF9F3] rounded-2xl p-6 border">目前沒有這筆神明資料。</div>;

  // Part：dates 有 provenance/verified 版本時，優先用它當「主要紀念日顯示」，避免上面顯示未附來源的舊猜測、
  // 下面又顯示一次附來源的正確版本，兩邊互相矛盾。
  const primaryDatesLine = profile?.dates?.value?.length
    ? profile.dates.value.map(e => `${e.label}：農曆${e.lunarDate}${e.regionalVariation ? '（不同地區/廟宇可能採用不同日期）' : ''}`).join('；')
    : deity.lunarBirthdays.join('、');

  const handleShare = () => {
    if (!onOpenShareModal) return;
    onOpenShareModal({
      title: `${deity.name} · 慈悲庇佑`,
      subtitle: deity.whatFor.join('、'),
      primaryText: `農曆紀念日：${primaryDatesLine}`,
      secondaryText: `常見祈求：${deity.whatFor.join('、')}；常見供品：${deity.offerings.join('、')}`,
      style: 'deity-blessing',
    });
  };

  return <div className="space-y-4 pb-12">
    <section className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5]">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-[#736B63] flex items-center gap-1"><ArrowLeft className="w-4 h-4"/>返回今天拜什麼</button>
        {onOpenShareModal && <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#A63A28]/10 text-[#A63A28] border border-[#A63A28]/20 hover:bg-[#A63A28]/15 text-xs font-semibold" id="btn-share-deity">
          <Share2 className="w-3.5 h-3.5" /><span>分享這位神明</span>
        </button>}
      </div>
      <div className="flex items-center gap-3 mt-4"><Flame className="w-8 h-8 text-[#A63A28]"/><div><h1 className="font-serif-tc font-bold text-2xl">{deity.name}</h1><p className="text-sm text-[#736B63]">{deity.aliases.join('、')}</p></div>{import.meta.env.DEV && <span className="ml-auto text-[10px] px-2 py-1 rounded-full bg-[#FFF8E8]">{deity.dataStatus.toUpperCase()}</span>}</div>
    </section>
    <section className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5]">
      <h2 className="font-serif-tc font-bold">目前可確認的資料欄位</h2>
      <dl className="mt-3 space-y-3 text-sm">
        <div><dt className="text-[#736B63]">常見祈求</dt><dd>{deity.whatFor.join('、')}</dd></div>
        <div><dt className="text-[#736B63]">常見供品</dt><dd>{deity.offerings.join('、')}</dd></div>
        {!profile?.dates && <div><dt className="text-[#736B63]">農曆紀念日</dt><dd>{primaryDatesLine}</dd></div>}
      </dl>
      <p className="text-xs text-[#A63A28] mt-4">以上資料目前為「{DATA_STATUS_LABEL[deity.dataStatus] ?? deity.dataStatus}」階段，暫不顯示未驗證的神蹟、禁忌或特殊斷言。</p>
      <button onClick={() => onTemples(deity.name)} className="mt-4 px-4 py-2.5 rounded-xl bg-[#2C2C2C] text-white text-sm">查看相關寺廟樣本</button>
    </section>
    {profile && <section className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5]">
      <h2 className="font-serif-tc font-bold">逐欄位資料來源（Part F）</h2>
      <p className="text-xs text-[#736B63] mt-1 mb-3">「已核實」代表這個欄位有具體引用來源；「民間習俗整理」代表這是廣泛流傳的說法，沒有單一權威文獻，並不是不可信，只是不能當成官方認證的事實。</p>
      <dl className="space-y-2">
        <ProvenanceRow label="正式名稱" field={profile.name} />
        <ProvenanceRow label="別稱" field={profile.aliases} />
        <DatesRow field={profile.dates} />
        <ProvenanceRow label="信仰內涵" field={profile.beliefs} />
        <ProvenanceRow label="常見祈求" field={profile.commonPrayers} />
        <ProvenanceRow label="文化背景" field={profile.culturalBackground} />
      </dl>
    </section>}
  </div>;
}
