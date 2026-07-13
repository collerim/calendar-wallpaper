import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const motifMetadataSource = fs.readFileSync(new URL("../theme-motifs.js", import.meta.url), "utf8");
const motifRendererSource = fs.readFileSync(new URL("../motif-renderers.js", import.meta.url), "utf8");
const holidayRefreshSource = fs.readFileSync(new URL("../refresh-holiday-data.js", import.meta.url), "utf8");

const newMotifs = [
  "musicWaves",
  "cosmicObservatory",
  "gardenGate",
  "oceanCompass"
];

function loadMotifMetadata() {
  const context = vm.createContext({});
  vm.runInContext(
    `${motifMetadataSource}\nglobalThis.__motifMetadata = { MOTIF_TAGS, MONTH_MOTIF_ROTATION, SEASONAL_MOTIF_COPY };`,
    context,
    { filename: "theme-motifs.js" }
  );
  return context.__motifMetadata;
}

test("new motifs have tags, seasonal copy, and fallback rotation slots", () => {
  const metadata = loadMotifMetadata();

  for (const motif of newMotifs) {
    assert.ok(metadata.MOTIF_TAGS[motif]?.length >= 3, `${motif} should have semantic tags`);
    assert.equal(metadata.SEASONAL_MOTIF_COPY[motif]?.titles.length, 3, `${motif} should have seasonal titles`);
    assert.ok(metadata.MONTH_MOTIF_ROTATION.some((rotation) => rotation.includes(motif)), `${motif} should appear in fallback rotation`);
  }
});

test("every registered motif reaches the drawing dispatcher", () => {
  const { MOTIF_TAGS } = loadMotifMetadata();

  for (const motif of Object.keys(MOTIF_TAGS)) {
    assert.match(motifRendererSource, new RegExp(`\\b${motif}:\\s*draw[A-Z]`), `${motif} should be registered with a renderer`);
  }
});

test("new motifs are available to refreshed holiday themes", () => {
  for (const motif of newMotifs) {
    assert.match(holidayRefreshSource, new RegExp(`\\b${motif}: \\[\\[`), `${motif} should have a generated-theme palette`);
  }

  assert.match(holidayRefreshSource, /return "musicWaves"/);
  assert.match(holidayRefreshSource, /return "cosmicObservatory"/);
  assert.match(holidayRefreshSource, /return "gardenGate"/);
  assert.match(holidayRefreshSource, /return "oceanCompass"/);
});
