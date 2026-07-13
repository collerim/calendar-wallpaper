import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const layoutSource = fs.readFileSync(new URL("../calendar-layout.js", import.meta.url), "utf8");
const rendererSource = fs.readFileSync(new URL("../calendar-renderer.js", import.meta.url), "utf8");

function loadCalendarModules() {
  const context = vm.createContext({});
  vm.runInContext(layoutSource, context, { filename: "calendar-layout.js" });
  vm.runInContext(rendererSource, context, { filename: "calendar-renderer.js" });
  return {
    layout: context.YearCalendarLayout,
    renderer: context.YearCalendarRenderer
  };
}

test("year calendar model captures leap-year progress and all day slots", () => {
  const { layout } = loadCalendarModules();
  const model = layout.createYearCalendarModel(new Date(2026, 6, 25));

  assert.equal(model.year, 2026);
  assert.equal(model.totalDays, 365);
  assert.equal(model.dayOfYear, 206);
  assert.equal(model.days.length, 365);
  assert.equal(model.months.length, 12);
  assert.equal(model.progress.label, "56% · 159d left");
  assert.equal(model.days.filter((day) => day.isToday).length, 1);
});

test("calendar model keeps February leap days and normal days in one seam", () => {
  const { layout } = loadCalendarModules();

  const leapModel = layout.createYearCalendarModel(new Date(2028, 1, 29));
  const normalModel = layout.createYearCalendarModel(new Date(2027, 1, 28));

  assert.equal(leapModel.months[1].days, 29);
  assert.equal(leapModel.totalDays, 366);
  assert.equal(leapModel.days.length, 366);
  assert.equal(normalModel.months[1].days, 28);
  assert.equal(normalModel.totalDays, 365);
});

test("calendar renderer day color policy is testable without canvas rendering", () => {
  const { renderer } = loadCalendarModules();
  const style = renderer.STYLE;

  assert.equal(renderer.colorForDay({ isPast: true, isToday: false }, style), style.pastDayColor);
  assert.equal(renderer.colorForDay({ isPast: false, isToday: true }, style), style.todayColor);
  assert.equal(renderer.colorForDay({ isPast: false, isToday: false }, style), style.futureDayColor);
});
