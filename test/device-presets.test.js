import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const config = JSON.parse(fs.readFileSync(new URL("../device-presets.json", import.meta.url)));

test("device presets cover unique output sizes and model names", () => {
  assert.equal(config.version, 1);
  assert.ok(config.presets.length >= 8);

  const ids = new Set();
  const models = new Set();
  for (const preset of config.presets) {
    assert.match(preset.id, /^\d+x\d+$/);
    assert.equal(preset.id, `${preset.width}x${preset.height}`);
    assert.ok(preset.width >= 750);
    assert.ok(preset.height > preset.width);
    assert.ok(preset.models.length > 0);
    assert.equal(ids.has(preset.id), false);
    ids.add(preset.id);

    for (const model of preset.models) {
      assert.equal(models.has(model), false);
      models.add(model);
    }
  }
});
