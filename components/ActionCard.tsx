import React from 'react';
import { SuitableItem, UnsuitableItem } from '../types';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

interface ActionCardProps {
  suitableActivities: SuitableItem[];
  unsuitableActivities: UnsuitableItem[];
  isElderMode: boolean;
  onSelectAction: (actionName: string) => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  suitableActivities,
  unsuitableActivities,
  isElderMode,
  onSelectAction,
}) => {
  return (
    <div className="space-y-4">
      {/* 宜（適合做什麼）Card */}
      <div className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm relative">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#EBF5ED] text-[#2E7D32] flex items-center justify-center font-bold font-serif-tc text-base border border-[#2E7D32]/25">
              宜
            </div>
            <div>
              <h3 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-xl' : 'text-lg'}`}>
                今日適合做什麼？
              </h3>
              <p className="text-xs text-[#736B63]">順應時令氣場，順風順水</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#EBF5ED] text-[#2E7D32] font-semibold border border-[#2E7D32]/20">
            {suitableActivities.length} 項好時機
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {suitableActivities.map((act, idx) => (
            <button
              key={idx}
              onClick={() => onSelectAction(act.name)}
              className="text-left p-3.5 rounded-xl bg-white border border-[#E8E1D5] hover:border-[#2E7D32]/50 hover:bg-[#F9FCFA] transition-all group flex flex-col justify-between"
              id={`btn-act-suit-${idx}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                    <span className={`font-bold text-[#2C2C2C] group-hover:text-[#2E7D32] ${isElderMode ? 'text-lg' : 'text-base'}`}>
                      {act.name}
                    </span>
                  </div>
                  {act.tag && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#A63A28]/10 text-[#A63A28] font-bold border border-[#A63A28]/20">
                      {act.tag}
                    </span>
                  )}
                </div>
                <p className={`text-[#5C554E] mt-1 line-clamp-2 ${isElderMode ? 'text-sm' : 'text-xs'}`}>
                  {act.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8E1D5]/60 text-[11px] text-[#736B63]">
                <span>{act.category}</span>
                <span className="text-[#2E7D32] font-medium flex items-center group-hover:translate-x-0.5 transition-transform">
                  查看建議 <ArrowRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 忌（今日不建議做什麼）Card */}
      <div className="bg-[#FDF9F3] rounded-2xl p-5 border border-[#E8E1D5] shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#A63A28]/10 text-[#A63A28] flex items-center justify-center font-bold font-serif-tc text-base border border-[#A63A28]/20">
              忌
            </div>
            <div>
              <h3 className={`font-serif-tc font-bold text-[#2C2C2C] ${isElderMode ? 'text-xl' : 'text-lg'}`}>
                今日不建議做什麼？
              </h3>
              <p className="text-xs text-[#736B63]">避開不利時段，留待好日更從容</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#A63A28]/10 text-[#A63A28] font-semibold border border-[#A63A28]/20">
            {unsuitableActivities.length} 項暫緩
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 mt-4">
          {unsuitableActivities.map((act, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white border border-[#F5D5CF] flex items-start justify-between gap-3"
            >
              <div className="flex items-start space-x-2.5">
                <XCircle className="w-4 h-4 text-[#A63A28] mt-0.5 shrink-0" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold text-[#2C2C2C] ${isElderMode ? 'text-lg' : 'text-base'}`}>
                      {act.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FAF6F0] text-[#736B63] border border-[#E8E1D5]">
                      {act.category}
                    </span>
                  </div>
                  <p className={`text-[#5C554E] mt-1 ${isElderMode ? 'text-sm' : 'text-xs'}`}>
                    {act.reason}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectAction(act.name)}
                className="shrink-0 text-xs px-2.5 py-1.5 rounded-lg bg-white border border-[#A63A28]/30 text-[#A63A28] hover:bg-[#A63A28]/10 transition-colors font-medium"
                id={`btn-act-unsuit-${idx}`}
              >
                找好日子
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
