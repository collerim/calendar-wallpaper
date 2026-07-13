import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const ASSET_BRANCH = process.env.ASSET_BRANCH || "generated-wallpapers";
const ASSET_WORKTREE = process.env.ASSET_WORKTREE || "../generated-wallpapers";
const THEME_HISTORY_FILE = path.join("data", "theme-history.json");
const SITE_FILES = ["index.html", "app.js", "styles.css", "device-presets.json", ".nojekyll"];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
    encoding: "utf8",
    ...options
  });
  if (!options.allowFailure && result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`);
  }
  return result;
}

function git(args, options = {}) {
  return run("git", args, options);
}

function outputOf(command, args) {
  const result = run(command, args, { capture: true, allowFailure: true });
  return result.status === 0 ? result.stdout.trim() : "";
}

function writeEmptyThemeHistory() {
  fs.mkdirSync(path.dirname(THEME_HISTORY_FILE), { recursive: true });
  fs.writeFileSync(THEME_HISTORY_FILE, '{\n  "version": 1,\n  "updatedAt": null,\n  "days": {}\n}\n');
}

function restoreThemeHistory() {
  fs.mkdirSync(path.dirname(THEME_HISTORY_FILE), { recursive: true });

  const fetchResult = git(["fetch", "origin", `${ASSET_BRANCH}:refs/remotes/origin/${ASSET_BRANCH}`], { allowFailure: true });
  if (fetchResult.status === 0) {
    const showResult = git(["show", `origin/${ASSET_BRANCH}:${THEME_HISTORY_FILE}`], { capture: true, allowFailure: true });
    if (showResult.status === 0) {
      fs.writeFileSync(THEME_HISTORY_FILE, showResult.stdout);
      console.log(`Restored theme history from ${ASSET_BRANCH}`);
      return;
    }
  }

  const historySource = outputOf("git", ["log", "--diff-filter=AM", "--format=%H", "-n", "1", "--", THEME_HISTORY_FILE]);
  if (historySource) {
    const showResult = git(["show", `${historySource}:${THEME_HISTORY_FILE}`], { capture: true, allowFailure: true });
    if (showResult.status === 0) {
      fs.writeFileSync(THEME_HISTORY_FILE, showResult.stdout);
      console.log("Restored theme history from main history");
      return;
    }
  }

  writeEmptyThemeHistory();
  console.log("Started a new theme history");
}

function ensureAssetWorktree() {
  const remoteBranchExists = git(["ls-remote", "--exit-code", "--heads", "origin", ASSET_BRANCH], { allowFailure: true }).status === 0;
  if (remoteBranchExists) {
    git(["fetch", "origin", `${ASSET_BRANCH}:${ASSET_BRANCH}`]);
    git(["worktree", "add", ASSET_WORKTREE, ASSET_BRANCH]);
    return;
  }

  git(["worktree", "add", "--detach", ASSET_WORKTREE]);
  git(["-C", ASSET_WORKTREE, "checkout", "--orphan", ASSET_BRANCH]);
  git(["-C", ASSET_WORKTREE, "rm", "-rf", "."], { allowFailure: true });
}

function restoreLegacyArchiveIfNeeded() {
  const outputRoot = path.join(ASSET_WORKTREE, "output");
  const hasArchive = fs.existsSync(outputRoot) && fs.readdirSync(outputRoot).some((entry) => fs.statSync(path.join(outputRoot, entry)).isDirectory());
  if (hasArchive) return;

  const archiveSource = outputOf("git", ["log", "--diff-filter=AM", "--format=%H", "-n", "1", "--", "output", "drafts"]);
  if (!archiveSource) return;
  git(["-C", ASSET_WORKTREE, "checkout", archiveSource, "--", "output"], { allowFailure: true });
  git(["-C", ASSET_WORKTREE, "checkout", archiveSource, "--", "drafts"], { allowFailure: true });
}

function copyDirectoryContents(source, target) {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(target, { recursive: true });
  fs.cpSync(source, target, { recursive: true, force: true });
}

function copySiteFiles() {
  for (const file of SITE_FILES) {
    fs.copyFileSync(file, path.join(ASSET_WORKTREE, file));
  }
}

function removeDraftMetadata() {
  const draftRoot = path.join(ASSET_WORKTREE, "drafts");
  if (!fs.existsSync(draftRoot)) return;
  const visit = (folder) => {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const entryPath = path.join(folder, entry.name);
      if (entry.isDirectory()) {
        visit(entryPath);
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        fs.rmSync(entryPath, { force: true });
      }
    }
  };
  visit(draftRoot);
}

function publishArchive() {
  console.log("Generated output files:");
  run("find", ["output", "-maxdepth", "4", "-type", "f"], { allowFailure: true });
  if (fs.existsSync("drafts")) {
    console.log("Generated draft files:");
    run("find", ["drafts", "-maxdepth", "4", "-type", "f"], { allowFailure: true });
  }

  ensureAssetWorktree();
  restoreLegacyArchiveIfNeeded();

  copySiteFiles();
  copyDirectoryContents("output", path.join(ASSET_WORKTREE, "output"));
  fs.mkdirSync(path.join(ASSET_WORKTREE, "data"), { recursive: true });
  fs.copyFileSync(THEME_HISTORY_FILE, path.join(ASSET_WORKTREE, THEME_HISTORY_FILE));
  copyDirectoryContents("drafts", path.join(ASSET_WORKTREE, "drafts"));
  removeDraftMetadata();

  git(["-C", ASSET_WORKTREE, "add", "-A"]);
  git(["-C", ASSET_WORKTREE, "commit", "-m", "chore: update generated wallpapers"], { allowFailure: true });
  git(["-C", ASSET_WORKTREE, "push", "origin", ASSET_BRANCH]);
}

const command = process.argv[2];
if (command === "restore-history") {
  restoreThemeHistory();
} else if (command === "publish-archive") {
  publishArchive();
} else {
  console.error("Usage: node publish-generated-assets.js <restore-history|publish-archive>");
  process.exit(1);
}
