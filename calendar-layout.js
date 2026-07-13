// Calendar layout model for the year wallpaper.
//
// This module owns the date math and geometry for the year calendar. It does
// not draw anything; callers receive a stable model that renderers and tests
// can use through the same seam.

const WALLPAPER_RENDER_SURFACE = Object.freeze({
  width: 1260,
  height: 2736,
  calendarScale: 1.25,
  topReserved: 550,
  bottomReserved: 420
});

const YEAR_CALENDAR_LAYOUT_DEFAULTS = Object.freeze({
  monthNames: Object.freeze(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]),
  monthsPerRow: 3,
  cols: 7,
  dotSize: 22,
  dotGap: 10,
  monthTitleHeight: 36,
  titleGap: 14,
  monthGap: 36,
  rowGap: 52,
  calendarStartOffsetY: 12,
  progressGap: 58,
  progressLabelToBarGap: 30,
  progressBarHeight: 20
});

function createYearCalendarModel(date, options = {}) {
  const surface = {
    ...WALLPAPER_RENDER_SURFACE,
    ...(options.surface || {})
  };
  const layout = {
    ...YEAR_CALENDAR_LAYOUT_DEFAULTS,
    ...(options.layout || {})
  };

  const year = date.getFullYear();
  const months = layout.monthNames.map((name, monthIndex) => ({
    name,
    monthIndex,
    days: daysInMonth(year, monthIndex)
  }));

  const dayOfYear = dayOfYearFor(date);
  const totalDays = daysInYear(year);
  const progressPercent = Math.floor((dayOfYear / totalDays) * 100);
  const daysLeft = totalDays - dayOfYear;
  const maxMonthHeight = Math.max(...months.map((month) => monthHeight(year, month.monthIndex, month.days, layout)));
  const totalRows = Math.ceil(months.length / layout.monthsPerRow);
  const calendarHeight = totalRows * maxMonthHeight + (totalRows - 1) * layout.rowGap;
  const scaledCalendarHeight = calendarHeight * surface.calendarScale;
  const calendarTop = surface.topReserved;
  const calendarBottom = surface.height - surface.bottomReserved;
  const calendarStartY = calendarTop + (calendarBottom - calendarTop - scaledCalendarHeight) / 2 + layout.calendarStartOffsetY;
  const monthWidth = layout.cols * layout.dotSize + (layout.cols - 1) * layout.dotGap;
  const rowWidth = layout.monthsPerRow * monthWidth + (layout.monthsPerRow - 1) * layout.monthGap;
  const firstMonthX = (surface.width - rowWidth) / 2;
  const lastMonthX = firstMonthX + rowWidth;

  const monthSlots = [];
  const daySlots = [];
  let dayCounter = 1;

  for (let row = 0; row < totalRows; row++) {
    const cursorY = row * (maxMonthHeight + layout.rowGap);
    for (let column = 0; column < layout.monthsPerRow; column++) {
      const monthIndex = row * layout.monthsPerRow + column;
      const month = months[monthIndex];
      if (!month) continue;

      const cursorX = firstMonthX + column * (monthWidth + layout.monthGap);
      const firstDay = new Date(year, monthIndex, 1).getDay();
      const offset = (firstDay + 6) % layout.cols;
      const yStart = cursorY + layout.monthTitleHeight + layout.titleGap;
      const monthSlot = {
        ...month,
        row,
        column,
        x: cursorX,
        y: cursorY,
        width: monthWidth,
        titleX: cursorX + monthWidth / 2,
        titleY: cursorY + layout.monthTitleHeight - 6
      };
      monthSlots.push(monthSlot);

      for (let day = 1; day <= month.days; day++) {
        const index = offset + day - 1;
        const x = cursorX + (index % layout.cols) * (layout.dotSize + layout.dotGap);
        const y = yStart + Math.floor(index / layout.cols) * (layout.dotSize + layout.dotGap);
        const isToday = dayCounter === dayOfYear;
        const isPast = dayCounter < dayOfYear;
        daySlots.push({
          year,
          monthIndex,
          monthName: month.name,
          day,
          dayOfYear: dayCounter,
          state: isToday ? "today" : isPast ? "past" : "future",
          isPast,
          isToday,
          isFuture: dayCounter > dayOfYear,
          x,
          y,
          centerX: x + layout.dotSize / 2,
          centerY: y + layout.dotSize / 2
        });
        dayCounter++;
      }
    }
  }

  const progressY = calendarStartY + scaledCalendarHeight + layout.progressGap;
  const progressBarY = progressY + layout.progressLabelToBarGap;

  return {
    date,
    year,
    dayOfYear,
    totalDays,
    daysLeft,
    progressPercent,
    surface,
    layout,
    months: monthSlots,
    days: daySlots,
    maxMonthHeight,
    calendarHeight,
    scaledCalendarHeight,
    calendarStartY,
    progress: {
      label: `${progressPercent}% · ${daysLeft}d left`,
      labelY: progressY,
      barX: firstMonthX,
      barY: progressBarY,
      barWidth: lastMonthX - firstMonthX,
      barHeight: layout.progressBarHeight,
      fillRatio: dayOfYear / totalDays
    }
  };
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function daysInYear(year) {
  return daysBetween(new Date(year, 0, 1), new Date(year, 11, 31)) + 1;
}

function dayOfYearFor(date) {
  return daysBetween(new Date(date.getFullYear(), 0, 1), date) + 1;
}

function daysBetween(start, end) {
  return Math.floor((startOfLocalDay(end) - startOfLocalDay(start)) / 86400000);
}

function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function monthHeight(year, monthIndex, days, layout = YEAR_CALENDAR_LAYOUT_DEFAULTS) {
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const offset = (firstDay + 6) % layout.cols;
  const rows = Math.ceil((offset + days) / layout.cols);
  return layout.monthTitleHeight + layout.titleGap + rows * layout.dotSize + (rows - 1) * layout.dotGap;
}

globalThis.YearCalendarLayout = {
  RENDER_SURFACE: WALLPAPER_RENDER_SURFACE,
  DEFAULTS: YEAR_CALENDAR_LAYOUT_DEFAULTS,
  createYearCalendarModel,
  daysInMonth,
  daysInYear,
  dayOfYearFor,
  monthHeight
};
