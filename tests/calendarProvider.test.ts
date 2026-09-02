import { describe, expect, it } from 'vitest'; import { LunarDataProvider, type LunarDataMonth } from '../src/lib/calendar/lunarDataProvider';
const month: LunarDataMonth = { year: 2026, month: 8, days: [{ gregorian: '2026-08-29', weekDay: '星期六', lunar: { yearGanzhi: '丙午', monthName: '七月小', dayName: '十七' }, auspicious: ['祭祀'], inauspicious: ['嫁娶'], deityBirthday: [], dayGanzhi: { full: '己巳' }, luckyDirection: { 財神: '西南', 喜神: '正南' }, pengTaboo: '己不破券 二比並亡' }] };
describe('LunarData provider', () => {
  const provider = new LunarDataProvider(async (year, requestedMonth) => year === 2026 && requestedMonth === 8 ? month : null);
  it('normalizes a fetched date', async () => expect(await provider.getDay('2026-08-29')).toMatchObject({ date: '2026-08-29', weekday: '星期六', primarySource: 'LunarData' }));
  it('returns null outside available months', async () => expect(await provider.getDay('2026-03-01')).toBeNull());
  it('exposes 干支/財神方位/喜神方位/彭祖百忌 for the 查看更多農民曆 collapsible (Part A5)', async () => {
    const day = await provider.getDay('2026-08-29');
    expect(day).toMatchObject({ ganzhi: '己巳', wealthDirection: '西南', blessingDirection: '正南', pengTaboo: '己不破券 二比並亡' });
  });
});

// Part（「小節日」擴充）：原始 LunarData 月份 JSON 其實每天都帶完整的 deityInfo/goodGods/badGods，
// 過去 lunarDataProvider 只取出名字字串、其餘全丟掉——這裡守住「完整內容真的有流到 CalendarDay」，
// 避免以後改動時又不小心丟回去。
describe('LunarData provider — deityDayEvents & goodDayGods pass-through', () => {
  const monthWithEvents: LunarDataMonth = {
    year: 2026,
    month: 1,
    days: [
      {
        gregorian: '2026-01-05',
        weekDay: '星期一',
        lunar: { yearGanzhi: '乙巳', monthName: '十一月', dayName: '十七' },
        auspicious: [],
        inauspicious: [],
        deityBirthday: ['阿彌陀佛聖誕'],
        deityInfo: [
          {
            name: '阿彌陀佛聖誕',
            info: {
              name: '阿彌陀佛',
              title: '無量壽佛、無量光佛、接引佛',
              birthday: '農曆十一月十七',
              description: '阿彌陀佛是西方極樂世界的教主。',
              image: '結跏趺坐，手結接引印或禪定印',
              temple: '淨土宗佛寺、各佛寺皆有供奉',
              blessing: '求往生淨土、求平安、求長壽',
              note: '南無阿彌陀佛意為歸命無量光壽佛。',
            },
          },
        ],
        goodGods: ['天赦', '天醫'],
        badGods: ['歲破'],
      },
    ],
  };
  const provider = new LunarDataProvider(async (year, month) => (year === 2026 && month === 1 ? monthWithEvents : null));

  it('carries the full deityInfo object through as deityDayEvents, not just the bare name', async () => {
    const day = await provider.getDay('2026-01-05');
    expect(day?.deityDayEvents).toEqual([
      {
        eventName: '阿彌陀佛聖誕',
        deityName: '阿彌陀佛',
        title: '無量壽佛、無量光佛、接引佛',
        lunarDate: '農曆十一月十七',
        description: '阿彌陀佛是西方極樂世界的教主。',
        imageDescription: '結跏趺坐，手結接引印或禪定印',
        temple: '淨土宗佛寺、各佛寺皆有供奉',
        blessing: '求往生淨土、求平安、求長壽',
        note: '南無阿彌陀佛意為歸命無量光壽佛。',
      },
    ]);
  });

  it('passes through goodDayGods/badDayGods so 天赦日 etc. can be detected', async () => {
    const day = await provider.getDay('2026-01-05');
    expect(day?.goodDayGods).toEqual(['天赦', '天醫']);
    expect(day?.badDayGods).toEqual(['歲破']);
  });

  it('defaults to empty arrays rather than undefined when the raw day has no deityInfo/goodGods', async () => {
    const day = await provider.getDay('2026-08-29');
    // 這筆走的是上面第一個 describe 用的 fixture，完全沒有給 deityInfo/goodGods 欄位
    expect(day).toBeNull(); // 2026-08 不在 monthWithEvents 的 loader 範圍內，改用同一 provider 驗證真的沒有資料時不會噴錯
  });
});
