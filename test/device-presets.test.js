import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const config = JSON.parse(fs.readFileSync(new URL("../device-presets.json", import.meta.url)));

const expectedResolutionByModel = new Map(Object.entries({
  "iPhone 17 Pro Max": "1320x2868",
  "iPhone 16 Pro Max": "1320x2868",
  "iPhone 17 Pro": "1206x2622",
  "iPhone 17": "1206x2622",
  "iPhone 16 Pro": "1206x2622",
  "iPhone Air": "1260x2736",
  "iPhone 16 Plus": "1290x2796",
  "iPhone 15 Pro Max": "1290x2796",
  "iPhone 15 Plus": "1290x2796",
  "iPhone 14 Pro Max": "1290x2796",
  "iPhone 16": "1179x2556",
  "iPhone 15 Pro": "1179x2556",
  "iPhone 15": "1179x2556",
  "iPhone 14 Pro": "1179x2556",
  "iPhone 14 Plus": "1284x2778",
  "iPhone 13 Pro Max": "1284x2778",
  "iPhone 12 Pro Max": "1284x2778",
  "iPhone 14": "1170x2532",
  "iPhone 13 Pro": "1170x2532",
  "iPhone 13": "1170x2532",
  "iPhone 12 Pro": "1170x2532",
  "iPhone 12": "1170x2532",
  "iPhone 13 mini": "1080x2340",
  "iPhone 12 mini": "1080x2340",
  "iPhone 11 Pro": "1125x2436",
  "iPhone XS": "1125x2436",
  "iPhone X": "1125x2436",
  "iPhone 11 Pro Max": "1242x2688",
  "iPhone XS Max": "1242x2688",
  "iPhone 11": "828x1792",
  "iPhone XR": "828x1792",
  "iPhone SE (2nd or 3rd generation)": "750x1334",
  "iPhone 8": "750x1334",
  "iPhone 7": "750x1334",
  "iPhone 6s": "750x1334"
}));

test("device presets cover unique output sizes and model names", () => {
  assert.equal(config.version, 3);
  assert.equal(config.presets.length, 12);

  const ids = new Set();
  const models = new Set();
  for (const preset of config.presets) {
    assert.match(preset.id, /^\d+x\d+$/);
    assert.equal(preset.id, `${preset.width}x${preset.height}`);
    assert.ok(preset.width >= 750);
    assert.ok(preset.height > preset.width);
    assert.ok(preset.models.length > 0);
    assert.ok(["dynamic-island", "notch", "none"].includes(preset.cutout));
    assert.equal(ids.has(preset.id), false);
    ids.add(preset.id);

    for (const model of preset.models) {
      assert.equal(models.has(model), false);
      assert.equal(preset.id, expectedResolutionByModel.get(model), `${model} has the wrong resolution`);
      models.add(model);
    }
  }

  assert.deepEqual(models, new Set(expectedResolutionByModel.keys()));
  assert.equal(ids.has("1080x2340"), true);
});
