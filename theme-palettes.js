// Theme color constants, cultural palettes, and monthly fallback moods.

const THEME_CONFIG = {
  text: "#d7d7db",
  mutedText: "#8e8e93",
  overlay: "rgba(5,5,6,0.34)"
};

const FONT_STACK = "\"Noto Sans CJK SC\", \"Noto Sans SC\", \"Noto Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif";

const CULTURAL_PALETTES = {
  CN: { gradient: ["#25080c", "#8f171c", "#12090a"], accent: "#f6c85f", secondary: "#e83b36", tags: ["civic", "celebration", "sun", "light"] },
  US: { gradient: ["#101a34", "#4a2432", "#111316"], accent: "#6aa7ff", secondary: "#e85a63", tags: ["civic", "celebration", "sky"] },
  JP: { gradient: ["#171318", "#4b1f2a", "#111214"], accent: "#f2eee6", secondary: "#d94a4d", tags: ["sun", "civic"] },
  SG: { gradient: ["#151821", "#5b2530", "#111315"], accent: "#e85a63", secondary: "#f3f3f5", tags: ["civic", "celebration"] },
  FR: { gradient: ["#101d3f", "#342742", "#4c2734"], accent: "#6aa7ff", secondary: "#e85a63", tags: ["civic", "celebration"] },
  GB: { gradient: ["#111b32", "#482538", "#111316"], accent: "#7faee8", secondary: "#e65b5b", tags: ["civic"] },
  CA: { gradient: ["#17161c", "#5d2630", "#111214"], accent: "#e85a63", secondary: "#f3f3f5", tags: ["civic", "botanical"] },
  AU: { gradient: ["#101d34", "#263a54", "#111316"], accent: "#78aee8", secondary: "#d8b95b", tags: ["sky", "civic"] },
  DE: { gradient: ["#151515", "#55302d", "#111111"], accent: "#d8b95b", secondary: "#d65345", tags: ["civic"] },
  IT: { gradient: ["#10251f", "#4f2c31", "#111515"], accent: "#70bf75", secondary: "#e65b5b", tags: ["civic", "botanical"] },
  ES: { gradient: ["#211619", "#63362a", "#111314"], accent: "#d8b95b", secondary: "#e65b5b", tags: ["sun", "civic"] },
  KR: { gradient: ["#11192d", "#3d2f4b", "#111316"], accent: "#f3f3f5", secondary: "#d8555b", tags: ["civic", "sky"] },
  TH: { gradient: ["#111b34", "#4d2844", "#111316"], accent: "#7fbbe8", secondary: "#e65b5b", tags: ["water", "celebration"] },
  CH: { gradient: ["#151b27", "#4d2727", "#111314"], accent: "#e65b5b", secondary: "#f0f0f2", tags: ["mountain", "civic"] },
  NO: { gradient: ["#101d34", "#4f2d38", "#101316"], accent: "#6da2cf", secondary: "#e65b5b", tags: ["winter", "civic"] },
  MX: { gradient: ["#10251f", "#4f2c31", "#111515"], accent: "#70bf75", secondary: "#e85a63", tags: ["civic", "celebration"] },
  BR: { gradient: ["#102622", "#465c2d", "#101516"], accent: "#77c98e", secondary: "#d8c070", tags: ["sun", "celebration"] },
  IN: { gradient: ["#18251f", "#604026", "#111515"], accent: "#f0a24a", secondary: "#70bf75", tags: ["civic", "sun"] },
  ZA: { gradient: ["#10251f", "#1f415a", "#111515"], accent: "#77c98e", secondary: "#d8b95b", tags: ["civic", "celebration"] },
  NZ: { gradient: ["#101d34", "#293f5d", "#101316"], accent: "#78aee8", secondary: "#e85a63", tags: ["sky", "civic"] }
};

const OCCASION_PALETTES = [
  [/christmas/i, { gradient: ["#101827", "#2d4436", "#111314"], accent: "#d8c070", secondary: "#d65345", tags: ["winter", "light"] }],
  [/halloween/i, { gradient: ["#17121f", "#4b2d13", "#111113"], accent: "#f08a2d", secondary: "#8d65c5", tags: ["night", "playful"] }],
  [/valentine/i, { gradient: ["#241525", "#643044", "#111214"], accent: "#e87a94", secondary: "#d7b56b", tags: ["botanical", "celebration"] }],
  [/new year's day|new year's eve/i, { gradient: ["#151a2d", "#493456", "#111316"], accent: "#d6c070", secondary: "#78b8e6", tags: ["fireworks", "light"] }],
  [/thanksgiving|harvest/i, { gradient: ["#211916", "#604026", "#111314"], accent: "#d8a05f", secondary: "#9bb06d", tags: ["harvest", "botanical"] }]
];

const PALETTE_ATMOSPHERES = [
  "#2a1024", "#33131b", "#3a160f", "#38210f", "#2e2a12", "#1f3218", "#123025", "#103038",
  "#102b44", "#14244b", "#1d1f4a", "#2a1d49", "#381c42", "#431b34", "#4a1f27", "#3c2a18",
  "#24351f", "#17382d", "#163847", "#19304f", "#222b52", "#312650", "#44234a", "#512233",
  "#552622", "#483316", "#394018", "#254521", "#18483a", "#174654", "#1d3c60", "#29345f",
  "#3a2b5a", "#4b2851", "#5a2840", "#5a302d", "#4b3b22"
];

const MONTH_MOODS = [
  {
    title: "Deep Winter Light",
    zhMonth: "一月",
    mood: "寒夜、雪光与岁初微光",
    intro: "一月处在深冬与岁初之间，寒意最盛，白昼缓慢变长，日历从清冷的微光里重新开始。",
    motif: "snow",
    gradient: ["#101827", "#26374c", "#101214"],
    accent: "#a9c9e8",
    secondary: "#d9d9e5",
    tags: ["seasonal", "winter", "light"]
  },
  {
    title: "Early Spring Signal",
    zhMonth: "二月",
    mood: "早春枝芽、细雨和将醒未醒的空气",
    intro: "二月常在冬末与早春之间摆动，寒意还在，降水和枝芽已经开始提示新的季节。",
    motif: "springBuds",
    gradient: ["#14251d", "#425643", "#111516"],
    accent: "#92c982",
    secondary: "#d8c070",
    tags: ["seasonal", "spring", "botanical"]
  },
  {
    title: "Spring Bud Field",
    zhMonth: "三月",
    mood: "昼夜渐平、花信渐浓与新绿漫开的田野",
    intro: "三月进入春意更清楚的时段，昼夜渐渐均衡，花信与新绿让日历从沉静转向舒展。",
    motif: "springBuds",
    gradient: ["#16251e", "#526141", "#111516"],
    accent: "#a9d37f",
    secondary: "#e6b6c8",
    tags: ["seasonal", "spring", "botanical"]
  },
  {
    title: "Clear Rain Garden",
    zhMonth: "四月",
    mood: "春雨气息、水面花影和暮春透明感",
    intro: "四月的春雨变得频繁，草木继续生长，暮春的空气带着透明的水汽和新绿。",
    motif: "waterFlowers",
    gradient: ["#122735", "#346158", "#101518"],
    accent: "#87c9b7",
    secondary: "#c8d58f",
    tags: ["seasonal", "spring", "water", "botanical"]
  },
  {
    title: "Green Grain Rise",
    zhMonth: "五月",
    mood: "麦穗渐满、长昼初热和明亮绿意",
    intro: "五月从春末走向初夏，麦穗渐满，白昼拉长，天气开始有更明亮的热意。",
    motif: "grain",
    gradient: ["#1a271c", "#5d6639", "#121515"],
    accent: "#bfd46f",
    secondary: "#76b58a",
    tags: ["seasonal", "harvest", "botanical"]
  },
  {
    title: "Summer Water Pattern",
    zhMonth: "六月",
    mood: "夏日水纹、梅雨蓝绿和长昼里的潮湿光感",
    intro: "六月进入仲夏，白昼拉长，湿热、梅雨和水汽让季节变得丰沛而明亮。",
    motif: "waterFlowers",
    gradient: ["#102735", "#2d6467", "#111518"],
    accent: "#73d1c9",
    secondary: "#d8b95b",
    tags: ["seasonal", "summer", "water", "light"]
  },
  {
    title: "High Summer Heatwave",
    zhMonth: "七月",
    mood: "盛夏热浪、莲叶水面和午后云雨",
    intro: "七月是暑气最明显的月份，热浪、云雨和漫长午后构成盛夏的高点。",
    motif: "sunRibbons",
    gradient: ["#221a20", "#68412a", "#121314"],
    accent: "#e89b42",
    secondary: "#75bdd0",
    tags: ["seasonal", "summer", "sun", "water"]
  },
  {
    title: "Late Summer Grain",
    zhMonth: "八月",
    mood: "暑气渐散、初秋谷色和夜里的新凉",
    intro: "八月仍有暑气，夜里开始出现新凉，金色谷物和低一点的天光让季节悄悄转向秋天。",
    motif: "grain",
    gradient: ["#1d211a", "#615237", "#121414"],
    accent: "#d6a95e",
    secondary: "#88a06a",
    tags: ["seasonal", "harvest", "autumn"]
  },
  {
    title: "Autumn Grain Balance",
    zhMonth: "九月",
    mood: "初秋谷物、露水和昼夜均衡",
    intro: "九月暑气退去，清晨露水增多，谷物、凉风和均衡的日光让秋意变得清楚。",
    motif: "grain",
    gradient: ["#201d1b", "#635136", "#121414"],
    accent: "#d8a95e",
    secondary: "#8fa36b",
    tags: ["seasonal", "harvest", "autumn"]
  },
  {
    title: "Cold Dew Skyline",
    zhMonth: "十月",
    mood: "深秋冷露、霜色边缘和更清澈的夜空",
    intro: "十月进入深秋，凉意更明显，天空清透，草木开始收束，夜色也更有轮廓。",
    motif: "aurora",
    gradient: ["#111c2b", "#30445a", "#101316"],
    accent: "#91bfe6",
    secondary: "#c5b06f",
    tags: ["seasonal", "autumn", "sky", "light"]
  },
  {
    title: "First Winter Window",
    zhMonth: "十一月",
    mood: "初冬窗光、浅寒空气和安静的蓝灰色",
    intro: "十一月寒意逐渐稳定，窗光、浅冷空气和蓝灰色的傍晚让日历进入更安静的初冬。",
    motif: "candle",
    gradient: ["#101b2b", "#253c50", "#101214"],
    accent: "#84bde6",
    secondary: "#d2d8e6",
    tags: ["seasonal", "winter", "light"]
  },
  {
    title: "Winter Solstice Glow",
    zhMonth: "十二月",
    mood: "冬光、雪意和长夜里慢慢回升的金色",
    intro: "十二月接近一年中黑夜最长的时段，雪意、冬光和慢慢回升的金色让寒冷不至于沉闷。",
    motif: "snow",
    gradient: ["#11182a", "#273154", "#101214"],
    accent: "#9dbaf0",
    secondary: "#d6c071",
    tags: ["seasonal", "winter", "light"]
  }
];
