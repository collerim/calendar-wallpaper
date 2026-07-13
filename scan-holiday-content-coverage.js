import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

globalThis.window = globalThis;

await import("./data/holiday-content.js");
await import("./data/holiday-intros.js");

const content = globalThis.YearCalendarHolidayContent || {};
const intros = globalThis.YearCalendarHolidayIntros || {};
const entries = Array.isArray(content.entries) ? content.entries : [];
const introKeys = new Set(Object.keys(intros).map(normalizeKey));
const options = parseArgs(process.argv.slice(2));

if (options.help) {
  printHelp();
  process.exit(0);
}

const combined = {
  providerHolidayCount: 0,
  coveredByContent: 0,
  coveredByLegacyIntro: 0,
  gaps: new Map(),
  legacyOnly: new Map(),
  windows: [],
  sourceStats: {
    nagerRequests: 0,
    nagerSuccessfulRequests: 0,
    openHolidaysRequests: 0,
    openHolidaysSuccessfulRequests: 0
  }
};

fs.mkdirSync(options.outputDir, { recursive: true });

for (let index = 0; index < options.windows; index++) {
  const start = addDays(options.startDate, index * (options.days + 1));
  const startKey = dateKey(start);
  const cachePath = path.join(options.outputDir, `holiday-cache-${startKey}.js`);

  console.log(`Scanning ${startKey} for ${options.days} days...`);
  const refreshArgs = [
    "refresh-holiday-data.js",
    "--date", startKey,
    "--days", String(options.days),
    "--output", cachePath
  ];
  if (!options.allowEmptyProviderWindows) refreshArgs.push("--strict-providers");

  const result = spawnSync(process.execPath, refreshArgs, {
    cwd: process.cwd(),
    encoding: "utf8"
  });

  if (result.status !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    throw new Error(`Failed to refresh scan window ${startKey}`);
  }

  const cache = readHolidayCache(cachePath);
  assertWindowHasProviderData(cache, startKey, options);
  const report = analyzeCache(cache);
  mergeReport(combined, report);
  combined.windows.push({
    start: cache.window?.start || startKey,
    end: cache.window?.end || "?",
    providerHolidayCount: report.providerHolidayCount,
    coveredByContent: report.coveredByContent,
    coveredByLegacyIntro: report.coveredByLegacyIntro,
    uncoveredUniqueTitles: report.gaps.size,
    legacyOnlyUniqueTitles: report.legacyOnly.size
  });
}

function assertWindowHasProviderData(cache, startKey, options) {
  const sourceStats = cache.sourceStats || {};
  const nagerSuccess = sourceStats.nagerSuccessfulRequests || 0;
  const openHolidaysSuccess = sourceStats.openHolidaysSuccessfulRequests || 0;
  if (nagerSuccess || openHolidaysSuccess) return;

  const mode = options.allowEmptyProviderWindows ? "relaxed" : "strict";
  throw new Error(`No provider data for scan window ${startKey} in ${mode} mode`);
}

printReport(combined, options);
if (options.reportJson) writeJsonReport(combined, options.reportJson);
if (options.stubsFile) writeStubsFile(combined, options.stubsFile, options.limit);

function analyzeCache(cache) {
  const report = {
    providerHolidayCount: 0,
    coveredByContent: 0,
    coveredByLegacyIntro: 0,
    gaps: new Map(),
    legacyOnly: new Map(),
    sourceStats: cache.sourceStats || {}
  };

  for (const [date, themes] of Object.entries(cache.days || {}).sort(([a], [b]) => a.localeCompare(b))) {
    for (const theme of themes) {
      if (!["Nager.Date", "OpenHolidays"].includes(theme.source?.provider)) continue;
      report.providerHolidayCount += 1;

      const keys = holidayLookupKeys(theme);
      if (holidayContentFor(keys)) {
        report.coveredByContent += 1;
        continue;
      }
      if (keys.some((key) => intros[key] || introKeys.has(normalizeKey(key)))) {
        report.coveredByLegacyIntro += 1;
        addHolidaySummary(report.legacyOnly, theme, date);
        continue;
      }

      addHolidaySummary(report.gaps, theme, date);
    }
  }

  return report;
}

function mergeReport(combinedReport, report) {
  combinedReport.providerHolidayCount += report.providerHolidayCount;
  combinedReport.coveredByContent += report.coveredByContent;
  combinedReport.coveredByLegacyIntro += report.coveredByLegacyIntro;

  for (const summary of report.gaps.values()) mergeSummary(combinedReport.gaps, summary);
  for (const summary of report.legacyOnly.values()) mergeSummary(combinedReport.legacyOnly, summary);

  const sourceStats = report.sourceStats || {};
  combinedReport.sourceStats.nagerRequests += sourceStats.nagerRequests || 0;
  combinedReport.sourceStats.nagerSuccessfulRequests += sourceStats.nagerSuccessfulRequests || 0;
  combinedReport.sourceStats.openHolidaysRequests += sourceStats.openHolidaysRequests || 0;
  combinedReport.sourceStats.openHolidaysSuccessfulRequests += sourceStats.openHolidaysSuccessfulRequests || 0;
}

function mergeSummary(target, summary) {
  const id = normalizeKey(`${joinSet(summary.countries)}|${summary.title}`);
  if (!target.has(id)) {
    target.set(id, {
      title: summary.title,
      providers: new Set(),
      countries: new Set(),
      dates: new Set(),
      localNames: new Set(),
      typeLabels: new Set()
    });
  }
  const merged = target.get(id);
  for (const provider of summary.providers) merged.providers.add(provider);
  for (const country of summary.countries) merged.countries.add(country);
  for (const date of summary.dates) merged.dates.add(date);
  for (const localName of summary.localNames) merged.localNames.add(localName);
  for (const typeLabel of summary.typeLabels) merged.typeLabels.add(typeLabel);
}

function printReport(report, options) {
  console.log("");
  console.log(`Holiday content scan from ${dateKey(options.startDate)} across ${options.windows} window(s)`);
  console.log(`Window size: ${options.days} days`);
  console.log(`Provider candidates: ${report.providerHolidayCount}`);
  console.log(`Covered by structured content: ${report.coveredByContent}`);
  console.log(`Covered by legacy intros: ${report.coveredByLegacyIntro}`);
  console.log(`Uncovered unique titles: ${report.gaps.size}`);
  console.log(`Legacy-only unique titles: ${report.legacyOnly.size}`);
  console.log(`Nager successful requests: ${report.sourceStats.nagerSuccessfulRequests}/${report.sourceStats.nagerRequests}`);
  console.log(`OpenHolidays successful requests: ${report.sourceStats.openHolidaysSuccessfulRequests}/${report.sourceStats.openHolidaysRequests}`);
  console.log("");

  if (report.gaps.size) {
    console.log("Uncovered:");
    printSummaries(report.gaps, options.limit);
  }

  if (report.legacyOnly.size) {
    console.log("Legacy-only:");
    printSummaries(report.legacyOnly, options.limit);
  }

  if (!report.gaps.size && !report.legacyOnly.size) {
    console.log("No missing or legacy-only provider holiday titles found in scanned windows.");
  }
}

function writeJsonReport(report, filePath) {
  const payload = {
    providerHolidayCount: report.providerHolidayCount,
    coveredByContent: report.coveredByContent,
    coveredByLegacyIntro: report.coveredByLegacyIntro,
    uncoveredUniqueTitles: report.gaps.size,
    legacyOnlyUniqueTitles: report.legacyOnly.size,
    sourceStats: report.sourceStats,
    windows: report.windows,
    gaps: [...report.gaps.values()].map(summaryToJson),
    legacyOnly: [...report.legacyOnly.values()].map(summaryToJson)
  };

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function writeStubsFile(report, filePath, limit) {
  const summaries = [
    ...[...report.gaps.values()].map((summary) => ({ summary, status: "missing" })),
    ...[...report.legacyOnly.values()].map((summary) => ({ summary, status: "legacy-only" }))
  ].slice(0, limit);

  const lines = [
    "// Paste these objects into data/holiday-content.js entries, then replace TODO descriptions.",
    "// Generated by npm run content:scan.",
    ""
  ];

  for (const { summary, status } of summaries) {
    lines.push("    {");
    lines.push(`      title: ${JSON.stringify(summary.title)},`);
    lines.push(`      zhTitle: ${JSON.stringify(summary.title)},`);
    lines.push(`      type: ${JSON.stringify(firstValue(summary.typeLabels) || "节日")},`);
    lines.push(`      description: ${JSON.stringify(`TODO: ${summary.title} 的来历、习俗或文化意义。`)},`);
    lines.push(`      keys: ${JSON.stringify(suggestedKeys(summary), null, 6).replace(/\n/g, "\n      ")}`);
    lines.push(`      // scanStatus: ${status}; countries: ${joinSet(summary.countries)}; providers: ${joinSet(summary.providers)}; dates: ${joinSet(summary.dates, 4)}`);
    lines.push("    },");
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`);
}

function firstValue(values) {
  return values.values().next().value || "";
}

function suggestedKeys(summary) {
  const keys = new Set([summary.title]);
  for (const country of summary.countries) keys.add(`${country}|${summary.title}`);
  for (const country of summary.countries) {
    for (const localName of summary.localNames) keys.add(`${country}|${localName}`);
  }
  for (const localName of summary.localNames) keys.add(localName);
  return [...keys].filter(Boolean);
}

function summaryToJson(summary) {
  return {
    title: summary.title,
    providers: [...summary.providers],
    countries: [...summary.countries],
    dates: [...summary.dates],
    localNames: [...summary.localNames],
    typeLabels: [...summary.typeLabels]
  };
}

function printSummaries(summaries, limit) {
  for (const [index, summary] of [...summaries.values()].slice(0, limit).entries()) {
    console.log(`${index + 1}. ${summary.title}`);
    console.log(`   countries: ${joinSet(summary.countries)}`);
    console.log(`   providers: ${joinSet(summary.providers)}`);
    console.log(`   dates: ${joinSet(summary.dates, 8)}`);
    console.log(`   local: ${joinSet(summary.localNames, 4)}`);
    console.log(`   types: ${joinSet(summary.typeLabels, 4)}`);
  }
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

function parseArgs(args) {
  const start = valueAfter(args, "--start") || dateKey(shanghaiToday());
  const startDate = dateFromKey(start);
  if (!startDate) throw new Error(`Invalid --start value: ${start}`);

  return {
    startDate,
    days: numberAfter(args, "--days", 90),
    windows: numberAfter(args, "--windows", 4),
    limit: numberAfter(args, "--limit", 50),
    outputDir: valueAfter(args, "--output-dir") || path.join("tmp", "holiday-content-scan"),
    reportJson: valueAfter(args, "--report-json"),
    stubsFile: valueAfter(args, "--stubs-file"),
    allowEmptyProviderWindows: args.includes("--allow-empty-provider-windows"),
    help: args.includes("--help") || args.includes("-h")
  };
}

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : "";
}

function numberAfter(args, flag, fallback) {
  const value = Number(valueAfter(args, flag));
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function dateFromKey(key) {
  const match = key?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function dateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function shanghaiToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function normalizeKey(value) {
  return String(value || "").toLowerCase().replace(/[’']/g, "").replace(/\s+/g, " ").trim();
}

function joinSet(values, limit = Infinity) {
  const items = [...values].slice(0, limit);
  return items.length ? items.join(", ") : "-";
}

function printHelp() {
  console.log(`Usage: npm run content:scan -- --start 2026-09-11 --windows 4 --days 90

Scans future Nager.Date/OpenHolidays windows without overwriting data/holiday-cache.js.
The scan uses strict provider refreshes by default, so it fails if either provider has no successful responses.

Options:
  --start YYYY-MM-DD     First scan window start date. Defaults to today.
  --windows N            Number of windows to scan. Defaults to 4.
  --days N               Days per window. Defaults to 90.
  --limit N              Max summaries to print per section. Defaults to 50.
  --output-dir DIR       Temporary cache directory. Defaults to tmp/holiday-content-scan.
  --report-json FILE     Optional machine-readable report path.
  --stubs-file FILE      Optional JS object stubs for the next content batch.
  --allow-empty-provider-windows
                          Relax strict provider refreshes for far-future scans where one provider has a known date boundary.
                          The scan still fails if both providers return no data.
`);
}
