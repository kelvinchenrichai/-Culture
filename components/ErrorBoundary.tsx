import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

/**
 * Part K1：任何一個畫面（Today / Calendar / Temple / Deity...）丟出未預期的
 * render-time 例外，都不該讓整站變白屏。這裡刻意用最保守的做法——
 * 顯示一句話 + 重新整理按鈕，不嘗試猜測錯誤內容或做花俏的復原邏輯。
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // 保留 console.error，方便開發時在瀏覽器主控台看到完整堆疊；
    // 不上報到任何第三方服務——這個專案的整站 API 成本目標是 NT$0。
    console.error('[ErrorBoundary] 畫面發生未預期錯誤：', error);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen paper-bg flex items-center justify-center p-6">
        <div className="max-w-sm w-full bg-[#FDF9F3] rounded-2xl p-6 border border-[#E8E1D5] text-center space-y-3">
          <p className="text-2xl">⚠️</p>
          <h1 className="font-serif-tc font-bold text-xl text-[#2C2C2C]">這個畫面暫時出了問題</h1>
          <p className="text-base text-[#5C554E]">不是你的操作有錯，是我們這邊的畫面壞掉了。重新整理通常就能恢復。</p>
          <button
            onClick={this.handleReload}
            className="w-full px-4 py-3 rounded-xl bg-[#A63A28] text-white font-semibold min-h-[48px]"
          >
            重新整理
          </button>
        </div>
      </div>
    );
  }
}
