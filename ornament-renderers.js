// Semantic ornaments, cultural illustration overlays, and signature glyphs.

function drawSemanticOrnaments(ctx, theme, width, height) {
  const variant = themeVariant(theme, 9);
  drawMicroTexture(ctx, theme, width, height, variant);
  drawCornerAccents(ctx, theme, width, height, variant);

  if (hasTag(theme, "water")) drawWaveLattice(ctx, theme, width, height, variant);
  if (hasTag(theme, "botanical")) drawBotanicalVines(ctx, theme, width, height, variant);
  if (hasTag(theme, "celebration")) drawRibbonConfetti(ctx, theme, width, height, variant);
  if (hasTag(theme, "civic")) drawCivicRosettes(ctx, theme, width, height, variant);
  if (hasTag(theme, "sky")) drawConstellationVeil(ctx, theme, width, height, variant);
  if (hasTag(theme, "mountain")) drawContourLines(ctx, theme, width, height, variant);
  if (hasTag(theme, "winter")) drawFrostCrystals(ctx, theme, width, height, variant);
  if (hasTag(theme, "memorial")) drawQuietLightMarks(ctx, theme, width, height, variant);
  if (hasTag(theme, "island")) drawIslandFronds(ctx, theme, width, height, variant);
  if (hasTag(theme, "sun")) drawSolarHalos(ctx, theme, width, height, variant);
  if (hasTag(theme, "light")) drawSmallLanternGlow(ctx, theme, width, height, variant);
  if (hasTag(theme, "procession")) drawFestivalDrums(ctx, theme, width, height, variant);
  if (hasTag(theme, "islamic")) drawPrayerArchways(ctx, theme, width, height, variant);
  if (hasTag(theme, "folk")) drawWovenBorders(ctx, theme, width, height, variant);
  if (hasTag(theme, "maritime")) drawHarborSignals(ctx, theme, width, height, variant);
  if (hasTag(theme, "market")) drawMarketStalls(ctx, theme, width, height, variant);
  if (hasTag(theme, "heritage")) drawOliveSprigs(ctx, theme, width, height, variant);
  if (hasTag(theme, "remembrance")) drawCommemorativeTorches(ctx, theme, width, height, variant);
  if (hasTag(theme, "literature")) drawBookPressMarks(ctx, theme, width, height, variant);
  if (hasTag(theme, "religious")) drawAncestralOfferings(ctx, theme, width, height, variant);
  if (hasTag(theme, "celebration") && /carnival|mask|mardi|狂欢|面具/i.test(`${theme.title} ${theme.caption}`)) drawMaskConfetti(ctx, theme, width, height, variant);
  drawSignatureOrnaments(ctx, theme, width, height, variant);
}

function drawMicroTexture(ctx, theme, width, height, variant) {
  for (let i = 0; i < 70; i++) {
    const x = 42 + ((i * 97 + variant * 53) % (width - 84));
    const y = 110 + ((i * 149 + variant * 71) % (height - 240));
    const color = i % 2 ? theme.accent : theme.secondary;
    dot(ctx, x, y, 1.4 + (i % 3) * 0.5, color, 0.025 + (i % 5) * 0.006);
  }
}

function drawCornerAccents(ctx, theme, width, height, variant) {
  const corners = [
    [86, 650],
    [width - 86, 650],
    [110, height - 620],
    [width - 110, height - 620]
  ];
  for (let i = 0; i < corners.length; i++) {
    const [x, y] = corners[i];
    const flip = x > width / 2 ? -1 : 1;
    for (let ring = 0; ring < 3; ring++) {
      strokePath(
        ctx,
        [[x + flip * ring * 11, y + ring * 18], [x + flip * (34 + ring * 13), y - 46 - ring * 22]],
        ring % 2 ? theme.secondary : theme.accent,
        2,
        0.09 + ring * 0.025
      );
    }
    if ((variant + i) % 2 === 0) drawDiamond(ctx, x + flip * 28, y + 72, 12 + (variant % 3) * 3, theme.secondary, 0.11);
    else drawTinyGlyphFlower(ctx, theme, x + flip * 24, y + 70, 18 + (variant % 2) * 4, 0.11);
  }
}

function drawWaveLattice(ctx, theme, width, height, variant) {
  for (const baseY of [150 + variant * 6, height - 180 - variant * 5]) {
    for (let row = 0; row < 4; row++) {
      const y = baseY + row * 30;
      strokePath(ctx, [[44, y], [240, y - 52, 390, y + 54, 575, y - 4], [770, y - 62, 946, y + 50, width - 44, y - 6]], row % 2 ? theme.secondary : theme.accent, 2, 0.08 + row * 0.012);
    }
  }
  for (let i = 0; i < 15; i++) {
    drawEllipse(ctx, 86 + ((i * 83 + variant * 41) % (width - 172)), 520 + ((i * 157) % 1540), 5 + (i % 3) * 2, 11 + (i % 4) * 2, i * 0.6, i % 2 ? theme.secondary : theme.accent, 0.07);
  }
}

function drawBotanicalVines(ctx, theme, width, height, variant) {
  for (const side of [-1, 1]) {
    const startX = side < 0 ? 58 : width - 58;
    for (let vine = 0; vine < 3; vine++) {
      const y = 815 + vine * 455 + variant * 9;
      strokePath(ctx, [[startX, y], [startX + side * 82, y - 70, startX + side * 150, y + 62, startX + side * 226, y - 12]], theme.accent, 2, 0.11 + vine * 0.016);
      for (let leaf = 0; leaf < 5; leaf++) {
        const lx = startX + side * (54 + leaf * 38);
        const ly = y - 38 + ((leaf + vine + variant) % 3) * 28;
        drawEllipse(ctx, lx, ly, 7, 18, side * (leaf % 2 ? 0.7 : -0.5), leaf % 2 ? theme.secondary : theme.accent, 0.1);
      }
    }
  }
}

function drawRibbonConfetti(ctx, theme, width, height, variant) {
  for (let i = 0; i < 34; i++) {
    const x = 58 + ((i * 137 + variant * 83) % (width - 116));
    const y = i % 2 ? 125 + ((i * 47) % 360) : height - 380 + ((i * 53) % 280);
    if (i % 3 === 0) {
      strokePath(ctx, [[x - 12, y], [x + 12, y - 10, x + 22, y + 11, x + 38, y]], i % 2 ? theme.secondary : theme.accent, 2, 0.11);
    } else if (i % 3 === 1) {
      drawDiamond(ctx, x, y, 7 + (i % 4), i % 2 ? theme.accent : theme.secondary, 0.12);
    } else {
      flag(ctx, x, y, i % 2 ? theme.secondary : theme.accent);
    }
  }
}

function drawCivicRosettes(ctx, theme, width, height, variant) {
  const points = [
    [150, 520],
    [width - 150, 520],
    [180, height - 485],
    [width - 180, height - 485]
  ];
  for (let p = 0; p < points.length; p++) {
    const [cx, cy] = points[p];
    const spokes = 14 + ((variant + p) % 5);
    for (let i = 0; i < spokes; i++) {
      const angle = (Math.PI * 2 * i) / spokes;
      const r1 = 16;
      const r2 = 52 + (i % 3) * 7;
      strokePath(ctx, [[cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1], [cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2]], i % 2 ? theme.secondary : theme.accent, 2, 0.075);
    }
    dot(ctx, cx, cy, 10, p % 2 ? theme.secondary : theme.accent, 0.1);
  }
}

function drawConstellationVeil(ctx, theme, width, height, variant) {
  const stars = [];
  for (let i = 0; i < 24; i++) {
    stars.push([
      70 + ((i * 151 + variant * 67) % (width - 140)),
      105 + ((i * 79 + variant * 29) % 360)
    ]);
  }
  for (let i = 0; i < stars.length; i++) {
    const [x, y] = stars[i];
    if (i % 5 === 0) drawStar(ctx, x, y, 7, 3, theme.secondary, 0.12);
    else dot(ctx, x, y, 2.5 + (i % 3), theme.accent, 0.1);
    if (i > 0 && i % 4 !== 0) {
      const [px, py] = stars[i - 1];
      if (Math.abs(x - px) < 260) strokePath(ctx, [[px, py], [x, y]], theme.secondary, 1, 0.045);
    }
  }
}

function drawContourLines(ctx, theme, width, height, variant) {
  for (let row = 0; row < 5; row++) {
    const y = height - 300 + row * 28;
    strokePath(ctx, [[70, y], [240, y - 44 - row * 8, 420, y + 36, 590, y - 10], [790, y - 58, 970, y + 40, width - 70, y - 18]], row % 2 ? theme.secondary : theme.accent, 2, 0.05 + row * 0.011);
  }
  for (let i = 0; i < 7; i++) {
    const x = 130 + ((i * 149 + variant * 47) % (width - 260));
    flag(ctx, x, height - 410 + (i % 3) * 22, i % 2 ? theme.accent : theme.secondary);
  }
}

function drawFrostCrystals(ctx, theme, width, height, variant) {
  for (let i = 0; i < 18; i++) {
    const cx = 80 + ((i * 173 + variant * 59) % (width - 160));
    const cy = i % 2 ? 135 + ((i * 71) % 420) : height - 515 + ((i * 61) % 350);
    const size = 10 + (i % 4) * 3;
    for (let arm = 0; arm < 6; arm++) {
      const angle = (Math.PI * 2 * arm) / 6;
      strokePath(ctx, [[cx, cy], [cx + Math.cos(angle) * size, cy + Math.sin(angle) * size]], "#f3f7ff", 1.4, 0.08);
    }
  }
}

function drawQuietLightMarks(ctx, theme, width, height, variant) {
  for (const side of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      const x = side < 0 ? 78 + i * 72 : width - 78 - i * 72;
      const y = height - 570 + ((i + variant) % 3) * 45;
      ctx.fillStyle = hexToRgba(theme.secondary, 0.08);
      roundRect(ctx, x - 8, y - 18, 16, 42, 4);
      ctx.fill();
      drawEllipse(ctx, x, y - 29, 5, 12, 0, theme.accent, 0.13);
    }
  }
}

function drawIslandFronds(ctx, theme, width, height, variant) {
  for (const [baseX, baseY, side] of [[92, height - 260, 1], [width - 92, height - 260, -1], [76, 430, 1], [width - 76, 430, -1]]) {
    for (let i = 0; i < 5; i++) {
      const angle = side * (-0.8 + i * 0.22);
      const endX = baseX + Math.cos(angle) * (76 + i * 10) * side;
      const endY = baseY - Math.sin(angle) * (40 + i * 6) - variant * 2;
      strokePath(ctx, [[baseX, baseY], [endX, endY]], i % 2 ? theme.secondary : theme.accent, 2, 0.075);
      for (let leaf = 0; leaf < 3; leaf++) {
        drawEllipse(ctx, baseX + side * (24 + leaf * 18 + i * 4), baseY - 8 - leaf * 12 - i * 3, 5, 15, angle, theme.accent, 0.07);
      }
    }
  }
}

function drawSolarHalos(ctx, theme, width, height, variant) {
  for (const [cx, cy] of [[width / 2, 285], [width / 2, height - 230]]) {
    for (let ring = 0; ring < 3; ring++) {
      ctx.save();
      ctx.strokeStyle = hexToRgba(ring % 2 ? theme.secondary : theme.accent, 0.055 + ring * 0.018);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 74 + ring * 42 + variant * 2, Math.PI * 0.08, Math.PI * 0.92);
      ctx.stroke();
      ctx.restore();
    }
  }
}

function drawSmallLanternGlow(ctx, theme, width, height, variant) {
  for (let i = 0; i < 8; i++) {
    const x = 165 + ((i * 181 + variant * 37) % (width - 330));
    const y = i % 2 ? 520 + ((i * 151) % 620) : height - 690 + ((i * 127) % 430);
    drawSoftGlow(ctx, x, y, 42 + (i % 3) * 12, i % 2 ? theme.secondary : theme.accent, 0.035);
    drawEllipse(ctx, x, y, 5, 14, 0, i % 2 ? theme.secondary : theme.accent, 0.08);
  }
}

function drawFestivalDrums(ctx, theme, width, height, variant) {
  for (const [cx, cy, side] of [[118, 520, 1], [width - 118, 520, -1], [148, height - 560, 1], [width - 148, height - 560, -1]]) {
    drawEllipse(ctx, cx, cy, 28, 38, side * 0.12, theme.accent, 0.08);
    drawEllipse(ctx, cx, cy, 20, 30, side * 0.12, theme.secondary, 0.07);
    strokePath(ctx, [[cx - side * 38, cy - 54], [cx + side * 18, cy - 12]], theme.secondary, 2, 0.075);
    strokePath(ctx, [[cx - side * 48, cy + 52], [cx + side * 22, cy + 8]], theme.accent, 2, 0.075);
    for (let i = 0; i < 3; i++) {
      dot(ctx, cx + side * (42 + i * 18), cy - 44 + i * 12 + variant, 3.5, i % 2 ? theme.secondary : theme.accent, 0.09);
    }
  }
}

function drawPrayerArchways(ctx, theme, width, height, variant) {
  for (const [cx, cy] of [[width / 2, 345], [width / 2, height - 430]]) {
    for (let i = 0; i < 5; i++) {
      const x = cx - 240 + i * 120;
      ctx.save();
      ctx.strokeStyle = hexToRgba(i % 2 ? theme.secondary : theme.accent, 0.055 + (i % 2) * 0.018);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 36, cy + 58);
      ctx.lineTo(x - 36, cy - 6);
      ctx.quadraticCurveTo(x, cy - 78 - variant * 2, x + 36, cy - 6);
      ctx.lineTo(x + 36, cy + 58);
      ctx.stroke();
      ctx.restore();
      drawStar(ctx, x, cy - 18, 7, 3, theme.secondary, 0.08);
    }
  }
}

function drawWovenBorders(ctx, theme, width, height, variant) {
  for (const y of [118 + variant * 2, height - 126 - variant * 2]) {
    for (let i = 0; i < 22; i++) {
      const x = 72 + i * ((width - 144) / 21);
      drawDiamond(ctx, x, y, 8 + (i % 3), i % 2 ? theme.secondary : theme.accent, 0.085);
      strokePath(ctx, [[x - 22, y - 15], [x + 22, y + 15]], theme.accent, 1.5, 0.045);
      strokePath(ctx, [[x - 22, y + 15], [x + 22, y - 15]], theme.secondary, 1.5, 0.045);
    }
  }
}

function drawHarborSignals(ctx, theme, width, height, variant) {
  for (const [baseX, baseY, side] of [[86, 455, 1], [width - 86, 455, -1], [106, height - 455, 1], [width - 106, height - 455, -1]]) {
    strokePath(ctx, [[baseX, baseY + 88], [baseX, baseY - 70]], theme.secondary, 2.2, 0.075);
    drawSoftGlow(ctx, baseX, baseY - 92, 44, theme.accent, 0.03);
    for (let i = 0; i < 4; i++) {
      flag(ctx, baseX + side * (10 + i * 24), baseY - 58 + i * 26, i % 2 ? theme.secondary : theme.accent);
    }
    for (let row = 0; row < 2; row++) {
      strokePath(ctx, [[baseX + side * 14, baseY + 44 + row * 24], [baseX + side * 130, baseY + 20 + row * 16]], theme.accent, 1.6, 0.055);
    }
  }
}

function drawMarketStalls(ctx, theme, width, height, variant) {
  for (const [x, y] of [[78, 520], [width - 258, 520], [108, height - 565], [width - 288, height - 565]]) {
    ctx.save();
    ctx.fillStyle = hexToRgba(theme.accent, 0.045);
    roundRect(ctx, x, y, 180, 92, 6);
    ctx.fill();
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = hexToRgba(i % 2 ? theme.secondary : theme.accent, 0.09);
      roundRect(ctx, x + i * 36, y - 38, 36, 38, 4);
      ctx.fill();
    }
    strokePath(ctx, [[x + 16, y + 92], [x + 16, y + 144]], theme.secondary, 2, 0.065);
    strokePath(ctx, [[x + 164, y + 92], [x + 164, y + 144]], theme.secondary, 2, 0.065);
    dot(ctx, x + 52 + variant, y + 46, 6, theme.secondary, 0.07);
    dot(ctx, x + 96, y + 54, 5, theme.accent, 0.08);
    ctx.restore();
  }
}

function drawOliveSprigs(ctx, theme, width, height, variant) {
  for (const [baseX, baseY, side] of [[120, 420, 1], [width - 120, 420, -1], [150, height - 430, 1], [width - 150, height - 430, -1]]) {
    strokePath(ctx, [[baseX, baseY + 70], [baseX + side * 42, baseY + 10, baseX + side * 96, baseY - 30, baseX + side * 154, baseY - 82]], theme.secondary, 2, 0.07);
    for (let i = 0; i < 7; i++) {
      const x = baseX + side * (28 + i * 18);
      const y = baseY + 30 - i * 18 + ((i + variant) % 2) * 8;
      drawEllipse(ctx, x, y, 5, 14, side * (i % 2 ? -0.72 : 0.58), theme.accent, 0.075);
      if (i % 3 === 0) dot(ctx, x + side * 10, y + 6, 3, theme.secondary, 0.09);
    }
  }
}

function drawCommemorativeTorches(ctx, theme, width, height, variant) {
  for (const [cx, cy] of [[132, 470], [width - 132, 470], [168, height - 500], [width - 168, height - 500]]) {
    strokePath(ctx, [[cx, cy + 76], [cx, cy - 10]], theme.secondary, 3, 0.075);
    drawEllipse(ctx, cx, cy - 32, 10, 28, 0.1, theme.accent, 0.12);
    drawEllipse(ctx, cx + 9, cy - 34, 7, 20, -0.4, theme.secondary, 0.09);
    for (let i = 0; i < 4; i++) {
      strokePath(ctx, [[cx - 32 + i * 20, cy + 78], [cx - 18 + i * 14, cy + 106 + variant]], i % 2 ? theme.accent : theme.secondary, 1.5, 0.055);
    }
  }
}

function drawBookPressMarks(ctx, theme, width, height, variant) {
  for (const [x, y] of [[86, 370], [width - 246, 370], [116, height - 475], [width - 276, height - 475]]) {
    ctx.save();
    ctx.strokeStyle = hexToRgba(theme.accent, 0.075);
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, 160, 118, 6);
    ctx.stroke();
    for (let row = 0; row < 5; row++) {
      strokePath(ctx, [[x + 24, y + 26 + row * 16], [x + 132 - (row % 2) * 24, y + 26 + row * 16]], row % 2 ? theme.secondary : theme.accent, 1.5, 0.065);
    }
    for (let i = 0; i < 4; i++) {
      drawDiamond(ctx, x + 34 + i * 28, y + 94 + ((i + variant) % 2) * 6, 5, i % 2 ? theme.secondary : theme.accent, 0.07);
    }
    ctx.restore();
  }
}

function drawAncestralOfferings(ctx, theme, width, height, variant) {
  for (const [cx, cy] of [[width / 2, 405], [width / 2, height - 455]]) {
    strokePath(ctx, [[cx - 150, cy + 72], [cx + 150, cy + 72]], theme.secondary, 2.4, 0.075);
    drawEllipse(ctx, cx, cy + 52, 54, 14, 0, theme.accent, 0.055);
    for (let i = 0; i < 3; i++) {
      const x = cx - 72 + i * 72;
      ctx.fillStyle = hexToRgba(theme.secondary, 0.07);
      roundRect(ctx, x - 8, cy - 8, 16, 54, 4);
      ctx.fill();
      drawEllipse(ctx, x, cy - 22, 5, 13, 0, theme.accent, 0.11);
    }
    flower(ctx, cx + 122, cy + 34 + variant, 18, theme.accent, theme.secondary, 0.075, 6);
  }
}

function drawMaskConfetti(ctx, theme, width, height, variant) {
  for (let i = 0; i < 24; i++) {
    const x = 80 + ((i * 127 + variant * 41) % (width - 160));
    const y = i % 2 ? 180 + ((i * 53) % 320) : height - 560 + ((i * 47) % 320);
    if (i % 4 === 0) drawEllipse(ctx, x, y, 12, 7, i * 0.28, theme.accent, 0.09);
    else if (i % 4 === 1) drawDiamond(ctx, x, y, 7, theme.secondary, 0.1);
    else strokePath(ctx, [[x - 12, y], [x + 8, y - 12, x + 18, y + 10, x + 34, y - 2]], i % 2 ? theme.secondary : theme.accent, 1.6, 0.075);
  }
}

function drawCulturalIllustration(ctx, theme, width, height) {
  const code = theme.source?.countryCode;
  const text = `${theme.title} ${theme.caption}`.toLowerCase();

  if (code === "CN") {
    drawChinaRedGoldEmblem(ctx, theme, width, height);
    return;
  }
  if (code === "JP") {
    drawRisingSunSeal(ctx, theme, width, height);
    return;
  }
  if (/christmas/i.test(text)) {
    drawEvergreenIllustration(ctx, theme, width, height);
    return;
  }
  if (/halloween/i.test(text)) {
    drawNightFestivalIllustration(ctx, theme, width, height);
    return;
  }
  if (hasTag(theme, "civic")) {
    drawFlagColorSweep(ctx, theme, width, height);
    return;
  }
  if (hasTag(theme, "water") || hasTag(theme, "island")) {
    drawCoastalSeal(ctx, theme, width, height);
  }
}

function drawChinaRedGoldEmblem(ctx, theme, width, height) {
  for (const [cx, cy, scale] of [[width / 2, 210, 1], [width / 2, height - 220, 0.92]]) {
    drawSoftGlow(ctx, cx, cy, 150 * scale, theme.accent, 0.055);
    for (let ring = 0; ring < 4; ring++) {
      ctx.save();
      ctx.strokeStyle = hexToRgba(theme.accent, 0.075 - ring * 0.008);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, (48 + ring * 30) * scale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    drawStar(ctx, cx, cy, 22 * scale, 9 * scale, theme.accent, 0.22);
    for (let i = 0; i < 4; i++) {
      const angle = -0.9 + i * 0.28;
      drawStar(ctx, cx + Math.cos(angle) * 62 * scale, cy + Math.sin(angle) * 50 * scale, 9 * scale, 4 * scale, theme.accent, 0.16);
    }
  }
  for (const y of [138, height - 130]) {
    strokePath(ctx, [[70, y], [260, y - 38, 420, y + 34, 610, y - 10], [805, y - 50, 980, y + 30, width - 70, y - 6]], theme.secondary, 5, 0.14);
    strokePath(ctx, [[92, y + 28], [280, y - 6, 450, y + 56, 628, y + 20], [830, y - 12, 996, y + 52, width - 92, y + 18]], theme.accent, 3, 0.12);
  }
}

function drawRisingSunSeal(ctx, theme, width, height) {
  for (const [cx, cy] of [[width / 2, 230], [width / 2, height - 235]]) {
    drawSoftGlow(ctx, cx, cy, 128, theme.secondary, 0.04);
    drawEllipse(ctx, cx, cy, 54, 54, 0, theme.secondary, 0.13);
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18;
      strokePath(ctx, [[cx + Math.cos(angle) * 72, cy + Math.sin(angle) * 72], [cx + Math.cos(angle) * 126, cy + Math.sin(angle) * 126]], theme.accent, 2, 0.055);
    }
  }
}

function drawFlagColorSweep(ctx, theme, width, height) {
  const bands = [
    [theme.accent, 0],
    ["#f3f3f5", 1],
    [theme.secondary, 2]
  ];
  for (const [color, index] of bands) {
    const y = 135 + index * 38;
    strokePath(ctx, [[70, y], [260, y - 54, 440, y + 48, 620, y - 4], [830, y - 58, 990, y + 40, width - 70, y - 8]], color, 4, index === 1 ? 0.08 : 0.14);
    const bottomY = height - 150 - index * 36;
    strokePath(ctx, [[80, bottomY], [285, bottomY - 48, 460, bottomY + 44, 646, bottomY - 2], [830, bottomY - 54, 990, bottomY + 38, width - 80, bottomY - 6]], color, 4, index === 1 ? 0.07 : 0.12);
  }
}

function drawEvergreenIllustration(ctx, theme, width, height) {
  for (const [baseX, baseY, side] of [[85, 380, 1], [width - 85, 380, -1], [95, height - 405, 1], [width - 95, height - 405, -1]]) {
    for (let i = 0; i < 7; i++) {
      const x = baseX + side * (i * 26);
      const y = baseY + i * 8;
      strokePath(ctx, [[x, y], [x + side * 82, y - 42]], i % 2 ? theme.secondary : theme.accent, 2, 0.09);
      drawEllipse(ctx, x + side * 38, y - 18, 5, 18, side * 0.72, theme.secondary, 0.075);
    }
  }
}

function drawNightFestivalIllustration(ctx, theme, width, height) {
  drawSoftGlow(ctx, width / 2, 235, 130, theme.accent, 0.04);
  for (let i = 0; i < 12; i++) {
    const x = 90 + ((i * 113) % (width - 180));
    const y = i % 2 ? 335 + (i % 4) * 32 : height - 360 + (i % 3) * 28;
    drawEllipse(ctx, x, y, 11 + (i % 3) * 4, 17 + (i % 4) * 4, 0, theme.accent, 0.08);
    strokePath(ctx, [[x, y - 18], [x + 8, y - 34]], theme.secondary, 2, 0.08);
  }
}

function drawCoastalSeal(ctx, theme, width, height) {
  for (const [cx, cy] of [[width / 2, 230], [width / 2, height - 230]]) {
    drawSoftGlow(ctx, cx, cy, 132, theme.secondary, 0.035);
    for (let i = 0; i < 4; i++) {
      strokePath(ctx, [[cx - 110, cy + i * 18], [cx - 34, cy - 28 + i * 10, cx + 36, cy + 30 + i * 8, cx + 110, cy - 6 + i * 12]], i % 2 ? theme.secondary : theme.accent, 2, 0.08);
    }
  }
}

function drawSignatureOrnaments(ctx, theme, width, height, variant) {
  if (hasTag(theme, "civic")) drawCeremonialMedallions(ctx, theme, width, height, variant);
  if (hasTag(theme, "celebration")) drawFoldedPaperFans(ctx, theme, width, height, variant);
  if (hasTag(theme, "water") || hasTag(theme, "island")) drawTideGlyphs(ctx, theme, width, height, variant);
  if (hasTag(theme, "botanical") || hasTag(theme, "harvest")) drawPressedSprigs(ctx, theme, width, height, variant);
  if (hasTag(theme, "sky") || hasTag(theme, "light")) drawLuminousPearls(ctx, theme, width, height, variant);
  if (hasTag(theme, "winter")) drawGlassBands(ctx, theme, width, height, variant);
  if (hasTag(theme, "memorial")) drawRemembranceStems(ctx, theme, width, height, variant);
  if (hasTag(theme, "culture")) drawCulturalGlyphs(ctx, theme, width, height, variant);
  if (hasTag(theme, "seasonal")) drawSeasonalGlyphs(ctx, theme, width, height, variant);
}

function drawCulturalGlyphs(ctx, theme, width, height, variant) {
  const text = `${theme.title} ${theme.caption}`.toLowerCase();
  if (/book|education|teacher|language|poetry/.test(text)) drawBookGlyphs(ctx, theme, width, height, variant);
  if (/music|jazz/.test(text)) drawSoundGlyphs(ctx, theme, width, height, variant);
  if (/photo|television/.test(text)) drawFrameGlyphs(ctx, theme, width, height, variant);
  if (/coffee|tea|food/.test(text)) drawSteamGlyphs(ctx, theme, width, height, variant);
  if (/peace|human rights|tolerance|friendship|kindness/.test(text)) drawPeaceGlyphs(ctx, theme, width, height, variant);
}

function drawBookGlyphs(ctx, theme, width, height, variant) {
  for (const [cx, cy] of [[145, 430], [width - 145, 430], [170, height - 430], [width - 170, height - 430]]) {
    ctx.save();
    ctx.strokeStyle = hexToRgba(theme.accent, 0.08);
    ctx.lineWidth = 2;
    roundRect(ctx, cx - 30, cy - 22, 60, 44, 5);
    ctx.stroke();
    strokePath(ctx, [[cx, cy - 20], [cx, cy + 22]], theme.secondary, 1.5, 0.08);
    for (let i = 0; i < 3; i++) {
      strokePath(ctx, [[cx - 21, cy - 10 + i * 10], [cx - 6, cy - 10 + i * 10]], theme.accent, 1, 0.075);
      strokePath(ctx, [[cx + 6, cy - 10 + i * 10], [cx + 21, cy - 10 + i * 10]], theme.secondary, 1, 0.075);
    }
    ctx.restore();
  }
}

function drawSoundGlyphs(ctx, theme, width, height, variant) {
  for (const baseY of [390 + variant * 5, height - 410 - variant * 4]) {
    for (let i = 0; i < 18; i++) {
      const x = 95 + i * ((width - 190) / 17);
      const amp = 14 + ((i + variant) % 5) * 7;
      strokePath(ctx, [[x, baseY - amp], [x, baseY + amp]], i % 2 ? theme.secondary : theme.accent, 2, 0.065);
    }
  }
}

function drawFrameGlyphs(ctx, theme, width, height, variant) {
  for (const [x, y] of [[120, 405], [width - 240, 405], [145, height - 470], [width - 265, height - 470]]) {
    ctx.save();
    ctx.strokeStyle = hexToRgba(theme.secondary, 0.075);
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, 120, 78, 8);
    ctx.stroke();
    dot(ctx, x + 92, y + 22, 5, theme.accent, 0.08);
    drawEllipse(ctx, x + 58, y + 40, 18, 18, 0, theme.accent, 0.055);
    ctx.restore();
  }
}

function drawSteamGlyphs(ctx, theme, width, height, variant) {
  for (const [cx, cy] of [[130, 430], [width - 130, 430], [165, height - 430], [width - 165, height - 430]]) {
    drawEllipse(ctx, cx, cy + 34, 38, 11, 0, theme.secondary, 0.055);
    for (let i = 0; i < 3; i++) {
      strokePath(ctx, [[cx - 22 + i * 22, cy + 12], [cx - 30 + i * 22, cy - 22, cx - 12 + i * 24, cy - 34, cx - 20 + i * 24, cy - 62]], theme.accent, 2, 0.075);
    }
  }
}

function drawPeaceGlyphs(ctx, theme, width, height, variant) {
  for (const [cx, cy] of [[width / 2, 250], [width / 2, height - 260]]) {
    ctx.save();
    ctx.strokeStyle = hexToRgba(theme.accent, 0.08);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 52, 0, Math.PI * 2);
    ctx.stroke();
    strokePath(ctx, [[cx, cy - 52], [cx, cy + 52]], theme.secondary, 2, 0.08);
    strokePath(ctx, [[cx, cy + 8], [cx - 36, cy + 42]], theme.secondary, 2, 0.08);
    strokePath(ctx, [[cx, cy + 8], [cx + 36, cy + 42]], theme.secondary, 2, 0.08);
    ctx.restore();
  }
}

function drawCeremonialMedallions(ctx, theme, width, height, variant) {
  const anchors = [
    [width / 2, 205],
    [width / 2, height - 235]
  ];
  for (const [cx, cy] of anchors) {
    for (let ring = 0; ring < 3; ring++) {
      ctx.save();
      ctx.strokeStyle = hexToRgba(ring % 2 ? theme.secondary : theme.accent, 0.05 + ring * 0.018);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 52 + ring * 27 + variant, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18;
      const r = 86 + (i % 2) * 14;
      drawDiamond(ctx, cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 4 + (i % 3), i % 2 ? theme.secondary : theme.accent, 0.07);
    }
  }
}

function drawFoldedPaperFans(ctx, theme, width, height, variant) {
  const fans = [
    [150, 400, 1],
    [width - 150, 400, -1],
    [190, height - 420, 1],
    [width - 190, height - 420, -1]
  ];
  for (const [cx, cy, side] of fans) {
    for (let fold = 0; fold < 7; fold++) {
      const angle = side * (-0.72 + fold * 0.24);
      strokePath(ctx, [[cx, cy], [cx + Math.cos(angle) * 78, cy + Math.sin(angle) * 78]], fold % 2 ? theme.secondary : theme.accent, 2, 0.085);
    }
    ctx.save();
    ctx.strokeStyle = hexToRgba(theme.accent, 0.075);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 78, side > 0 ? -0.72 : Math.PI - 0.72, side > 0 ? 0.72 : Math.PI + 0.72);
    ctx.stroke();
    ctx.restore();
  }
}

function drawTideGlyphs(ctx, theme, width, height, variant) {
  for (const base of [380, height - 465]) {
    for (let i = 0; i < 9; i++) {
      const cx = 120 + ((i * 143 + variant * 29) % (width - 240));
      const cy = base + (i % 3) * 26;
      ctx.save();
      ctx.strokeStyle = hexToRgba(i % 2 ? theme.secondary : theme.accent, 0.07);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 16 + (i % 4) * 4, Math.PI * 0.1, Math.PI * 1.78);
      ctx.stroke();
      ctx.restore();
      dot(ctx, cx + 22, cy - 3, 2.5, theme.secondary, 0.08);
    }
  }
}

function drawPressedSprigs(ctx, theme, width, height, variant) {
  for (const [baseX, baseY, side] of [[128, 510, 1], [width - 128, 510, -1], [142, height - 520, 1], [width - 142, height - 520, -1]]) {
    strokePath(ctx, [[baseX, baseY], [baseX + side * 82, baseY - 76, baseX + side * 126, baseY + 34, baseX + side * 188, baseY - 42]], theme.accent, 2, 0.08);
    for (let i = 0; i < 6; i++) {
      const x = baseX + side * (32 + i * 25);
      const y = baseY - 24 + ((i + variant) % 3) * 22;
      drawEllipse(ctx, x, y, 5 + (i % 2), 15 + (i % 3) * 3, side * (i % 2 ? 0.72 : -0.42), i % 2 ? theme.secondary : theme.accent, 0.075);
    }
  }
}

function drawLuminousPearls(ctx, theme, width, height, variant) {
  for (let arc = 0; arc < 2; arc++) {
    const cy = arc === 0 ? 315 : height - 330;
    for (let i = 0; i < 14; i++) {
      const t = i / 13;
      const x = 135 + t * (width - 270);
      const y = cy + Math.sin(t * Math.PI * 2 + variant) * 22;
      drawSoftGlow(ctx, x, y, 16 + (i % 3) * 5, i % 2 ? theme.secondary : theme.accent, 0.026);
      dot(ctx, x, y, 2.2 + (i % 3) * 0.8, "#ffffff", 0.1);
    }
  }
}

function drawGlassBands(ctx, theme, width, height, variant) {
  for (const y of [430 + variant * 3, height - 450 - variant * 2]) {
    for (let i = 0; i < 4; i++) {
      strokePath(ctx, [[84, y + i * 22], [300, y - 28 + i * 18, 520, y + 34 + i * 10, 700, y - 10 + i * 18], [900, y - 48 + i * 12, 1040, y + 30 + i * 10, width - 84, y - 4 + i * 18]], "#f3f7ff", 1.5, 0.042 + i * 0.01);
    }
  }
}

function drawRemembranceStems(ctx, theme, width, height, variant) {
  const stems = [[96, height - 705, 1], [width - 96, height - 705, -1], [118, 620, 1], [width - 118, 620, -1]];
  for (const [x, y, side] of stems) {
    strokePath(ctx, [[x, y + 80], [x + side * 28, y + 20, x + side * 12, y - 38, x + side * 48, y - 82]], theme.secondary, 2, 0.075);
    flower(ctx, x + side * 50, y - 92, 22 + (variant % 3) * 3, theme.accent, theme.secondary, 0.1, 5);
  }
}

function drawSeasonalGlyphs(ctx, theme, width, height, variant) {
  if (hasTag(theme, "dew-season")) drawDewBeadVeils(ctx, theme, width, height, variant);
  if (hasTag(theme, "equinox")) drawEquinoxBalanceMarks(ctx, theme, width, height, variant);
  if (hasTag(theme, "rain-season") || hasTag(theme, "summer")) drawRainCurtainGlyphs(ctx, theme, width, height, variant);
  if (hasTag(theme, "heat-season")) drawHeatShimmerGlyphs(ctx, theme, width, height, variant);
  if (hasTag(theme, "cold-season")) drawWinterWindowGlyphs(ctx, theme, width, height, variant);
  if (hasTag(theme, "spring-season") || hasTag(theme, "spring")) drawSproutOrbitGlyphs(ctx, theme, width, height, variant);
  if (hasTag(theme, "grain-season") || hasTag(theme, "harvest")) drawHarvestMoonGlyphs(ctx, theme, width, height, variant);
}

function drawDewBeadVeils(ctx, theme, width, height, variant) {
  const rows = [310 + variant * 3, height - 520 - variant * 2];
  for (const baseY of rows) {
    for (let i = 0; i < 18; i++) {
      const t = i / 17;
      const x = 88 + t * (width - 176);
      const y = baseY + Math.sin(t * Math.PI * 2 + variant * 0.7) * 30;
      strokePath(ctx, [[x - 8, y - 34], [x - 2, y - 12, x + 2, y + 10, x + 8, y + 34]], theme.secondary, 1.4, 0.075);
      drawEllipse(ctx, x, y + 42, 6 + (i % 3), 10 + (i % 4), 0, i % 2 ? theme.accent : "#f3f7ff", 0.16);
      dot(ctx, x - 2, y + 38, 1.6, "#ffffff", 0.16);
      drawSoftGlow(ctx, x, y + 42, 24, theme.accent, 0.026);
    }
  }
  for (const [x, side] of [[105, 1], [width - 105, -1]]) {
    for (let i = 0; i < 7; i++) {
      const y = 605 + i * 190;
      strokePath(ctx, [[x, y], [x + side * 42, y - 52, x + side * 82, y + 34, x + side * 126, y - 18]], theme.secondary, 1.8, 0.09);
      drawEllipse(ctx, x + side * (34 + (i % 3) * 18), y + 12, 8, 12, 0, theme.accent, 0.13);
    }
  }
  for (const [cx, cy, scale] of [[width / 2, 270, 1], [width / 2, height - 300, 0.8]]) {
    drawSoftGlow(ctx, cx, cy, 120 * scale, theme.accent, 0.032);
    drawEllipse(ctx, cx - 38 * scale, cy, 46 * scale, 54 * scale, -0.2, theme.secondary, 0.075);
    drawEllipse(ctx, cx - 18 * scale, cy - 4 * scale, 38 * scale, 48 * scale, -0.2, theme.gradient[0], 0.18);
    for (let i = 0; i < 5; i++) {
      const angle = -0.5 + i * 0.25;
      drawEllipse(ctx, cx + Math.cos(angle) * 96 * scale, cy + Math.sin(angle) * 42 * scale, 7 * scale, 12 * scale, angle, theme.accent, 0.11);
    }
  }
}

function drawEquinoxBalanceMarks(ctx, theme, width, height, variant) {
  for (const y of [360 + variant * 4, height - 430 - variant * 3]) {
    strokePath(ctx, [[width / 2 - 180, y], [width / 2 + 180, y]], theme.accent, 2, 0.075);
    drawDiamond(ctx, width / 2, y, 9, theme.secondary, 0.11);
    for (const side of [-1, 1]) {
      const cx = width / 2 + side * 128;
      strokePath(ctx, [[cx, y], [cx - side * 34, y + 42], [cx + side * 34, y + 42], [cx, y]], theme.secondary, 1.5, 0.065);
      dot(ctx, cx, y + 42, 3.2, theme.accent, 0.09);
    }
  }
}

function drawRainCurtainGlyphs(ctx, theme, width, height, variant) {
  for (const zone of [210, height - 610]) {
    for (let i = 0; i < 28; i++) {
      const x = 65 + ((i * 67 + variant * 43) % (width - 130));
      const y = zone + ((i * 37) % 260);
      const length = 30 + (i % 5) * 12;
      strokePath(ctx, [[x, y], [x - 9, y + length]], i % 2 ? theme.secondary : theme.accent, 1.5, 0.055);
      if (i % 4 === 0) drawEllipse(ctx, x - 12, y + length + 8, 4, 7, 0, theme.secondary, 0.07);
    }
  }
}

function drawHeatShimmerGlyphs(ctx, theme, width, height, variant) {
  for (const y of [340 + variant * 6, height - 510 - variant * 4]) {
    for (let i = 0; i < 9; i++) {
      const x = 100 + i * ((width - 200) / 8);
      strokePath(ctx, [[x, y + 42], [x - 20, y + 10, x + 24, y - 18, x, y - 54]], theme.accent, 2.4, 0.06);
      strokePath(ctx, [[x + 18, y + 52], [x + 40, y + 16, x - 2, y - 12, x + 22, y - 46]], theme.secondary, 1.8, 0.045);
    }
  }
}

function drawWinterWindowGlyphs(ctx, theme, width, height, variant) {
  for (const [x, y] of [[104, 420], [width - 224, 420], [130, height - 560], [width - 250, height - 560]]) {
    ctx.save();
    ctx.strokeStyle = hexToRgba("#f3f7ff", 0.06);
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, 120, 150, 10);
    ctx.stroke();
    strokePath(ctx, [[x + 60, y], [x + 60, y + 150]], "#f3f7ff", 1.4, 0.055);
    strokePath(ctx, [[x, y + 74], [x + 120, y + 74]], "#f3f7ff", 1.4, 0.055);
    ctx.restore();
    drawSoftGlow(ctx, x + 60, y + 84, 72, theme.secondary, 0.025);
  }
}

function drawSproutOrbitGlyphs(ctx, theme, width, height, variant) {
  for (const [cx, cy] of [[width / 2, 300], [width / 2, height - 420]]) {
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16 + variant * 0.04;
      const rx = 250 + (i % 3) * 18;
      const ry = 72 + (i % 4) * 7;
      const x = cx + Math.cos(angle) * rx;
      const y = cy + Math.sin(angle) * ry;
      drawEllipse(ctx, x, y, 5, 15, angle, i % 2 ? theme.secondary : theme.accent, 0.075);
    }
  }
}

function drawHarvestMoonGlyphs(ctx, theme, width, height, variant) {
  for (const [cx, cy, scale] of [[width / 2, 260, 1], [width / 2, height - 365, 0.86]]) {
    drawSoftGlow(ctx, cx, cy, 165 * scale, theme.secondary, 0.04);
    drawEllipse(ctx, cx, cy, 64 * scale, 64 * scale, 0, theme.secondary, 0.085);
    for (let i = 0; i < 11; i++) {
      const angle = -0.92 + i * 0.18;
      const x = cx + Math.cos(angle) * 130 * scale;
      const y = cy + Math.sin(angle) * 76 * scale;
      drawEllipse(ctx, x, y, 8 * scale, 16 * scale, angle, i % 2 ? theme.accent : theme.secondary, 0.105);
    }
  }
}
