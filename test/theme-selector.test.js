import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const selectorSource = fs.readFileSync(new URL("../theme-selector.js", import.meta.url), "utf8");
const rankingRulesSource = fs.readFileSync(new URL("../theme-ranking-rules.js", import.meta.url), "utf8");

function monthDay(date) {
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function candidate(title, motif, priority, tags = [], source = null, gradient = ["#111111", "#222222", "#333333"]) {
  return {
    title,
    caption: title,
    motif,
    gradient,
    accent: "#ffffff",
    secondary: "#999999",
    priority,
    tags,
    source
  };
}

function loadSelector(overrides = {}) {
  const context = vm.createContext({
    ThemeEngineInternals: {
      MOTIF_TAGS: {},
      MONTH_MOTIF_ROTATION: Array.from({ length: 12 }, () => []),
      FIXED_HOLIDAYS: [],
      FLOATING_RULES: [],
      applyPaletteAtmosphere: (theme) => ({ ...theme, atmosphereApplied: true }),
      cachedHolidayThemes: () => [],
      createTheme: (theme) => ({ ...theme, tags: theme.tags || [] }),
      fallbackThemes: () => [candidate("Fallback", "aurora", 30, ["month-mood"])],
      monthDay,
      seedForDate: () => 123,
      seededJitter: () => 0,
      themeVariant: () => 99,
      ...overrides
    }
  });

  vm.runInContext(rankingRulesSource, context, { filename: "theme-ranking-rules.js" });
  vm.runInContext(selectorSource, context, { filename: "theme-selector.js" });
  return context.ThemeEngine;
}

test("cached provider themes are retained while fixed holidays can still compete", () => {
  const cached = candidate("Provider Holiday", "lanterns", 110);
  const selector = loadSelector({
    cachedHolidayThemes: () => [cached],
    FIXED_HOLIDAYS: [
      ["06-18", "Fixed Holiday", "Fixed Holiday", "fireworks", ["#111111", "#222222", "#333333"], "#ffffff", "#999999", 99]
    ]
  });

  const ranked = selector.rankDailyThemes(new Date(2026, 5, 18));

  assert.equal(ranked.length, 2);
  assert.equal(ranked[0].theme.title, "Provider Holiday");
  assert.equal(ranked[0].theme.atmosphereApplied, true);
  assert.equal(ranked[1].theme.title, "Fixed Holiday");
  assert.ok(ranked[0].scoreBreakdown);
  assert.equal(ranked[0].scoreBreakdown.finalScore, ranked[0].score);
});

test("fixed holidays are used before seasonal fallbacks", () => {
  const selector = loadSelector({
    FIXED_HOLIDAYS: [
      ["06-18", "Fixed Holiday", "Fixed Holiday", "fireworks", ["#111111", "#222222", "#333333"], "#ffffff", "#999999", 80]
    ]
  });

  assert.equal(selector.getDailyTheme(new Date(2026, 5, 18)).title, "Fixed Holiday");
});

test("seasonal fallbacks preserve rank metadata when no holiday matches", () => {
  const selector = loadSelector({
    fallbackThemes: () => [
      candidate("Lower fallback", "snow", 20, ["month-mood"]),
      candidate("Higher fallback", "aurora", 30, ["month-mood"])
    ]
  });

  const ranked = selector.rankDailyThemes(new Date(2026, 5, 19));

  assert.deepEqual(
    Array.from(ranked, ({ rank, sourceIndex, rankSeed, theme }) => ({ rank, sourceIndex, rankSeed, title: theme.title })),
    [
      { rank: 0, sourceIndex: 1, rankSeed: 123, title: "Higher fallback" },
      { rank: 1, sourceIndex: 0, rankSeed: 123, title: "Lower fallback" }
    ]
  );
});

test("recent motif use can move a fresher candidate to the top", () => {
  const selector = loadSelector({
    cachedHolidayThemes: () => [
      candidate("Repeated visual", "fireworks", 70),
      candidate("Fresh visual", "snow", 60)
    ]
  });

  const ranked = selector.rankDailyThemes(new Date(2026, 5, 20), {
    avoidMotifs: ["fireworks"]
  });

  assert.equal(ranked[0].theme.title, "Fresh visual");
  assert.equal(ranked[0].score, 60);
  assert.equal(ranked[1].score, 34);
});

test("widely recognized holidays can beat slightly higher-priority local holidays", () => {
  const selector = loadSelector({
    cachedHolidayThemes: () => [
      candidate("Local Municipal Holiday", "wovenPattern", 82, ["civic"], {
        provider: "OpenHolidays",
        countryCode: "DE",
        countryName: "Germany",
        typeLabels: ["地方假日"],
        nationwide: false,
        subdivisions: ["BE"]
      }),
      candidate("New Year's Day", "fireworks", 64, ["celebration"], {
        provider: "Nager.Date",
        countryCode: "US",
        countryName: "United States",
        typeLabels: ["Public"],
        nationwide: true
      })
    ]
  });

  const ranked = selector.rankDailyThemes(new Date(2026, 0, 1));

  assert.equal(ranked[0].theme.title, "New Year's Day");
  assert.ok(ranked[0].score > ranked[1].score);
});

test("fixed mainstream holidays still compete when provider cache only has local holidays", () => {
  const selector = loadSelector({
    cachedHolidayThemes: () => [
      candidate("Municipal holiday", "wovenPattern", 58, ["culture", "civic"], {
        provider: "OpenHolidays",
        countryCode: "PT",
        countryName: "Portugal",
        typeLabels: ["可选假日", "地方性"],
        nationwide: false,
        subdivisions: ["CO-CO"]
      })
    ],
    FIXED_HOLIDAYS: [
      ["07-04", "Independence Day", "Independence Day · 烟火照亮夏夜", "fireworks", ["#111111", "#222222", "#333333"], "#ffffff", "#999999", 78]
    ]
  });

  const ranked = selector.rankDailyThemes(new Date(2026, 6, 4));

  assert.equal(ranked[0].theme.title, "Independence Day");
  assert.equal(ranked[0].theme.source.countryCode, "US");
  assert.equal(ranked[0].theme.holidayFamily, "independence-day");
  assert.equal(ranked[1].theme.title, "Municipal holiday");
});

test("recent country and cultural cluster repetition can move a different public theme ahead", () => {
  const selector = loadSelector({
    cachedHolidayThemes: () => [
      candidate("China National Day", "fireworks", 84, ["civic", "celebration"], {
        provider: "Nager.Date",
        countryCode: "CN",
        countryName: "China",
        typeLabels: ["Public"],
        nationwide: true
      }),
      candidate("World Oceans Day", "oceanCompass", 72, ["maritime", "water"], {
        provider: "Curated Cultural Observances",
        countryCode: "INTL",
        countryName: "International",
        typeLabels: ["国际日"]
      })
    ]
  });

  const ranked = selector.rankDailyThemes(new Date(2026, 9, 1), {
    recentThemes: [
      {
        title: "China Public Holiday",
        motif: "cityParade",
        tags: ["civic"],
        source: { countryCode: "CN" }
      },
      {
        title: "China Civic Holiday",
        motif: "streamers",
        tags: ["civic", "celebration"],
        source: { countryCode: "CN" }
      }
    ]
  });

  assert.equal(ranked[0].theme.title, "World Oceans Day");
  assert.ok(ranked[0].score > ranked[1].score);
});

test("recently similar background colors can move a fresher palette ahead", () => {
  const selector = loadSelector({
    cachedHolidayThemes: () => [
      candidate("Deep Red Follow-up", "fireworks", 72, ["celebration"], null, ["#25080c", "#8f171c", "#12090a"]),
      candidate("Blue Counterpoint", "oceanCompass", 62, ["maritime"], null, ["#101d34", "#263a54", "#111316"])
    ]
  });

  const ranked = selector.rankDailyThemes(new Date(2026, 6, 7), {
    recentThemes: [
      {
        title: "Yesterday Red",
        motif: "lanterns",
        tags: ["celebration"],
        gradient: ["#24080d", "#8a171e", "#13090a"]
      }
    ]
  });

  assert.equal(ranked[0].theme.title, "Blue Counterpoint");
  assert.ok(ranked[0].score > ranked[1].score);
});

test("recently repeated holiday families can move a fresher holiday topic ahead", () => {
  const selector = loadSelector({
    cachedHolidayThemes: () => [
      candidate("Independence Day", "fireworks", 82, ["civic", "celebration"], {
        provider: "Nager.Date",
        countryCode: "GH",
        countryName: "Ghana",
        typeLabels: ["Public"],
        nationwide: true,
        localName: "Independence Day"
      }),
      candidate("World Oceans Day", "oceanCompass", 68, ["maritime", "water"], {
        provider: "Curated Cultural Observances",
        countryCode: "INTL",
        countryName: "International",
        typeLabels: ["国际日"]
      })
    ]
  });

  const ranked = selector.rankDailyThemes(new Date(2026, 2, 6), {
    recentThemes: [
      {
        title: "Independence Day",
        motif: "cityParade",
        tags: ["civic", "celebration"],
        source: {
          countryCode: "CO",
          countryName: "Colombia",
          localName: "Independence Day",
          typeLabels: ["Public"],
          nationwide: true
        }
      }
    ]
  });

  assert.equal(ranked[0].theme.title, "World Oceans Day");
  assert.ok(ranked[0].score > ranked[1].score);
});
