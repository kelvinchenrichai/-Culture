/** Part E3：距離格式化。>=1km 顯示到小數一位公里，<1km 顯示到十公尺。 */
export function formatDistance(km: number): string {
  if (!Number.isFinite(km) || km < 0) return '距離未知';
  if (km >= 1) return `約 ${km.toFixed(1)} 公里`;
  const meters = Math.round((km * 1000) / 10) * 10;
  return `約 ${meters} 公尺`;
}

/**
 * Part E5：導航用外部連結，不需要 API key、不依賴任何地圖 SDK。
 * 用 geo query 讓使用者的裝置決定要開 Google Maps 還是 Apple Maps 之類的預設地圖 App。
 */
export function buildNavigationUrl(temple: { lat?: number; lng?: number; name: string; normalizedAddress?: string; rawAddress?: string }): string {
  if (temple.lat != null && temple.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${temple.lat},${temple.lng}`;
  }
  const query = encodeURIComponent(temple.normalizedAddress || temple.rawAddress || temple.name);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
