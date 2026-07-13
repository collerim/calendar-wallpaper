import assert from "node:assert/strict";
import test from "node:test";

import { createHolidayCacheBuilder } from "../holiday-cache-builder.js";

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

function theme(title, countryCode, score) {
  return {
    title,
    score,
    source: { countryCode }
  };
}

test("finalize keeps the highest-scoring duplicate and caps each day", () => {
  const builder = createHolidayCacheBuilder({
    startDate: new Date(2026, 0, 1),
    endDate: new Date(2026, 0, 1),
    maxCandidatesPerDay: 2,
    dateKey,
    addDays
  });

  builder.addTheme("2026-01-01", theme("New Year", "US", 20));
  builder.addTheme("2026-01-01", theme("New Year", "US", 50));
  builder.addTheme("2026-01-01", theme("New Year", "CN", 40));
  builder.addTheme("2026-01-01", theme("Another Holiday", "GB", 30));

  const result = builder.finalize();

  assert.deepEqual(
    result.days["2026-01-01"].map(({ title, score, source }) => [title, source.countryCode, score]),
    [
      ["New Year", "US", 50],
      ["New Year", "CN", 40]
    ]
  );
});

test("finalize reports uncovered dates across the requested window", () => {
  const builder = createHolidayCacheBuilder({
    startDate: new Date(2026, 0, 1),
    endDate: new Date(2026, 0, 3),
    maxCandidatesPerDay: 3,
    dateKey,
    addDays
  });

  builder.addTheme("2026-01-01", theme("First Day", "US", 10));
  builder.addTheme("2026-01-03", theme("Third Day", "US", 10));

  assert.deepEqual(builder.finalize().coverage, {
    totalDays: 3,
    candidateDays: 2,
    fallbackDays: 1,
    fallbackDates: ["2026-01-02"]
  });
});

test("finalize keeps family-diverse candidates beyond the highest raw scores", () => {
  const builder = createHolidayCacheBuilder({
    startDate: new Date(2026, 0, 1),
    endDate: new Date(2026, 0, 1),
    maxCandidatesPerDay: 4,
    dateKey,
    addDays
  });

  builder.addTheme("2026-01-01", { ...theme("Independence A", "AA", 100), holidayFamily: "independence-day" });
  builder.addTheme("2026-01-01", { ...theme("Independence B", "BB", 95), holidayFamily: "independence-day" });
  builder.addTheme("2026-01-01", { ...theme("Independence C", "CC", 90), holidayFamily: "independence-day" });
  builder.addTheme("2026-01-01", { ...theme("Independence D", "DD", 85), holidayFamily: "independence-day" });
  builder.addTheme("2026-01-01", { ...theme("World Oceans Day", "INTL", 70), holidayFamily: "environmental-observance" });

  assert.deepEqual(
    builder.finalize().days["2026-01-01"].map(({ title }) => title),
    ["Independence A", "Independence B", "Independence C", "World Oceans Day"]
  );
});

test("finalize keeps the highest scoring representative for a newly retained family", () => {
  const builder = createHolidayCacheBuilder({
    startDate: new Date(2026, 0, 1),
    endDate: new Date(2026, 0, 1),
    maxCandidatesPerDay: 4,
    dateKey,
    addDays
  });

  builder.addTheme("2026-01-01", { ...theme("Top A", "AA", 100), holidayFamily: "independence-day" });
  builder.addTheme("2026-01-01", { ...theme("Top B", "BB", 99), holidayFamily: "national-day" });
  builder.addTheme("2026-01-01", { ...theme("Top C", "CC", 98), holidayFamily: "constitution-day" });
  builder.addTheme("2026-01-01", { ...theme("High scoring culture", "DD", 97), holidayFamily: "culture-observance" });
  builder.addTheme("2026-01-01", {
    ...theme("Low scoring curated culture", "INTL", 1),
    holidayFamily: "culture-observance",
    source: { countryCode: "INTL", provider: "Curated Cultural Observances" }
  });

  assert.deepEqual(
    builder.finalize().days["2026-01-01"].map(({ title }) => title),
    ["Top A", "Top B", "Top C", "High scoring culture"]
  );
});
