import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

import { decideGapIssueAction, renderIssueBody } from "../sync-holiday-gap-issue.js";

test("gap issue action opens, updates, and closes a single issue", () => {
  const report = {
    window: { start: "2027-02-03", end: "2027-02-22" },
    gaps: [{
      title: "Martyrs' Day",
      countries: ["ST"],
      dates: ["2027-02-03"],
      localNames: ["Dia dos Mártires"]
    }],
    legacyOnly: [{
      title: "Sports Day",
      countries: ["BH"],
      dates: ["2027-02-22"],
      localNames: []
    }]
  };

  assert.equal(decideGapIssueAction(report, null).action, "create");
  assert.deepEqual(
    decideGapIssueAction(report, { number: 7, state: "CLOSED" }),
    { action: "update", number: 7, reopen: true }
  );
  assert.deepEqual(
    decideGapIssueAction(report, { number: 7, state: "OPEN" }),
    { action: "update", number: 7, reopen: false }
  );
  assert.deepEqual(
    decideGapIssueAction({ window: report.window, gaps: [], legacyOnly: [] }, { number: 7, state: "OPEN" }),
    { action: "close", number: 7 }
  );
  assert.equal(
    decideGapIssueAction({ window: report.window, gaps: [], legacyOnly: [] }, null).action,
    "noop"
  );

  const body = renderIssueBody(report);
  assert.match(body, /\*\*Martyrs' Day\*\* — ST — 2027-02-03 — local: Dia dos Mártires/);
  assert.match(body, /\*\*Sports Day\*\* — BH — 2027-02-22/);
});

test("dry run reports the issue body without calling GitHub", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "holiday-gap-issue-"));
  const reportPath = path.join(directory, "report.json");
  fs.writeFileSync(reportPath, JSON.stringify({
    window: { start: "2027-02-03", end: "2027-02-03" },
    gaps: [{ title: "Yap Day", countries: ["FM"], dates: ["2027-03-02"], localNames: [] }],
    legacyOnly: []
  }));

  const result = spawnSync(process.execPath, [
    "sync-holiday-gap-issue.js",
    "--report", reportPath,
    "--existing", "none",
    "--dry-run"
  ], { cwd: process.cwd(), encoding: "utf8" });

  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.action, "create");
  assert.equal(payload.title, "Holiday content gaps");
  assert.match(payload.body, /Yap Day/);
  assert.match(payload.body, /FM/);
  assert.match(payload.body, /2027-03-02/);
});
