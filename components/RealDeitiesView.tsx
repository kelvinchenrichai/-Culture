import React, { useEffect, useState } from 'react';
import { Flame, Sparkles, ChevronDown, Share2, CalendarClock } from 'lucide-react';
import { DEITIES } from '../src/data/deities/deities';
import { calendarService } from '../src/services/appServices';
import { isTianSheDay, TIAN_SHE_DAY_EXPLANATION, findUpcomingSpecialDays, type UpcomingSpecialDay } from '../src/lib/calendar/specialDays';
import type { DeityDayEvent } from '../src/lib/calendar/types';
import type { TodayViewModel } from '../src/viewmodels/types';
import type { ShareCardData } from '../types';

/**
 * Part（「小節日」擴充）：這裡是這次改動的核心畫面。使用者的原話是「除了剪頭髮那天還有適合
 * 什麼事情⋯⋯我要的就是把那些可能平時不太會在意的、不會去拜拜的都提醒出來」——過去這頁只
 * 顯示「今天」的神明誕辰名稱（而且還要能對到 6 位精選神明才有連結可點），使用者完全看不到
 * LunarData 裡其實每天都有的完整節日內容，也看不到天赦日、也看不到接下來幾天有什麼日子。
 *
 * 這裡新增三塊、都直接讀取已經接上的真實資料，不生成任何新內容：
 *   1. 今天的完整節日/神明事件（deityDayEvents，含描述/祈求/宮廟），可展開、可分享。
 *   2. 天赦日提示（isTianSheDay + LunarData 自己算好的 goodDayGods，不是本站重算曆法）。
 *   3. 近期特殊日子（findUpcomingSpecialDays，未來 14 天內「有內容」的日子）。
 */

const DATA_SOURCE_NOTE = '資料來源：LunarData（農民曆節日/神明資料庫）';

function DeityEventCard({
  event,
  onShare,
}: {
  event: DeityDayEvent;
  onShare?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hasDetail = Boolean(event.description || event.blessing || event.temple || event.note);
  return (
    <div className="rounded-xl bg-white border border-[#E8E1D5] overflow-hidden">
      <button
        onClick={() => hasDetail && setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 p-4 text-left"
      >
        <div className="min-w-0">
          <strong className="text-[#2C2C2C] block truncate">{event.eventName}</strong>
          {event.title && <p className="text-xs text-[#736B63] mt-0.5 truncate">{event.title}</p>}
        </div>
        {hasDetail && (
          <ChevronDown className={`w-4 h-4 shrink-0 text-[#736B63] transition-transform ${open ? 'rotate-180' : ''}`} />
        )}
      </button>
      {open && hasDetail && (
        <div className="px-4 pb-4 space-y-2 text-sm text-[#5C554E] border-t border-[#F0EBE1] pt-3">
          {event.lunarDate && <p className="text-xs text-[#736B63]">{event.lunarDate}</p>}
          {event.description && <p className="leading-relaxed">{event.description}</p>}
          {event.blessing && (
            <p className="leading-relaxed">
              <span className="font-semibold text-[#A63A28]">常見祈求：</span>
              {event.blessing}
            </p>
          )}
          {event.temple && (
            <p className="leading-relaxed">
              <span className="font-semibold text-[#A63A28]">供奉場所：</span>
              {event.temple}
            </p>
          )}
          {event.note && <p className="text-xs text-[#736B63] leading-relaxed">{event.note}</p>}
          <p className="text-[10px] text-[#A39B90] pt-1">{DATA_SOURCE_NOTE}</p>
        </div>
      )}
      {onShare && (
        <button
          onClick={onShare}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-[#A63A28] bg-[#FFF8E8]/60 border-t border-[#F0EBE1] hover:bg-[#FFF8E8]"
        >
          <Share2 className="w-3.5 h-3.5" />
          分享這個日子給親友
        </button>
      )}
    </div>
  );
}

export function RealDeitiesView({
  today,
  onSelect,
  onOpenShareModal,
}: {
  today: TodayViewModel;
  onSelect: (id: string) => void;
  onOpenShareModal?: (data: Partial<ShareCardData>) => void;
}) {
  const dev = import.meta.env.DEV;
  const [upcoming, setUpcoming] = useState<UpcomingSpecialDay[] | 'loading' | 'error'>('loading');

  useEffect(() => {
    if (today.state !== 'success') return;
    let active = true;
    setUpcoming('loading');
    findUpcomingSpecialDays(calendarService, today.date.iso, 14)
      .then((days) => {
        if (active) setUpcoming(days.filter((d) => d.date !== today.date.iso));
      })
      .catch(() => {
        if (active) setUpcoming('error');
      });
    return () => {
      active = false;
    };
  }, [today.date.iso, today.state]);

  const tianShe = today.calendarDay ? isTianSheDay(today.calendarDay) : false;
  // 注意跟舊版 fallback（today.deityBirthdays）分開判斷：rawEvents 才是「有沒有完整資料可用」，
  // todayEvents 是「扣掉天赦日banner已經講過的重複卡片之後還剩下什麼可以列」——如果只用
  // todayEvents.length 去決定要不要退回舊版名字清單，天赦日當天（唯一事件就是「天赦日」本身）
  // 過濾完會變成 0，就會誤退回舊清單、重複顯示一次沒有展開/分享功能的「天赦日」純文字。
  const rawEvents = today.calendarDay?.deityDayEvents;
  // 天赦日banner已經完整說明過了，下面事件列表就不用再重複列一次同名的「天赦日」卡片。
  const todayEvents = (rawEvents ?? []).filter((event) => !(tianShe && event.eventName === '天赦日'));

  const shareEvent = (event: DeityDayEvent) => {
    if (!onOpenShareModal) return;
    onOpenShareModal({
      title: event.deityName ? `${event.eventName} · ${event.deityName}` : event.eventName,
      subtitle: event.title,
      primaryText: event.description || `今天是${event.eventName}，別忘了留意這個平常容易錯過的日子。`,
      secondaryText: [event.blessing && `常見祈求：${event.blessing}`, event.temple && `供奉場所：${event.temple}`]
        .filter(Boolean)
        .join('；'),
      style: 'deity-blessing',
    });
  };

  const shareTianShe = () => {
    if (!onOpenShareModal) return;
    onOpenShareModal({
      title: '天赦日',
      subtitle: `${today.date.solarDisplay} · 農曆 ${today.date.lunarDisplay}`,
      primaryText: TIAN_SHE_DAY_EXPLANATION,
      style: 'deity-blessing',
    });
  };

  const shareUpcoming = (day: UpcomingSpecialDay) => {
    if (!onOpenShareModal) return;
    const tags = [day.isTianShe && '天赦日', ...day.deityEvents.map((e) => e.eventName)].filter(Boolean).join('、');
    onOpenShareModal({
      title: `${day.date}（${day.weekday}）`,
      subtitle: `農曆 ${day.lunarDisplay}`,
      primaryText: tags || '值得留意的日子',
      secondaryText: day.isTianShe ? TIAN_SHE_DAY_EXPLANATION : undefined,
      style: 'deity-blessing',
    });
  };

  return (
    <div className="space-y-4 pb-12">
      <section className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5]">
        <div className="flex items-center gap-2">
          <Flame className="text-[#A63A28]" />
          <h1 className="font-serif-tc font-bold text-xl">今天拜什麼？</h1>
        </div>

        {tianShe && (
          <div className="mt-4 p-4 rounded-xl bg-[#FFF8E8] border border-[#F2D98A]">
            <div className="flex items-center gap-2 text-[#7A5A13] font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              今天是天赦日
            </div>
            <p className="text-xs text-[#7A5A13]/90 mt-1.5 leading-relaxed">{TIAN_SHE_DAY_EXPLANATION}</p>
            {onOpenShareModal && (
              <button
                onClick={shareTianShe}
                className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#7A5A13] px-3 py-1.5 rounded-lg bg-white/70 border border-[#F2D98A]"
              >
                <Share2 className="w-3.5 h-3.5" />
                分享天赦日
              </button>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-[#E8E1D5] space-y-2.5">
          {today.state !== 'success' ? (
            <p>今日資料暫時無法取得，請稍後再試。</p>
          ) : todayEvents.length ? (
            todayEvents.map((event) => (
              <DeityEventCard
                key={event.eventName}
                event={event}
                onShare={onOpenShareModal ? () => shareEvent(event) : undefined}
              />
            ))
          ) : rawEvents !== undefined ? (
            // rawEvents 有資料（表示今天走的是新版完整資料源），只是唯一的事件剛好就是天赦日本身，
            // 已經在上面 banner 顯示過了，這裡不用再退回舊版名字清單重複顯示一次。
            tianShe ? null : <p className="text-[#5C554E]">今天沒有查到主要神明聖誕或節日。</p>
          ) : today.deityBirthdays.length ? (
            today.deityBirthdays.map((event) => (
              <button
                key={event.name}
                disabled={!event.id}
                onClick={() => event.id && onSelect(event.id)}
                className="block w-full text-left p-4 rounded-xl bg-white border border-[#E8E1D5]"
              >
                <strong>{event.name}</strong>
                {dev && <span className="ml-2 text-[10px]">{event.dataStatus.toUpperCase()}</span>}
              </button>
            ))
          ) : (
            <p className="text-[#5C554E]">今天沒有查到主要神明聖誕或節日。</p>
          )}
        </div>
      </section>

      <section className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5]">
        <div className="flex items-center gap-2">
          <CalendarClock className="text-[#A63A28]" />
          <h2 className="font-serif-tc font-bold text-lg">近期特殊日子</h2>
        </div>
        <p className="text-xs text-[#736B63] mt-1">
          平常容易錯過的神明聖誕、節日、天赦日，提前 14 天幫你留意。
        </p>
        <div className="mt-3 space-y-2">
          {upcoming === 'loading' && <p className="text-sm text-[#736B63]">讀取中…</p>}
          {upcoming === 'error' && <p className="text-sm text-[#736B63]">暫時無法取得近期資料。</p>}
          {Array.isArray(upcoming) &&
            (upcoming.length ? (
              upcoming.map((day) => (
                <div key={day.date} className="rounded-xl bg-white border border-[#E8E1D5] p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs text-[#736B63]">
                        {day.date}（{day.weekday}）· 農曆 {day.lunarDisplay}
                      </div>
                      <div className="text-sm font-semibold text-[#2C2C2C] mt-0.5 truncate">
                        {[day.isTianShe && '天赦日', ...day.deityEvents.map((e) => e.eventName)]
                          .filter(Boolean)
                          .join('、')}
                      </div>
                    </div>
                    {onOpenShareModal && (
                      <button
                        onClick={() => shareUpcoming(day)}
                        aria-label={`分享 ${day.date}`}
                        className="shrink-0 p-2 rounded-lg bg-[#FFF8E8]/60 text-[#A63A28] border border-[#F0EBE1]"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#736B63]">接下來 14 天內沒有特別記載的節日或天赦日。</p>
            ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif-tc font-bold text-lg px-1 mb-3">認識更多神明</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DEITIES.map((deity) => (
            <button
              key={deity.id}
              onClick={() => onSelect(deity.id)}
              className="text-left bg-[#FDF9F3] rounded-2xl p-4 border border-[#E8E1D5]"
            >
              <strong className="text-[#2C2C2C]">{deity.name}</strong>
              <p className="text-xs text-[#736B63] mt-1">{deity.aliases.join('、')}</p>
              {dev && (
                <span className="inline-block mt-2 text-[10px] px-2 py-1 rounded-full bg-[#FFF8E8]">
                  {deity.dataStatus.toUpperCase()}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
