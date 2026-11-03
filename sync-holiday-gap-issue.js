import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ISSUE_TITLE = "Holiday content gaps";

const options = parseArgs(process.argv.slice(2));

if (isDirectRun(import.meta.url)) {
  const report = options.report
    ? JSON.parse(fs.readFileSync(options.report, "utf8"))
    : collectReport(options.cache);
  const existing = options.existing === "none"
    ? null
    : options.existing
      ? parseExisting(options.existing)
      : findExistingIssue();
  const action = decideGapIssueAction(report, existing);
  if (options.dryRun) {
    console.log(JSON.stringify({ ...action, title: ISSUE_TITLE, body: renderIssueBody(report) }, null, 2));
  } else {
    applyGapIssueAction(action, report);
    console.log(`Holiday gap issue action: ${action.action}${action.number ? ` #${action.number}` : ""}`);
  }
}

export function renderIssueBody(report) {
  const gaps = Array.isArray(report?.gaps) ? report.gaps : [];
  const legacyOnly = Array.isArray(report?.legacyOnly) ? report.legacyOnly : [];
  const lines = [
    "Provider holidays in the refreshed cache still need country-scoped entries in `data/holiday-content.js`.",
    "",
    `Window: ${report?.window?.start || "?"} -> ${report?.window?.end || "?"}`,
    `Uncovered: ${gaps.length}`,
    `Legacy-only: ${legacyOnly.length}`,
    "",
    "## Uncovered",
    ...formatGapLines(gaps),
    "",
    "## Legacy-only",
    ...formatGapLines(legacyOnly),
    "",
    "The Refresh Holiday Data workflow commits the provider cache first, then updates this issue. It closes the issue when a run finds zero gaps."
  ];
  return `${lines.join("\n")}\n`;
}

export function decideGapIssueAction(report, existing) {
  const hasGaps = (report?.gaps?.length || 0) + (report?.legacyOnly?.length || 0) > 0;
  if (!hasGaps) {
    if (existing?.state === "OPEN") return { action: "close", number: existing.number };
    return { action: "noop" };
  }
  if (!existing) return { action: "create" };
  return {
    action: "update",
    number: existing.number,
    reopen: existing.state !== "OPEN"
  };
}

function formatGapLines(items) {
  if (!items.length) return ["- None"];
  return items.map((item) => {
    const countries = joinList(item.countries);
    const dates = joinList(item.dates);
    const localNames = joinList(item.localNames);
    const local = localNames ? ` — local: ${localNames}` : "";
    return `- **${item.title}** — ${countries} — ${dates}${local}`;
  });
}

function joinList(values) {
  return Array.isArray(values) && values.length ? values.join(", ") : "";
}

function collectReport(cachePath) {
  const output = path.join(os.tmpdir(), `holiday-content-gaps-${process.pid}.json`);
  const args = ["list-holiday-content-gaps.js", "--json", output, "--limit", "1000"];
  if (cachePath) args.push("--cache", cachePath);
  const result = spawnSync(process.execPath, args, { cwd: process.cwd(), encoding: "utf8" });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.status !== 0) {
    if (result.stderr) process.stderr.write(result.stderr);
    throw new Error("Holiday gap report failed");
  }
  return JSON.parse(fs.readFileSync(output, "utf8"));
}

function findExistingIssue() {
  const result = gh([
    "issue", "list",
    "--state", "all",
    "--limit", "100",
    "--json", "number,title,state",
    "--search", `${ISSUE_TITLE} in:title`
  ], { stdio: "pipe" });
  const issues = JSON.parse(result.stdout || "[]")
    .filter((issue) => issue.title === ISSUE_TITLE)
    .sort((a, b) => a.number - b.number);
  return issues[0] || null;
}

function applyGapIssueAction(action, report) {
  if (action.action === "noop") return;
  const bodyFile = path.join(os.tmpdir(), `holiday-gap-issue-${process.pid}.md`);
  if (action.action === "close") {
    gh([
      "issue", "close", String(action.number),
      "--comment", "The latest holiday refresh found zero uncovered titles and zero legacy-only titles."
    ]);
    return;
  }

  fs.writeFileSync(bodyFile, renderIssueBody(report));
  if (action.action === "create") {
    gh(["issue", "create", "--title", ISSUE_TITLE, "--body-file", bodyFile]);
    return;
  }
  if (action.reopen) gh(["issue", "reopen", String(action.number)]);
  gh(["issue", "edit", String(action.number), "--body-file", bodyFile]);
}

function gh(args, spawnOptions = {}) {
  const result = spawnSync("gh", args, { encoding: "utf8", ...spawnOptions });
  if (result.status !== 0) {
    const detail = result.stderr || result.stdout || "gh command failed";
    throw new Error(detail.trim());
  }
  return result;
}

function parseExisting(value) {
  const [number, state] = String(value).split(":");
  return { number: Number(number), state: state || "OPEN" };
}

function parseArgs(args) {
  const reportIndex = args.indexOf("--report");
  const cacheIndex = args.indexOf("--cache");
  const existingIndex = args.indexOf("--existing");
  return {
    report: reportIndex >= 0 ? args[reportIndex + 1] : "",
    cache: cacheIndex >= 0 ? args[cacheIndex + 1] : "",
    existing: existingIndex >= 0 ? args[existingIndex + 1] : "",
    dryRun: args.includes("--dry-run")
  };
}

function isDirectRun(moduleUrl) {
  const entry = process.argv[1];
  if (!entry) return false;
  return pathToFileURL(path.resolve(entry)).href === moduleUrl;
}
