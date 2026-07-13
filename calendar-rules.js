// Calendar-specific display rules shared by the wallpaper and regression tests.

const LAST_PAYDAY = {
  year: 2026,
  monthIndex: 6,
  day: 25
};

function isPayday(year, monthIndex, day) {
  if (day !== LAST_PAYDAY.day) return false;

  const monthKey = year * 12 + monthIndex;
  const lastPaydayMonthKey = LAST_PAYDAY.year * 12 + LAST_PAYDAY.monthIndex;
  return monthKey <= lastPaydayMonthKey;
}

globalThis.YearCalendarRules = {
  isPayday
};
