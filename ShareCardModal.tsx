import React, { useState } from 'react';
import { ShareCardData, ShareCardStyle } from '../types';
import { TODAY_INFO } from '../data/mockData';
import type { TodayViewModel } from '../src/viewmodels/types';
import {
  X,
  Share2,
  Copy,
  Download,
  Check,
  Sparkles,
  Heart,
  Flame,
  CheckCircle2,
  Sun
} from 'lucide-react';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<ShareCardData>;
  isElderMode: boolean;
  today: TodayViewModel;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  initialData,
  isElderMode,
  today,
}) => {
  if (!isOpen) return null;

  const [activeStyle, setActiveStyle] = useState<ShareCardStyle>(
    initialData?.style || 'cultural-minimal'
  );
  const [activeTheme, setActiveTheme] = useState<'paper' | 'vermilion' | 'dark' | 'green'>('paper');
  const [copiedToast, setCopiedToast] = useState(false);
  const [customBlessing, setCustomBlessing] = useState('祝你今天事事順心，平安喜樂！');

  const handleCopyText = () => {
    const text = today.state === 'success' ? `【今日好日 · 民俗生活指南】\n📅 國曆 ${today.date.solarDisplay} (${today.date.weekday}) · 農曆 ${today.date.lunarDisplay}\n🌸 宜：${today.goodActions.map(a => a.label).join('、') || '無明確記載'}\n⚠️ 忌：${today.badActions.map(a => a.label).join('、') || '無明確記載'}\n${customBlessing}\n\n資料依據：${today.source.primarySource}` : '今日資料暫時無法取得，請稍後再試。';
    navigator.clipboard?.writeText?.(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleShareLine = () => {
    const text = `【今日好日】${today.date.solarDisplay} · 農曆${today.date.lunarDisplay}\n${customBlessing}`;
    const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" role="dialog" aria-modal="true" aria-label="製作分享卡">
      <div className="bg-[#FDF9F3] w-full max-w-lg rounded-3xl p-5 md:p-6 border border-[#E8E1D5] shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="關閉"
          className="absolute right-4 top-4 p-2 rounded-full bg-white text-[#736B63] hover:text-[#2C2C2C] hover:bg-[#FAF6F0] border border-[#E8E1D5] transition-colors min-w-[40px] min-h-[40px]"
          id="btn-close-share-modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2 pb-3 border-b border-[#E8E1D5]">
          <div className="w-8 h-8 rounded-lg bg-[#A63A28]/10 text-[#A63A28] flex items-center justify-center border border-[#A63A28]/20">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif-tc font-bold text-lg text-[#2C2C2C]">
              製作今日生活分享卡
            </h3>
            <p className="text-xs text-[#736B63]">
              長輩喜歡轉傳 LINE、年輕人發 IG 限動都不嫌俗的精美卡片
            </p>
          </div>
        </div>

        {/* Style Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 my-3">
          {[
            { id: 'cultural-minimal' as ShareCardStyle, label: '今日宜忌卡' },
            { id: 'daily-quote' as ShareCardStyle, label: '生活一句卡' },
            { id: 'deity-blessing' as ShareCardStyle, label: '神明祝壽卡' },
            { id: 'decision-ticket' as ShareCardStyle, label: '生活決策卡' },
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => setActiveStyle(style.id)}
              className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                activeStyle === style.id
                  ? 'bg-[#2C2C2C] text-white shadow-xs'
                  : 'bg-white text-[#5C554E] border border-[#E8E1D5] hover:bg-[#FAF6F0]'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>

        {/* Theme Selector */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xs text-[#736B63] font-medium">卡片色系：</span>
          {[
            { id: 'paper', name: '米白宣紙', bg: 'bg-[#FAF6F0] border-[#E8E1D5]' },
            { id: 'vermilion', name: '朱砂暖紅', bg: 'bg-[#FFF5F2] border-[#F2C0B8]' },
            { id: 'dark', name: '墨色典雅', bg: 'bg-[#22201E] border-[#403B37] text-[#FAF6F0]' },
            { id: 'green', name: '青竹常安', bg: 'bg-[#F2F7F3] border-[#CDE3D1]' },
          ].map((th) => (
            <button
              key={th.id}
              onClick={() => setActiveTheme(th.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                activeTheme === th.id
                  ? 'ring-2 ring-[#A63A28] scale-105 ' + th.bg
                  : th.bg + ' opacity-70'
              }`}
            >
              {th.name}
            </button>
          ))}
        </div>

        {/* Live Card Preview Box */}
        <div
          className={`rounded-2xl p-6 border shadow-md transition-all relative overflow-hidden ${
            activeTheme === 'paper'
              ? 'bg-white text-[#2C2C2C] border-[#E8E1D5]'
              : activeTheme === 'vermilion'
              ? 'bg-gradient-to-br from-[#FFF5F2] to-[#FCECE8] text-[#2C2C2C] border-[#F2C0B8]'
              : activeTheme === 'dark'
              ? 'bg-[#22201E] text-[#FAF6F0] border-[#38332E]'
              : 'bg-[#F2F7F3] text-[#2C2C2C] border-[#CDE3D1]'
          }`}
        >
          {/* Subtle Watermark seal */}
          <div className="absolute right-3 top-3 opacity-15 pointer-events-none select-none">
            <span className="font-serif-tc font-bold text-5xl">吉</span>
          </div>

          {/* 1. Cultural Minimal (今日宜忌卡) */}
          {activeStyle === 'cultural-minimal' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-current/15 pb-3">
                <div>
                  <div className="text-xs opacity-70">
                    {today.date.solarDisplay} · {today.date.weekday}
                  </div>
                  <div className="font-serif-tc font-bold text-lg text-[#A63A28]">
                    農曆 {today.date.lunarDisplay}
                  </div>
                </div>
                <div className="seal-stamp-filled text-xs px-2.5 py-1">
                  今日參考
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded bg-[#EBF5ED] text-[#2E7D32] flex items-center justify-center font-bold text-xs shrink-0">
                    宜
                  </span>
                  <span className="text-xs font-semibold leading-relaxed">
                    {today.goodActions.map((a) => a.label).join(' · ') || '無明確記載'}
                  </span>
                </div>

                <div className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded bg-[#A63A28]/10 text-[#A63A28] flex items-center justify-center font-bold text-xs shrink-0">
                    忌
                  </span>
                  <span className="text-xs opacity-80 leading-relaxed">
                    {today.badActions.map((a) => a.label).join(' · ') || '無明確記載'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-current/15 text-xs italic font-serif-tc opacity-90">
                {TODAY_INFO.emotionalQuote.content}
              </div>
            </div>
          )}

          {/* 2. Daily Quote (今日生活一句卡) */}
          {activeStyle === 'daily-quote' && (
            <div className="space-y-4 text-center py-2">
              <div className="inline-block px-3 py-1 rounded-full bg-current/10 text-xs font-serif-tc font-bold">
                今日好日 · 日曆手撕箋
              </div>

              <div className="font-serif-tc text-2xl font-bold">
                {today.date.solarDisplay}
              </div>

              <div className="text-xs opacity-70">
                農曆 {today.date.lunarDisplay}
              </div>

              <div className="p-4 rounded-xl bg-current/5 border border-current/10 my-2">
                <p className="font-serif-tc text-lg font-bold leading-relaxed">
                  {TODAY_INFO.emotionalQuote.content}
                </p>
                <p className="text-xs opacity-75 mt-2">
                  {TODAY_INFO.emotionalQuote.subtext}
                </p>
              </div>

              <div className="text-xs opacity-75">{customBlessing}</div>
            </div>
          )}

          {/* 3. Deity Birthday / Blessing (神明生日祝福卡) */}
          {activeStyle === 'deity-blessing' && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-[#A63A28]" />
                <span className="font-serif-tc font-bold text-sm">
                  {initialData?.title || '福德正神（土地公）· 慈悲護佑'}
                </span>
              </div>

              <div className="font-serif-tc font-bold text-xl leading-tight">
                {initialData?.primaryText || '保佑闔家安康、出入平安、財運亨通'}
              </div>

              <p className="text-xs opacity-80 leading-relaxed">
                {initialData?.secondaryText ||
                  '農曆初二、十六作牙吉日。心誠則靈，常念善心，平安自來。'}
              </p>

              <div className="pt-3 border-t border-current/15 flex items-center justify-between text-[11px] opacity-75">
                <span>今日好日 · 敬神祈福指南</span>
                <span>祝你平安喜樂</span>
              </div>
            </div>
          )}

          {/* 4. Decision Ticket (生活決策票根卡) */}
          {activeStyle === 'decision-ticket' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-dashed border-current/25 pb-2.5">
                <span className="font-bold text-xs">生活決策通行證</span>
                <span className="text-[10px] uppercase font-mono tracking-wider">
                  TODAY PASS
                </span>
              </div>

              <div className="text-center py-2">
                <div className="text-xs opacity-75">{initialData?.title || '今天可以剪頭髮嗎？'}</div>
                <div className="font-serif-tc font-bold text-3xl text-[#2E7D32] my-1">
                  {initialData?.primaryText ? initialData.primaryText.split('！')[0] : '適合！大吉'}
                </div>
                <p className="text-xs opacity-85 mt-1">
                  {initialData?.subtitle || '剪去雜緒，煥然一新，旺氣提升！'}
                </p>
              </div>

              <div className="pt-2 border-t border-dashed border-current/25 flex items-center justify-between text-[11px] opacity-75">
                <span>{today.date.solarDisplay}</span>
                <span>今日好日生活指南</span>
              </div>
            </div>
          )}
        </div>

        {/* Custom Blessing Input */}
        <div className="mt-4">
          <label className="text-xs text-[#736B63] font-medium block mb-1">
            自訂祝福語（附加在分享文案中）：
          </label>
          <input
            type="text"
            value={customBlessing}
            onChange={(e) => setCustomBlessing(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E8E1D5] text-[#2C2C2C] focus:outline-none focus:border-[#A63A28]"
            id="input-custom-blessing"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-5 pt-3 border-t border-[#E8E1D5]">
          <button
            onClick={handleShareLine}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-[#06C755] text-white hover:bg-[#05B34C] font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm"
            id="btn-share-to-line"
          >
            <Share2 className="w-4 h-4" />
            <span>分享到 LINE 好友 / 群組</span>
          </button>

          <button
            onClick={handleCopyText}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-[#2C2C2C] text-white hover:bg-[#1A1A1A] font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm"
            id="btn-copy-card-text"
          >
            {copiedToast ? <Check className="w-4 h-4 text-[#FFE58F]" /> : <Copy className="w-4 h-4" />}
            <span>{copiedToast ? '已複製圖文至剪貼簿！' : '複製文字卡片內容'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
