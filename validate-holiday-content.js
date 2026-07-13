await import("./data/holiday-content.js");
await import("./data/holiday-intros.js");

const content = globalThis.YearCalendarHolidayContent || {};
const intros = globalThis.YearCalendarHolidayIntros || {};
const entries = Array.isArray(content.entries) ? content.entries : [];
const errors = [];
const warnings = [];
const keyOwners = new Map();

for (const [index, entry] of entries.entries()) {
  const label = `${index + 1}. ${entry.title || "<missing title>"}`;
  const entryErrors = requiredFieldErrors(entry);
  for (const error of entryErrors) errors.push(`${label}: ${error}`);

  if (/TODO/i.test(entry.description || "")) errors.push(`${label}: description still contains TODO`);

  const ownKeys = new Set();
  for (const rawKey of holidayContentKeys(entry)) {
    const key = normalizeKey(rawKey);
    if (!key) continue;
    ownKeys.add(key);
  }

  if (!ownKeys.size) {
    errors.push(`${label}: no usable lookup keys`);
    continue;
  }

  for (const key of ownKeys) {
    const owner = keyOwners.get(key);
    if (owner && owner.entry !== entry) {
      if (isRiskyDuplicateKey(key, owner.entry, entry)) {
        errors.push(`${label}: lookup key "${key}" already belongs to "${owner.entry.title}"`);
      } else {
        warnings.push(`${label}: broad lookup key "${key}" also appears in "${owner.entry.title}"`);
      }
      continue;
    }
    keyOwners.set(key, { entry, index });
  }
}

for (const introKey of Object.keys(intros)) {
  const key = normalizeKey(introKey);
  if (!keyOwners.has(key)) errors.push(`legacy intro key is not covered by structured content: ${introKey}`);
}

console.log(`Holiday content entries: ${entries.length}`);
console.log(`Structured lookup keys: ${keyOwners.size}`);
console.log(`Warnings: ${warnings.length}`);
console.log(`Errors: ${errors.length}`);

for (const warning of warnings.slice(0, 40)) console.log(`warning: ${warning}`);
if (warnings.length > 40) console.log(`warning: ... ${warnings.length - 40} more`);

for (const error of errors) console.error(`error: ${error}`);
if (errors.length) process.exit(1);

function requiredFieldErrors(entry) {
  const missing = [];
  if (!entry.title) missing.push("missing title");
  if (!entry.zhTitle) missing.push("missing zhTitle");
  if (!entry.type) missing.push("missing type");
  if (!entry.description) missing.push("missing description");
  if (!Array.isArray(entry.keys) || !entry.keys.length) missing.push("missing keys");
  return missing;
}

function holidayContentKeys(entry) {
  return Array.isArray(entry.keys) ? entry.keys.filter(Boolean) : [];
}

function isRiskyDuplicateKey(key, existingEntry, newEntry) {
  if (isCountryScopedHolidayKey(key)) return true;
  if (key.includes("|")) return true;

  const existingScoped = holidayContentKeys(existingEntry).some((value) => isCountryScopedHolidayKey(normalizeKey(value)));
  const newScoped = holidayContentKeys(newEntry).some((value) => isCountryScopedHolidayKey(normalizeKey(value)));

  // A broad generic alias shared by two country-scoped entries can make future
  // provider matches pick the first entry accidentally.
  return existingScoped && newScoped;
}

function isCountryScopedHolidayKey(key) {
  return /^[a-z]{2}\|/.test(key);
}

function normalizeKey(value) {
  return String(value || "").toLowerCase().replace(/[’']/g, "").replace(/\s+/g, " ").trim();
}
