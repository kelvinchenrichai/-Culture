import { DayInfo, LifeDecision, Deity, WorshipGuide, Temple, AuspiciousDay } from '../types';

export const TODAY_INFO: DayInfo = {
  solarDate: '2025年 3月 15日',
  weekday: '星期六',
  lunarDate: '乙巳年 二月十六',
  solarTerm: '驚蟄・後候',
  zodiacYear: '蛇年',
  ganZhi: '乙巳年 己卯月 癸亥日',
  overallVerdict: '大吉',
  summary: '氣場溫和通達，適合梳理思緒、會晤良友、清理居所與祈願納福。',
  score: 92,
  clashZodiac: '沖蛇 48歲（忌往正南）',
  wealthDirection: '正南方',
  blessingDirection: '東南方',
  emotionalQuote: {
    content: '「心若安適，行事皆是好時節；把今天過好，明天自然光亮。」',
    subtext: '今天給自己一杯茶的時間，整理身心，順其自然。',
    tag: '今日好心境'
  },
  suitableActivities: [
    { name: '理髮沐浴', category: '生活打理', description: '剪去雜緒，煥然一新，旺氣提升', tag: '極推薦' },
    { name: '祈福參拜', category: '信仰安心', description: '向神明祈願合家平安、事業順遂', tag: '良辰' },
    { name: '會友品茗', category: '人際交流', description: '適合與親友相聚、談心結善緣' },
    { name: '納財求利', category: '商務工作', description: '利於簽約、收帳、理財規劃' },
    { name: '掃除整頓', category: '居家生活', description: '清理家中雜物，去除滯氣' }
  ],
  unsuitableActivities: [
    { name: '大型動土', category: '工程居家', reason: '今日地氣易擾，重大開工裝修宜延後' },
    { name: '長途移徙', category: '搬家外出', reason: '氣場轉換頻繁，長途搬家較費心神' },
    { name: '詞訟爭執', category: '心性言行', reason: '心平氣和為上，避免一時口舌爭端' }
  ],
  auspiciousHours: [
    { branch: '辰時', timeRange: '07:00 - 09:00', auspicious: true, name: '司命吉時（最宜出門、晨拜）' },
    { branch: '巳時', timeRange: '09:00 - 11:00', auspicious: true, name: '青龍吉時（最宜剪髮、簽約）' },
    { branch: '未時', timeRange: '13:00 - 15:00', auspicious: true, name: '金匱吉時（宜聚會、會客）' },
    { branch: '申時', timeRange: '15:00 - 17:00', auspicious: true, name: '天德吉時（宜採購、修繕）' },
    { branch: '酉時', timeRange: '17:00 - 19:00', auspicious: false, name: '平時' },
    { branch: '戌時', timeRange: '19:00 - 21:00', auspicious: true, name: '玉堂吉時（宜沉澱、家庭共聚）' }
  ],
  todayDeityEvent: {
    isBirthday: false,
    deityName: '土地公（福德正神）',
    title: '今日宜祈求：財運亨通與居家平安',
    description: '農曆初二、十六為民間傳統「作牙」敬拜土地公之日。今日備些甜食、水果向常去的土地公廟請安，有助聚財守成。',
    offeringsSummary: '花生糖、麻糬、發糕、三樣當季圓形水果',
    deityId: 'tudigong'
  }
};

export const LIFE_DECISIONS: LifeDecision[] = [
  {
    id: 'haircut',
    query: '剪頭髮',
    title: '今天可以剪頭髮嗎？',
    isSuitable: true,
    verdict: '適合',
    shortReason: '今日逢「宜沐浴、理髮」，氣場清新，剪髮有助掃除晦氣、提振精氣神。',
    detailedExplanation: '在傳統民俗中，剪頭髮象徵「去舊生新、修整頭面」。今天的日柱與天干氣息清爽，特別適合修剪髮型、修容或整理儀容，讓整個人容光煥發，吸引好人緣。',
    lifeAdvice: '如果這幾天覺得思緒繁雜或精神不濟，下午去剪個乾淨清爽的髮型，心情會頓時明朗許多喔！',
    bestHours: ['上午 09:00 - 11:00（青龍吉時）', '下午 13:00 - 15:00（金匱吉時）'],
    avoidHours: ['中午 11:00 - 13:00（午時沖煞交接）'],
    nextAuspiciousDays: [
      { solarDate: '3月 18日 (二)', lunarDate: '二月十九', weekday: '週二', description: '宜理髮、出行，旺人緣' },
      { solarDate: '3月 22日 (六)', lunarDate: '二月廿三', weekday: '週六', description: '大吉日，理髮、祈福皆宜' },
      { solarDate: '3月 27日 (四)', lunarDate: '二月廿八', weekday: '週四', description: '歲德合日，修剪得貴人' }
    ],
    customTips: [
      '剪完頭髮後可洗個溫水澡，換上乾淨淺色上衣，納吉聚氣。',
      '若家中有長輩或嬰幼兒，建議挑選陽光充足的上午時段前往。',
      '不用刻意拘泥於複雜規矩，放鬆心情享受洗剪過程最重要。'
    ],
    category: '生活打理',
    iconName: 'Scissors'
  },
  {
    id: 'moving',
    query: '搬家入宅',
    title: '今天適合搬家或入宅嗎？',
    isSuitable: false,
    verdict: '不建議',
    shortReason: '今日「忌移徙、入宅」，地氣起伏較大，重大搬遷較易勞心奔波。',
    detailedExplanation: '入宅搬家講求氣場平穩聚財。今日時令處於轉換期，且逢沖蛇，若要將大型傢俱、床鋪或神明祖先位遷入新居，容易產生瑣碎折騰，建議另擇吉日進行。',
    lifeAdvice: '今天雖然不適合大搬家，但非常適合先去新家通風開窗、丈量尺寸或網購家飾品喔！',
    bestHours: ['若急需搬小物件：下午 15:00 - 17:00'],
    avoidHours: ['上午 07:00 - 11:00（沖煞正南方向）'],
    nextAuspiciousDays: [
      { solarDate: '3月 20日 (四)', lunarDate: '二月廿一', weekday: '週四', description: '天德合日，安居大吉' },
      { solarDate: '3月 24日 (一)', lunarDate: '二月廿五', weekday: '週一', description: '三合吉日，宜入宅安床' },
      { solarDate: '3月 29日 (六)', lunarDate: '三月初一', weekday: '週六', description: '初一大吉，移徙旺丁財' }
    ],
    customTips: [
      '搬家前三天可先在客廳點亮一盞暖黃小燈（象徵光明進宅）。',
      '入宅當天請先煮一壺開水、帶一包米與鹽進門，象徵衣食豐足。'
    ],
    category: '居家安居',
    iconName: 'Home'
  },
  {
    id: 'opening',
    query: '開工開業',
    title: '今天適合開工、開業或開市嗎？',
    isSuitable: true,
    verdict: '平順可行',
    shortReason: '今日偏向平順日，一般辦公室恢復上班或店家營業皆可，若有重大新店開幕建議配合吉時。',
    detailedExplanation: '今日有納財之吉，日常工作展開、專案啟動都很順暢。若是實體店面盛大剪綵，可搭配上午 09:00 至 11:00 的青龍吉時點香祈福，即可討個好彩頭。',
    lifeAdvice: '開工前可在辦公桌右上角放杯溫水或放幾顆糖果，象徵工作順心、甜甜蜜蜜。',
    bestHours: ['上午 09:15 - 10:45（利開張求財）', '下午 13:30 - 14:30（金匱良辰）'],
    avoidHours: ['中午 11:30 - 12:30'],
    nextAuspiciousDays: [
      { solarDate: '3月 19日 (三)', lunarDate: '二月二十', weekday: '週三', description: '開市大吉，利萬商興隆' },
      { solarDate: '3月 25日 (二)', lunarDate: '二月廿六', weekday: '週二', description: '天喜星照，客源廣進' }
    ],
    customTips: [
      '開工第一天向同事或員工說句吉祥話，正向氛圍就是最好的風水。',
      '店家門口保持明亮乾淨，收銀機旁可放一小盆多肉或金桔。'
    ],
    category: '工作財運',
    iconName: 'Briefcase'
  },
  {
    id: 'worship-praying',
    query: '祈福拜拜',
    title: '今天適合去廟裡拜拜祈福嗎？',
    isSuitable: true,
    verdict: '適合',
    shortReason: '今日為農曆十六，民間作牙祈福好日子，神氣祥和，極宜參拜土地公、媽祖或常拜神祇。',
    detailedExplanation: '今天是向神明報平安、感謝庇佑的極佳時機。帶著虔誠的心，準備幾樣簡單當季水果或點心，到住家附近的土地公廟或信仰中心走走，能讓心靈重獲平靜。',
    lifeAdvice: '不用準備繁複的大魚大肉，心誠則靈，三樣水果加一盒甜點，神明就很歡喜囉。',
    bestHours: ['上午 07:00 - 11:00（晨光祥和，香火鼎盛）', '下午 14:00 - 16:30（午後寧靜祈心）'],
    avoidHours: ['傍晚日落後天色昏暗不宜急躁前往'],
    nextAuspiciousDays: [
      { solarDate: '3月 16日 (日)', lunarDate: '二月十七', weekday: '週日', description: '宜安神、祈福、還願' },
      { solarDate: '3月 23日 (日)', lunarDate: '二月廿四', weekday: '週日', description: '觀音菩薩聖誕前夕吉日' }
    ],
    customTips: [
      '進廟記得「右門進（龍門）、左門出（虎門）」，不踩門檻表示尊重。',
      '報上姓名、農曆出生年月日、現住地址，再講述祈求之事，條理分明。'
    ],
    category: '健康祈福',
    iconName: 'Sparkles'
  },
  {
    id: 'cleaning',
    query: '大掃除整理',
    title: '今天適合家裡大掃除、整理雜物嗎？',
    isSuitable: true,
    verdict: '適合',
    shortReason: '今日利「除舊布新」，清理客廳、玄關與陽台，能迅速排解濁氣，迎入好風好水。',
    detailedExplanation: '風水講求氣流暢通。今天適合把堆積已久的快遞紙箱、過期物品清理乾淨，尤其是玄關與冰箱，整理整齊後整個人視野也會豁然開朗。',
    lifeAdvice: '先從一張桌面或一個抽屜開始整理，不需要給自己太大壓力，看著空間變乾淨心情就會變好。',
    bestHours: ['上午 08:30 - 11:30', '下午 14:00 - 16:00'],
    avoidHours: ['夜晚時段不建議劇烈翻動大型櫃體'],
    nextAuspiciousDays: [
      { solarDate: '3月 21日 (五)', lunarDate: '二月廿二', weekday: '週五', description: '破舊除晦日，大掃除首選' }
    ],
    customTips: [
      '大掃除時可以打開窗戶讓陽光和微風吹拂進來。',
      '玄關放一張乾淨的地墊，大門擦拭乾淨，招財納福第一步。'
    ],
    category: '居家安居',
    iconName: 'Brush'
  },
  {
    id: 'contract',
    query: '簽約簽訂合約',
    title: '今天適合簽約、買房簽約或重大交易嗎？',
    isSuitable: true,
    verdict: '適合',
    shortReason: '今日得「納財」吉神相護，只要審慎核對條款細節，非常利於落實合作與簽字。',
    detailedExplanation: '今日吉時財氣凝聚，思緒清明。與客戶簽約、簽訂租約或買賣協議都很合適，建議在吉時內完成落款蓋章，合作共贏。',
    lifeAdvice: '簽約前務必喝口水、逐條確認金額與日期，專業謹慎配上好時辰，自然順風順水。',
    bestHours: ['上午 09:30 - 11:00（青龍貴人時）', '下午 13:30 - 15:00'],
    avoidHours: ['中午 12:00 - 13:00'],
    nextAuspiciousDays: [
      { solarDate: '3月 19日 (三)', lunarDate: '二月二十', weekday: '週三', description: '交易成約大吉日' },
      { solarDate: '3月 26日 (三)', lunarDate: '二月廿七', weekday: '週三', description: '財祿星照，經商簽約宜' }
    ],
    customTips: [
      '隨身攜帶自己常用的順手原子筆，簽名時運筆順暢有助信心。',
      '簽署前確認合約一式兩份皆蓋騎縫章，保全權益。'
    ],
    category: '工作財運',
    iconName: 'FileCheck'
  },
  {
    id: 'buycar',
    query: '買車交車',
    title: '今天適合交車、過戶或買車嗎？',
    isSuitable: false,
    verdict: '不建議',
    shortReason: '今日交通出行略帶浮動之象，重大動產交車過戶建議選擇專屬「開市/出行吉日」。',
    detailedExplanation: '交車講求「平安吉祥、路路暢通」。今天雖然日常開車出行無礙，但若要舉行新車交車儀式或懸掛紅綵，建議移至下週二的出行大吉日，更具安心圓滿的儀式感。',
    lifeAdvice: '可以先利用今天做好車險比價與配備核對，把細節敲定，等好日子一到開心牽新車！',
    bestHours: ['若已預約不可改：建議上午 10:00 前完成基本交接'],
    avoidHours: ['下午 15:00 - 17:00（申時多車流）'],
    nextAuspiciousDays: [
      { solarDate: '3月 18日 (二)', lunarDate: '二月十九', weekday: '週二', description: '車馬大通，宜交車出行' },
      { solarDate: '3月 22日 (六)', lunarDate: '二月廿三', weekday: '週六', description: '出行大吉，行車平安' }
    ],
    customTips: [
      '交車時可在車內放一個平安符或紅包袋（內裝168元像徵一路發）。',
      '新車落地先在附近大廟繞一圈過火求平安，開車更安心。'
    ],
    category: '生活打理',
    iconName: 'Car'
  },
  {
    id: 'dating',
    query: '約會告白談親',
    title: '今天適合約會、告白或見雙方家長嗎？',
    isSuitable: true,
    verdict: '適合',
    shortReason: '今日逢「喜神在東南」，人緣磁場柔和，利於真誠溝通、增進情誼。',
    detailedExplanation: '今天的氣場特別適合溫暖誠懇的互動。無論是跟心儀對象散步喝咖啡，或是與伴侶討論未來計畫，都能在和諧放鬆的氛圍下得到美好回應。',
    lifeAdvice: '真誠是最好的風水，穿著整潔舒適的衣服，給對方一個真切溫暖的微笑吧！',
    bestHours: ['傍晚 17:00 - 19:30（夕陽漫步好時光）', '下午 14:00 - 16:00'],
    avoidHours: ['深夜不宜過度探討嚴肅爭端'],
    nextAuspiciousDays: [
      { solarDate: '3月 20日 (四)', lunarDate: '二月廿一', weekday: '週四', description: '天喜吉日，利姻緣定盟' },
      { solarDate: '3月 23日 (日)', lunarDate: '二月廿四', weekday: '週日', description: '週末良辰，宜約會告白' }
    ],
    customTips: [
      '見面時可以帶點小點心或溫暖飲品，拉近彼此距離。',
      '如果想求姻緣，也可以抽空去龍山寺或霞海城隍廟參拜月老星君喔。'
    ],
    category: '人際感情',
    iconName: 'Heart'
  }
];

export const DEITIES_LIST: Deity[] = [
  {
    id: 'tudigong',
    name: '土地公',
    honoricTitle: '福德正神',
    folkName: '土地公 / 伯公 / 福神',
    birthdayLunar: '二月初二（頭牙）、八月十五（中秋壽誕）',
    upcomingBirthdaySolar: '農曆二月初二（已過或即將到臨）',
    domains: ['保佑居家出入平安', '正財與偏財聚庫', '商家店面開市順利', '在地鄉里守護'],
    shortIntro: '台灣最親切、密度最高的地方守護神。就像鄰里的慈祥長輩，掌管一方水土與財富。',
    fullStory: '福德正神民間俗稱土地公或伯公，是台灣民間信仰中最基層也最普及的神明。傳說土地公生前多為樂善好施、造福鄉里的仁德之士，歿後受封為神。做生意的人常在每個月農曆初二、十六「作牙」拜土地公，祈求生意興隆；一般民眾亦視其為守護家宅安全、賜福解厄的慈祥長老。',
    recommendedOfferings: [
      {
        category: '甜點點心（土地公最愛）',
        items: ['花生糖（吃甜甜有好人緣、好事發生）', '麻糬（黏錢黏財運）', '發糕（發財高升）', '綠豆糕'],
        meaning: '老人家神明喜歡吃軟軟甜甜的點心，象徵討得歡心、財富黏住。'
      },
      {
        category: '吉祥水果（單數 3 種或 5 種）',
        items: ['蘋果（象徵平平安安）', '橘子（象徵大吉大利）', '鳳梨（象徵好運旺旺來）', '香蕉（象徵招財進寶）'],
        meaning: '水果需圓潤飽滿，洗淨完整裝盤。'
      },
      {
        category: '金紙與茶水',
        items: ['土地公金（四方金/福金/壽金）', '熱茶三杯或米酒三小杯'],
        meaning: '茶水敬神以示禮敬，金紙隨廟方環保爐化。'
      }
    ],
    tabooOfferings: [
      '芭樂、番茄（種子多不易消化，民俗視為不敬）',
      '苦瓜（不要讓生活吃苦）',
      '拜過變質或有破損的水果'
    ],
    bestWorshipTimes: '上午 07:00 - 11:00 為陽氣充足之時，或下午 13:00 - 16:00。農曆初二、十六最為熱鬧。',
    steps: [
      { stepNumber: 1, title: '淨手洗臉與整理供品', action: '進入廟宇前先洗淨雙手，將準備的水果甜點擺放在神明供桌上，並將茶水斟好。' },
      { stepNumber: 2, title: '點香先拜天公爐', action: '點燃清香（通常 1~3 柱），面向廟外天公爐行三鞠躬禮，插香敬天。' },
      { stepNumber: 3, title: '向正殿土地公報到', action: '面向土地公神尊，雙手持香，心中默念姓名、農曆生辰、現住地址，再具體說出今日所求之事或感謝之意。' },
      { stepNumber: 4, title: '參拜陪祀神明與行禮', action: '若廟內有文昌帝君、虎爺（常在桌下，可備雞蛋拜虎爺求財），依序參拜。香過半後雙手合十向土地公致謝，收拾供品並過爐。' }
    ],
    prayerTemplate: {
      forGeneral: '弟子（信女）○○○，農曆○○年○月○日吉時生，現居住在○○市○○區○○路○○號。今天誠心準備鮮花素果、甜點茶水，向福德正神土地公伯伯請安行禮。祈求土地公保佑弟子全家出入平安、身心健康、工作順利、大事化小。弟子若蒙庇佑，必常來奉香感恩。',
      forBusiness: '弟子○○○，所經營之○○公司（店名）位於○○市○○區○○號。今天適逢好日子，虔備水果甜食敬奉福德正神。祈求土地公賜福賜財，保佑本店客源廣進、貴人相助、生意興隆、財源滾滾。',
      tips: '講話像跟長輩聊天一樣清楚誠懇即可，放慢語速，不用背誦艱深文言文。'
    },
    famousTemples: [
      { name: '新北烘爐地南山福德宮', city: '新北市中和區', highlight: '北台灣求財指標，24小時開放，夜景壯觀' },
      { name: '南投竹山紫南宮', city: '南投縣竹山鎮', highlight: '全台求發財金、金雞最著名靈廟' },
      { name: '屏東車城福安宮', city: '屏東縣車城鄉', highlight: '全台灣規模最大、歷史悠久的土地公祖廟' }
    ],
    color: '#D9483B',
    tag: '財運與平安守護'
  },
  {
    id: 'mazu',
    name: '天上聖母（媽祖）',
    honoricTitle: '天上聖母',
    folkName: '媽祖娘娘 / 姑婆祖 / 媽祖婆',
    birthdayLunar: '三月廿三（媽祖生）',
    upcomingBirthdaySolar: '農曆三月廿三（全台瘋媽祖時節）',
    domains: ['航海與行車交通平安', '守護全家大小安康', '重大難關指引庇佑', '慈悲濟世消災解厄'],
    shortIntro: '台灣民間信仰的精神母親，象徵慈悲、護佑、安定人心的強大力量。',
    fullStory: '媽祖原名林默娘，宋代福建莆田人，自幼聰慧、精通醫理水性，常於海上風浪中拯救遇險漁民。昇天後被歷代朝廷敕封為「天后」、「天上聖母」。台灣早期先民渡過險惡黑水溝，皆仰賴媽祖庇佑。如今媽祖信仰已深入全台，每年農曆三月的媽祖遶境更是世界級宗教文化盛事。',
    recommendedOfferings: [
      {
        category: '鮮花與化妝品（聖母莊嚴）',
        items: ['鮮花一對（百合、玫瑰或康乃馨，象徵清香美麗）', '新梳子、碰粉（膨粉）、香水或紅頭繩'],
        meaning: '敬獻聖母美麗莊嚴，祈求容光煥發、家庭和樂。'
      },
      {
        category: '圓滿素果與糕餅',
        items: ['五樣當季水果（橘子、蘋果、香蕉、棗子、水梨）', '壽桃、紅龜粿、海苔或素食餅乾'],
        meaning: '祈求圓滿長壽、全家福祿雙全。'
      },
      {
        category: '清茶與線香',
        items: ['清茶三杯', '環保貢香一束'],
        meaning: '敬茶表示清淨誠心。'
      }
    ],
    tabooOfferings: [
      '未煮熟之生肉或帶血葷食（正殿多宜純素果清茶）',
      '枯萎褪色的花朵',
      '番茄、芭樂或有異味的水果'
    ],
    bestWorshipTimes: '清晨 06:00 - 10:00 氣場最為清幽，或重大節慶繞境吉時。',
    steps: [
      { stepNumber: 1, title: '淨心與整理花果', action: '入廟前整肅儀容，將鮮花水果擺放於媽祖神案前供桌。' },
      { stepNumber: 2, title: '先敬天公爐', action: '持香步出殿外朝天公三拜，插香。' },
      { stepNumber: 3, title: '敬拜天上聖母主神', action: '持香跪拜或肅立，向媽祖稟報姓名、生辰、住址與所求之事，祈求慈悲加持。' },
      { stepNumber: 4, title: '依序參拜千里眼、順風耳與後殿', action: '向兩側將軍及後殿觀音菩薩、註生娘娘等行禮，香過半後可求取媽祖平安符或香火袋於主爐過香三圈。' }
    ],
    prayerTemplate: {
      forGeneral: '弟子（信女）○○○，農曆○○年○月○日吉時生，現居住在○○市○○區○○路○○號。今日懷抱感恩之心，備辦鮮花素果向天上聖母媽祖娘娘請安。祈求聖母娘娘大慈大悲，保佑弟子行車平安、出入順利、家庭和諧、身心安康。弟子定當心存善念、行善積德。',
      forBusiness: '弟子○○○，祈求天上聖母庇佑弟子事業航道風平浪靜，遇困難有貴人指引，工作專案順利推進，逢凶化吉。',
      tips: '向媽祖說話就像向慈祥的媽媽傾訴心事，真誠表露心願，心靈自然得到釋放。'
    },
    famousTemples: [
      { name: '大甲鎮瀾宮', city: '台中市大甲區', highlight: '大甲媽祖遶境名揚國際，香火萬代' },
      { name: '白沙屯拱天宮', city: '苗栗縣通霄鎮', highlight: '粉紅超跑徒步進香，神蹟靈驗萬千' },
      { name: '北港朝天宮', city: '雲林縣北港鎮', highlight: '台灣媽祖信仰重鎮，古蹟歷史悠久' },
      { name: '台南大天后宮', city: '台南市中西區', highlight: '台灣首座官建媽祖廟，後殿月老亦極靈驗' }
    ],
    color: '#D49B44',
    tag: '平安、慈悲與家庭護佑'
  },
  {
    id: 'guanyu',
    name: '關聖帝君',
    honoricTitle: '文衡聖帝 / 恩主公',
    folkName: '關公 / 關二爺 / 協天大帝',
    birthdayLunar: '六月廿四（關公誕辰）',
    upcomingBirthdaySolar: '農曆六月廿四',
    domains: ['忠義守信事業成功', '武財神求正財守庫', '驅邪避凶小人退散', '考試功名升遷及格'],
    shortIntro: '忠義與誠信的象徵，亦是兼具武財神與文昌威德的全能守護神。',
    fullStory: '關聖帝君即三國名將關羽，以「忠、義、勇、節」名垂千古。商人敬佩其誠信守約、長於算數管帳，尊為「武財神」；讀書人尊其為「五文昌之一」；一般民眾更尊為保境安民、驅邪解厄的「恩主公」。',
    recommendedOfferings: [
      {
        category: '大氣水果與滋補品',
        items: ['當季五色水果（柑橘、蘋果、茂谷柑、甜柿）', '人蔘茶、桂圓紅棗糕、高山茶'],
        meaning: '敬獻帝君正氣凜然，象徵事業踏實、步步高升。'
      },
      {
        category: '誠信茶水與鮮花',
        items: ['熱高山茶三杯', '劍蘭或向日葵（象徵浩然正氣）'],
        meaning: '正氣之花，驅散陰霾小人。'
      }
    ],
    tabooOfferings: [
      '鴨肉（民俗傳說關公坐騎赤兔馬不宜與某些禽類同祀）',
      '楊桃、核桃（音近逃或難和諧）',
      '不正當手段所得之財物的非分之求'
    ],
    bestWorshipTimes: '上午 08:00 - 12:00 正氣充沛之時。',
    steps: [
      { stepNumber: 1, title: '莊重整衣進殿', action: '入恩主公廟宜服裝整齊，心懷敬意。' },
      { stepNumber: 2, title: '天公爐行禮後拜帝君', action: '向關聖帝君稟明行號、職位、工作事項與誠信經營之決心。' },
      { stepNumber: 3, title: '若求籤需依序擲筊請示', action: '抽籤後需連續得三個聖筊（或依廟方規定一至三筊）確認籤詩。' }
    ],
    prayerTemplate: {
      forGeneral: '弟子○○○，農曆○○年○月○日吉時生，住址○○。今日誠敬敬拜關聖帝君。祈求恩主公浩然正氣加持，保佑弟子小人遠離、貴人扶持、職場升遷順利、心志堅定。',
      forBusiness: '弟子○○○經營○○事業，祈求武財神關聖帝君保佑商譽良好、客戶信任、款項回收順利、正財進庫。',
      tips: '求關公需重視「信用」與「正道」，切勿求偏門橫財。'
    },
    famousTemples: [
      { name: '台北行天宮', city: '台北市中山區', highlight: '不燒香不燒金紙之典範，收驚靈驗' },
      { name: '日月潭文武廟', city: '南投縣魚池鄉', highlight: '氣勢磅礴，文武雙全之聖地' },
      { name: '台南祀典武廟', city: '台南市中西區', highlight: '國定古蹟，全台唯一列入官方祀典之關帝廟' }
    ],
    color: '#8C2B22',
    tag: '正財、事業升遷與正氣'
  },
  {
    id: 'yuelao',
    name: '月下老人',
    honoricTitle: '月老神君',
    folkName: '月老星君 / 月下老人',
    birthdayLunar: '八月十五（中秋節）',
    upcomingBirthdaySolar: '農曆八月十五（中秋也是月老生）',
    domains: ['單身牽引正緣良配', '情侶伴侶感情穩定', '職場貴人與好人緣', '化解感情糾葛疑慮'],
    shortIntro: '千里姻緣一線牽。專門掌管人間男女情緣與貴人人脈的慈眉月下仙人。',
    fullStory: '月下老人手持姻緣簿與紅絲線，在月光下翻閱記載人間男女姻緣的冊子。只要被月老的紅線繫上，哪怕相隔千里也能結為連理。現代人不只求愛情，從事業務、服務業或想改善職場人際關係者，也會向月老祈求招引好人緣。',
    recommendedOfferings: [
      {
        category: '甜蜜圓滿供品（月老最愛甜食）',
        items: ['巧克力、金莎（象徵愛情甜蜜濃郁）', '紅棗（象徵早日找到好對象）', '桂圓（象徵圓圓滿滿）', '軟糖或棉花糖'],
        meaning: '嘴甜心甜，讓月老在牽線時多講好話。'
      },
      {
        category: '鮮花與紅線',
        items: ['雙數鮮花一束（百合或粉紅玫瑰）', '依廟方規矩索取紅線與鉛錢'],
        meaning: '祈求花開結果、良緣早定。'
      }
    ],
    tabooOfferings: [
      '酸澀或苦味食物（如檸檬、苦瓜）',
      '傘（諧音「散」，參拜時盡量放包包或折疊好）',
      '帶刺且未修整的黑色暗色花卉'
    ],
    bestWorshipTimes: '西洋情人節、七夕情人節、中秋節月老誕辰，或平日清晨午後。',
    steps: [
      { stepNumber: 1, title: '準備甜食與供品', action: '將巧克力、紅棗、甜點擺在月老供桌。' },
      { stepNumber: 2, title: '詳細開出理想對象條件', action: '向月老清晰說明自己基本資料，並詳述希望對象的性格、三觀、年齡範圍等具體特質。' },
      { stepNumber: 3, title: '求取紅線過爐', action: '擲筊徵得月老同意後，取得紅線一條，在香爐上方順時鐘繞三圈，隨身收在皮夾內。' }
    ],
    prayerTemplate: {
      forGeneral: '弟子（信女）○○○，農曆○○年○月○日生，現居○○市○○區。今天帶來甜糖鮮花敬拜月老星君。弟子目前單身，希望月老慈悲牽線，賜予弟子性格善良、成熟負責、彼此尊重理解之正緣良配。若有良緣修成正果，必定帶著喜糖喜餅前來答謝月老。',
      forBusiness: '祈求月老星君賜予好人脈與貴人運，讓弟子在工作職場處處遇善緣、廣結好人緣。',
      tips: '條件不要太天馬行空，專注在心靈契合與人品三觀，越明確越有力量。'
    },
    famousTemples: [
      { name: '台北霞海城隍廟', city: '台北市大同區', highlight: '全台效率最高、外國觀光客必訪之月老靈廟' },
      { name: '艋舺龍山寺月老神君', city: '台北市萬華區', highlight: '紅線靈驗聞名遐邇，香火終年鼎盛' },
      { name: '台南祀典武廟月老', city: '台南市中西區', highlight: '擅長斬爛桃花、牽定正緣拐杖月老' }
    ],
    color: '#D9483B',
    tag: '好姻緣、貴人與好人脈'
  },
  {
    id: 'wenchang',
    name: '文昌帝君',
    honoricTitle: '梓潼帝君',
    folkName: '文昌公 / 掌管功名祿位星君',
    birthdayLunar: '二月初三（文昌誕辰）',
    upcomingBirthdaySolar: '農曆二月初三',
    domains: ['各類國家考試與升學及格', '職場晉升考核與證照', '思維清晰記憶力提升', '學童智慧開啟開竅'],
    shortIntro: '天下讀書人與考生的智慧導師，專司掌管功名、祿位、升遷與文運。',
    fullStory: '文昌帝君主宰人間功名祿位與科舉考試。自古以來，士子應試必先敬拜文昌。現代無論是會考、學測、國考、高普考、證照考試或職場評鑑，考生與求職者都會前來祈求心神安寧、臨場發揮實力。',
    recommendedOfferings: [
      {
        category: '諧音吉祥蔬菜（考試必備）',
        items: [
          '青蔥一束（象徵聰明伶俐）',
          '芹菜一束（象徵勤奮勤勞）',
          '白蘿蔔/菜頭（象徵好彩頭）',
          '包子+糕點+粽子（象徵「包高中」）'
        ],
        meaning: '每樣蔬菜需清洗乾淨並繫上紅緞帶，不可切斷。'
      },
      {
        category: '文具與准考證影本',
        items: ['黑色2B鉛筆、原子筆各一支', '准考證影本或考試通知單（放供桌）'],
        meaning: '讓神明看清考場座號與考生姓名，保佑答題順暢。'
      }
    ],
    tabooOfferings: [
      '鴨蛋（象徵零分）',
      '丸子（象徵完蛋）',
      '烏龍茶（象徵擺烏龍、看錯題目）'
    ],
    bestWorshipTimes: '考試前一至二週，上午 07:00 - 11:00 思緒最清明之時。',
    steps: [
      { stepNumber: 1, title: '供品與准考證擺正', action: '將蔥、芹菜、菜頭及准考證影本端正擺放。' },
      { stepNumber: 2, title: '詳述考科與考場座號', action: '向文昌帝君稟報姓名、生辰、考試名稱、日期、考場位置與准考證號碼。' },
      { stepNumber: 3, title: '文具過爐加持', action: '將考試要用的筆帶到香爐上方順時鐘繞三圈，收回文具袋備用。' }
    ],
    prayerTemplate: {
      forGeneral: '弟子○○○，農曆○○年○月○日生，現就讀（或報考）○○。將於○年○月○日參加○○考試，准考證號碼為○○○○。今日備辦蔥芹、菜頭、素果前來敬拜文昌帝君。祈求帝君賜予弟子開竅智慧、心神安定、臨考不慌、下筆如有神助、順利錄取。弟子定當勤勉向學，回饋社會。',
      forBusiness: '祈求文昌帝君保佑弟子職場思路清晰、報告撰寫流暢、專業證照考試順利通關。',
      tips: '誠心祈求之餘，自身務必付出努力，神明自會在關鍵時刻助你一把。'
    },
    famousTemples: [
      { name: '台北市文昌宮', city: '台北市中山區（雙連站）', highlight: '雙連文昌宮全台考生朝聖重鎮，文具過爐靈驗' },
      { name: '宜蘭傳藝文昌祠', city: '宜蘭縣五結鄉', highlight: '國家官方興建文昌祠，充滿傳統文風底蘊' },
      { name: '彰化員林興賢書院', city: '彰化縣員林市', highlight: '三級古蹟文昌書院，歷代文風鼎盛' }
    ],
    color: '#2A5C8A',
    tag: '學業、考運、證照與升遷'
  },
  {
    id: 'guanyin',
    name: '觀世音菩薩',
    honoricTitle: '南海觀世音菩薩 / 觀音佛祖',
    folkName: '觀音媽 / 觀世音大士',
    birthdayLunar: '二月十九（誕辰）、六月十九（得道）、九月十九（出家）',
    upcomingBirthdaySolar: '農曆二月十九（觀音佛誕日）',
    domains: ['消災解厄保平安', '心靈寧靜撫慰焦慮', '賜子保胎護幼童', '求智慧開悟與大悲願'],
    shortIntro: '大慈大悲、尋聲救苦。是台灣民間信徒最依賴的慈悲撫慰之光。',
    fullStory: '觀世音菩薩以「慈悲為懷、尋聲救苦」聞名，只要眾生遇到苦難，稱念其名號，菩薩便隨緣示現、解救危難。在台灣民間家庭中，「觀音彩」或觀音佛像幾乎是家家必供奉的主尊。',
    recommendedOfferings: [
      {
        category: '純素清淨素果與鮮花',
        items: ['鮮花一對（白百合、荷花、水仙）', '當季新鮮素果（蘋果、水梨、蓮霧、蜜棗）', '純淨白開水或清茶三杯'],
        meaning: '敬佛唯重清淨素雅，不沾葷腥。'
      },
      {
        category: '素食點心',
        items: ['素壽桃、綠豆糕、純全麥糕點'],
        meaning: '慈悲不殺生，清心寡欲。'
      }
    ],
    tabooOfferings: [
      '任何葷食魚肉、生鮮肉品（絕對嚴禁）',
      '酒類（佛門以茶代酒）',
      '蒜、蔥、韭菜等五辛植物'
    ],
    bestWorshipTimes: '清晨日出或隨時心緒煩躁時皆可參拜。',
    steps: [
      { stepNumber: 1, title: '淨心合掌', action: '供奉鮮花素果，雙手合十靜心三分鐘。' },
      { stepNumber: 2, title: '持香敬天後禮佛', action: '向菩薩稟明心意，誠心默念「南無大慈大悲觀世音菩薩」。' },
      { stepNumber: 3, title: '靜坐祈念或求大悲水', action: '可在殿內稍作停留，平復呼吸，祈求身心安穩。' }
    ],
    prayerTemplate: {
      forGeneral: '弟子（信女）○○○，農曆○○年○月○日生，住址○○。今日誠敬敬奉鮮花素果，禮拜南無大慈大悲觀世音菩薩。祈求菩薩慈悲護佑，令弟子與家人身心清淨、災厄化解、病痛早癒、煩惱消融。弟子願心存善念、口說好話、廣結善緣。',
      forBusiness: '祈求菩薩賜予慈悲心與智慧，讓弟子在面對挫折時沉著冷靜、化解危機。',
      tips: '放空心中的雜念，哪怕只是雙手合十安靜站著，菩薩都能感受你的虔誠。'
    },
    famousTemples: [
      { name: '艋舺龍山寺', city: '台北市萬華區', highlight: '國定古蹟，主祀觀世音菩薩，神威遠播' },
      { name: '高雄內門紫竹寺', city: '高雄市內門區', highlight: '台灣南部觀音信仰名剎，宋江陣發源地' },
      { name: '林口竹林山觀音寺', city: '新北市林口區', highlight: '宮殿巍峨壯麗，香火綿延' }
    ],
    color: '#4A6B5D',
    tag: '大悲救苦、平靜心靈與家宅安康'
  }
];

export const WORSHIP_GUIDES: WorshipGuide[] = [
  {
    id: 'basic-flow',
    title: '第一次拜拜就上手：新手四步基本流程',
    subtitle: '教你進廟動線、順序與插香禮儀，長輩也稱讚',
    category: '基礎入門',
    readTime: '3 分鐘',
    targetAudience: '所有人 / 新手 / 年輕族群',
    summary: '很多人進大廟不知道該先拜哪裡、從哪道門進出。只要掌握「龍進虎出、先敬天再敬神」的原則，進廟拜拜就能自然又安心。',
    steps: [
      {
        step: 1,
        title: '入廟動線：右門進、左門出（龍進虎出）',
        details: '面對廟門時，由你的「右手邊門（龍門）」進入，從「左手邊門（虎門）」走出。千萬不要走中間的正門（神明通道）或踩踏門檻（門檻象徵神明的肩膀與家面）。',
        tip: '口訣：人面對廟門，右邊進、左邊出，抬腳跨過門檻。'
      },
      {
        step: 2,
        title: '整理供品與洗淨雙手',
        details: '將自備的水果、甜點放上供桌。若有攜帶金紙，可放在供品旁邊。進入大殿前，先到洗手台把雙手洗乾淨，以示清淨敬意。'
      },
      {
        step: 3,
        title: '參拜順序：天公爐 → 主神 → 配祀神 → 桌下虎爺',
        details: '點清香後，第一步先走到廟門外向天拜「天公爐」；第二步回到正殿拜「主神（例如媽祖或土地公）」；第三步依廟方動線拜左右配祀神（文昌、註生娘娘、關公等）；若供桌下方有虎爺將軍，最後再拜虎爺。'
      },
      {
        step: 4,
        title: '香過半柱，行禮收供品與化金紙',
        details: '敬拜完畢後，稍等 10-15 分鐘讓香燃燒過半。再次雙手合十向神明致謝，取下供品；若有金紙，送至廟方環保金爐焚化即可圓滿。'
      }
    ],
    keyChecklist: [
      '進出方向：龍門進、虎門出，跨過門檻不踩踏',
      '參拜順序：先向外拜天公，再進內拜主神',
      '點香支數：現在多數廟宇提倡環保，一爐一柱香即可，心誠最重要',
      '心態：衣著整齊、手機關靜音、輕聲細語'
    ],
    commonMisconceptions: [
      { question: '插香時可以用右手或左手？', answer: '民俗建議用「左手」插香，因為傳統認為右手常做雜事，左手較為清淨乾淨。' },
      { question: '生理期來可以去拜拜嗎？', answer: '現代觀念以健康與誠心為重！生理期是自然的身體現象，只要身體舒適、心存敬意，正常參拜是完全沒問題的。' }
    ]
  },
  {
    id: 'how-to-pray',
    title: '拜拜口訣小抄：跟神明說話的萬用範本',
    subtitle: '教你講清楚「我是誰、住哪裡、想求什麼」，神明聽得最清楚',
    category: '拜拜供品',
    readTime: '2 分鐘',
    targetAudience: '想求事情、不知如何開口者',
    summary: '向神明祈願不需要背誦深奧經文，就像跟慈祥的長輩面談一樣，只要清楚報出個人資訊與明確訴求即可。',
    steps: [
      {
        step: 1,
        title: '第一步：自報身家資料',
        details: '「弟子（男生稱弟子/女生稱信女）○○○，出生於農曆○○年○月○日吉時，目前居住在○○市○○區○○路○○號。」',
        tip: '若不知道農曆生辰或確切出生時辰，講國曆生日或「吉時」即可。'
      },
      {
        step: 2,
        title: '第二步：說明今日來意與感謝',
        details: '「今天誠心準備了鮮花素果與點心，專程前來向○○神明行禮請安，感謝神明平日慈悲庇佑。」'
      },
      {
        step: 3,
        title: '第三步：清楚說出具體祈求',
        details: '「弟子近期正在籌備○○（例如找工作、準備考試、身體微恙、簽約買房），祈求神明賜予智慧、化解阻礙、保佑過程順利平安。」',
        tip: '願望越具體、合情合理越好，避免貪求非分之財。'
      },
      {
        step: 4,
        title: '第四步：承諾行善與還願',
        details: '「若蒙神明慈悲庇佑事成，弟子日後必定再前來奉香答謝，並在生活中多行善事、回饋大眾。」'
      }
    ],
    keyChecklist: [
      '姓名 + 農曆（或國曆）出生年月日',
      '現住地址（租屋處或戶籍地皆可，以現住為佳）',
      '具體明確的事項',
      '感謝詞與行善發願'
    ],
    commonMisconceptions: [
      { question: '願望講出聲音比較好，還是心裡默念？', answer: '在廟裡雙手合十「心中默念」最為恰當，既能保護個人隱私，也不會打擾周遭其他香客。' }
    ]
  },
  {
    id: 'fruit-guide',
    title: '拜拜水果怎麼挑？吉凶諧音與挑選指南',
    subtitle: '哪些水果是必備好彩頭？哪些水果不宜上供桌？',
    category: '拜拜供品',
    readTime: '3 分鐘',
    targetAudience: '採買供品家庭 / 年輕採購者',
    summary: '拜拜供奉水果講求「單數（陽數）、圓滿、香氣清新」。挑對水果不僅寓意美好，拜完帶回家全家享用也能吃進平安健康。',
    steps: [
      {
        step: 1,
        title: '數量原則：單數為吉（陽數）',
        details: '種類挑選 1、3 或 5 種水果；每種水果的顆數也建議是單數（例如 3 顆蘋果、5 顆橘子）。單數在易經中屬「陽」，代表生氣蓬勃。'
      },
      {
        step: 2,
        title: '最受歡迎的四大吉果',
        details: '1. 蘋果（平平安安）\n2. 橘子 / 茂谷柑（大吉大利）\n3. 鳳梨（好運旺來，但某些行業如醫院警察不宜）\n4. 香蕉（招財進寶、招福）'
      },
      {
        step: 3,
        title: '常見不宜上供桌的水果',
        details: '1. 芭樂、番茄（種子多不易消化排泄，民俗視為不潔不敬）\n2. 釋迦（外型似釋迦牟尼佛頭部，不敬）\n3. 苦瓜、蓮霧（蓮霧底部凹陷代表漏財，但現代多已較寬容）'
      }
    ],
    keyChecklist: [
      '種類數與顆數維持單數（如 3 樣水果、每樣 3-5 顆）',
      '水果需清洗乾淨、完整無破損爛斑',
      '拜完帶回家全家分食「吃平安」'
    ],
    commonMisconceptions: [
      { question: '一定要買很貴的進口水果嗎？', answer: '完全不需要！當季盛產、新鮮乾淨的在地水果就是最好的供品，神明最看重的是誠敬之心。' }
    ]
  },
  {
    id: 'divination-guide',
    title: '擲筊與求籤教學：神明指引怎麼看？',
    subtitle: '聖筊、笑筊、陰筊代表什麼意思？求籤的標準流程',
    category: '求籤問事',
    readTime: '3 分鐘',
    targetAudience: '心中有疑惑想求籤指引者',
    summary: '擲筊是人與神明溝通的最古老工具。兩片木製或竹製的筊杯，透過一平一凸的陰陽變化，傳達神明的指引。',
    steps: [
      {
        step: 1,
        title: '先請示神明：可否求籤？',
        details: '心中把事情稟報清楚後，先問神明是否願意賜籤。擲出一個「聖筊」後，才去籤筒抽一支籤。'
      },
      {
        step: 2,
        title: '抽籤後確認籤號',
        details: '抽出一支竹籤後，看清楚上面的號碼或干支（例如：甲子籤）。放回籤筒或手持，回到神前問：「請問是第○籤嗎？」'
      },
      {
        step: 3,
        title: '連擲三個聖筊確認（大廟標準）',
        details: '標準求籤需連續擲出「三個聖筊」才算確定是這支籤；若出現笑筊或陰筊，表示不是這支，需重抽。'
      },
      {
        step: 4,
        title: '取籤詩並請解籤處解說',
        details: '確認籤詩後至籤詩櫃取對應籤條，可請教廟方解籤老師，或參考籤詩上的典故啟發生活智慧。'
      }
    ],
    keyChecklist: [
      '聖筊（一平一凸 / 一正一反）：神明贊同、答應、可行',
      '笑筊（兩平面朝上）：事情尚未明朗、說法不清、神明微笑',
      '陰筊/怒筊（兩凸面朝上）：神明不贊成、不可行、需要再調整'
    ],
    commonMisconceptions: [
      { question: '擲出陰筊代表大難臨頭嗎？', answer: '不是的！陰筊通常代表「目前的時機還不成熟」或「你的方向需要停下來重新思考」，是善意的提醒而非懲罰。' }
    ]
  }
];

export const TEMPLES_LIST: Temple[] = [
  {
    id: 'lungshan-taipei',
    name: '艋舺龍山寺',
    mainDeity: '觀世音菩薩',
    city: '台北市',
    district: '萬華區',
    address: '台北市萬華區廣州街211號',
    distanceKm: 1.2,
    openingHours: '06:00 - 22:00',
    highlights: ['國定古蹟', '香火鼎盛二百餘年', '後殿月老靈驗', '文昌帝君考運祈求'],
    phone: '(02) 2302-5162',
    tags: ['觀音', '月老', '文昌', '百年古蹟'],
    mapQuery: '艋舺龍山寺',
    rating: 4.8
  },
  {
    id: 'hsingtian-taipei',
    name: '台北行天宮',
    mainDeity: '關聖帝君（恩主公）',
    city: '台北市',
    district: '中山區',
    address: '台北市中山區民權東路二段109號',
    distanceKm: 2.8,
    openingHours: '04:00 - 22:00',
    highlights: ['全台免費收驚服務', '環保廟宇（不燒香不燒金）', '求事業正財指南'],
    phone: '(02) 2502-7924',
    tags: ['關公', '收驚', '正財', '台北捷運直達'],
    mapQuery: '台北行天宮',
    rating: 4.9
  },
  {
    id: 'xiahai-taipei',
    name: '台北霞海城隍廟',
    mainDeity: '城隍爺・月下老人',
    city: '台北市',
    district: '大同區',
    address: '台北市大同區迪化街一段61號',
    distanceKm: 3.5,
    openingHours: '07:00 - 19:00',
    highlights: ['全台月老超靈驗名廟', '大稻埕歷史文化核心', '平安茶免費供應'],
    phone: '(02) 2558-0346',
    tags: ['月老', '城隍爺', '大稻埕', '求姻緣'],
    mapQuery: '台北霞海城隍廟',
    rating: 4.8
  },
  {
    id: 'hongludi-newtaipei',
    name: '烘爐地南山福德宮',
    mainDeity: '福德正神（土地公）',
    city: '新北市',
    district: '中和區',
    address: '新北市中和區興南路二段399巷160-1號',
    distanceKm: 6.8,
    openingHours: '24小時全天開放',
    highlights: ['北台灣求財第一名', '大土地公神像地標', '大台北百萬夜景', '換母錢發財金'],
    phone: '(02) 2942-5277',
    tags: ['土地公', '換發財錢母', '24小時', '夜景'],
    mapQuery: '烘爐地南山福德宮',
    rating: 4.9
  },
  {
    id: 'zinan-nantou',
    name: '南投竹山紫南宮',
    mainDeity: '福德正神（土地公）',
    city: '南投縣',
    district: '竹山鎮',
    address: '南投縣竹山鎮大公街40號',
    distanceKm: 145.0,
    openingHours: '07:00 - 21:00',
    highlights: ['全台借發財金始祖', '金雞祈福求財運', '過年走春排隊盛事'],
    phone: '(049) 262-3728',
    tags: ['土地公', '發財金', '金雞', '求財第一'],
    mapQuery: '南投竹山紫南宮',
    rating: 4.9
  },
  {
    id: 'baishatun-miaoli',
    name: '白沙屯拱天宮',
    mainDeity: '天上聖母（媽祖）',
    city: '苗栗縣',
    district: '通霄鎮',
    address: '苗栗縣通霄鎮白東里8號',
    distanceKm: 110.0,
    openingHours: '05:00 - 21:30',
    highlights: ['粉紅超跑徒步進香', '神威顯赫隨機路線', '在地淳樸漁村風情'],
    phone: '(037) 792-058',
    tags: ['媽祖', '粉紅超跑', '徒步進香', '台灣奇蹟'],
    mapQuery: '白沙屯拱天宮',
    rating: 4.9
  },
  {
    id: 'dajia-taichung',
    name: '大甲鎮瀾宮',
    mainDeity: '天上聖母（媽祖）',
    city: '台中市',
    district: '大甲區',
    address: '台中市大甲區順天路158號',
    distanceKm: 130.0,
    openingHours: '06:00 - 21:30',
    highlights: ['世界三大宗教盛事遶境', '翡翠媽祖與黃金媽祖', '奶油酥餅特產商圈'],
    phone: '(04) 2676-3522',
    tags: ['媽祖', '大甲遶境', '台中地標', '香火旺'],
    mapQuery: '大甲鎮瀾宮',
    rating: 4.8
  },
  {
    id: 'fuan-pingtung',
    name: '車城福安宮',
    mainDeity: '福德正神（土地公）',
    city: '屏東縣',
    district: '車城鄉',
    address: '屏東縣車城鄉福安路51號',
    distanceKm: 380.0,
    openingHours: '05:00 - 22:00',
    highlights: ['全東南亞最大土地公廟', '神奇自動吸金紙八卦爐', '恆春半島信仰中心'],
    phone: '(08) 882-1345',
    tags: ['土地公', '東南亞最大', '自動吸金爐', '屏東旅遊'],
    mapQuery: '車城福安宮',
    rating: 4.8
  }
];

export const AUSPICIOUS_DAYS: AuspiciousDay[] = [
  // 剪頭髮
  {
    id: 'hair-1',
    category: '剪頭髮',
    solarDate: '2025年 3月 15日',
    lunarDate: '二月十六',
    weekday: '週六（今日）',
    clashZodiac: '沖蛇 48歲',
    bestHours: '09:00 - 11:00 / 13:00 - 15:00',
    suitabilityScore: 95,
    highlight: '今日大吉，剪髮去穢氣、提振神氣',
    reason: '司命青龍雙吉星拱照，修剪儀容大吉'
  },
  {
    id: 'hair-2',
    category: '剪頭髮',
    solarDate: '2025年 3月 18日',
    lunarDate: '二月十九',
    weekday: '週二',
    clashZodiac: '沖猴 45歲',
    bestHours: '10:00 - 12:00 / 14:00 - 16:00',
    suitabilityScore: 92,
    highlight: '逢觀音誕辰吉日，理髮增福慧',
    reason: '宜沐浴理髮，精神煥發招貴人'
  },
  {
    id: 'hair-3',
    category: '剪頭髮',
    solarDate: '2025年 3月 22日',
    lunarDate: '二月廿三',
    weekday: '週六',
    clashZodiac: '沖鼠 41歲',
    bestHours: '09:00 - 11:30',
    suitabilityScore: 89,
    highlight: '週末好時光，修剪容顏開新運',
    reason: '天喜日，宜修飾容儀、聚會'
  },
  {
    id: 'hair-4',
    category: '剪頭髮',
    solarDate: '2025年 3月 27日',
    lunarDate: '二月廿八',
    weekday: '週四',
    clashZodiac: '沖龍 37歲',
    bestHours: '13:00 - 15:00',
    suitabilityScore: 90,
    highlight: '歲德合吉日，修剪得貴人助',
    reason: '氣場柔順，掃除雜念'
  },

  // 搬家入宅
  {
    id: 'move-1',
    category: '搬家入宅',
    solarDate: '2025年 3月 20日',
    lunarDate: '二月廿一',
    weekday: '週四',
    clashZodiac: '沖馬 47歲',
    bestHours: '09:00 - 11:00（辰巳吉時）',
    suitabilityScore: 96,
    highlight: '天德合日，安居大吉、人財兩旺',
    reason: '天德月德雙照，宜入宅、安床、移徙'
  },
  {
    id: 'move-2',
    category: '搬家入宅',
    solarDate: '2025年 3月 24日',
    lunarDate: '二月廿五',
    weekday: '週一',
    clashZodiac: '沖狗 43歲',
    bestHours: '07:30 - 10:30',
    suitabilityScore: 94,
    highlight: '三合吉日，新家聚氣、生活順遂',
    reason: '地氣祥和，利於安置大型家具與神明安座'
  },
  {
    id: 'move-3',
    category: '搬家入宅',
    solarDate: '2025年 3月 29日',
    lunarDate: '三月初一',
    weekday: '週六',
    clashZodiac: '沖兔 39歲',
    bestHours: '08:00 - 11:00',
    suitabilityScore: 91,
    highlight: '初一大吉，移徙納福、萬象更新',
    reason: '日月合朔，利於開啟新居生活'
  },

  // 開工開業
  {
    id: 'work-1',
    category: '開工開業',
    solarDate: '2025年 3月 19日',
    lunarDate: '二月二十',
    weekday: '週三',
    clashZodiac: '沖羊 46歲',
    bestHours: '09:15 - 11:00',
    suitabilityScore: 98,
    highlight: '開市萬商吉日，利客源廣進、財路暢通',
    reason: '天官賜福星臨，商業剪綵與開工首選'
  },
  {
    id: 'work-2',
    category: '開工開業',
    solarDate: '2025年 3月 25日',
    lunarDate: '二月廿六',
    weekday: '週二',
    clashZodiac: '沖豬 42歲',
    bestHours: '10:00 - 12:00',
    suitabilityScore: 93,
    highlight: '天喜星照，團隊合作無間、業績長紅',
    reason: '宜簽約、開張、新品上市'
  },

  // 祈福拜拜
  {
    id: 'worship-1',
    category: '祈福拜拜',
    solarDate: '2025年 3月 15日',
    lunarDate: '二月十六',
    weekday: '週六（今日）',
    clashZodiac: '沖蛇 48歲',
    bestHours: '07:00 - 11:00',
    suitabilityScore: 95,
    highlight: '作牙吉日，向土地公請安納福',
    reason: '農曆十六民間作牙，祈求平安與正財'
  },
  {
    id: 'worship-2',
    category: '祈福拜拜',
    solarDate: '2025年 3月 18日',
    lunarDate: '二月十九',
    weekday: '週二',
    clashZodiac: '沖猴 45歲',
    bestHours: '全天清晨至午後',
    suitabilityScore: 99,
    highlight: '觀音菩薩聖誕大吉，消災祈福極佳',
    reason: '慈悲佛誕日，參拜寺廟重獲心靈寧靜'
  },

  // 買車過戶
  {
    id: 'car-1',
    category: '買車過戶',
    solarDate: '2025年 3月 18日',
    lunarDate: '二月十九',
    weekday: '週二',
    clashZodiac: '沖猴 45歲',
    bestHours: '09:00 - 11:00',
    suitabilityScore: 94,
    highlight: '車馬大通吉日，行車平安、順心順意',
    reason: '宜出行、交易、交車過火'
  },
  {
    id: 'car-2',
    category: '買車過戶',
    solarDate: '2025年 3月 22日',
    lunarDate: '二月廿三',
    weekday: '週六',
    clashZodiac: '沖鼠 41歲',
    bestHours: '10:00 - 12:00',
    suitabilityScore: 91,
    highlight: '週末良辰，提新車遊車河大吉',
    reason: '天喜吉神，利於牽新車與開箱'
  }
];

export const UPCOMING_DEITY_EVENTS = [
  {
    lunarDate: '二月十九',
    solarDate: '3月 18日 (二)',
    deityName: '觀世音菩薩聖誕',
    importance: '大節日',
    summary: '一年三大觀音日之一，宜進廟禮佛、祈求消災解厄與全家安康。',
    offerings: '鮮花一對、素果、壽桃、清茶',
    deityId: 'guanyin'
  },
  {
    lunarDate: '三月初三',
    solarDate: '3月 31日 (一)',
    deityName: '玄天上帝聖誕',
    importance: '民俗大節',
    summary: '北方鎮天真武大帝，驅邪除煞、消災解厄的威德守護神。',
    offerings: '三牲素果、發糕、麵線',
    deityId: 'tudigong'
  },
  {
    lunarDate: '三月十五',
    solarDate: '4月 12日 (六)',
    deityName: '保生大帝 & 趙公明武財神聖誕',
    importance: '醫藥與求財大日',
    summary: '祈求身體健康化解病痛，同時為中路武財神趙公明誕辰，求財旺氣。',
    offerings: '當季水果、甜點、金紙',
    deityId: 'guanyu'
  },
  {
    lunarDate: '三月廿三',
    solarDate: '4月 20日 (日)',
    deityName: '天上聖母（媽祖）聖誕',
    importance: '全台年度盛事',
    summary: '全台灣規模最盛大的神明生日，全台各媽祖廟進香遶境祈安。',
    offerings: '鮮花、膨粉、壽桃、素果',
    deityId: 'mazu'
  }
];
