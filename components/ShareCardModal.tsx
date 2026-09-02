import React, { useEffect, useState } from 'react';
import { ShareCardData, ShareCardStyle } from '../types';
import { TODAY_INFO } from '../data/mockData';
import type { TodayViewModel } from '../src/viewmodels/types';
import { shareToLine } from '../src/lib/share/lineShare';
import { createGenericShareCardSvg, CARD_THEMES, type GenericCardContent } from '../src/lib/share/shareCardService';
import { renderMotif, type IllustrationMotif } from '../src/lib/share/illustrations';

const STYLE_MOTIF: Record<ShareCardStyle, IllustrationMotif> = {
  'cultural-minimal': 'mountainWater',
  'daily-quote': 'cloud',
  'deity-blessing': 'lotus',
  'decision-ticket': 'cloud',
};
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
  // Part J：hooks 一定要在任何 early return 之前呼叫，否則 isOpen 在同一個元件實例上
  // true/false 切換時，React 呼叫的 hook 數量會不一致（違反 Rules of Hooks），實際表現
  // 就是「分享卡開關幾次之後整個 App 噴錯」——這是這輪 accessibility/hardening 稽核時
  // 順手抓到的既有 bug，不是新加的功能，一起修掉。
  const [activeStyle, setActiveStyle] = useState<ShareCardStyle>(
    initialData?.style || 'cultural-minimal'
  );
  const [activeTheme, setActiveTheme] = useState<'paper' | 'vermilion' | 'dark' | 'green'>('paper');
  const [copiedToast, setCopiedToast] = useState(false);
  const [downloadState, setDownloadState] = useState<'idle' | 'working' | 'done'>('idle');
  const [customBlessing, setCustomBlessing] = useState('祝你今天事事順心，平安喜樂！');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Part（「小節日」擴充時發現的既有 bug）：這個 modal 從頭到尾只掛載一次（isOpen 只是控制
  // 要不要 return null，不是控制 mount/unmount），所以上面 activeStyle 的 useState 初始值
  // 只會在「第一次」render 時讀一次 initialData.style——App 第一次開啟分享卡時 initialData
  // 通常還是 undefined，之後不管從哪個按鈕帶著哪個 style 進來（例如神明頁的
  // 'deity-blessing'、決策頁的 'decision-ticket'），分頁永遠停在上次手動選過的樣式（或永遠
  // 卡在預設的「今日宜忌卡」），呼叫端指定的 style 完全被忽略。用 useEffect 在每次「真的打開
  // 且帶著新 initialData」時重新同步，才會符合使用者從哪裡點分享、預設就看到對應樣式的預期。
  useEffect(() => {
    if (isOpen) setActiveStyle(initialData?.style || 'cultural-minimal');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // Part（bug fix round）：這裡原本不管使用者是從哪裡點「分享」進來的，一律只組「今天」的宜忌
  // 文字——結果從「找好日子」點某一個未來日期分享時，文字卡跟圖卡顯示的其實是今天的資料，
  // 不是使用者真正想分享的那一天。改成：有 initialData（代表呼叫方指定了明確內容，例如某個
  // 未來好日子、某位神明、某個決策結果）就一定用 initialData，沒有的時候才退回顯示「今天」。
  const buildShareText = (): string => {
    if (initialData) {
      const parts = [initialData.title, initialData.subtitle, initialData.primaryText, initialData.secondaryText, customBlessing].filter(
        (part): part is string => Boolean(part && part.trim())
      );
      return `【今日好日】${parts.join('\n')}`;
    }
    return today.state === 'success'
      ? `【今日好日 · 民俗生活指南】\n📅 國曆 ${today.date.solarDisplay} (${today.date.weekday}) · 農曆 ${today.date.lunarDisplay}\n🌸 宜：${today.goodActions.map(a => a.label).join('、') || '無明確記載'}\n⚠️ 忌：${today.badActions.map(a => a.label).join('、') || '無明確記載'}\n${customBlessing}\n\n資料依據：${today.source.primarySource}`
      : '今日資料暫時無法取得，請稍後再試。';
  };

  const handleCopyText = () => {
    navigator.clipboard?.writeText?.(buildShareText());
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleShareLine = () => {
    // Part（bug fix round）：原本分享出去的訊息完全沒有附網站連結，朋友收到後沒辦法點回來看——
    // 對「容易在 LINE 裡面分享推廣」這個目標來說等於少了最後一步。shareToLine 統一補上網址。
    shareToLine(buildShareText());
  };

  // Part（bug fix round）：畫面上原本只有一個「即時預覽」的 div，完全沒有存成圖片的功能——
  // 已經寫好且有測試的 SVG 產生器從來沒被接上任何畫面。這裡把目前畫面上顯示的內容，轉成
  // 一張可以下載、適合長輩直接在 LINE 裡面用「傳照片」方式轉傳的直式圖卡（PNG）。
  const buildGenericCardContent = (): GenericCardContent => {
    if (activeStyle === 'cultural-minimal') {
      if (initialData) {
        return {
          eyebrow: initialData.subtitle || '好日子分享',
          title: initialData.title || '今日好日',
          lines: [initialData.primaryText, initialData.secondaryText].filter((v): v is string => Boolean(v)),
          quote: customBlessing,
          footer: '今日好日 · 台灣民俗生活指南',
          motif: 'mountainWater',
        };
      }
      return {
        eyebrow: `${today.date.solarDisplay} · ${today.date.weekday}`,
        title: `農曆 ${today.date.lunarDisplay}`,
        lines: [
          `宜：${today.goodActions.map((a) => a.label).join('、') || '無明確記載'}`,
          `忌：${today.badActions.map((a) => a.label).join('、') || '無明確記載'}`,
        ],
        quote: TODAY_INFO.emotionalQuote.content,
        footer: '今日好日 · 台灣民俗生活指南',
        motif: 'mountainWater',
      };
    }
    if (activeStyle === 'daily-quote') {
      return {
        eyebrow: '今日好日 · 日曆手撕箋',
        title: today.date.solarDisplay,
        lines: [`農曆 ${today.date.lunarDisplay}`, TODAY_INFO.emotionalQuote.subtext].filter(Boolean),
        quote: `${TODAY_INFO.emotionalQuote.content}／${customBlessing}`,
        footer: '今日好日 · 台灣民俗生活指南',
        motif: 'cloud',
      };
    }
    if (activeStyle === 'deity-blessing') {
      return {
        eyebrow: initialData?.title || '福德正神（土地公）· 慈悲護佑',
        title: initialData?.primaryText || '保佑闔家安康、出入平安、財運亨通',
        lines: [initialData?.secondaryText || '農曆初二、十六作牙吉日。心誠則靈，常念善心，平安自來。'],
        quote: customBlessing,
        footer: '今日好日 · 敬神祈福指南',
        motif: 'lotus',
      };
    }
    return {
      eyebrow: initialData?.title || '今天可以剪頭髮嗎？',
      title: initialData?.primaryText ? initialData.primaryText.split('！')[0] : '適合！大吉',
      lines: [initialData?.subtitle || '剪去雜緒，煥然一新，旺氣提升！'],
      quote: customBlessing,
      footer: `${today.date.solarDisplay} · 今日好日生活指南`,
      motif: 'cloud',
    };
  };

  const handleDownloadImage = () => {
    setDownloadState('working');
    const theme = CARD_THEMES[activeTheme];
    const svg = createGenericShareCardSvg(buildGenericCardContent(), theme);
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setDownloadState('idle');
        URL.revokeObjectURL(svgUrl);
        return;
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(svgUrl);
        if (!blob) {
          setDownloadState('idle');
          return;
        }
        const pngUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `今日好日-分享卡-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pngUrl);
        setDownloadState('done');
        setTimeout(() => setDownloadState('idle'), 2500);
      }, 'image/png');
    };
    img.onerror = () => {
      setDownloadState('idle');
      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
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
          {/* Part（分享卡插畫）：跟下載出來的 PNG 用同一個 renderMotif，避免預覽看到的跟下載到的長得不一樣。 */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none select-none -z-10"
            viewBox="0 0 1080 1350"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: renderMotif(STYLE_MOTIF[activeStyle], CARD_THEMES[activeTheme].accent) }}
          />

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
                    {initialData?.dateText ?? `${today.date.solarDisplay} · ${today.date.weekday}`}
                  </div>
                  <div className="font-serif-tc font-bold text-lg text-[#A63A28]">
                    {initialData?.title ?? `農曆 ${today.date.lunarDisplay}`}
                  </div>
                </div>
                <div className="seal-stamp-filled text-xs px-2.5 py-1">
                  今日參考
                </div>
              </div>

              {/* Part（bug fix round）：這裡以前不管有沒有 initialData 一律顯示「今天」的宜忌，
                  導致「找好日子」分享某個未來日期時，卡片內容其實是今天的、不是那一天的。
                  現在有 initialData（呼叫方指定明確內容）就優先顯示它。 */}
              {initialData ? (
                <div className="space-y-2">
                  {initialData.subtitle && (
                    <p className="text-xs font-semibold opacity-80">{initialData.subtitle}</p>
                  )}
                  <p className="text-sm font-semibold leading-relaxed">{initialData.primaryText}</p>
                  {initialData.secondaryText && (
                    <p className="text-xs opacity-80 leading-relaxed">{initialData.secondaryText}</p>
                  )}
                </div>
              ) : (
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
              )}

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
        <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-3">
          <button
            onClick={handleDownloadImage}
            disabled={downloadState === 'working'}
            className="w-full py-3 px-4 rounded-xl bg-[#A63A28] text-white hover:bg-[#8f3121] font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm disabled:opacity-60"
            id="btn-download-card-image"
          >
            {downloadState === 'done' ? <Check className="w-4 h-4 text-[#FFE58F]" /> : <Download className="w-4 h-4" />}
            <span>
              {downloadState === 'working' ? '圖片產生中…' : downloadState === 'done' ? '已下載，可以直接傳圖片給朋友！' : '下載圖卡（存成照片，長輩最愛用這個轉傳）'}
            </span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-2.5 pt-3 border-t border-[#E8E1D5]">
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
