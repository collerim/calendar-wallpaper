// Theme motif metadata, seasonal display copy, and fallback motif rotation.

const MOTIF_TAGS = {
  grain: ["botanical", "harvest"],
  waterFlowers: ["water", "botanical"],
  marigold: ["botanical", "memorial", "celebration"],
  clover: ["botanical", "luck"],
  mountainFlags: ["mountain", "civic", "celebration"],
  tanabata: ["sky", "wish", "light"],
  tricolor: ["civic", "celebration"],
  pumpkin: ["night", "autumn", "playful"],
  snow: ["winter", "sky", "light"],
  springBuds: ["botanical", "spring"],
  sunRibbons: ["sun", "celebration"],
  fireworks: ["sky", "celebration", "light"],
  petals: ["botanical", "memorial"],
  candle: ["memorial", "light", "winter"],
  streamers: ["civic", "celebration"],
  starfield: ["sky", "light"],
  aurora: ["sky", "mountain", "light"],
  lanterns: ["light", "celebration", "culture"],
  paperKites: ["sky", "celebration", "wind"],
  wovenPattern: ["culture", "civic"],
  moonOrbit: ["sky", "light", "seasonal"],
  rainGarden: ["water", "botanical", "seasonal"],
  harvestSheaves: ["botanical", "harvest", "seasonal"],
  paperCut: ["civic", "celebration", "culture"],
  teaSteam: ["culture", "light", "winter"],
  dragonDance: ["celebration", "culture", "procession", "folk"],
  crescentLantern: ["islamic", "religious", "light", "sky"],
  lotusMandala: ["religious", "botanical", "culture", "heritage"],
  templeBells: ["religious", "heritage", "light"],
  carnivalMasks: ["celebration", "procession", "folk", "market"],
  folkEmbroidery: ["folk", "heritage", "culture"],
  cityParade: ["civic", "celebration", "procession"],
  maritimeFlags: ["maritime", "water", "civic", "island"],
  desertGeometry: ["islamic", "heritage", "sun"],
  tropicalBloom: ["island", "botanical", "water"],
  oliveBranches: ["heritage", "botanical", "civic"],
  laurelTorch: ["civic", "remembrance", "light"],
  sportsMedals: ["sports", "celebration", "civic"],
  bookPress: ["literature", "culture", "heritage"],
  marketBanners: ["market", "celebration", "folk"],
  ancestralTable: ["remembrance", "religious", "light"],
  doveGarland: ["remembrance", "light", "civic"],
  stainedGlass: ["religious", "heritage", "light"],
  musicWaves: ["music", "culture", "celebration"],
  cosmicObservatory: ["science", "sky", "light"],
  gardenGate: ["botanical", "heritage", "seasonal"],
  oceanCompass: ["maritime", "water", "travel"]
};

const ZH_MONTH_TO_EN = {
  一月: "January",
  二月: "February",
  三月: "March",
  四月: "April",
  五月: "May",
  六月: "June",
  七月: "July",
  八月: "August",
  九月: "September",
  十月: "October",
  十一月: "November",
  十二月: "December"
};

const SEASONAL_TITLE_EN = {
  雪光: "Snowlight",
  霜窗: "Frost Window",
  冷白: "Cold White",
  窗灯: "Window Light",
  暖烛: "Warm Candle",
  夜灯: "Night Light",
  月轨: "Moon Orbit",
  夜潮: "Night Tide",
  微月: "Small Moon",
  茶汽: "Tea Steam",
  暖雾: "Warm Mist",
  杯影: "Cup Shadow",
  新芽: "New Buds",
  枝信: "Branch Signal",
  青芽: "Green Buds",
  雨庭: "Rain Garden",
  雨幕: "Rain Veil",
  湿光: "Wet Light",
  纸鸢: "Paper Kites",
  风线: "Wind Lines",
  晴风: "Clear Wind",
  花影: "Petal Shadows",
  花信: "Flower Signal",
  柔瓣: "Soft Petals",
  水花: "Water Flowers",
  水纹: "Water Pattern",
  潮色: "Tidal Color",
  织纹: "Woven Pattern",
  经纬: "Warp and Weft",
  布纹: "Cloth Texture",
  麦色: "Wheat Color",
  谷光: "Grain Light",
  穗影: "Ear Shadows",
  麦束: "Wheat Sheaves",
  谷束: "Grain Sheaves",
  金穗: "Golden Ears",
  长昼: "Long Day",
  日带: "Sun Ribbon",
  晴弧: "Clear Arc",
  灯影: "Lantern Shadows",
  小灯: "Small Lights",
  光串: "Light String",
  天光: "Sky Light",
  流光: "Flowing Light",
  山色: "Mountain Color",
  剪影: "Paper Cut",
  纸纹: "Paper Texture",
  红金: "Red and Gold",
  星图: "Star Map",
  夜星: "Night Stars",
  星线: "Star Lines",
  乐谱: "Music Score",
  声浪: "Sound Waves",
  节拍: "Rhythm",
  星台: "Observatory",
  轨镜: "Orbital Lens",
  远望: "Far Gaze",
  花门: "Garden Gate",
  藤廊: "Vine Arbor",
  绿径: "Green Path",
  海针: "Sea Compass",
  罗盘: "Compass Rose",
  航线: "Sea Route"
};

const MONTH_MOTIF_ROTATION = [
  ["snow", "candle", "moonOrbit", "teaSteam", "starfield", "aurora", "cosmicObservatory", "paperCut", "lanterns", "doveGarland", "stainedGlass"],
  ["springBuds", "rainGarden", "paperKites", "petals", "gardenGate", "waterFlowers", "moonOrbit", "teaSteam", "wovenPattern", "lotusMandala", "crescentLantern"],
  ["springBuds", "petals", "paperKites", "rainGarden", "gardenGate", "waterFlowers", "wovenPattern", "moonOrbit", "lanterns", "folkEmbroidery", "bookPress"],
  ["rainGarden", "waterFlowers", "springBuds", "gardenGate", "wovenPattern", "petals", "paperKites", "moonOrbit", "teaSteam", "templeBells", "oliveBranches"],
  ["grain", "harvestSheaves", "sunRibbons", "paperKites", "gardenGate", "waterFlowers", "wovenPattern", "lanterns", "springBuds", "cityParade", "sportsMedals"],
  ["waterFlowers", "rainGarden", "sunRibbons", "oceanCompass", "musicWaves", "moonOrbit", "paperKites", "lanterns", "wovenPattern", "starfield", "maritimeFlags", "dragonDance"],
  ["sunRibbons", "waterFlowers", "oceanCompass", "paperKites", "lanterns", "rainGarden", "musicWaves", "starfield", "moonOrbit", "wovenPattern", "cityParade", "tropicalBloom"],
  ["grain", "harvestSheaves", "moonOrbit", "oceanCompass", "wovenPattern", "sunRibbons", "lanterns", "paperKites", "teaSteam", "marketBanners", "desertGeometry"],
  ["harvestSheaves", "grain", "moonOrbit", "teaSteam", "aurora", "cosmicObservatory", "wovenPattern", "paperKites", "lanterns", "folkEmbroidery", "bookPress"],
  ["aurora", "paperCut", "wovenPattern", "lanterns", "candle", "starfield", "cosmicObservatory", "moonOrbit", "harvestSheaves", "carnivalMasks", "ancestralTable"],
  ["candle", "teaSteam", "wovenPattern", "starfield", "cosmicObservatory", "aurora", "snow", "moonOrbit", "lanterns", "doveGarland", "laurelTorch"],
  ["snow", "lanterns", "candle", "moonOrbit", "starfield", "cosmicObservatory", "musicWaves", "teaSteam", "aurora", "paperCut", "stainedGlass", "crescentLantern"]
];

const SEASONAL_MOTIF_COPY = {
  snow: {
    titles: ["雪光", "霜窗", "冷白"],
    descriptions: ["清冷的雪意和低色温光线让这一天更安静。", "像窗边凝住的寒光，适合留一点留白。", "冷白色的空气把季节压低，也让微光更清楚。"]
  },
  candle: {
    titles: ["窗灯", "暖烛", "夜灯"],
    descriptions: ["一点暖光把冷空气收拢起来，让日历显得更向内。", "烛光感让这一天不只是寒冷，也有安定的室内气息。", "夜灯和暗色背景给桌面留出更清楚的阅读空间。"]
  },
  moonOrbit: {
    titles: ["月轨", "夜潮", "微月"],
    descriptions: ["月相般的轨迹给潮湿或清冷的日子留出缓慢节奏。", "夜色和潮气叠在一起，画面更像一个安静的天象切片。", "微光绕开正中央，让日历主体保持干净。"]
  },
  teaSteam: {
    titles: ["茶汽", "暖雾", "杯影"],
    descriptions: ["蒸汽一样的线条让季节有一点日常的温度。", "暖雾散开，给冷色背景添一点柔和的生活感。", "杯影和细线让画面更安静，不去抢日历主体。"]
  },
  springBuds: {
    titles: ["新芽", "枝信", "青芽"],
    descriptions: ["细小的新芽让季节显得轻一点，像刚展开的日历页。", "枝条和浅绿把空气拉开，保留春天刚出现的弹性。", "青色的小形状让画面更有生长感。"]
  },
  rainGarden: {
    titles: ["雨庭", "雨幕", "湿光"],
    descriptions: ["雨线和庭院感让这一天带着湿润、清亮的层次。", "细雨像一层轻幕，压低对比度，也让桌面更耐看。", "湿光铺在背景上，画面更丰沛但不过分热闹。"]
  },
  paperKites: {
    titles: ["纸鸢", "风线", "晴风"],
    descriptions: ["纸鸢和风线让画面有向上的轻快感。", "细线穿过边角，像风把日历轻轻提起来。", "晴风主题给普通的一天一点明亮的动势。"]
  },
  petals: {
    titles: ["花影", "花信", "柔瓣"],
    descriptions: ["花瓣形状提供柔和的节奏，不让画面显得单调。", "花信感更轻，适合普通日子里的小变化。", "柔瓣装饰把色彩压得更细，也更像插画。"]
  },
  waterFlowers: {
    titles: ["水花", "水纹", "潮色"],
    descriptions: ["水面花影让湿润的季节感更具体。", "水纹把背景分成更细的层次，避免大面积色块重复。", "潮色在边缘铺开，让这一天有一点清凉的波动。"]
  },
  wovenPattern: {
    titles: ["织纹", "经纬", "布纹"],
    descriptions: ["织纹让普通日子多一点手作质感。", "经纬线条给画面秩序感，也让背景更耐看。", "布纹感比纯装饰更克制，适合长期使用。"]
  },
  grain: {
    titles: ["麦色", "谷光", "穗影"],
    descriptions: ["谷物色调让画面更温暖，也更接近季节里的土地感。", "谷光带来一点收获感，但不把主题说成具体节日。", "穗影让边角有节奏，中心仍保持清楚。"]
  },
  harvestSheaves: {
    titles: ["麦束", "谷束", "金穗"],
    descriptions: ["成束的谷物形状让日子更有插画感。", "谷束比单纯色块更有层次，也减少重复。", "金穗带来温暖的边缘装饰，不影响文字阅读。"]
  },
  sunRibbons: {
    titles: ["长昼", "日带", "晴弧"],
    descriptions: ["长昼感用细亮色带表现，明亮但不刺眼。", "日带从边缘穿过，让普通日子也有一点节庆气息。", "晴弧让画面更开阔，像日光划过背景。"]
  },
  lanterns: {
    titles: ["灯影", "小灯", "光串"],
    descriptions: ["小灯串给普通日子一点轻微的庆祝感。", "灯影悬在边缘，既有氛围，也不会抢掉日历。", "光串让背景更有节奏，适合夜色或暖色主题。"]
  },
  aurora: {
    titles: ["天光", "流光", "山色"],
    descriptions: ["流动天光让背景更有纵深。", "柔和的光带给冷色背景增加变化。", "山色和天光让画面更开阔，不像固定模板。"]
  },
  paperCut: {
    titles: ["剪影", "纸纹", "红金"],
    descriptions: ["剪纸式几何让画面更像节日插画，但不绑定具体节日。", "纸纹给边角增加手工质感。", "红金元素提供一点仪式感，同时保持背景克制。"]
  },
  starfield: {
    titles: ["星图", "夜星", "星线"],
    descriptions: ["星图让普通夜色更有空间感。", "夜星细碎分布，给背景一点安静的闪动。", "星线把画面连起来，但不制造视觉噪音。"]
  },
  dragonDance: {
    titles: ["龙影", "鳞光", "红舞"],
    descriptions: ["弧形龙身和流苏让普通日子也带一点东亚节庆的动势。", "细鳞片把红金色压成纹理，热闹但不遮挡主体。", "红色舞龙构图让画面更像节日插画。"]
  },
  crescentLantern: {
    titles: ["月灯", "弯月", "星灯"],
    descriptions: ["新月与悬灯提供安静的夜色仪式感。", "弯月和星点让深色背景有更柔和的层次。", "灯影悬在边缘，给普通夜色一点节庆感。"]
  },
  lotusMandala: {
    titles: ["莲环", "曼荼", "花轮"],
    descriptions: ["莲花环和几何花瓣带来南亚与佛教文化里的静定感。", "曼荼罗式结构让画面更完整，也更像一张节庆海报。", "花轮在上下呼应，中心保持干净。"]
  },
  templeBells: {
    titles: ["钟影", "檐铃", "香线"],
    descriptions: ["钟形轮廓和香烟线让画面带一点宗教场所的庄重。", "檐铃式的细线给边角增加节奏。", "温暖钟影让深色背景更有仪式感。"]
  },
  carnivalMasks: {
    titles: ["面具", "彩羽", "游彩"],
    descriptions: ["面具、羽饰和彩带让普通日子更有街头庆典的辨识度。", "彩羽构图比单纯飘带更有角色感。", "游行式装饰给画面一点表演节奏。"]
  },
  folkEmbroidery: {
    titles: ["绣纹", "菱绣", "线纹"],
    descriptions: ["对称刺绣和菱形纹给画面加一点地方手工质感。", "绣线式边框让背景更细密，也减少重复感。", "民俗纹样让普通日期不只是抽象装饰。"]
  },
  cityParade: {
    titles: ["旗街", "巡游", "城彩"],
    descriptions: ["城市旗列和街道节奏让画面更接近公共庆典。", "巡游构图让上下边缘有明确方向。", "城市节庆感适合国庆、公众节日和普通夏日。"]
  },
  maritimeFlags: {
    titles: ["海旗", "港灯", "潮旗"],
    descriptions: ["航海旗和波线让画面带着港口与岛屿气息。", "港灯感的竖线给海色背景增加秩序。", "潮旗把水纹和旗色组合成更具体的主视觉。"]
  },
  desertGeometry: {
    titles: ["沙纹", "星沙", "几何"],
    descriptions: ["沙丘曲线和几何星纹让暖色背景更有地域气质。", "星形几何比普通日光更有文化辨识度。", "沙纹构图让画面开阔但不过分空。"]
  },
  tropicalBloom: {
    titles: ["岛花", "阔叶", "热花"],
    descriptions: ["大叶和热带花让岛屿主题更鲜明。", "阔叶把边角撑开，中心仍留给文字。", "热带花影给普通夏日更多生命力。"]
  },
  oliveBranches: {
    titles: ["橄榄", "枝环", "绿冠"],
    descriptions: ["橄榄枝和和平环让画面更克制、典雅。", "枝环式装饰适合纪念、文化与公共主题。", "绿色叶片让深色背景更安静。"]
  },
  laurelTorch: {
    titles: ["桂冠", "火炬", "纪光"],
    descriptions: ["桂冠与火炬带来纪念碑式的公共仪式感。", "火光集中在边缘，让画面庄重但不刺眼。", "桂冠结构让普通日子也有清晰主视觉。"]
  },
  sportsMedals: {
    titles: ["奖章", "跑道", "金弧"],
    descriptions: ["奖牌和跑道弧线让公共活动主题更有运动感。", "金色圆章给画面一点胜利和参与的气息。", "跑道弧线提供清楚的动势。"]
  },
  bookPress: {
    titles: ["书页", "铅字", "印纹"],
    descriptions: ["书页和铅字块让文化日更像知识与出版主题。", "印刷纹理提供稳定的版式感。", "书页构图比星点更贴近阅读和语言主题。"]
  },
  marketBanners: {
    titles: ["市棚", "彩摊", "集旗"],
    descriptions: ["摊棚和三角旗让画面有社区集市的温度。", "彩摊结构让节庆更落地，也更有人间烟火。", "集旗在上下边缘形成轻快节奏。"]
  },
  ancestralTable: {
    titles: ["供桌", "烛台", "花祭"],
    descriptions: ["供桌、烛台和花枝让追思主题更具体。", "低亮烛光让画面保持安静的纪念感。", "花祭式边角装饰适合祖先与亡灵相关日子。"]
  },
  doveGarland: {
    titles: ["鸽环", "静羽", "白光"],
    descriptions: ["抽象鸽影和花环让和平、追思主题更柔和。", "静羽形状让深色背景多一点安定感。", "白光点缀让纪念主题不显沉重。"]
  },
  stainedGlass: {
    titles: ["彩窗", "玫窗", "光格"],
    descriptions: ["彩窗分割线让宗教节日更有建筑与光感。", "玫瑰窗式构图提供清晰的中心装饰。", "光格纹理让深色背景更像节庆插画。"]
  },
  musicWaves: {
    titles: ["乐谱", "声浪", "节拍"],
    descriptions: ["五线谱、音符和柔和声浪让画面带着音乐节奏。", "声浪从边缘散开，热闹却不会压住日历。", "轻快节拍给文化日和普通夜晚增加一点流动感。"]
  },
  cosmicObservatory: {
    titles: ["星台", "轨镜", "远望"],
    descriptions: ["观测镜与行星轨迹把夜空变成一张安静的探索图。", "轨道和透镜形状让科学主题比普通星点更具体。", "远望宇宙的构图给深色背景增加开阔感。"]
  },
  gardenGate: {
    titles: ["花门", "藤廊", "绿径"],
    descriptions: ["花门和藤蔓把春夏植物感组织成一座安静庭园。", "藤廊沿边缘生长，让中心保持清楚。", "绿径与小花给生态主题增加温和的纵深。"]
  },
  oceanCompass: {
    titles: ["海针", "罗盘", "航线"],
    descriptions: ["罗盘玫瑰与潮汐线让海洋主题有明确的航行方向。", "航海刻度给蓝色背景增加秩序和探索感。", "航线穿过边角，像一张克制的海图。"]
  }
};
