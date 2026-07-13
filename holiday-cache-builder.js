export function createHolidayCacheBuilder({ startDate, endDate, maxCandidatesPerDay, dateKey, addDays }) {
  const days = {};

  function addTheme(dayKey, theme) {
    days[dayKey] ||= [];
    days[dayKey].push(theme);
  }

  function dedupeThemes(themes) {
    const seen = new Map();
    for (const theme of themes) {
      const key = `${theme.title.toLowerCase()}-${theme.source?.countryCode || "global"}`;
      const existing = seen.get(key);
      if (!existing || theme.score > existing.score) seen.set(key, theme);
    }
    return Array.from(seen.values());
  }

  function selectCandidates(themes) {
    const sorted = dedupeThemes(themes).sort((a, b) => b.score - a.score);
    const selected = [];
    const selectedKeys = new Set();

    function add(theme) {
      const key = `${theme.title.toLowerCase()}-${theme.source?.countryCode || "global"}`;
      if (selectedKeys.has(key) || selected.length >= maxCandidatesPerDay) return false;
      selected.push(theme);
      selectedKeys.add(key);
      return true;
    }

    for (const theme of sorted.slice(0, Math.min(3, maxCandidatesPerDay))) add(theme);
    const selectedFamilies = new Set(selected.map((theme) => theme.holidayFamily).filter(Boolean));
    for (const theme of sorted) {
      const family = theme.holidayFamily || "";
      if (family && !selectedFamilies.has(family) && add(theme)) selectedFamilies.add(family);
    }

    for (const theme of sorted) {
      const provider = theme.source?.provider || "";
      if (/Curated Cultural Observances|Fixed Holidays/.test(provider)) add(theme);
    }

    for (const theme of sorted) add(theme);
    return selected;
  }

  function rankedDays() {
    const ranked = {};
    for (const [day, themes] of Object.entries(days).sort(([a], [b]) => a.localeCompare(b))) {
      ranked[day] = selectCandidates(themes);
    }
    return ranked;
  }

  function coverage(ranked) {
    const missingDates = [];
    let totalDays = 0;

    for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
      totalDays++;
      const key = dateKey(date);
      if (!ranked[key]) missingDates.push(key);
    }

    return {
      totalDays,
      candidateDays: Object.keys(ranked).length,
      fallbackDays: missingDates.length,
      fallbackDates: missingDates
    };
  }

  function finalize() {
    const ranked = rankedDays();
    return {
      days: ranked,
      coverage: coverage(ranked)
    };
  }

  return {
    addTheme,
    finalize
  };
}
