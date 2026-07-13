// Main motif dispatcher and large motif drawing functions.

const THEME_DECORATION_RENDERERS = Object.freeze({
  grain: drawGrain,
  marigold: drawMarigold,
  clover: drawClover,
  mountainFlags: drawMountainFlags,
  tanabata: drawTanabata,
  waterFlowers: drawWaterFlowers,
  tricolor: drawTricolor,
  pumpkin: drawPumpkin,
  snow: drawSnow,
  springBuds: drawSpringBuds,
  sunRibbons: drawSunRibbons,
  fireworks: drawFireworks,
  petals: drawPetals,
  candle: drawCandle,
  streamers: drawStreamers,
  starfield: drawStarfield,
  lanterns: drawLanterns,
  paperKites: drawPaperKites,
  wovenPattern: drawWovenPattern,
  moonOrbit: drawMoonOrbit,
  rainGarden: drawRainGarden,
  harvestSheaves: drawHarvestSheaves,
  paperCut: drawPaperCut,
  teaSteam: drawTeaSteam,
  dragonDance: drawDragonDance,
  crescentLantern: drawCrescentLantern,
  lotusMandala: drawLotusMandala,
  templeBells: drawTempleBells,
  carnivalMasks: drawCarnivalMasks,
  folkEmbroidery: drawFolkEmbroidery,
  cityParade: drawCityParade,
  maritimeFlags: drawMaritimeFlags,
  desertGeometry: drawDesertGeometry,
  tropicalBloom: drawTropicalBloom,
  oliveBranches: drawOliveBranches,
  laurelTorch: drawLaurelTorch,
  sportsMedals: drawSportsMedals,
  bookPress: drawBookPress,
  marketBanners: drawMarketBanners,
  ancestralTable: drawAncestralTable,
  doveGarland: drawDoveGarland,
  stainedGlass: drawStainedGlass,
  musicWaves: drawMusicWaves,
  cosmicObservatory: drawCosmicObservatory,
  gardenGate: drawGardenGate,
  oceanCompass: drawOceanCompass,
  aurora: drawAurora
});

function drawThemeDecorations(ctx, theme, width, height) {
  const renderer = THEME_DECORATION_RENDERERS[theme.motif] || THEME_DECORATION_RENDERERS.aurora;
  renderer(ctx, theme, width, height);
  drawCulturalIllustration(ctx, theme, width, height);
  drawSemanticOrnaments(ctx, theme, width, height);
}

globalThis.YearCalendarMotifRenderers = {
  renderers: THEME_DECORATION_RENDERERS
};

function drawGrain(ctx, theme, width) {
  for (const side of [-1, 1]) {
    const baseX = side < 0 ? 118 : width - 118;
    for (let i = 0; i < 7; i++) {
      const x = baseX + side * i * 13;
      const y = 655 + i * 115;
      strokePath(ctx, [[x, y], [x + side * 46, y - 150]], theme.accent, 3, 0.28 - i * 0.012);
      for (let g = 0; g < 5; g++) {
        const gy = y - 128 + g * 24;
        drawEllipse(ctx, x + side * (24 + g * 3), gy, 8, 20, side * -0.49, theme.accent, 0.16);
      }
    }
  }
  for (let i = 0; i < 28; i++) {
    const x = 70 + i * 42;
    const y = 205 + (i % 4) * 20;
    strokePath(ctx, [[x, y], [x + 18, y + 52]], theme.secondary, 2, 0.14 + (i % 3) * 0.03);
  }
  strokePath(ctx, [[90, 2350], [250, 2260, 390, 2295, 535, 2210]], theme.accent, 3, 0.18);
  strokePath(ctx, [[1170, 2352], [1010, 2262, 872, 2297, 725, 2215]], theme.accent, 3, 0.18);
}

function drawMarigold(ctx, theme, width) {
  drawBunting(ctx, theme, 74, 94, 7);
  drawBunting(ctx, theme, width - 536, 94, 7, true);
  for (const [cx, cy, size] of [[82, 770, 44], [1160, 790, 52], [106, 2265, 56], [1154, 2260, 46], [1015, 2440, 38], [245, 2448, 38]]) {
    flower(ctx, cx, cy, size, theme.accent, theme.secondary, 0.21);
  }
  strokePath(ctx, [[72, 2105], [210, 2060, 320, 2108, 438, 2048]], theme.secondary, 3, 0.18);
  strokePath(ctx, [[1188, 2105], [1050, 2060, 940, 2108, 822, 2048]], theme.secondary, 3, 0.18);
}

function drawClover(ctx, theme, width) {
  for (const [x, y, r] of [[95, 710, 18], [1165, 720, 22], [110, 2235, 26], [1135, 2240, 18], [250, 2485, 18], [1015, 2470, 20]]) {
    clover(ctx, x, y, r, theme.accent, 0.22);
  }
  for (let i = 0; i < 9; i++) {
    strokePath(ctx, [[84 + i * 28, 230 + i * 8], [172 + i * 20, 190 + i * 4, 268 + i * 16, 218 + i * 10, 360 + i * 9, 178 + i * 3]], theme.accent, 3, 0.11 + i * 0.006);
    strokePath(ctx, [[width - 84 - i * 28, 230 + i * 8], [width - 172 - i * 20, 190 + i * 4, width - 268 - i * 16, 218 + i * 10, width - 360 - i * 9, 178 + i * 3]], theme.accent, 3, 0.11 + i * 0.006);
  }
  strokePath(ctx, [[95, 2400], [260, 2345, 390, 2395, 520, 2325]], theme.secondary, 3, 0.18);
  strokePath(ctx, [[1165, 2400], [1000, 2345, 870, 2395, 740, 2325]], theme.secondary, 3, 0.18);
}

function drawMountainFlags(ctx, theme, width, height) {
  ctx.save();
  ctx.fillStyle = hexToRgba(theme.secondary, 0.12);
  ctx.beginPath();
  ctx.moveTo(0, 2570);
  ctx.lineTo(190, 2300);
  ctx.lineTo(320, 2460);
  ctx.lineTo(505, 2215);
  ctx.lineTo(690, 2500);
  ctx.lineTo(842, 2340);
  ctx.lineTo(1040, 2590);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = hexToRgba(theme.accent, 0.1);
  ctx.beginPath();
  ctx.moveTo(76, 2578);
  ctx.lineTo(254, 2360);
  ctx.lineTo(386, 2500);
  ctx.lineTo(548, 2302);
  ctx.lineTo(720, 2578);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  for (const y of [174, 226]) {
    strokePath(ctx, [[105, y], [285, y - 55, 410, y + 50, 570, y - 10]], "#ffffff", 2, 0.16);
    strokePath(ctx, [[690, y - 4], [850, y - 65, 978, y + 48, 1152, y - 12]], "#ffffff", 2, 0.16);
    for (let i = 0; i < 10; i++) {
      flag(ctx, 120 + i * 48, y - 4 + (i % 3) * 7, [theme.accent, theme.secondary, "#d65345", "#ffffff"][i % 4]);
      flag(ctx, 704 + i * 48, y - 8 + (i % 3) * 7, [theme.secondary, theme.accent, "#d65345", "#ffffff"][i % 4]);
    }
  }
}

function drawTanabata(ctx, theme, width) {
  for (let i = 0; i < 42; i++) {
    const x = 55 + ((i * 109) % 1150);
    const y = 130 + ((i * 73) % 250);
    drawStar(ctx, x, y, 6 + (i % 3) * 2, 2.5, i % 4 === 0 ? theme.secondary : theme.accent, 0.15 + (i % 5) * 0.025);
  }
  strokePath(ctx, [[56, 270], [250, 178, 412, 316, 610, 232], [810, 148, 972, 278, 1204, 184]], theme.accent, 2, 0.22);
  strokePath(ctx, [[70, 2380], [260, 2310, 404, 2370, 566, 2280]], theme.secondary, 3, 0.18);
  strokePath(ctx, [[1190, 2380], [1000, 2310, 856, 2370, 694, 2280]], theme.secondary, 3, 0.18);
  for (const [x, y, color] of [[96, 700, theme.secondary], [1160, 710, theme.accent], [128, 2250, theme.accent], [1132, 2250, theme.secondary], [1006, 2450, theme.accent]]) {
    tag(ctx, x, y, color);
  }
}

function drawWaterFlowers(ctx, theme) {
  for (let i = 0; i < 8; i++) {
    strokePath(ctx, [[60 + i * 16, 265 + i * 18], [190 + i * 12, 190 + i * 5, 290 + i * 20, 335 - i * 12, 420 + i * 16, 250 + i * 9]], theme.accent, 3, 0.13 + i * 0.01);
    strokePath(ctx, [[1200 - i * 16, 265 + i * 18], [1070 - i * 12, 190 + i * 5, 970 - i * 20, 335 - i * 12, 840 - i * 16, 250 + i * 9]], theme.accent, 3, 0.13 + i * 0.01);
  }
  for (const [cx, cy, size] of [[92, 770, 40], [1168, 790, 44], [120, 2235, 42], [1140, 2230, 38], [260, 2460, 34], [1005, 2468, 34]]) {
    flower(ctx, cx, cy, size, theme.secondary, theme.accent, 0.22, 5);
  }
  strokePath(ctx, [[78, 2360], [225, 2280, 408, 2344, 552, 2266]], theme.accent, 4, 0.18);
  strokePath(ctx, [[1182, 2360], [1035, 2280, 852, 2344, 708, 2266]], theme.accent, 4, 0.18);
}

function drawTricolor(ctx, theme) {
  const colors = [theme.accent, "#f3f3f5", theme.secondary];
  for (const [cx, cy] of [[112, 230], [1138, 230], [118, 2250], [1142, 2250], [260, 2460], [1000, 2460]]) {
    for (let ring = 0; ring < 3; ring++) {
      for (let i = 0; i < 18; i++) {
        const angle = (Math.PI * 2 * i) / 18;
        const len = 24 + ring * 18;
        const x1 = cx + Math.cos(angle) * (18 + ring * 16);
        const y1 = cy + Math.sin(angle) * (18 + ring * 16);
        const x2 = cx + Math.cos(angle) * len;
        const y2 = cy + Math.sin(angle) * len;
        strokePath(ctx, [[x1, y1], [x2, y2]], colors[(i + ring) % 3], 2, 0.12 - ring * 0.02);
      }
    }
  }
  for (let i = 0; i < 3; i++) {
    strokePath(ctx, [[70, 170 + i * 45], [245, 125 + i * 38, 392, 215 + i * 18, 560, 160 + i * 30]], colors[i], 4, 0.18);
    strokePath(ctx, [[700, 170 + i * 45], [875, 125 + i * 38, 1022, 215 + i * 18, 1190, 160 + i * 30]], colors[i], 4, 0.18);
  }
}

function drawPumpkin(ctx, theme) {
  for (const [cx, cy, size] of [[92, 735, 46], [1166, 742, 42], [114, 2240, 54], [1145, 2245, 48], [255, 2470, 38], [1010, 2465, 42]]) {
    ctx.fillStyle = hexToRgba(theme.accent, 0.2);
    ctx.beginPath();
    ctx.ellipse(cx, cy, size * 0.55, size * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
    drawEllipse(ctx, cx - size * 0.22, cy, size * 0.28, size * 0.4, 0, theme.accent, 0.14);
    drawEllipse(ctx, cx + size * 0.22, cy, size * 0.28, size * 0.4, 0, theme.accent, 0.14);
    strokePath(ctx, [[cx, cy - size * 0.34], [cx + size * 0.16, cy - size * 0.64, cx - size * 0.08, cy - size * 0.72, cx + size * 0.18, cy - size * 0.92]], theme.secondary, 3, 0.16);
  }
  for (let i = 0; i < 18; i++) {
    dot(ctx, 90 + i * 64, 190 + (i % 3) * 35, 3 + (i % 3), theme.secondary, 0.12 + (i % 4) * 0.025);
  }
  strokePath(ctx, [[70, 2370], [225, 2295, 398, 2355, 548, 2268]], theme.accent, 3, 0.18);
  strokePath(ctx, [[1190, 2370], [1035, 2295, 862, 2355, 712, 2268]], theme.accent, 3, 0.18);
}

function drawAurora(ctx, theme) {
  for (let i = 0; i < 7; i++) {
    strokePath(ctx, [[70, 155 + i * 22], [260, 80 + i * 9, 402, 240 - i * 13, 585, 120 + i * 18]], i % 2 ? theme.secondary : theme.accent, 5, 0.09 + i * 0.01);
    strokePath(ctx, [[675, 155 + i * 22], [865, 80 + i * 9, 1007, 240 - i * 13, 1190, 120 + i * 18]], i % 2 ? theme.accent : theme.secondary, 5, 0.09 + i * 0.01);
  }
  mountainBase(ctx, theme);
  for (let i = 0; i < 28; i++) {
    dot(ctx, 55 + ((i * 127) % 1150), 305 + ((i * 97) % 180), 2 + (i % 3), "#f3f7ff", 0.12 + (i % 4) * 0.03);
  }
}

function drawSnow(ctx, theme) {
  drawAurora(ctx, theme);
  for (let i = 0; i < 50; i++) {
    dot(ctx, 55 + ((i * 131) % 1150), 125 + ((i * 83) % 330), 2 + (i % 3), "#f3f7ff", 0.09 + (i % 4) * 0.025);
  }
}

function drawSpringBuds(ctx, theme) {
  for (let i = 0; i < 8; i++) {
    strokePath(ctx, [[80 + i * 18, 270 + i * 18], [190 + i * 28, 198 + i * 8, 300 + i * 20, 330 - i * 10, 430 + i * 14, 230 + i * 8]], theme.accent, 3, 0.12 + i * 0.01);
    strokePath(ctx, [[1180 - i * 18, 270 + i * 18], [1070 - i * 28, 198 + i * 8, 960 - i * 20, 330 - i * 10, 830 - i * 14, 230 + i * 8]], theme.accent, 3, 0.12 + i * 0.01);
  }
  for (const [x, y] of [[96, 730], [1160, 735], [125, 2248], [1135, 2245], [260, 2460], [1010, 2460]]) {
    drawEllipse(ctx, x - 10, y, 10, 24, -0.6, theme.accent, 0.18);
    drawEllipse(ctx, x + 12, y - 4, 10, 24, 0.6, theme.secondary, 0.16);
  }
}

function drawSunRibbons(ctx, theme) {
  for (const [cx, cy] of [[130, 230], [1130, 230], [140, 2245], [1120, 2245], [285, 2470], [980, 2470]]) {
    for (let i = 0; i < 22; i++) {
      const angle = (Math.PI * 2 * i) / 22;
      strokePath(ctx, [[cx + Math.cos(angle) * 18, cy + Math.sin(angle) * 18], [cx + Math.cos(angle) * 64, cy + Math.sin(angle) * 64]], i % 2 ? theme.secondary : theme.accent, 3, 0.11);
    }
  }
  strokePath(ctx, [[70, 2360], [230, 2285, 410, 2350, 570, 2265]], theme.accent, 3, 0.18);
  strokePath(ctx, [[1190, 2360], [1030, 2285, 850, 2350, 690, 2265]], theme.secondary, 3, 0.18);
}

function drawFireworks(ctx, theme) {
  drawTricolor(ctx, theme);
}

function drawPetals(ctx, theme) {
  for (const [cx, cy, size] of [[92, 740, 42], [1166, 742, 38], [115, 2240, 46], [1142, 2244, 42], [255, 2468, 34], [1010, 2462, 36]]) {
    flower(ctx, cx, cy, size, theme.accent, theme.secondary, 0.18, 6);
  }
  for (let i = 0; i < 28; i++) {
    drawEllipse(ctx, 70 + ((i * 79) % 1120), 150 + ((i * 41) % 280), 5, 13, i * 0.7, i % 2 ? theme.secondary : theme.accent, 0.12);
  }
}

function drawCandle(ctx, theme) {
  for (const [x, y] of [[95, 730], [1165, 735], [125, 2245], [1135, 2240], [260, 2460], [1010, 2460]]) {
    ctx.fillStyle = hexToRgba(theme.secondary, 0.17);
    roundRect(ctx, x - 11, y - 25, 22, 58, 5);
    ctx.fill();
    drawEllipse(ctx, x, y - 42, 7, 17, 0, theme.accent, 0.22);
  }
  drawSnow(ctx, theme);
}

function drawStreamers(ctx, theme) {
  for (let y of [174, 226]) {
    strokePath(ctx, [[80, y], [260, y - 55, 420, y + 45, 590, y - 8]], theme.accent, 2, 0.16);
    strokePath(ctx, [[680, y], [860, y - 55, 1020, y + 45, 1190, y - 8]], theme.secondary, 2, 0.16);
    for (let i = 0; i < 10; i++) {
      flag(ctx, 100 + i * 48, y + (i % 3) * 7, i % 2 ? theme.secondary : theme.accent);
      flag(ctx, 700 + i * 48, y + (i % 3) * 7, i % 2 ? theme.accent : theme.secondary);
    }
  }
  drawSunRibbons(ctx, theme);
}

function drawStarfield(ctx, theme) {
  for (let i = 0; i < 56; i++) {
    const x = 50 + ((i * 113) % 1160);
    const y = 125 + ((i * 71) % 360);
    if (i % 4 === 0) drawStar(ctx, x, y, 7, 3, theme.secondary, 0.16);
    else dot(ctx, x, y, 2 + (i % 4), theme.accent, 0.11 + (i % 5) * 0.02);
  }
  strokePath(ctx, [[78, 2360], [240, 2285, 420, 2355, 574, 2268]], theme.secondary, 3, 0.18);
  strokePath(ctx, [[1182, 2360], [1020, 2285, 840, 2355, 686, 2268]], theme.secondary, 3, 0.18);
}

function drawLanterns(ctx, theme, width, height) {
  for (const y of [150, height - 410]) {
    strokePath(ctx, [[78, y], [280, y - 44, 440, y + 34, 620, y - 8], [820, y - 52, 986, y + 36, width - 78, y - 10]], theme.secondary, 2, 0.15);
    for (let i = 0; i < 9; i++) {
      const x = 120 + i * ((width - 240) / 8);
      const ly = y + 38 + ((i % 3) * 13);
      strokePath(ctx, [[x, y + 4], [x, ly - 34]], theme.secondary, 1.4, 0.12);
      drawSoftGlow(ctx, x, ly, 54, i % 2 ? theme.secondary : theme.accent, 0.035);
      drawEllipse(ctx, x, ly, 18, 30, 0, i % 2 ? theme.secondary : theme.accent, 0.16);
      strokePath(ctx, [[x - 16, ly], [x + 16, ly]], "#ffffff", 1.2, 0.12);
      strokePath(ctx, [[x, ly + 31], [x, ly + 50]], theme.accent, 1.5, 0.1);
    }
  }
}

function drawPaperKites(ctx, theme, width, height) {
  const kites = [
    [135, 385, 0.72],
    [width - 150, 415, -0.62],
    [190, height - 455, -0.45],
    [width - 175, height - 500, 0.55]
  ];
  for (const [cx, cy, angle] of kites) {
    drawKite(ctx, cx, cy, 56, angle, theme.accent, theme.secondary);
    strokePath(ctx, [[cx, cy + 40], [cx - 36, cy + 110, cx + 44, cy + 160, cx - 18, cy + 220]], theme.secondary, 1.8, 0.1);
    for (let bow = 0; bow < 3; bow++) {
      const bx = cx + (bow % 2 ? 22 : -18);
      const by = cy + 95 + bow * 48;
      drawDiamond(ctx, bx, by, 8, bow % 2 ? theme.secondary : theme.accent, 0.12);
    }
  }
  drawConstellationVeil(ctx, theme, width, height, themeVariant(theme, 7));
}

function drawWovenPattern(ctx, theme, width, height) {
  for (const baseY of [210, height - 350]) {
    for (let row = 0; row < 5; row++) {
      const y = baseY + row * 26;
      for (let i = 0; i < 16; i++) {
        const x = 84 + i * ((width - 168) / 15);
        const color = (i + row) % 2 ? theme.secondary : theme.accent;
        strokePath(ctx, [[x - 18, y - 10], [x + 18, y + 10]], color, 2.2, 0.08);
        strokePath(ctx, [[x - 18, y + 10], [x + 18, y - 10]], color, 2.2, 0.06);
      }
    }
  }
  for (const [x, y] of [[105, 610], [width - 105, 610], [126, height - 610], [width - 126, height - 610]]) {
    drawDiamond(ctx, x, y, 34, theme.accent, 0.08);
    drawDiamond(ctx, x, y, 18, theme.secondary, 0.1);
  }
}

function drawMoonOrbit(ctx, theme, width, height) {
  for (const [cx, cy, scale] of [[width / 2, 255, 1], [width / 2, height - 330, 0.85]]) {
    drawSoftGlow(ctx, cx, cy, 170 * scale, theme.secondary, 0.035);
    drawEllipse(ctx, cx, cy, 64 * scale, 64 * scale, 0, theme.secondary, 0.11);
    drawEllipse(ctx, cx + 24 * scale, cy - 6 * scale, 56 * scale, 60 * scale, 0, theme.gradient[0], 0.23);
    for (let ring = 0; ring < 3; ring++) {
      ctx.save();
      ctx.strokeStyle = hexToRgba(ring % 2 ? theme.accent : theme.secondary, 0.055 + ring * 0.012);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, (145 + ring * 40) * scale, (44 + ring * 14) * scale, -0.18 + ring * 0.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      dot(ctx, cx + Math.cos(angle) * 210 * scale, cy + Math.sin(angle) * 66 * scale, 2.8 + (i % 3), "#ffffff", 0.11);
    }
  }
}

function drawRainGarden(ctx, theme, width, height) {
  drawWaveLattice(ctx, theme, width, height, themeVariant(theme, 7));
  for (const [baseX, baseY, side] of [[95, 690, 1], [width - 95, 700, -1], [126, height - 620, 1], [width - 126, height - 635, -1]]) {
    strokePath(ctx, [[baseX, baseY + 72], [baseX + side * 38, baseY + 10, baseX + side * 82, baseY - 20, baseX + side * 132, baseY - 88]], theme.accent, 2.5, 0.11);
    for (let i = 0; i < 5; i++) {
      drawEllipse(ctx, baseX + side * (34 + i * 22), baseY - 12 - i * 16, 7, 18, side * (0.5 - i * 0.12), i % 2 ? theme.secondary : theme.accent, 0.1);
    }
    flower(ctx, baseX + side * 146, baseY - 96, 26, theme.secondary, theme.accent, 0.13, 7);
  }
  drawRainCurtainGlyphs(ctx, theme, width, height, themeVariant(theme, 5));
}

function drawHarvestSheaves(ctx, theme, width, height) {
  for (const [baseX, baseY, side] of [[110, 720, 1], [width - 110, 720, -1], [150, height - 480, 1], [width - 150, height - 480, -1]]) {
    for (let i = 0; i < 7; i++) {
      const angle = side * (-0.45 + i * 0.15);
      const x = baseX + side * i * 7;
      strokePath(ctx, [[x, baseY], [x + Math.sin(angle) * 90, baseY - 155 - i * 8]], i % 2 ? theme.secondary : theme.accent, 2.4, 0.13);
      for (let g = 0; g < 4; g++) {
        drawEllipse(ctx, x + side * (20 + g * 6), baseY - 132 + g * 18 - i * 5, 7, 16, side * -0.56, i % 2 ? theme.secondary : theme.accent, 0.105);
      }
    }
    strokePath(ctx, [[baseX - side * 46, baseY - 58], [baseX + side * 74, baseY - 76]], theme.secondary, 3, 0.12);
  }
  drawHarvestMoonGlyphs(ctx, theme, width, height, themeVariant(theme, 8));
}

function drawPaperCut(ctx, theme, width, height) {
  for (const [cx, cy, scale] of [[width / 2, 220, 1], [width / 2, height - 240, 0.9]]) {
    drawSoftGlow(ctx, cx, cy, 150 * scale, theme.accent, 0.035);
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16;
      const r = 84 * scale;
      drawDiamond(ctx, cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 12 * scale, i % 2 ? theme.secondary : theme.accent, 0.095);
    }
    drawDiamond(ctx, cx, cy, 48 * scale, theme.accent, 0.12);
    drawDiamond(ctx, cx, cy, 24 * scale, theme.secondary, 0.12);
  }
  drawBunting(ctx, theme, 84, 120, 7);
  drawBunting(ctx, theme, width - 574, 120, 7, true);
}

function drawTeaSteam(ctx, theme, width, height) {
  for (const [cx, cy] of [[150, 520], [width - 150, 520], [180, height - 500], [width - 180, height - 500]]) {
    drawEllipse(ctx, cx, cy + 54, 48, 12, 0, theme.secondary, 0.075);
    ctx.save();
    ctx.strokeStyle = hexToRgba(theme.accent, 0.1);
    ctx.lineWidth = 2;
    roundRect(ctx, cx - 42, cy + 10, 84, 54, 8);
    ctx.stroke();
    ctx.restore();
    for (let i = 0; i < 4; i++) {
      strokePath(ctx, [[cx - 30 + i * 20, cy], [cx - 46 + i * 22, cy - 44, cx - 6 + i * 18, cy - 74, cx - 22 + i * 21, cy - 118]], i % 2 ? theme.secondary : theme.accent, 2, 0.085);
    }
  }
  drawSmallLanternGlow(ctx, theme, width, height, themeVariant(theme, 6));
}

function drawDragonDance(ctx, theme, width, height) {
  for (const [baseY, flip] of [[210, 1], [height - 260, -1]]) {
    strokePath(ctx, [[80, baseY], [260, baseY - 88 * flip, 430, baseY + 95 * flip, 615, baseY + 8 * flip], [805, baseY - 82 * flip, 990, baseY + 72 * flip, width - 78, baseY - 18 * flip]], theme.accent, 18, 0.105);
    strokePath(ctx, [[92, baseY + 34 * flip], [280, baseY - 48 * flip, 440, baseY + 102 * flip, 620, baseY + 18 * flip], [818, baseY - 54 * flip, 990, baseY + 84 * flip, width - 96, baseY]], theme.secondary, 5, 0.12);
    for (let i = 0; i < 17; i++) {
      const x = 125 + i * ((width - 250) / 16);
      const y = baseY + Math.sin(i * 0.9) * 52 * flip;
      drawDiamond(ctx, x, y, 8 + (i % 3), i % 2 ? theme.secondary : theme.accent, 0.13);
      strokePath(ctx, [[x - 8, y + 24 * flip], [x - 16, y + 58 * flip]], theme.secondary, 1.8, 0.09);
    }
    drawStar(ctx, width - 118, baseY - 38 * flip, 24, 10, theme.accent, 0.16);
  }
}

function drawCrescentLantern(ctx, theme, width, height) {
  for (const [cx, cy, scale] of [[width / 2, 250, 1], [width / 2, height - 300, 0.86]]) {
    drawSoftGlow(ctx, cx, cy, 170 * scale, theme.secondary, 0.035);
    drawEllipse(ctx, cx - 28 * scale, cy, 70 * scale, 82 * scale, -0.2, theme.secondary, 0.13);
    drawEllipse(ctx, cx + 6 * scale, cy - 8 * scale, 68 * scale, 84 * scale, -0.2, theme.gradient[0], 0.28);
    for (let i = 0; i < 8; i++) {
      const x = cx - 300 * scale + i * 86 * scale;
      const y = cy + 90 * scale + (i % 2) * 26;
      strokePath(ctx, [[x, cy - 30 * scale], [x, y - 32 * scale]], theme.secondary, 1.3, 0.08);
      drawEllipse(ctx, x, y, 12 * scale, 24 * scale, 0, i % 2 ? theme.secondary : theme.accent, 0.12);
      dot(ctx, x, y, 2.5 * scale, "#ffffff", 0.1);
    }
    for (let i = 0; i < 22; i++) {
      const angle = Math.PI * 2 * (i / 22);
      drawStar(ctx, cx + Math.cos(angle) * 230 * scale, cy + Math.sin(angle) * 72 * scale, 5 * scale, 2 * scale, i % 2 ? theme.accent : theme.secondary, 0.09);
    }
  }
}

function drawLotusMandala(ctx, theme, width, height) {
  for (const [cx, cy, scale] of [[width / 2, 250, 1], [width / 2, height - 310, 0.9]]) {
    drawSoftGlow(ctx, cx, cy, 170 * scale, theme.accent, 0.03);
    for (let ring = 0; ring < 3; ring++) {
      const petals = 12 + ring * 4;
      for (let i = 0; i < petals; i++) {
        const angle = (Math.PI * 2 * i) / petals + ring * 0.12;
        const r = (45 + ring * 42) * scale;
        drawEllipse(ctx, cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 10 * scale, (28 + ring * 6) * scale, angle, (i + ring) % 2 ? theme.secondary : theme.accent, 0.085 - ring * 0.006);
      }
    }
    for (let i = 0; i < 8; i++) drawDiamond(ctx, cx + Math.cos(i * Math.PI / 4) * 150 * scale, cy + Math.sin(i * Math.PI / 4) * 150 * scale, 9 * scale, theme.secondary, 0.08);
  }
}

function drawTempleBells(ctx, theme, width, height) {
  for (const [cx, cy, scale] of [[142, 520, 1], [width - 142, 520, 1], [185, height - 500, 0.95], [width - 185, height - 500, 0.95]]) {
    ctx.save();
    ctx.strokeStyle = hexToRgba(theme.accent, 0.09);
    ctx.lineWidth = 2.5 * scale;
    ctx.beginPath();
    ctx.moveTo(cx - 42 * scale, cy + 54 * scale);
    ctx.quadraticCurveTo(cx - 30 * scale, cy - 38 * scale, cx, cy - 72 * scale);
    ctx.quadraticCurveTo(cx + 30 * scale, cy - 38 * scale, cx + 42 * scale, cy + 54 * scale);
    ctx.lineTo(cx - 42 * scale, cy + 54 * scale);
    ctx.stroke();
    ctx.restore();
    drawEllipse(ctx, cx, cy + 60 * scale, 48 * scale, 9 * scale, 0, theme.secondary, 0.08);
    dot(ctx, cx, cy + 72 * scale, 5 * scale, theme.accent, 0.11);
    for (let i = 0; i < 4; i++) strokePath(ctx, [[cx - 28 * scale + i * 18 * scale, cy - 86 * scale], [cx - 42 * scale + i * 22 * scale, cy - 132 * scale, cx + 8 * scale + i * 12 * scale, cy - 154 * scale, cx - 18 * scale + i * 18 * scale, cy - 194 * scale]], i % 2 ? theme.secondary : theme.accent, 1.6 * scale, 0.055);
  }
}

function drawCarnivalMasks(ctx, theme, width, height) {
  for (const [cx, cy, side] of [[140, 430, 1], [width - 140, 430, -1], [175, height - 450, 1], [width - 175, height - 450, -1]]) {
    drawEllipse(ctx, cx - side * 22, cy, 38, 52, side * 0.18, theme.accent, 0.09);
    drawEllipse(ctx, cx + side * 22, cy, 38, 52, -side * 0.18, theme.secondary, 0.08);
    drawEllipse(ctx, cx - side * 18, cy - 8, 10, 5, 0, theme.gradient[0], 0.28);
    drawEllipse(ctx, cx + side * 18, cy - 8, 10, 5, 0, theme.gradient[0], 0.28);
    for (let i = 0; i < 5; i++) {
      const angle = side * (-0.82 + i * 0.28);
      strokePath(ctx, [[cx, cy - 50], [cx + Math.cos(angle) * 88, cy - 92 + Math.sin(angle) * 28]], i % 2 ? theme.secondary : theme.accent, 2.4, 0.085);
    }
    strokePath(ctx, [[cx - side * 86, cy + 78], [cx - side * 28, cy + 112, cx + side * 42, cy + 48, cx + side * 98, cy + 88]], theme.accent, 2, 0.075);
  }
}

function drawFolkEmbroidery(ctx, theme, width, height) {
  for (const x of [72, width - 72]) {
    for (let i = 0; i < 13; i++) {
      const y = 360 + i * 160;
      drawDiamond(ctx, x, y, 20 + (i % 2) * 5, i % 2 ? theme.secondary : theme.accent, 0.08);
      drawDiamond(ctx, x, y, 9, i % 2 ? theme.accent : theme.secondary, 0.1);
      strokePath(ctx, [[x - 28, y - 28], [x + 28, y + 28]], theme.accent, 1.6, 0.055);
      strokePath(ctx, [[x - 28, y + 28], [x + 28, y - 28]], theme.secondary, 1.6, 0.055);
    }
  }
  drawWovenBorders(ctx, theme, width, height, themeVariant(theme, 7));
}

function drawCityParade(ctx, theme, width, height) {
  for (const y of [170, 225, height - 245, height - 190]) {
    strokePath(ctx, [[70, y], [260, y - 34, 430, y + 32, 610, y - 4], [810, y - 42, 988, y + 30, width - 70, y - 8]], y < height / 2 ? theme.accent : theme.secondary, 3, 0.12);
    for (let i = 0; i < 12; i++) {
      const x = 110 + i * ((width - 220) / 11);
      flag(ctx, x, y + 8 + (i % 3) * 10, i % 2 ? theme.secondary : theme.accent);
    }
  }
  for (let i = 0; i < 9; i++) {
    const x = 160 + i * ((width - 320) / 8);
    strokePath(ctx, [[x, 360], [x - 42, 450], [x + 42, 450], [x, 360]], theme.secondary, 1.8, 0.055);
    strokePath(ctx, [[x, height - 360], [x - 42, height - 450], [x + 42, height - 450], [x, height - 360]], theme.accent, 1.8, 0.055);
  }
}

function drawMaritimeFlags(ctx, theme, width, height) {
  for (const y of [190, height - 250]) {
    for (let row = 0; row < 4; row++) {
      strokePath(ctx, [[60, y + row * 26], [240, y - 32 + row * 18, 430, y + 42 + row * 12, 620, y], [830, y - 44 + row * 14, 1000, y + 32 + row * 10, width - 60, y - 6]], row % 2 ? theme.secondary : theme.accent, 2, 0.075);
    }
    for (let i = 0; i < 14; i++) {
      const x = 92 + i * ((width - 184) / 13);
      ctx.fillStyle = hexToRgba(i % 2 ? theme.secondary : theme.accent, 0.13);
      ctx.beginPath();
      ctx.moveTo(x, y + 76);
      ctx.lineTo(x + 22, y + 92 + (i % 2) * 10);
      ctx.lineTo(x, y + 110);
      ctx.closePath();
      ctx.fill();
    }
  }
  drawHarborSignals(ctx, theme, width, height, themeVariant(theme, 6));
}

function drawDesertGeometry(ctx, theme, width, height) {
  for (const y of [310, height - 380]) {
    strokePath(ctx, [[60, y + 70], [250, y - 35, 455, y + 80, 650, y + 6], [850, y - 80, 1020, y + 58, width - 60, y + 12]], theme.accent, 3, 0.09);
    strokePath(ctx, [[80, y + 120], [300, y + 22, 500, y + 122, 710, y + 42], [900, y - 20, 1055, y + 94, width - 80, y + 52]], theme.secondary, 2, 0.07);
  }
  for (const [cx, cy] of [[180, 500], [width - 180, 500], [220, height - 525], [width - 220, height - 525], [width / 2, 250], [width / 2, height - 260]]) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      drawDiamond(ctx, cx + Math.cos(angle) * 44, cy + Math.sin(angle) * 44, 8, i % 2 ? theme.secondary : theme.accent, 0.085);
    }
    drawStar(ctx, cx, cy, 15, 6, theme.secondary, 0.09);
  }
}

function drawTropicalBloom(ctx, theme, width, height) {
  for (const [baseX, baseY, side] of [[86, 500, 1], [width - 86, 500, -1], [115, height - 500, 1], [width - 115, height - 500, -1]]) {
    for (let i = 0; i < 5; i++) {
      const angle = side * (-0.85 + i * 0.32);
      drawEllipse(ctx, baseX + side * (48 + i * 20), baseY - 20 + i * 9, 18, 72, angle, i % 2 ? theme.secondary : theme.accent, 0.075);
      strokePath(ctx, [[baseX, baseY], [baseX + side * (88 + i * 28), baseY - 50 + i * 14]], theme.secondary, 1.5, 0.055);
    }
    flower(ctx, baseX + side * 138, baseY + 78, 38, theme.accent, theme.secondary, 0.105, 7);
  }
  drawWaveLattice(ctx, theme, width, height, themeVariant(theme, 8));
}

function drawOliveBranches(ctx, theme, width, height) {
  for (const [cx, cy, scale] of [[width / 2, 260, 1], [width / 2, height - 300, 0.9]]) {
    for (const side of [-1, 1]) {
      strokePath(ctx, [[cx + side * 18 * scale, cy + 86 * scale], [cx + side * 76 * scale, cy + 16 * scale, cx + side * 122 * scale, cy - 52 * scale, cx + side * 188 * scale, cy - 92 * scale]], theme.secondary, 2, 0.08);
      for (let i = 0; i < 8; i++) {
        const x = cx + side * (42 + i * 19) * scale;
        const y = cy + (55 - i * 20) * scale;
        drawEllipse(ctx, x, y, 6 * scale, 17 * scale, side * (i % 2 ? -0.65 : 0.55), theme.accent, 0.08);
        if (i % 3 === 1) dot(ctx, x + side * 9 * scale, y + 7 * scale, 3 * scale, theme.secondary, 0.1);
      }
    }
  }
}

function drawLaurelTorch(ctx, theme, width, height) {
  for (const [cx, cy, scale] of [[width / 2, 260, 1], [width / 2, height - 310, 0.86]]) {
    strokePath(ctx, [[cx, cy + 95 * scale], [cx, cy - 34 * scale]], theme.secondary, 4 * scale, 0.08);
    drawEllipse(ctx, cx - 8 * scale, cy - 70 * scale, 14 * scale, 38 * scale, -0.22, theme.accent, 0.13);
    drawEllipse(ctx, cx + 10 * scale, cy - 68 * scale, 10 * scale, 28 * scale, 0.38, theme.secondary, 0.1);
    for (const side of [-1, 1]) {
      for (let i = 0; i < 11; i++) {
        const angle = side * (1.1 + i * 0.11);
        const r = (78 + i * 10) * scale;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r * 0.9;
        drawEllipse(ctx, x, y, 6 * scale, 16 * scale, angle, i % 2 ? theme.secondary : theme.accent, 0.08);
      }
    }
  }
}

function drawSportsMedals(ctx, theme, width, height) {
  for (const [cx, cy, scale] of [[width / 2, 285, 1], [width / 2, height - 330, 0.9]]) {
    for (let ring = 0; ring < 4; ring++) {
      ctx.save();
      ctx.strokeStyle = hexToRgba(ring % 2 ? theme.secondary : theme.accent, 0.055 + ring * 0.012);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, (190 + ring * 45) * scale, (60 + ring * 13) * scale, -0.08, Math.PI * 0.05, Math.PI * 1.1);
      ctx.stroke();
      ctx.restore();
    }
    for (let i = 0; i < 5; i++) {
      const x = cx - 150 * scale + i * 75 * scale;
      strokePath(ctx, [[x - 18 * scale, cy - 95 * scale], [x, cy - 52 * scale], [x + 18 * scale, cy - 95 * scale]], theme.secondary, 2, 0.08);
      drawEllipse(ctx, x, cy - 30 * scale, 24 * scale, 24 * scale, 0, i % 2 ? theme.secondary : theme.accent, 0.105);
      drawStar(ctx, x, cy - 30 * scale, 8 * scale, 3 * scale, "#ffffff", 0.08);
    }
  }
}

function drawBookPress(ctx, theme, width, height) {
  for (const [cx, cy, scale] of [[width / 2, 275, 1], [width / 2, height - 330, 0.9]]) {
    ctx.save();
    ctx.strokeStyle = hexToRgba(theme.accent, 0.09);
    ctx.lineWidth = 2;
    roundRect(ctx, cx - 210 * scale, cy - 78 * scale, 190 * scale, 142 * scale, 8 * scale);
    roundRect(ctx, cx + 20 * scale, cy - 78 * scale, 190 * scale, 142 * scale, 8 * scale);
    ctx.stroke();
    ctx.restore();
    strokePath(ctx, [[cx, cy - 82 * scale], [cx, cy + 72 * scale]], theme.secondary, 2, 0.075);
    for (let row = 0; row < 6; row++) {
      strokePath(ctx, [[cx - 178 * scale, cy - 44 * scale + row * 20 * scale], [cx - 58 * scale, cy - 44 * scale + row * 20 * scale]], row % 2 ? theme.secondary : theme.accent, 1.6 * scale, 0.065);
      strokePath(ctx, [[cx + 58 * scale, cy - 44 * scale + row * 20 * scale], [cx + 178 * scale, cy - 44 * scale + row * 20 * scale]], row % 2 ? theme.accent : theme.secondary, 1.6 * scale, 0.065);
    }
    for (let i = 0; i < 12; i++) drawDiamond(ctx, cx - 260 * scale + i * 47 * scale, cy + 118 * scale + (i % 2) * 8 * scale, 6 * scale, i % 2 ? theme.secondary : theme.accent, 0.07);
  }
}

function drawMarketBanners(ctx, theme, width, height) {
  for (const [x, y] of [[86, 360], [width - 386, 360], [116, height - 500], [width - 416, height - 500]]) {
    ctx.save();
    ctx.fillStyle = hexToRgba(theme.secondary, 0.055);
    roundRect(ctx, x, y, 300, 130, 8);
    ctx.fill();
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = hexToRgba(i % 2 ? theme.accent : theme.secondary, 0.1);
      roundRect(ctx, x + i * 50, y - 54, 50, 54, 5);
      ctx.fill();
    }
    strokePath(ctx, [[x + 24, y + 132], [x + 24, y + 210]], theme.secondary, 2, 0.065);
    strokePath(ctx, [[x + 276, y + 132], [x + 276, y + 210]], theme.secondary, 2, 0.065);
    drawBunting(ctx, theme, x + 18, y + 28, 4);
    ctx.restore();
  }
}

function drawAncestralTable(ctx, theme, width, height) {
  for (const [cx, cy, scale] of [[width / 2, 350, 1], [width / 2, height - 405, 0.92]]) {
    drawSoftGlow(ctx, cx, cy, 150 * scale, theme.accent, 0.03);
    strokePath(ctx, [[cx - 240 * scale, cy + 95 * scale], [cx + 240 * scale, cy + 95 * scale]], theme.secondary, 3, 0.08);
    strokePath(ctx, [[cx - 210 * scale, cy + 95 * scale], [cx - 250 * scale, cy + 165 * scale]], theme.secondary, 2, 0.06);
    strokePath(ctx, [[cx + 210 * scale, cy + 95 * scale], [cx + 250 * scale, cy + 165 * scale]], theme.secondary, 2, 0.06);
    for (let i = 0; i < 3; i++) {
      const x = cx - 80 * scale + i * 80 * scale;
      ctx.fillStyle = hexToRgba(theme.secondary, 0.08);
      roundRect(ctx, x - 10 * scale, cy + 22 * scale, 20 * scale, 58 * scale, 4 * scale);
      ctx.fill();
      drawEllipse(ctx, x, cy + 4 * scale, 6 * scale, 16 * scale, 0, theme.accent, 0.12);
    }
    flower(ctx, cx + 165 * scale, cy + 48 * scale, 27 * scale, theme.accent, theme.secondary, 0.095, 7);
    drawEllipse(ctx, cx - 165 * scale, cy + 70 * scale, 42 * scale, 12 * scale, 0, theme.accent, 0.07);
  }
}

function drawDoveGarland(ctx, theme, width, height) {
  for (const [cx, cy, scale] of [[width / 2, 255, 1], [width / 2, height - 300, 0.88]]) {
    for (const side of [-1, 1]) {
      drawEllipse(ctx, cx + side * 36 * scale, cy, 58 * scale, 20 * scale, side * -0.35, "#f3f3f5", 0.07);
      drawEllipse(ctx, cx + side * 82 * scale, cy - 18 * scale, 30 * scale, 11 * scale, side * -0.2, theme.secondary, 0.055);
    }
    strokePath(ctx, [[cx - 210 * scale, cy + 95 * scale], [cx - 90 * scale, cy + 145 * scale, cx + 90 * scale, cy + 145 * scale, cx + 210 * scale, cy + 95 * scale]], theme.accent, 2.4 * scale, 0.075);
    for (let i = 0; i < 13; i++) {
      const t = i / 12;
      const x = cx - 205 * scale + t * 410 * scale;
      const y = cy + (95 + Math.sin(t * Math.PI) * 45) * scale;
      drawEllipse(ctx, x, y, 5 * scale, 13 * scale, t * Math.PI - 1.2, i % 2 ? theme.secondary : theme.accent, 0.08);
    }
    for (let i = 0; i < 11; i++) dot(ctx, cx - 180 * scale + i * 36 * scale, cy - 82 * scale + (i % 3) * 9 * scale, 2.8 * scale, "#ffffff", 0.09);
  }
}

function drawStainedGlass(ctx, theme, width, height) {
  for (const [cx, cy, scale] of [[width / 2, 255, 1], [width / 2, height - 310, 0.86]]) {
    drawSoftGlow(ctx, cx, cy, 160 * scale, theme.accent, 0.03);
    for (let ring = 0; ring < 3; ring++) {
      ctx.save();
      ctx.strokeStyle = hexToRgba(ring % 2 ? theme.secondary : theme.accent, 0.07);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, (48 + ring * 42) * scale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16;
      strokePath(ctx, [[cx, cy], [cx + Math.cos(angle) * 142 * scale, cy + Math.sin(angle) * 142 * scale]], i % 2 ? theme.secondary : theme.accent, 1.5, 0.06);
      drawEllipse(ctx, cx + Math.cos(angle + 0.1) * 86 * scale, cy + Math.sin(angle + 0.1) * 86 * scale, 10 * scale, 25 * scale, angle, i % 3 ? theme.accent : theme.secondary, 0.055);
    }
    drawStar(ctx, cx, cy, 20 * scale, 8 * scale, "#f3f7ff", 0.09);
  }
}

function drawMusicWaves(ctx, theme, width, height) {
  for (const [baseY, flip] of [[180, 1], [height - 220, -1]]) {
    for (let line = 0; line < 5; line++) {
      const y = baseY + flip * line * 20;
      strokePath(ctx, [[65, y], [280, y + flip * 16, 485, y - flip * 10, 690, y + flip * 8], [885, y + flip * 20, 1060, y - flip * 12, width - 65, y]], line % 2 ? theme.secondary : theme.accent, 1.6, 0.055);
    }
    const notes = [
      [130, baseY + flip * 34, 0.82],
      [300, baseY - flip * 4, 1],
      [505, baseY + flip * 58, 0.72],
      [760, baseY + flip * 18, 0.9],
      [985, baseY + flip * 66, 0.76],
      [1140, baseY + flip * 8, 0.92]
    ];
    notes.forEach(([x, y, scale], index) => drawMusicNote(ctx, x, y, scale, index % 2 ? theme.secondary : theme.accent, flip));
  }

  for (const side of [-1, 1]) {
    const startX = side < 0 ? 70 : width - 70;
    for (let wave = 0; wave < 6; wave++) {
      const x = startX + side * wave * 18;
      strokePath(ctx, [[x, 580], [x + side * (32 + wave * 3), 780, x - side * (24 + wave * 2), 980, x, 1180], [x + side * (26 + wave * 2), 1390, x - side * (30 + wave * 2), 1600, x, 1810], [x + side * (22 + wave * 2), 1990, x, 2170]], wave % 2 ? theme.secondary : theme.accent, 1.5, 0.04 + wave * 0.008);
    }
  }
}

function drawCosmicObservatory(ctx, theme, width, height) {
  for (const [cx, cy, scale] of [[width / 2, 245, 1], [width / 2, height - 285, 0.88]]) {
    drawSoftGlow(ctx, cx, cy, 190 * scale, theme.accent, 0.025);
    for (let orbit = 0; orbit < 4; orbit++) {
      ctx.save();
      ctx.strokeStyle = hexToRgba(orbit % 2 ? theme.secondary : theme.accent, 0.05 + orbit * 0.012);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(cx, cy, (75 + orbit * 48) * scale, (28 + orbit * 17) * scale, -0.28 + orbit * 0.19, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      const angle = orbit * 1.7 + 0.5;
      dot(ctx, cx + Math.cos(angle) * (75 + orbit * 48) * scale, cy + Math.sin(angle) * (28 + orbit * 17) * scale, (5 + orbit) * scale, orbit % 2 ? theme.secondary : theme.accent, 0.12);
    }
    drawEllipse(ctx, cx, cy, 24 * scale, 24 * scale, 0, theme.accent, 0.12);
  }

  drawTelescope(ctx, 125, 590, 1, theme, 1);
  drawTelescope(ctx, width - 125, height - 590, 0.9, theme, -1);
  for (let i = 0; i < 16; i++) {
    const x = 70 + ((i * 173) % (width - 140));
    const y = 430 + ((i * 257) % (height - 860));
    drawStar(ctx, x, y, 5 + (i % 4) * 2, 2, i % 2 ? theme.secondary : theme.accent, 0.045 + (i % 3) * 0.012);
  }
}

function drawGardenGate(ctx, theme, width, height) {
  for (const [cx, cy, flip, scale] of [[width / 2, 360, 1, 1], [width / 2, height - 390, -1, 0.9]]) {
    ctx.save();
    ctx.strokeStyle = hexToRgba(theme.secondary, 0.065);
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(cx - 245 * scale, cy + flip * 140 * scale);
    ctx.lineTo(cx - 245 * scale, cy - flip * 10 * scale);
    ctx.bezierCurveTo(cx - 245 * scale, cy - flip * 170 * scale, cx + 245 * scale, cy - flip * 170 * scale, cx + 245 * scale, cy - flip * 10 * scale);
    ctx.lineTo(cx + 245 * scale, cy + flip * 140 * scale);
    ctx.stroke();
    ctx.restore();

    for (const side of [-1, 1]) {
      const baseX = cx + side * 235 * scale;
      strokePath(ctx, [[baseX, cy + flip * 130 * scale], [baseX - side * 30 * scale, cy + flip * 40 * scale, baseX + side * 18 * scale, cy - flip * 45 * scale, cx + side * 120 * scale, cy - flip * 118 * scale]], theme.accent, 2, 0.08);
      for (let leaf = 0; leaf < 8; leaf++) {
        const t = leaf / 7;
        const x = baseX - side * (18 + t * 92) * scale;
        const y = cy + flip * (102 - t * 205) * scale;
        drawEllipse(ctx, x + side * (leaf % 2 ? 13 : -13) * scale, y, 6 * scale, 17 * scale, side * (leaf % 2 ? -0.7 : 0.7), leaf % 2 ? theme.secondary : theme.accent, 0.075);
      }
      flower(ctx, cx + side * 145 * scale, cy - flip * 105 * scale, 25 * scale, theme.accent, theme.secondary, 0.085, 7);
    }
  }

  for (const x of [76, width - 76]) {
    for (let i = 0; i < 12; i++) {
      const y = 540 + i * 145;
      drawEllipse(ctx, x + (i % 2 ? 16 : -16), y, 7, 20, i % 2 ? -0.6 : 0.6, i % 2 ? theme.secondary : theme.accent, 0.055);
    }
  }
}

function drawOceanCompass(ctx, theme, width, height) {
  drawCompassRose(ctx, width / 2, 255, 132, theme, 1);
  drawCompassRose(ctx, width / 2, height - 305, 112, theme, 0.88);

  for (const [baseY, flip] of [[445, 1], [height - 470, -1]]) {
    for (let line = 0; line < 6; line++) {
      const y = baseY + flip * line * 22;
      strokePath(ctx, [[60, y], [235, y - flip * 38, 410, y + flip * 30, 600, y - flip * 8], [795, y - flip * 44, 980, y + flip * 34, width - 60, y - flip * 4]], line % 2 ? theme.secondary : theme.accent, 1.6, 0.045 + line * 0.007);
    }
  }

  for (const side of [-1, 1]) {
    const x = side < 0 ? 82 : width - 82;
    strokePath(ctx, [[x, 670], [x + side * 42, 905, x - side * 28, 1130, x + side * 32, 1360], [x - side * 20, 1590, x + side * 36, 1820, x, 2070]], theme.accent, 2, 0.065);
    for (let mark = 0; mark < 9; mark++) {
      const y = 720 + mark * 165;
      strokePath(ctx, [[x - side * 10, y], [x + side * (24 + (mark % 3) * 8), y - 12]], mark % 2 ? theme.secondary : theme.accent, 1.5, 0.06);
    }
  }
}

function drawMusicNote(ctx, x, y, scale, color, direction = 1) {
  drawEllipse(ctx, x, y, 12 * scale, 8 * scale, -0.32, color, 0.13);
  strokePath(ctx, [[x + 9 * scale, y - 2 * scale], [x + 9 * scale, y - direction * 58 * scale]], color, Math.max(1.5, 2.2 * scale), 0.12);
  if (scale > 0.85) {
    strokePath(ctx, [[x + 9 * scale, y - direction * 58 * scale], [x + 36 * scale, y - direction * 45 * scale]], color, Math.max(1.5, 2 * scale), 0.1);
  }
}

function drawTelescope(ctx, x, y, scale, theme, side) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(side * -0.55);
  ctx.fillStyle = hexToRgba(theme.accent, 0.08);
  roundRect(ctx, -48 * scale, -22 * scale, 118 * scale, 44 * scale, 10 * scale);
  ctx.fill();
  ctx.fillStyle = hexToRgba(theme.secondary, 0.1);
  roundRect(ctx, 55 * scale, -30 * scale, 28 * scale, 60 * scale, 6 * scale);
  ctx.fill();
  ctx.restore();
  strokePath(ctx, [[x, y + 22 * scale], [x - 42 * scale, y + 122 * scale]], theme.secondary, 2, 0.07);
  strokePath(ctx, [[x, y + 22 * scale], [x + 48 * scale, y + 122 * scale]], theme.secondary, 2, 0.07);
  dot(ctx, x, y + 18 * scale, 8 * scale, theme.accent, 0.1);
}

function drawCompassRose(ctx, cx, cy, radius, theme, scale) {
  ctx.save();
  ctx.strokeStyle = hexToRgba(theme.secondary, 0.065);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.58 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  for (let i = 0; i < 16; i++) {
    const angle = (Math.PI * 2 * i) / 16 - Math.PI / 2;
    const outer = radius * (i % 4 === 0 ? 1 : i % 2 === 0 ? 0.78 : 0.66) * scale;
    const inner = radius * 0.18 * scale;
    const spread = i % 4 === 0 ? 0.1 : 0.055;
    ctx.fillStyle = hexToRgba(i % 2 ? theme.secondary : theme.accent, i % 4 === 0 ? 0.11 : 0.065);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
    ctx.lineTo(cx + Math.cos(angle + spread) * inner, cy + Math.sin(angle + spread) * inner);
    ctx.lineTo(cx + Math.cos(angle - spread) * inner, cy + Math.sin(angle - spread) * inner);
    ctx.closePath();
    ctx.fill();
  }
  dot(ctx, cx, cy, 8 * scale, theme.secondary, 0.12);
}

function drawKite(ctx, cx, cy, size, rotation, color, secondary) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.fillStyle = hexToRgba(color, 0.15);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.64, 0);
  ctx.lineTo(0, size * 0.92);
  ctx.lineTo(-size * 0.64, 0);
  ctx.closePath();
  ctx.fill();
  strokePath(ctx, [[0, -size], [0, size * 0.92]], secondary, 1.5, 0.11);
  strokePath(ctx, [[-size * 0.64, 0], [size * 0.64, 0]], secondary, 1.5, 0.11);
  ctx.restore();
}

function drawBunting(ctx, theme, startX, y, count, alternate = false) {
  for (let i = 0; i < count; i++) {
    const x = startX + i * 70;
    ctx.fillStyle = hexToRgba((i + (alternate ? 1 : 0)) % 2 ? theme.secondary : theme.accent, 0.2);
    roundRect(ctx, x, y, 44, 58, 4);
    ctx.fill();
    strokePath(ctx, [[x + 8, y + 30], [x + 22, y + 51, x + 36, y + 30, x + 36, y + 30]], "#ffffff", 2, 0.18);
  }
}

function flower(ctx, cx, cy, size, petalColor, centerColor, alpha, petals = 12) {
  for (let p = 0; p < petals; p++) {
    const angle = (Math.PI * 2 * p) / petals;
    const px = cx + Math.cos(angle) * size * 0.48;
    const py = cy + Math.sin(angle) * size * 0.48;
    drawEllipse(ctx, px, py, size * 0.18, size * 0.36, angle, petalColor, alpha);
  }
  dot(ctx, cx, cy, size * 0.18, centerColor, alpha + 0.01);
}

function clover(ctx, cx, cy, r, color, alpha) {
  dot(ctx, cx, cy - r * 0.65, r, color, alpha);
  dot(ctx, cx - r * 0.65, cy, r, color, alpha);
  dot(ctx, cx + r * 0.65, cy, r, color, alpha);
  strokePath(ctx, [[cx, cy + r * 0.4], [cx - r * 0.15, cy + r * 1.3, cx - r * 0.7, cy + r * 2.1, cx - r * 1.15, cy + r * 2.8]], color, Math.max(2, r * 0.12), alpha);
}

function flag(ctx, x, y, color) {
  ctx.fillStyle = hexToRgba(color, 0.2);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 24, y + 7);
  ctx.lineTo(x, y + 24);
  ctx.closePath();
  ctx.fill();
}

function tag(ctx, x, y, color) {
  ctx.fillStyle = hexToRgba(color, 0.2);
  roundRect(ctx, x - 12, y - 34, 24, 68, 3);
  ctx.fill();
  strokePath(ctx, [[x, y - 52], [x, y - 34]], "#ffffff", 1.5, 0.18);
}

function mountainBase(ctx, theme) {
  ctx.save();
  ctx.fillStyle = hexToRgba(theme.accent, 0.1);
  ctx.beginPath();
  ctx.moveTo(0, 2580);
  ctx.lineTo(160, 2350);
  ctx.lineTo(270, 2492);
  ctx.lineTo(435, 2260);
  ctx.lineTo(620, 2580);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = hexToRgba(theme.secondary, 0.1);
  ctx.beginPath();
  ctx.moveTo(530, 2580);
  ctx.lineTo(700, 2335);
  ctx.lineTo(815, 2488);
  ctx.lineTo(1000, 2280);
  ctx.lineTo(1260, 2580);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
