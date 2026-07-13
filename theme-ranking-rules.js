// Shared ranking metadata and scoring helpers for holiday theme selection.
//
// This file intentionally exposes a global namespace so it can be loaded both
// by browser script tags and by Node ESM maintenance scripts.

globalThis.ThemeRankingRules = (() => {
  const MAINSTREAM_COUNTRY_CODES = new Set(["CN", "US", "JP", "SG", "GB", "FR", "CA", "AU", "DE", "IT", "ES", "KR"]);

  const POPULARITY_PATTERNS = [
    ["iconic", /lunar new year|chinese new year|spring festival|春节|new year's day|christmas day/i],
    ["major", /new year|christmas|easter|halloween|thanksgiving|mid-?autumn|moon festival|中秋|dragon boat|端午/i],
    ["major", /diwali|eid|ramadan|vesak|buddha|qingming|清明|valentine/i],
    ["common", /children'?s day|mother'?s day|father'?s day|earth day|workers'? day|labou?r day|may day/i],
    ["common", /national day|independence day|bastille day|constitution day|republic day|foundation day|unity day/i],
    ["observance", /world |international /i]
  ];

  const POPULARITY_BONUS = {
    iconic: 26,
    major: 20,
    common: 12,
    observance: 8,
    niche: 0,
    local: -16
  };

  const CULTURAL_BALANCE_CLUSTERS = [
    ["civic", ["civic"]],
    ["religious", ["religious", "islamic"]],
    ["remembrance", ["remembrance", "memorial"]],
    ["heritage", ["heritage", "folk", "culture", "literature"]],
    ["celebration", ["celebration", "procession", "market"]],
    ["maritime", ["maritime", "island"]],
    ["nature", ["botanical", "water", "mountain"]],
    ["knowledge", ["science", "music", "sports"]]
  ];

  const HOLIDAY_FAMILY_PATTERNS = [
    ["environmental-observance", /\bworld (nature|environment|ocean|water|wildlife|earth)|earth day|environment|ecology|forest|wildlife|海洋|环境|自然/i],
    ["health-observance", /\bworld (health|aids|blood|mental health|diabetes|cancer)|health day|卫生|健康/i],
    ["rights-observance", /\bworld (refugee|human rights|children|women|press freedom)|human rights|refugee|equality|tolerance|人权|难民/i],
    ["peace-observance", /\bworld peace|\binternational day of peace\b|\bpeace day\b|和平/i],
    ["culture-observance", /\bworld (book|poetry|theatre|music|radio|language)|international (jazz|museum|mother language)|文化|语言|音乐|诗歌|博物馆/i],
    ["science-observance", /\bworld (science|space)|international day of mathematics|pi day|science|space|astronomy|technology|科学|太空/i],
    ["independence-day", /\bindependence day\b|独立/i],
    ["national-day", /\bnational day\b|国庆|国家日/i],
    ["constitution-day", /\bconstitution day\b|宪法/i],
    ["republic-day", /\brepublic day\b|共和国/i],
    ["foundation-day", /\bfoundation day\b|建国|奠基/i],
    ["establishment-day", /\bestablishment day\b|establishment|成立/i],
    ["unity-day", /\bunity day\b|统一/i],
    ["emancipation-day", /\bemancipation day\b|解放/i],
    ["revolution-day", /\brevolution\b|革命/i],
    ["national-symbol-day", /\bflag\b|\banthem\b|国旗|国歌/i],
    ["heroes-day", /\bheroes'? day\b|英雄/i],
    ["municipal-local", /\bmunicipal holiday\b|\bcity day\b|\btown day\b|\bcommunal holiday\b|地方性|地方假日/i],
    ["saint-day", /\bst\.?\s|\bsaints?\b|\bsankt\b|\bsan |\bsanta |\bsanto /i],
    ["new-year", /\bnew year\b|新年|春节/i],
    ["christmas", /\bchristmas\b|圣诞/i],
    ["easter", /\beaster\b|复活节/i],
    ["labour-day", /\blabou?r day\b|\bworkers'? day\b|\bmay day\b|劳动/i],
    ["remembrance", /\bremembrance\b|\bmemorial\b|追思|纪念/i],
    ["international-observance", /\bworld\b|\binternational\b|国际/i]
  ];

  const FIXED_HOLIDAY_SOURCES = {
    "01-01|New Year's Day": ["INTL", "International", "国际"],
    "02-14|Valentine's Day": ["INTL", "International", "国际"],
    "03-17|Saint Patrick's Day": ["IE", "Ireland", "爱尔兰"],
    "04-13|Songkran": ["TH", "Thailand", "泰国"],
    "04-22|Earth Day": ["INTL", "International", "国际"],
    "05-01|International Workers' Day": ["INTL", "International", "国际"],
    "05-05|Children's Day Japan": ["JP", "Japan", "日本"],
    "06-04|Tonga Emancipation Day": ["TO", "Tonga", "汤加"],
    "06-17|Iceland National Day": ["IS", "Iceland", "冰岛"],
    "06-18|Seychelles National Day": ["SC", "Seychelles", "塞舌尔"],
    "06-25|Mozambique Independence Day": ["MZ", "Mozambique", "莫桑比克"],
    "06-29|Seychelles Independence Day": ["SC", "Seychelles", "塞舌尔"],
    "07-04|Independence Day": ["US", "United States", "美国"],
    "07-07|Tanabata": ["JP", "Japan", "日本"],
    "07-14|Bastille Day": ["FR", "France", "法国"],
    "07-26|Maldives Independence Day": ["MV", "Maldives", "马尔代夫"],
    "07-30|Vanuatu Independence Day": ["VU", "Vanuatu", "瓦努阿图"],
    "08-01|Swiss National Day": ["CH", "Switzerland", "瑞士"],
    "08-09|Singapore National Day": ["SG", "Singapore", "新加坡"],
    "09-03|San Marino Foundation Day": ["SM", "San Marino", "圣马力诺"],
    "09-08|Andorra National Day": ["AD", "Andorra", "安道尔"],
    "09-16|Mexico Independence Day": ["MX", "Mexico", "墨西哥"],
    "10-01|Tuvalu Independence Day": ["TV", "Tuvalu", "图瓦卢"],
    "10-03|Germany Unity Day": ["DE", "Germany", "德国"],
    "10-31|Halloween": ["INTL", "International", "国际"],
    "11-01|All Saints' Day": ["INTL", "International", "国际"],
    "11-02|Dia de Muertos": ["MX", "Mexico", "墨西哥"],
    "11-11|Remembrance Day": ["GB", "United Kingdom", "英国"],
    "12-13|Saint Lucia Day": ["SE", "Sweden", "瑞典"],
    "12-17|Bhutan National Day": ["BT", "Bhutan", "不丹"],
    "12-24|Christmas Eve": ["INTL", "International", "国际"],
    "12-25|Christmas Day": ["INTL", "International", "国际"],
    "12-31|New Year's Eve": ["INTL", "International", "国际"]
  };

  const IMPORTANT_TAG_RULES = [
    ["civic", ["civic", "celebration", "procession", "remembrance", "maritime"]],
    ["religious", ["religious", "islamic", "heritage", "light", "botanical"]],
    ["islamic", ["islamic", "religious", "light", "heritage", "sun"]],
    ["remembrance", ["remembrance", "memorial", "light", "heritage", "botanical"]],
    ["memorial", ["remembrance", "memorial", "light", "heritage", "botanical"]]
  ];

  function textForTheme(theme = {}) {
    return [
      theme.title,
      theme.caption,
      theme.localName,
      theme.source?.localName,
      Array.isArray(theme.source?.typeLabels) ? theme.source.typeLabels.join(" ") : ""
    ].filter(Boolean).join(" ");
  }

  function normalizeText(value) {
    return String(value || "").toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();
  }

  function inferHolidayFamily(theme = {}) {
    if (theme.holidayFamily) return theme.holidayFamily;
    const text = normalizeText(textForTheme(theme));
    for (const [family, pattern] of HOLIDAY_FAMILY_PATTERNS) {
      if (pattern.test(text)) return family;
    }

    const tags = Array.isArray(theme.tags) ? theme.tags : [];
    const scopeTier = inferScopeTier(theme);
    if (tags.includes("month-mood")) return "seasonal-fallback";
    if (tags.includes("religious") || tags.includes("islamic")) return "religious-observance";
    if (tags.includes("remembrance") || tags.includes("memorial")) return "remembrance";
    if (tags.includes("civic") && scopeTier === "national") return "national-civic-day";
    if (tags.includes("civic") && (scopeTier === "regional" || scopeTier === "local")) return "municipal-local";
    if (tags.includes("science")) return "science-observance";
    if (tags.includes("music") || tags.includes("literature") || tags.includes("culture") || tags.includes("heritage") || tags.includes("folk")) return "culture-observance";
    if (tags.includes("botanical") || tags.includes("water") || tags.includes("maritime")) return "environmental-observance";
    if (theme.source?.countryCode === "INTL") return "international-observance";
    if (scopeTier === "regional" || scopeTier === "local") return "municipal-local";
    if (theme.source?.provider) return "public-holiday";
    return "uncategorized-theme";
  }

  function inferScopeTier(theme = {}) {
    if (theme.scopeTier) return theme.scopeTier;
    const source = theme.source || {};
    const typeLabels = normalizeText(Array.isArray(source.typeLabels) ? source.typeLabels.join(" ") : "");
    const text = normalizeText(textForTheme(theme));
    if (source.countryCode === "INTL") return "international";
    if (source.nationwide === true || /public|公众节日|national|全国性|federal/.test(typeLabels)) return "national";
    if (source.nationwide === false || /地方性|local|municipal|city|town|communal|regional|state/.test(`${text} ${typeLabels}`)) return "local";
    if (Array.isArray(source.subdivisions) && source.subdivisions.length > 0) return "regional";
    return "unknown";
  }

  function inferPopularityTier(theme = {}) {
    if (theme.popularityTier) return theme.popularityTier;
    const text = textForTheme(theme);
    let tier = inferScopeTier(theme) === "local" ? "local" : "niche";
    for (const [candidateTier, pattern] of POPULARITY_PATTERNS) {
      if (pattern.test(text)) {
        tier = higherPopularityTier(tier, candidateTier);
      }
    }
    return tier;
  }

  function higherPopularityTier(left, right) {
    const order = ["local", "niche", "observance", "common", "major", "iconic"];
    return order.indexOf(right) > order.indexOf(left) ? right : left;
  }

  function popularityBonus(theme = {}) {
    if (theme.tags?.includes("month-mood")) return 0;
    const source = theme.source || {};
    const typeLabels = normalizeText(Array.isArray(source.typeLabels) ? source.typeLabels.join(" ") : "");
    const scopeTier = inferScopeTier(theme);
    let bonus = POPULARITY_BONUS[inferPopularityTier(theme)] ?? 0;

    if (scopeTier === "national") bonus += 8;
    if (scopeTier === "international") bonus += 6;
    if (/public|公众节日|national|federal/.test(typeLabels)) bonus += 6;
    if (MAINSTREAM_COUNTRY_CODES.has(source.countryCode)) bonus += 4;
    if (scopeTier === "regional") bonus -= 8;
    if (scopeTier === "local") bonus -= 14;
    if (Array.isArray(source.subdivisions) && source.subdivisions.length > 0) bonus -= 10;
    if (inferHolidayFamily(theme) === "saint-day" && bonus < 16) bonus -= 6;

    return Math.max(-22, Math.min(36, bonus));
  }

  function motifDiversityPenalty(theme = {}, avoidMotifs = []) {
    const recentMotifs = avoidMotifs.slice(-7);
    const recentIndex = recentMotifs.lastIndexOf(theme.motif);
    if (recentIndex === -1) return 0;
    const recency = recentMotifs.length - recentIndex;
    const occurrences = recentMotifs.filter((motif) => motif === theme.motif).length;
    const monthMoodPenalty = theme.tags?.includes("month-mood") ? 12 : 0;
    const recencyPenalty = [0, 36, 28, 20, 14, 10, 7, 5][recency] || 0;
    const frequencyPenalty = Math.max(0, occurrences - 1) * 10;
    return recencyPenalty + frequencyPenalty + monthMoodPenalty;
  }

  function culturalDiversityPenalty(theme = {}, recentThemes = []) {
    if (!recentThemes.length || theme.tags?.includes("month-mood")) return 0;

    const recent = recentThemes.slice(-10);
    const source = theme.source || {};
    const countryCode = source.countryCode && source.countryCode !== "INTL" ? source.countryCode : "";
    const clusters = culturalClusters(theme);
    let penalty = 0;

    if (countryCode) {
      const countries = recent.map((entry) => entry?.source?.countryCode || entry?.countryCode || "").filter((code) => code && code !== "INTL");
      const recentIndex = countries.lastIndexOf(countryCode);
      if (recentIndex !== -1) {
        const recency = countries.length - recentIndex;
        penalty += [0, 26, 20, 14, 9, 6][recency] || 4;
      }
      const occurrences = countries.filter((code) => code === countryCode).length;
      penalty += Math.max(0, occurrences - 1) * 7;
    }

    const clusterRecencyPenalty = [0, 16, 11, 7, 4];
    for (let offset = 1; offset <= Math.min(4, recent.length); offset++) {
      const entry = recent[recent.length - offset];
      const overlap = culturalClusters(entry).filter((cluster) => clusters.includes(cluster));
      if (overlap.length > 0) {
        penalty += clusterRecencyPenalty[offset] + Math.min(6, overlap.length * 2);
      }
    }

    return Math.min(42, penalty);
  }

  function culturalClusters(theme = {}) {
    const tags = Array.isArray(theme.tags) ? theme.tags : [];
    return CULTURAL_BALANCE_CLUSTERS
      .filter(([, clusterTags]) => clusterTags.some((tag) => tags.includes(tag)))
      .map(([cluster]) => cluster);
  }

  function fixedHolidaySource(monthDay, title) {
    const source = FIXED_HOLIDAY_SOURCES[`${monthDay}|${title}`];
    const [countryCode, countryName, zhName] = source || ["INTL", "International", "国际"];
    return {
      provider: "Fixed Holidays",
      countryCode,
      countryName,
      zhName,
      localName: title,
      typeLabels: countryCode === "INTL" ? ["国际日"] : ["公众节日"],
      nationwide: true
    };
  }

  function withRankingMetadata(theme = {}) {
    return {
      ...theme,
      holidayFamily: inferHolidayFamily(theme),
      popularityTier: inferPopularityTier(theme),
      scopeTier: inferScopeTier(theme)
    };
  }

  function averageGradientLab(theme = {}) {
    const gradient = Array.isArray(theme.gradient) ? theme.gradient : [];
    const labs = [gradient[0], gradient[1], gradient[1], gradient[2]]
      .map(hexToLab)
      .filter(Boolean);
    if (!labs.length) return null;
    return labs.reduce((sum, lab) => [
      sum[0] + lab[0],
      sum[1] + lab[1],
      sum[2] + lab[2]
    ], [0, 0, 0]).map((value) => value / labs.length);
  }

  function colorDistance(leftTheme, rightTheme) {
    const left = averageGradientLab(leftTheme);
    const right = averageGradientLab(rightTheme);
    if (!left || !right) return null;
    return Math.sqrt((left[0] - right[0]) ** 2 + (left[1] - right[1]) ** 2 + (left[2] - right[2]) ** 2);
  }

  function colorSimilarity(leftTheme, rightTheme) {
    const distance = colorDistance(leftTheme, rightTheme);
    if (distance === null) return 0;
    return Math.max(0, 1 - Math.min(distance, 100) / 100);
  }

  function holidayFamilyDiversityPenalty(theme = {}, recentThemes = []) {
    if (!recentThemes.length || theme.tags?.includes("month-mood")) return 0;

    const currentFamily = inferHolidayFamily(theme);
    if (!currentFamily) return 0;
    if (currentFamily === "uncategorized-theme" || currentFamily === "seasonal-fallback") return 0;

    const currentTitle = normalizeText(theme.title || "");
    const recent = recentThemes.slice(-5);
    let penalty = 0;

    for (let index = 0; index < recent.length; index++) {
      const entry = recent[index];
      const recentFamily = inferHolidayFamily(entry);
      if (recentFamily === "uncategorized-theme" || recentFamily === "seasonal-fallback") continue;
      if (recentFamily !== currentFamily) continue;

      const offset = recent.length - index;
      penalty += [0, 38, 24, 14, 8, 5][offset] || 4;

      const recentTitle = normalizeText(entry?.title || "");
      if (currentTitle && currentTitle === recentTitle) {
        penalty += [0, 10, 7, 4, 2, 1][offset] || 1;
      }
    }

    return Math.min(48, penalty);
  }

  function colorDiversityPenalty(theme = {}, recentThemes = []) {
    const recent = recentThemes
      .filter((entry) => colorDistance(theme, entry) !== null)
      .slice(-4);

    let penalty = 0;
    for (let index = 0; index < recent.length; index++) {
      const offset = recent.length - index;
      const similarity = colorSimilarity(theme, recent[index]);
      if (similarity >= 0.88) {
        penalty += [0, 34, 20, 12, 8][offset] || 5;
      } else if (similarity >= 0.78) {
        penalty += [0, 20, 12, 7, 4][offset] || 3;
      }
    }

    return Math.min(42, penalty);
  }

  function hexToLab(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    return xyzToLab(rgbToXyz(rgb));
  }

  function hexToRgb(hex) {
    if (typeof hex !== "string") return null;
    const value = hex.trim().replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(value)) return null;
    return [
      parseInt(value.slice(0, 2), 16),
      parseInt(value.slice(2, 4), 16),
      parseInt(value.slice(4, 6), 16)
    ];
  }

  function rgbToXyz([r, g, b]) {
    const [sr, sg, sb] = [r, g, b].map((channel) => {
      const value = channel / 255;
      return value > 0.04045 ? ((value + 0.055) / 1.055) ** 2.4 : value / 12.92;
    });
    return [
      (sr * 0.4124 + sg * 0.3576 + sb * 0.1805) * 100,
      (sr * 0.2126 + sg * 0.7152 + sb * 0.0722) * 100,
      (sr * 0.0193 + sg * 0.1192 + sb * 0.9505) * 100
    ];
  }

  function xyzToLab([x, y, z]) {
    const [xr, yr, zr] = [x / 95.047, y / 100, z / 108.883].map((value) => (
      value > 0.008856 ? Math.cbrt(value) : (7.787 * value) + 16 / 116
    ));
    return [
      (116 * yr) - 16,
      500 * (xr - yr),
      200 * (yr - zr)
    ];
  }

  function isAllowedMotifSubstitution(theme = {}, motif, motifTagsByName = {}) {
    const themeTags = Array.isArray(theme.tags) ? theme.tags : [];
    const candidateTags = motifTagsByName[motif] || [];
    for (const [importantTag, allowedTags] of IMPORTANT_TAG_RULES) {
      if (!themeTags.includes(importantTag)) continue;
      if (!candidateTags.some((tag) => allowedTags.includes(tag))) return false;
    }
    return true;
  }

  function scoreBreakdown(parts) {
    const breakdown = {
      basePriority: roundScore(parts.basePriority || 0),
      popularity: roundScore(parts.popularity || 0),
      jitter: roundScore(parts.jitter || 0),
      motifPenalty: roundScore(parts.motifPenalty || 0),
      culturalPenalty: roundScore(parts.culturalPenalty || 0),
      holidayFamilyPenalty: roundScore(parts.holidayFamilyPenalty || 0),
      colorPenalty: roundScore(parts.colorPenalty || 0)
    };
    breakdown.finalScore = roundScore(
      breakdown.basePriority +
      breakdown.popularity +
      breakdown.jitter -
      breakdown.motifPenalty -
      breakdown.culturalPenalty -
      breakdown.holidayFamilyPenalty -
      breakdown.colorPenalty
    );
    return breakdown;
  }

  function roundScore(value) {
    return Math.round(value * 1000) / 1000;
  }

  return {
    culturalClusters,
    culturalDiversityPenalty,
    colorDiversityPenalty,
    fixedHolidaySource,
    holidayFamilyDiversityPenalty,
    inferHolidayFamily,
    inferPopularityTier,
    inferScopeTier,
    isAllowedMotifSubstitution,
    motifDiversityPenalty,
    popularityBonus,
    scoreBreakdown,
    colorDistance,
    colorSimilarity,
    withRankingMetadata
  };
})();
