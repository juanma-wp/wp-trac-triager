// Shared release discovery and calendar helpers. No version or date is bundled.
globalThis.WPRelease = (() => {
  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december'
  ];

  function compare(a, b) {
    const left = a.split('.').map(Number);
    const right = b.split('.').map(Number);
    return left[0] - right[0] || left[1] - right[1];
  }

  function nextMajor(stable, pages) {
    if (!/^\d+\.\d+(?:\.\d+)?$/.test(stable) || !Array.isArray(pages)) {
      throw new Error('Invalid release discovery response');
    }
    return (
      pages
        .filter(page => /^\d+-\d+$/.test(page.slug))
        .map(page => page.slug.replace('-', '.'))
        .filter(version => compare(version, stable) > 0)
        .sort(compare)[0] || null
    );
  }

  function isoDate(year, month, day) {
    const date = new Date(Date.UTC(Number(year), month, Number(day)));
    if (month < 0 || date.getUTCMonth() !== month || date.getUTCDate() !== Number(day)) return null;
    return date.toISOString().slice(0, 10);
  }

  function parseDateRange(text) {
    const normalized = text.trim().replace(/[–—]/g, '-').replace(/\s+/g, ' ');
    const dayFirst = normalized.match(/^(\d{1,2})(?:\s*-\s*(\d{1,2}))? ([A-Za-z]+) (\d{4})$/);
    const monthFirst = normalized.match(/^([A-Za-z]+) (\d{1,2})(?:\s*-\s*(\d{1,2}))?,? (\d{4})$/);
    if (!dayFirst && !monthFirst) return null;
    const [, first, last, month, year] = dayFirst || [
      null,
      monthFirst[2],
      monthFirst[3],
      monthFirst[1],
      monthFirst[4]
    ];
    const monthIndex = months.indexOf(month.toLowerCase());
    const start = isoDate(year, monthIndex, first);
    const end = isoDate(year, monthIndex, last || first);
    return start && end && start <= end ? { start, end, label: normalized } : null;
  }

  function today() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function daysUntil(date, from = today()) {
    return Math.round(
      (Date.parse(date + 'T00:00:00Z') - Date.parse(from + 'T00:00:00Z')) / 86400000
    );
  }

  function nextMilestone(milestones, date = today()) {
    return (
      milestones
        .filter(item => item.end >= date)
        .sort((a, b) => a.start.localeCompare(b.start))[0] || null
    );
  }

  // Called only in the content script, where an inert template can parse HTML.
  // Remote nodes are never inserted into the page or executed.
  function parseSchedule(html, version) {
    const template = document.createElement('template');
    template.innerHTML = html;
    const root = template.content;
    root
      .querySelectorAll('.glossary-item-hidden-content, script, style')
      .forEach(node => node.remove());
    const heading = Array.from(root.querySelectorAll('h2, h3')).find(
      node => node.id === 'release-schedule' || /^release schedule$/i.test(node.textContent.trim())
    );
    if (!heading) throw new Error('Release schedule not found');
    let section = heading.nextElementSibling;
    let table;
    while (section && !/^H[1-3]$/.test(section.tagName)) {
      table = section.matches('table') ? section : section.querySelector('table');
      if (table) break;
      section = section.nextElementSibling;
    }
    if (!table) throw new Error('Release table not found');
    const milestones = [];
    let incomplete = false;
    for (const row of table.querySelectorAll('tr')) {
      const cells = row.querySelectorAll('td');
      if (cells.length < 2) continue;
      const label = cells[1].textContent.replace(/\s+/g, ' ').trim();
      const beta = label.match(/\bBeta\s*(\d+)/i);
      const rc = label.match(/\b(?:Release Candidate|RC)\s*(\d+)/i);
      const final =
        label.startsWith(`WordPress ${version}`) && /\b(released|release|launch)\b/i.test(label);
      if (!beta && !rc && !final) continue;
      const date = parseDateRange(cells[0].textContent);
      if (!date) {
        incomplete = true;
        continue;
      }
      milestones.push({
        ...date,
        name: beta ? `Beta ${beta[1]}` : rc ? `RC${rc[1]}` : `WordPress ${version}`,
        type: beta ? 'beta' : rc ? 'rc' : 'final'
      });
    }
    if (!milestones.length || incomplete || !milestones.some(item => item.type === 'final')) {
      throw new Error('Release dates are unavailable or use an unsupported format');
    }
    return milestones.sort((a, b) => a.start.localeCompare(b.start));
  }

  return { compare, nextMajor, parseDateRange, today, daysUntil, nextMilestone, parseSchedule };
})();
