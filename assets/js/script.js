const state = { area: 'All', system: 'All', query: '', limit: 10, data: [] };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function systemMatches(record, system) {
  if (system === 'All') return true;
  return String(record.system || '').toLowerCase().includes(system.toLowerCase());
}

function filtered() {
  return state.data.filter((record) => {
    const areaMatch = state.area === 'All' || (record.areas || []).includes(state.area);
    const systemMatch = systemMatches(record, state.system);
    const haystack = [record.milestone, record.project, record.system, record.problem, record.solution, record.insight, ...(record.areas || [])]
      .join(' ')
      .toLowerCase();
    const queryMatch = !state.query || haystack.includes(state.query);
    return areaMatch && systemMatch && queryMatch;
  });
}

function badges(record) {
  return (record.areas || []).slice(0, 4).map((area) => `<span class="area-badge">${escapeHtml(area)}</span>`).join('');
}

function render() {
  const body = $('#evidence-body');
  const cards = $('#evidence-cards');
  const count = $('#evidence-count');
  const empty = $('#evidence-empty');
  const loadMore = $('#load-more');
  if (!body || !cards || !count || !empty || !loadMore) return;

  const items = filtered();
  const visible = items.slice(0, state.limit);
  count.textContent = `${items.length} matching work ${items.length === 1 ? 'story' : 'stories'}`;

  body.innerHTML = visible.map((record) => `
    <tr>
      <td>${escapeHtml(record.milestone)}<div>${badges(record)}</div></td>
      <td><span class="system-badge">${escapeHtml(record.system)}</span></td>
      <td>${escapeHtml(record.problem)}</td>
      <td>${escapeHtml(record.solution)}</td>
      <td>${escapeHtml(record.insight)}</td>
    </tr>
  `).join('');

  cards.innerHTML = visible.map((record) => `
    <article class="evidence-card">
      <div class="mobile-system">${escapeHtml(record.system)} · ${escapeHtml(record.project)}</div>
      <h3>${escapeHtml(record.milestone)}</h3>
      <div>${badges(record)}</div>
      <dl>
        <div><dt>Problem</dt><dd>${escapeHtml(record.problem)}</dd></div>
        <div><dt>What I did</dt><dd>${escapeHtml(record.solution)}</dd></div>
        <div><dt>What I learned</dt><dd>${escapeHtml(record.insight)}</dd></div>
      </dl>
    </article>
  `).join('');

  empty.hidden = items.length > 0;
  loadMore.hidden = items.length <= state.limit;
}

function setActive(selector, activeButton) {
  $$(selector).forEach((button) => button.classList.toggle('active', button === activeButton));
}

function resetFilters() {
  state.area = 'All';
  state.system = 'All';
  state.query = '';
  state.limit = 10;
  const areaAll = document.querySelector('#area-filters .filter[data-filter="All"]');
  const systemAll = document.querySelector('#system-filters .system-chip[data-system="All"]');
  if (areaAll) setActive('#area-filters .filter', areaAll);
  if (systemAll) setActive('#system-filters .system-chip', systemAll);
  const search = $('#evidence-search');
  if (search) search.value = '';
  render();
}

fetch('assets/data/work-evidence.json')
  .then((response) => {
    if (!response.ok) throw new Error('Could not load evidence');
    return response.json();
  })
  .then((data) => {
    state.data = Array.isArray(data) ? data : [];
    render();
  })
  .catch(() => {
    const count = $('#evidence-count');
    if (count) count.textContent = 'Evidence could not be loaded. Please refresh the page.';
  });

$$('#area-filters .filter').forEach((button) => {
  button.addEventListener('click', () => {
    state.area = button.dataset.filter;
    state.limit = 10;
    setActive('#area-filters .filter', button);
    render();
  });
});

$$('#system-filters .system-chip').forEach((button) => {
  button.addEventListener('click', () => {
    state.system = button.dataset.system;
    state.limit = 10;
    setActive('#system-filters .system-chip', button);
    render();
  });
});

const searchInput = $('#evidence-search');
if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    state.query = event.target.value.trim().toLowerCase();
    state.limit = 10;
    render();
  });
}

const resetButton = $('#reset-filters');
if (resetButton) resetButton.addEventListener('click', resetFilters);

const loadMoreButton = $('#load-more');
if (loadMoreButton) {
  loadMoreButton.addEventListener('click', () => {
    state.limit += 10;
    render();
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08 });

$$('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('[data-jump-filter]').forEach((link) => {
  link.addEventListener('click', () => {
    const target = link.dataset.jumpFilter;
    if (!target) return;
    setTimeout(() => {
      const button = [...document.querySelectorAll('#area-filters .filter')].find((item) => item.dataset.filter === target);
      if (button) button.click();
    }, 350);
  });
});
