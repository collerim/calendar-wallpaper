import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const rulesSource = fs.readFileSync(new URL("../calendar-rules.js", import.meta.url), "utf8");

function loadRules() {
  const context = vm.createContext({});
  vm.runInContext(rulesSource, context, { filename: "calendar-rules.js" });
  return context.YearCalendarRules;
}

test("July 25, 2026 remains the final payday", () => {
  const { isPayday } = loadRules();

  assert.equal(isPayday(2026, 5, 25), true);
  assert.equal(isPayday(2026, 6, 25), true);
  assert.equal(isPayday(2026, 6, 24), false);
});

test("the payday marker is removed from August 2026 onward", () => {
  const { isPayday } = loadRules();

  assert.equal(isPayday(2026, 7, 25), false);
  assert.equal(isPayday(2026, 11, 25), false);
  assert.equal(isPayday(2027, 6, 25), false);
});
