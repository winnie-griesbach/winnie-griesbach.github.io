
const state = { area:'All', system:'All', query:'', limit:7, data:[] };
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const isGerman = document.documentElement.lang === 'de';
const labels = isGerman ? {
  problem:'Problem', solution:'Was ich umgesetzt habe', insight:'Was ich gelernt habe',
  loadError:'Interaktive Filter konnten nicht geladen werden. Alle Nachweise stehen weiterhin unten.',
  pause:'Diashow pausieren', resume:'Diashow fortsetzen',
  areas:{'UX / Customer Journey':'UX / Customer Journey','Technical Implementation':'Technische Umsetzung','Product / Tools':'Produkt / Tools','Digital Marketing':'Digitales Marketing'}
} : {
  problem:'Problem', solution:'What I did', insight:'What I learned',
  loadError:'Interactive filters could not be loaded. All evidence remains available below.',
  pause:'Pause slideshow', resume:'Resume slideshow', areas:{}
};
const areaLabel = (area) => labels.areas[area] || area;
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));

function systemMatches(record, system){
  if(system === 'All') return true;
  return String(record.system || '').split(/\s*[+·]\s*/).some((name) => name.trim().toLowerCase() === system.toLowerCase());
}

function filtered(){
  return state.data.filter((r) => {
    const area = state.area === 'All' || (r.areas || []).includes(state.area);
    const sys = systemMatches(r, state.system);
    const hay = [r.milestone,r.project,r.system,r.problem,r.solution,r.insight,...(r.areas || []).map(areaLabel)].join(' ').toLowerCase();
    const query = !state.query || hay.includes(state.query);
    return area && sys && query;
  });
}


function systemBadges(record){
  const raw = String(record.system || '');
  const systems = [];
  if(/magento/i.test(raw)) systems.push('Magento');
  if(/typo3/i.test(raw)) systems.push('TYPO3');
  if(/shopify/i.test(raw)) systems.push('Shopify');
  if(!systems.length && raw) systems.push(raw);
  return systems.map((name) => `<span class="system-badge">${escapeHtml(name)}</span>`).join('');
}

function systemText(record){
  const raw = String(record.system || '');
  const systems = [];
  if(/magento/i.test(raw)) systems.push('Magento');
  if(/typo3/i.test(raw)) systems.push('TYPO3');
  if(/shopify/i.test(raw)) systems.push('Shopify');
  return systems.length ? systems.join(' · ') : raw;
}

function badges(record){
  return (record.areas || []).slice(0,4).map((a) => `<span class="area-badge">${escapeHtml(areaLabel(a))}</span>`).join('');
}

function render(){
  const items = filtered();
  const visible = items.slice(0,state.limit);
  $('#evidence-count').textContent = isGerman ? `${items.length} passende Arbeitsnachweise` : `${items.length} matching work ${items.length === 1 ? 'story' : 'stories'}`;
  $('#evidence-body').innerHTML = visible.map((r) => `
    <tr>
      <td>${escapeHtml(r.milestone)}<div>${badges(r)}</div></td>
      <td>${systemBadges(r)}</td>
      <td>${escapeHtml(r.problem)}</td>
      <td>${escapeHtml(r.solution)}</td>
      <td>${escapeHtml(r.insight)}</td>
    </tr>
  `).join('');

  $('#evidence-cards').innerHTML = visible.map((r) => `
    <article class="evidence-card">
      <div class="mobile-system">${escapeHtml(systemText(r))} · ${escapeHtml(r.project)}</div>
      <h3>${escapeHtml(r.milestone)}</h3>
      <div>${badges(r)}</div>
      <dl>
        <div><dt>${labels.problem}</dt><dd>${escapeHtml(r.problem)}</dd></div>
        <div><dt>${labels.solution}</dt><dd>${escapeHtml(r.solution)}</dd></div>
        <div><dt>${labels.insight}</dt><dd>${escapeHtml(r.insight)}</dd></div>
      </dl>
    </article>
  `).join('');

  $('#evidence-empty').hidden = items.length > 0;
  $('#load-more').hidden = items.length <= state.limit;
}

function setActive(selector, button){
  $$(selector).forEach((b) => {
    b.classList.toggle('active', b === button);
    b.setAttribute('aria-pressed', String(b === button));
  });
}

function resetFilters(){
  state.area='All'; state.system='All'; state.query=''; state.limit=7;
  const areaAll = $('#area-filters [data-filter="All"]');
  const systemAll = $('#system-filters [data-system="All"]');
  if(areaAll) setActive('#area-filters .filter', areaAll);
  if(systemAll) setActive('#system-filters .system-chip', systemAll);
  $('#evidence-search').value='';
  render();
}

fetch(isGerman ? '/assets/data/work-evidence-de.json' : '/assets/data/work-evidence.json')
  .then((r) => {
    if(!r.ok) throw new Error('Could not load evidence');
    return r.json();
  })
  .then((data) => {
    state.data = Array.isArray(data) ? data : [];
    render();
    document.body.classList.add('evidence-ready');
    $('.evidence-toolbar').hidden = false;
    $('#reset-filters').hidden = false;
  })
  .catch(() => {
    $('#evidence-count').textContent = labels.loadError;
  });

$$('#area-filters .filter').forEach((btn) => btn.addEventListener('click', () => {
  state.area = btn.dataset.filter;
  state.limit = 10;
  setActive('#area-filters .filter', btn);
  render();
}));

$$('#system-filters .system-chip').forEach((btn) => btn.addEventListener('click', () => {
  state.system = btn.dataset.system;
  state.limit = 10;
  setActive('#system-filters .system-chip', btn);
  render();
}));

$('#evidence-search').addEventListener('input', (e) => {
  state.query = e.target.value.trim().toLowerCase();
  state.limit = 10;
  render();
});

$('#reset-filters').addEventListener('click', resetFilters);
$('#load-more').addEventListener('click', () => { state.limit += 7; render(); });

document.querySelectorAll('[data-jump-filter]').forEach((link) => {
  link.addEventListener('click', () => {
    const target = link.dataset.jumpFilter;
    setTimeout(() => {
      const button = [...document.querySelectorAll('#area-filters .filter')].find((b) => b.dataset.filter === target);
      if(button) button.click();
    }, 350);
  });
});

/* reveal */
if ('IntersectionObserver' in window) {
document.documentElement.classList.add('js-reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting) entry.target.classList.add('visible');
  });
},{threshold:.08});
$$('.reveal').forEach((el) => observer.observe(el));
}

/* video modal */
const modal = $('#video-modal');
const player = $('#video-modal-player');
const modalTitle = $('#video-modal-title');
let videoTrigger;
const backgroundRegions = $$('body > header, body > main, body > .footer-wrap, body > .skip-link');
let previousInert = [];

function openVideo(src,title){
  videoTrigger = document.activeElement;
  previousInert = backgroundRegions.map((el) => el.inert);
  backgroundRegions.forEach((el) => { el.inert = true; });
  player.src = src;
  modalTitle.textContent = title || 'Video';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  $('.video-modal-close').focus();
  player.play().catch(() => {});
}
function closeVideo(){
  player.pause();
  player.removeAttribute('src');
  player.load();
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
  backgroundRegions.forEach((el, i) => { el.inert = previousInert[i]; });
  videoTrigger?.focus({preventScroll:true});
}
$$('.video-open').forEach((btn) => btn.addEventListener('click', () => openVideo(btn.dataset.video, btn.dataset.title)));
$$('[data-close-video]').forEach((el) => el.addEventListener('click', closeVideo));
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && modal.classList.contains('open')) closeVideo();
  if(e.key === 'Tab' && modal.classList.contains('open')) {
    const focusable = [$('.video-modal-close'), player];
    const first = focusable[0], last = focusable[focusable.length - 1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
});

/* NY slider */
const viewport = $('#ny-slider');
const track = viewport.querySelector('.slider-track');
const slides = [...track.children];
const prev = $('.slider-arrow.prev');
const next = $('.slider-arrow.next');
let slideIndex = 0;
let timer;
const pause = $('.slider-pause');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let paused = reducedMotion.matches;
let hovering = false;

function slideStep(){
  const slide = slides[0];
  if(!slide) return 0;
  return slide.getBoundingClientRect().width + 16;
}
function renderSlider(){
  track.style.transform = `translateX(${-slideIndex * slideStep()}px)`;
}
function go(delta){
  slideIndex = (slideIndex + delta + slides.length) % slides.length;
  renderSlider();
}
prev.addEventListener('click', () => { go(-1); restartSlider(); });
next.addEventListener('click', () => { go(1); restartSlider(); });
window.addEventListener('resize', renderSlider);

function startSlider(){
  clearInterval(timer);
  if (!paused && !hovering && !document.hidden && !$('.slider-shell').contains(document.activeElement)) timer = setInterval(() => go(1), 4500);
}
function restartSlider(){
  clearInterval(timer);
  startSlider();
}
function updatePause(){
  pause.textContent = paused ? labels.resume : labels.pause;
  pause.setAttribute('aria-pressed', String(paused));
}
pause.addEventListener('click', () => { paused = !paused; updatePause(); startSlider(); });
viewport.addEventListener('mouseenter', () => { hovering = true; clearInterval(timer); });
viewport.addEventListener('mouseleave', () => { hovering = false; startSlider(); });
$('.slider-shell').addEventListener('focusin', () => clearInterval(timer));
$('.slider-shell').addEventListener('focusout', () => setTimeout(startSlider, 0));
document.addEventListener('visibilitychange', startSlider);
reducedMotion.addEventListener('change', (e) => { paused=e.matches; updatePause(); startSlider(); });
updatePause(); startSlider();
