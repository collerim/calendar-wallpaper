import fs from "node:fs";
import path from "node:path";

globalThis.window = globalThis;

await import("./data/holiday-content.js");
await import("./data/holiday-intros.js");

const options = parseArgs(process.argv.slice(2));
const content = globalThis.YearCalendarHolidayContent || {};
const intros = globalThis.YearCalendarHolidayIntros || {};
const entries = Array.isArray(content.entries) ? content.entries : [];
const introKeys = new Set(Object.keys(intros).map(normalizeKey));

const caches = readCaches(options.cacheDir)
  .filter((cache) => cache.window?.start && cache.window?.end)
  .filter((cache) => !options.start || cache.window.end >= options.start)
  .filter((cache) => !options.end || cache.window.start <= options.end)
  .sort((a, b) => a.window.start.localeCompare(b.window.start));

if (!caches.length) fail(`No cache windows found in ${options.cacheDir}`);

const audit = {
  windows: caches.length,
  requestedStart: options.start || caches[0].window.start,
  requestedEnd: options.end || caches[caches.length - 1].window.end,
  start: caches[0].window.start,
  end: caches[caches.length - 1].window.end,
  providerHolidayCount: 0,
  coveredByContent: 0,
  coveredByLegacyIntro: 0,
  gaps: new Map(),
  legacyOnly: new Map(),
  issues: [],
  sourceStats: {
    nagerRequests: 0,
    nagerSuccessfulRequests: 0,
    openHolidaysRequests: 0,
    openHolidaysSuccessfulRequests: 0
  }
};

if (options.start && (audit.start > options.start || audit.end < options.start)) {
  audit.issues.push(`first cache ${audit.start} -> ${audit.end} does not cover expected start ${options.start}`);
}

if (options.end && audit.end < options.end) {
  audit.issues.push(`last cache ends at ${audit.end}, expected coverage through ${options.end}`);
}

for (const [index, cache] of caches.entries()) {
  if (index > 0) {
    const expectedStart = addDaysKey(caches[index - 1].window.end, 1);
    if (cache.window.start > expectedStart) {
      audit.issues.push(`cache gap before ${cache.window.start}: expected ${expectedStart}`);
    }
  }

  const sourceStats = cache.sourceStats || {};
  audit.sourceStats.nagerRequests += sourceStats.nagerRequests || 0;
  audit.sourceStats.nagerSuccessfulRequests += sourceStats.nagerSuccessfulRequests || 0;
  audit.sourceStats.openHolidaysRequests += sourceStats.openHolidaysRequests || 0;
  audit.sourceStats.openHolidaysSuccessfulRequests += sourceStats.openHolidaysSuccessfulRequests || 0;

  if (options.requireNagerComplete && sourceStats.nagerSuccessfulRequests !== sourceStats.nagerRequests) {
    audit.issues.push(`${cache.window.start}: Nager.Date ${sourceStats.nagerSuccessfulRequests}/${sourceStats.nagerRequests}`);
  }

  if (options.requireOpenHolidaysComplete && sourceStats.openHolidaysSuccessfulRequests !== sourceStats.openHolidaysRequests) {
    audit.issues.push(`${cache.window.start}: OpenHolidays ${sourceStats.openHolidaysSuccessfulRequests}/${sourceStats.openHolidaysRequests}`);
  }

  analyzeCache(cache, audit);
}

printAudit(audit);

if (options.failOnGaps && (audit.gaps.size || audit.legacyOnly.size)) {
  audit.issues.push(`${audit.gaps.size} uncovered title(s), ${audit.legacyOnly.size} legacy-only title(s)`);
}

if (audit.issues.length) {
  for (const issue of audit.issues) console.error(`error: ${issue}`);
  process.exit(1);
}

function analyzeCache(cache, audit) {
  for (const [date, themes] of Object.entries(cache.days || {}).sort(([a], [b]) => a.localeCompare(b))) {
    if (options.start && date < options.start) continue;
    if (options.end && date > options.end) continue;

    for (const theme of themes) {
      if (!["Nager.Date", "OpenHolidays"].includes(theme.source?.provider)) continue;
      audit.providerHolidayCount += 1;

      const keys = holidayLookupKeys(theme);
      if (holidayContentFor(keys)) {
        audit.coveredByContent += 1;
        continue;
      }

      if (keys.some((key) => intros[key] || introKeys.has(normalizeKey(key)))) {
        audit.coveredByLegacyIntro += 1;
        addHolidaySummary(audit.legacyOnly, theme, date);
        continue;
      }

      addHolidaySummary(audit.gaps, theme, date);
    }
  }
}

function readCaches(cacheDir) {
  return fs.readdirSync(cacheDir)
    .filter((name) => /^holiday-cache-\d{4}-\d{2}-\d{2}\.js$/.test(name))
    .map((name) => readHolidayCache(path.join(cacheDir, name)));
}

function readHolidayCache(filePath) {
  const contentText = fs.readFileSync(filePath, "utf8");
  const match = contentText.match(/window\.YearCalendarHolidayCache\s*=\s*(\{[\s\S]*\});?\s*$/);
  if (!match) throw new Error(`Could not read holiday cache from ${filePath}`);
  return JSON.parse(match[1]);
}

function addHolidaySummary(target, theme, date) {
  const id = normalizeKey(`${theme.source?.countryCode || ""}|${theme.title}`);
  if (!target.has(id)) {
    target.set(id, {
      title: theme.title,
      providers: new Set(),
      countries: new Set(),
      dates: new Set(),
      localNames: new Set(),
      typeLabels: new Set()
    });
  }
  const summary = target.get(id);
  summary.providers.add(theme.source.provider);
  if (theme.source.countryCode) summary.countries.add(theme.source.countryCode);
  if (theme.source.localName && theme.source.localName !== theme.title) summary.localNames.add(theme.source.localName);
  for (const label of theme.source.typeLabels || []) summary.typeLabels.add(label);
  summary.dates.add(date);
}

function holidayLookupKeys(theme) {
  const source = theme.source || {};
  return [
    source.countryCode ? `${source.countryCode}|${theme.title}` : "",
    source.countryCode && source.localName ? `${source.countryCode}|${source.localName}` : "",
    theme.title,
    source.localName || ""
  ].filter(Boolean);
}

function holidayContentFor(keys) {
  const countryScopedKeys = keys.filter(isCountryScopedHolidayKey);
  const countryLookup = new Set(countryScopedKeys.map(normalizeKey));
  const countryMatch = entries.find((entry) => holidayContentKeys(entry).some((key) => countryLookup.has(normalizeKey(key))));
  if (countryMatch) return countryMatch;

  const genericLookup = new Set(keys.filter((key) => !isCountryScopedHolidayKey(key)).map(normalizeKey));
  return entries.find((entry) => {
    const entryKeys = holidayContentKeys(entry);
    if (entryKeys.some(isCountryScopedHolidayKey)) return false;
    return entryKeys.some((key) => genericLookup.has(normalizeKey(key)));
  }) || null;
}

function holidayContentKeys(entry) {
  return Array.isArray(entry.keys) ? entry.keys.filter(Boolean) : [];
}

function isCountryScopedHolidayKey(key) {
  return /^[A-Z]{2}\|/.test(key);
}

function printAudit(audit) {
  console.log(`Holiday content cache audit for ${audit.requestedStart} -> ${audit.requestedEnd}`);
  console.log(`Selected cache coverage: ${audit.start} -> ${audit.end}`);
  console.log(`Cache windows: ${audit.windows}`);
  console.log(`Provider candidates: ${audit.providerHolidayCount}`);
  console.log(`Covered by structured content: ${audit.coveredByContent}`);
  console.log(`Covered by legacy intros: ${audit.coveredByLegacyIntro}`);
  console.log(`Uncovered unique titles: ${audit.gaps.size}`);
  console.log(`Legacy-only unique titles: ${audit.legacyOnly.size}`);
  console.log(`Nager successful requests: ${audit.sourceStats.nagerSuccessfulRequests}/${audit.sourceStats.nagerRequests}`);
  console.log(`OpenHolidays successful requests: ${audit.sourceStats.openHolidaysSuccessfulRequests}/${audit.sourceStats.openHolidaysRequests}`);
  console.log(`Continuity/source issues: ${audit.issues.length}`);
}

function parseArgs(args) {
  return {
    cacheDir: valueAfter(args, "--cache-dir") || path.join("tmp", "holiday-content-scan"),
    start: valueAfter(args, "--start"),
    end: valueAfter(args, "--end"),
    failOnGaps: args.includes("--fail-on-gaps"),
    requireNagerComplete: args.includes("--require-nager-complete"),
    requireOpenHolidaysComplete: args.includes("--require-openholidays-complete")
  };
}

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : "";
}

function addDaysKey(key, days) {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(year, month - 1, day + days);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function normalizeKey(value) {
  return String(value || "").toLowerCase().replace(/[’']/g, "").replace(/\s+/g, " ").trim();
}

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}
