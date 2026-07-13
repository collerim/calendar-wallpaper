// Canvas renderer for the year calendar model.

const YEAR_CALENDAR_RENDER_STYLE = Object.freeze({
  backgroundColor: "#141414",
  textColor: "#8e8e93",
  pastDayColor: "#8e8e93",
  todayColor: "#ff453a",
  futureDayColor: "#2c2c2e",
  fontStack: "-apple-system"
});

function drawYearCalendar(ctx, model, styleOverrides = {}) {
  const style = { ...YEAR_CALENDAR_RENDER_STYLE, ...styleOverrides };
  const { surface, layout } = model;

  ctx.save();
  ctx.translate(surface.width / 2, model.calendarStartY);
  ctx.scale(surface.calendarScale, surface.calendarScale);
  ctx.translate(-surface.width / 2, 0);

  for (const month of model.months) {
    ctx.fillStyle = style.textColor;
    ctx.font = `32px ${style.fontStack}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(month.name, month.titleX, month.titleY);
  }

  for (const day of model.days) {
    ctx.fillStyle = colorForDay(day, style);
    ctx.beginPath();
    ctx.arc(day.centerX, day.centerY, layout.dotSize / 2, 0, Math.PI * 2);
    ctx.fill();

    if (day.isToday) drawTodayRing(ctx, day, layout, style);
  }

  ctx.restore();
}

function drawYearProgress(ctx, model, styleOverrides = {}) {
  const style = { ...YEAR_CALENDAR_RENDER_STYLE, ...styleOverrides };
  const progress = model.progress;

  ctx.fillStyle = style.futureDayColor;
  drawRoundedRect(ctx, progress.barX, progress.barY, progress.barWidth, progress.barHeight, progress.barHeight / 2);

  ctx.fillStyle = style.todayColor;
  drawRoundedRect(ctx, progress.barX, progress.barY, progress.barWidth * progress.fillRatio, progress.barHeight, progress.barHeight / 2);

  ctx.fillStyle = style.textColor;
  ctx.font = `56px ${style.fontStack}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(progress.label, model.surface.width / 2, progress.labelY);
}

function colorForDay(day, style = YEAR_CALENDAR_RENDER_STYLE) {
  if (day.isPast) return style.pastDayColor;
  if (day.isToday) return style.todayColor;
  return style.futureDayColor;
}

function drawTodayRing(ctx, day, layout, style) {
  ctx.strokeStyle = hexToCalendarRgba(style.todayColor, 0.6);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(day.centerX, day.centerY, layout.dotSize / 2 + 3, 0, Math.PI * 2);
  ctx.stroke();
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

function hexToCalendarRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

globalThis.YearCalendarRenderer = {
  STYLE: YEAR_CALENDAR_RENDER_STYLE,
  drawYearCalendar,
  drawYearProgress,
  colorForDay
};
