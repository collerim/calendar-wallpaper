import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const rendererSource = fs.readFileSync(new URL("../theme-renderers.js", import.meta.url), "utf8");
const holidayCacheSource = fs.readFileSync(new URL("../data/holiday-cache.js", import.meta.url), "utf8");

function loadRenderer() {
  const context = vm.createContext({
    countryNameZh: (source) => source.zhName || source.countryName || "当地",
    holidayTypeLabelFromSource: () => "公众节日",
    hasTag: () => false
  });
  vm.runInContext(rendererSource, context, { filename: "theme-renderers.js" });
  return context;
}

function loadHolidayCache() {
  const context = vm.createContext({});
  context.window = context;
  vm.runInContext(holidayCacheSource, context, { filename: "data/holiday-cache.js" });
  return context.YearCalendarHolidayCache;
}

test("country meta line prefixes valid country names with emoji flags", () => {
  const renderer = loadRenderer();

  assert.equal(
    renderer.themeMetaLine({
      source: {
        countryCode: "US",
        countryName: "United States",
        zhName: "美国"
      }
    }),
    "🇺🇸 美国 · 公众节日"
  );
});

test("country meta line skips flags for international observances", () => {
  const renderer = loadRenderer();

  assert.equal(
    renderer.themeMetaLine({
      source: {
        countryCode: "INTL",
        countryName: "International",
        zhName: "国际"
      }
    }),
    "国际 · 公众节日"
  );
});

test("uncovered holidays keep a provider name instead of breaking", () => {
  const renderer = loadRenderer();
  const uncovered = {
    title: "Totally Uncovered Holiday",
    description: "",
    tags: [],
    source: { countryCode: "ST", localName: "Local Holiday" }
  };
  const englishOnly = {
    title: "English Only Holiday",
    description: "",
    tags: [],
    source: { countryCode: "ST", localName: "English Only Holiday" }
  };

  assert.equal(renderer.themeDisplayTitle(uncovered), "Local Holiday");
  assert.equal(renderer.themeDisplayTitle(englishOnly), "English Only Holiday");
  renderer.holidayContentFor = () => ({ title: "Structured Title" });
  assert.equal(renderer.themeDisplayTitle(uncovered), "Structured Title");

  const measurements = [];
  renderer.drawFittedText({
    measureText(text) {
      measurements.push(text);
      if (typeof text !== "string") throw new TypeError("measureText");
      return { width: 10 };
    },
    fillText(text) {
      if (typeof text !== "string") throw new TypeError("fillText");
    }
  }, undefined, 0, 0, 100, 20, 12);
  assert.deepEqual(measurements, []);

  const engine = vm.createContext({
    YearCalendarHolidayContent: { entries: [] },
    YearCalendarHolidayIntros: {},
    YearCalendarHolidayCache: {
      days: {
        "2027-02-03": [{
          title: "Totally Uncovered Holiday",
          description: "",
          caption: "Totally Uncovered Holiday · Local Holiday",
          motif: "cityParade",
          gradient: ["#111111", "#222222", "#333333"],
          accent: "#ffffff",
          secondary: "#cccccc",
          priority: 50,
          tags: ["civic"],
          source: {
            provider: "Nager.Date",
            countryCode: "ST",
            countryName: "Sao Tome and Principe",
            localName: "Local Holiday",
            typeLabels: ["公众节日"]
          }
        }]
      }
    }
  });
  engine.window = engine;
  vm.runInContext(fs.readFileSync(new URL("../theme-motifs.js", import.meta.url), "utf8"), engine, { filename: "theme-motifs.js" });
  vm.runInContext(fs.readFileSync(new URL("../theme-palettes.js", import.meta.url), "utf8"), engine, { filename: "theme-palettes.js" });
  vm.runInContext(fs.readFileSync(new URL("../theme-engine.js", import.meta.url), "utf8"), engine, { filename: "theme-engine.js" });
  const [theme] = engine.ThemeEngineInternals.cachedHolidayThemes(new Date(2027, 1, 3));
  assert.equal(typeof theme.description, "string");
  assert.ok(theme.description.length > 0);
  assert.match(theme.description, /Local Holiday|Totally Uncovered Holiday/);
});

test("all current cached country codes can render emoji flags", () => {
  const renderer = loadRenderer();
  const cache = loadHolidayCache();
  const codes = new Set();

  for (const themes of Object.values(cache.days || {})) {
    for (const theme of themes) {
      const code = theme.source?.countryCode;
      if (code) codes.add(code);
    }
  }

  const nonCountryCodes = [...codes].filter((code) => !/^[A-Z]{2}$/.test(code)).sort();
  assert.deepEqual(nonCountryCodes, ["INTL"]);

  for (const code of codes) {
    if (code === "INTL") continue;
    assert.equal(Array.from(renderer.countryFlagEmoji(code)).length, 2, code);
  }
});
