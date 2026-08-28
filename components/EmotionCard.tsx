import React from 'react';
import { Heart, Share2, Sparkles, Quote } from 'lucide-react';
import { DayInfo } from '../types';

interface EmotionCardProps {
  quote: DayInfo['emotionalQuote'];
  isElderMode: boolean;
  onOpenShareModal: () => void;
}

export const EmotionCard: React.FC<EmotionCardProps> = ({
  quote,
  isElderMode,
  onOpenShareModal,
}) => {
  return (
    <div className="bg-gradient-to-br from-[#FDF9F3] via-[#FAF5EC] to-[#F3ECE0] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm relative overflow-hidden">
      {/* Decorative seal watermark */}
      <div className="absolute right-4 bottom-3 opacity-10 pointer-events-none select-none">
        <span className="font-serif-tc font-bold text-7xl text-[#A63A28]">
          安
        </span>
      </div>

      <div className="flex items-center justify-between pb-2.5">
        <div className="flex items-center space-x-1.5 text-[#A63A28]">
          <Heart className="w-4 h-4 text-[#A63A28]" />
          <span className="font-serif-tc font-bold text-xs tracking-wider uppercase">
            {quote.tag}
          </span>
        </div>

        <button
          onClick={onOpenShareModal}
          className="flex items-center space-x-1 text-xs text-[#736B63] hover:text-[#A63A28] bg-white/90 px-2.5 py-1 rounded-full border border-[#E8E1D5] shadow-2xs transition-colors"
          id="btn-share-quote"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>分享心境卡</span>
        </button>
      </div>

      <div className="mt-2 relative">
        <p className={`font-serif-tc font-semibold text-[#2C2C2C] leading-relaxed tracking-wide ${isElderMode ? 'text-xl' : 'text-lg'}`}>
          {quote.content}
        </p>
        <p className={`text-[#6E665E] mt-2 ${isElderMode ? 'text-base' : 'text-xs'}`}>
          {quote.subtext}
        </p>
      </div>
    </div>
  );
};
