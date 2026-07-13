const deviceSelect = document.querySelector("#device-model");
const dimensions = document.querySelector("#dimensions");
const previewFrame = document.querySelector("#phone-preview");
const previewImage = document.querySelector("#wallpaper-preview");
const previewMessage = document.querySelector("#preview-message");
const urlInput = document.querySelector("#wallpaper-url");
const copyButton = document.querySelector("#copy-url");
const openLink = document.querySelector("#open-wallpaper");
const downloadLink = document.querySelector("#download-wallpaper");

let presets = [];

function shanghaiDateKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function wallpaperPath(preset) {
  return `output/devices/${preset.id}/today.png`;
}

function selectedPreset() {
  return presets.find((preset) => preset.id === deviceSelect.value) || presets[0];
}

function enableLink(link, href) {
  link.href = href;
  link.removeAttribute("aria-disabled");
}

function updateSelection() {
  const preset = selectedPreset();
  if (!preset) return;

  const path = wallpaperPath(preset);
  const stableUrl = new URL(path, document.baseURI).href;
  dimensions.textContent = `${preset.width} x ${preset.height}`;
  previewFrame.style.setProperty("--preview-ratio", `${preset.width} / ${preset.height}`);
  previewImage.classList.remove("is-ready");
  previewMessage.hidden = false;
  previewMessage.textContent = "Loading today's wallpaper...";
  previewImage.src = `${path}?date=${shanghaiDateKey()}`;
  urlInput.value = stableUrl;
  copyButton.disabled = false;
  enableLink(openLink, stableUrl);
  enableLink(downloadLink, stableUrl);
  downloadLink.download = `calendar-wallpaper-${preset.id}.png`;
}

function populateDevices() {
  deviceSelect.innerHTML = "";
  for (const preset of presets) {
    for (const model of preset.models) {
      const option = document.createElement("option");
      option.value = preset.id;
      option.textContent = model;
      if (model === "iPhone 16 Pro") option.selected = true;
      deviceSelect.append(option);
    }
  }
  deviceSelect.disabled = false;
  updateSelection();
}

previewImage.addEventListener("load", () => {
  previewImage.classList.add("is-ready");
  previewMessage.hidden = true;
});

previewImage.addEventListener("error", () => {
  previewImage.classList.remove("is-ready");
  previewMessage.hidden = false;
  previewMessage.textContent = "Today's wallpaper is still being generated. Please try again shortly.";
});

deviceSelect.addEventListener("change", updateSelection);

copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(urlInput.value);
  copyButton.textContent = "Copied";
  setTimeout(() => {
    copyButton.textContent = "Copy URL";
  }, 1600);
});

fetch("device-presets.json")
  .then((response) => {
    if (!response.ok) throw new Error(`Device list request failed: ${response.status}`);
    return response.json();
  })
  .then((data) => {
    presets = Array.isArray(data.presets) ? data.presets : [];
    if (presets.length === 0) throw new Error("No device presets are configured");
    populateDevices();
  })
  .catch(() => {
    deviceSelect.innerHTML = "<option>Device list unavailable</option>";
    dimensions.textContent = "Unavailable";
    previewMessage.textContent = "The device list could not be loaded. Please refresh the page.";
  });
