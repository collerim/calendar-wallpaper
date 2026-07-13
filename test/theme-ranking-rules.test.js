import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const rulesSource = fs.readFileSync(new URL("../theme-ranking-rules.js", import.meta.url), "utf8");

function loadRules() {
  const context = vm.createContext({});
  vm.runInContext(rulesSource, context, { filename: "theme-ranking-rules.js" });
  return context.ThemeRankingRules;
}

test("world observances are split into more specific holiday families", () => {
  const rules = loadRules();

  assert.equal(rules.inferHolidayFamily({ title: "World Oceans Day" }), "environmental-observance");
  assert.equal(rules.inferHolidayFamily({ title: "World Health Day" }), "health-observance");
  assert.equal(rules.inferHolidayFamily({ title: "World Poetry Day" }), "culture-observance");
  assert.equal(rules.inferHolidayFamily({ title: "International Day of Peace" }), "peace-observance");
});

test("ranking rules can be loaded more than once in the same global context", () => {
  const context = vm.createContext({});

  vm.runInContext(rulesSource, context, { filename: "theme-ranking-rules.js" });
  vm.runInContext(rulesSource, context, { filename: "theme-ranking-rules.js" });

  assert.equal(context.ThemeRankingRules.inferHolidayFamily({ title: "World Oceans Day" }), "environmental-observance");
});

test("fixed holidays receive source and ranking metadata", () => {
  const rules = loadRules();
  const source = rules.fixedHolidaySource("07-04", "Independence Day");
  const theme = rules.withRankingMetadata({
    title: "Independence Day",
    caption: "Independence Day · 烟火照亮夏夜",
    source
  });

  assert.equal(theme.source.countryCode, "US");
  assert.equal(theme.scopeTier, "national");
  assert.equal(theme.holidayFamily, "independence-day");
  assert.equal(theme.popularityTier, "common");
});

test("provider holidays receive fallback family metadata when title patterns are ambiguous", () => {
  const rules = loadRules();
  const theme = rules.withRankingMetadata({
    title: "Canada Day",
    caption: "Canada Day · Canada",
    tags: ["culture", "civic"],
    source: {
      provider: "Nager.Date",
      countryCode: "CA",
      countryName: "Canada",
      typeLabels: ["公众节日"]
    }
  });

  assert.equal(theme.holidayFamily, "national-civic-day");
  assert.equal(theme.scopeTier, "national");
});

test("ambiguous themes still receive non-empty fallback family metadata", () => {
  const rules = loadRules();
  const theme = rules.withRankingMetadata({
    title: "Low Context Provider Holiday",
    caption: "Low Context Provider Holiday",
    source: {
      provider: "Nager.Date",
      countryCode: "ZZ",
      typeLabels: ["Public"]
    }
  });

  assert.equal(theme.holidayFamily, "public-holiday");
});

test("score breakdown totals exactly match the final score", () => {
  const rules = loadRules();
  const breakdown = rules.scoreBreakdown({
    basePriority: 78,
    popularity: 18,
    jitter: 1.25,
    motifPenalty: 4,
    culturalPenalty: 6,
    holidayFamilyPenalty: 8,
    colorPenalty: 3
  });

  assert.equal(breakdown.finalScore, 76.25);
});

test("important civic themes cannot jump to distant botanical-only motifs", () => {
  const rules = loadRules();
  const motifTags = {
    tropicalBloom: ["island", "botanical", "water"],
    cityParade: ["civic", "celebration", "procession"]
  };
  const theme = { tags: ["civic", "celebration"] };

  assert.equal(rules.isAllowedMotifSubstitution(theme, "tropicalBloom", motifTags), false);
  assert.equal(rules.isAllowedMotifSubstitution(theme, "cityParade", motifTags), true);
});
