
const state = { area:'All', system:'All', query:'', limit:10, data:[] };
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));

function systemMatches(record, system){
  if(system === 'All') return true;
  return String(record.system || '').toLowerCase().includes(system.toLowerCase());
}

function filtered(){
  return state.data.filter((r) => {
    const area = state.area === 'All' || (r.areas || []).includes(state.area);
    const sys = systemMatches(r, state.system);
    const hay = [r.milestone,r.project,r.system,r.problem,r.solution,r.insight,...(r.areas || [])].join(' ').toLowerCase();
    const query = !state.query || hay.includes(state.query);
    return area && sys && query;
  });
}

function badges(record){
  return (record.areas || []).slice(0,4).map((a) => `<span class="area-badge">${escapeHtml(a)}</span>`).join('');
}

function render(){
  const items = filtered();
  const visible = items.slice(0,state.limit);
  $('#evidence-count').textContent = `${items.length} matching work ${items.length === 1 ? 'story' : 'stories'}`;
  $('#evidence-body').innerHTML = visible.map((r) => `
    <tr>
      <td>${escapeHtml(r.milestone)}<div>${badges(r)}</div></td>
      <td><span class="system-badge">${escapeHtml(r.system)}</span></td>
      <td>${escapeHtml(r.problem)}</td>
      <td>${escapeHtml(r.solution)}</td>
      <td>${escapeHtml(r.insight)}</td>
    </tr>
  `).join('');

  $('#evidence-cards').innerHTML = visible.map((r) => `
    <article class="evidence-card">
      <div class="mobile-system">${escapeHtml(r.system)} · ${escapeHtml(r.project)}</div>
      <h3>${escapeHtml(r.milestone)}</h3>
      <div>${badges(r)}</div>
      <dl>
        <div><dt>Problem</dt><dd>${escapeHtml(r.problem)}</dd></div>
        <div><dt>What I did</dt><dd>${escapeHtml(r.solution)}</dd></div>
        <div><dt>What I learned</dt><dd>${escapeHtml(r.insight)}</dd></div>
      </dl>
    </article>
  `).join('');

  $('#evidence-empty').hidden = items.length > 0;
  $('#load-more').hidden = items.length <= state.limit;
}

function setActive(selector, button){
  $$(selector).forEach((b) => b.classList.toggle('active', b === button));
}

function resetFilters(){
  state.area='All'; state.system='All'; state.query=''; state.limit=10;
  const areaAll = $('#area-filters [data-filter="All"]');
  const systemAll = $('#system-filters [data-system="All"]');
  if(areaAll) setActive('#area-filters .filter', areaAll);
  if(systemAll) setActive('#system-filters .system-chip', systemAll);
  $('#evidence-search').value='';
  render();
}

fetch('assets/data/work-evidence.json')
  .then((r) => {
    if(!r.ok) throw new Error('Could not load evidence');
    return r.json();
  })
  .then((data) => {
    state.data = Array.isArray(data) ? data : [];
    render();
  })
  .catch(() => {
    $('#evidence-count').textContent = 'Evidence could not be loaded. Please refresh the page.';
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
$('#load-more').addEventListener('click', () => { state.limit += 10; render(); });

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
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting) entry.target.classList.add('visible');
  });
},{threshold:.08});
$$('.reveal').forEach((el) => observer.observe(el));

/* video modal */
const modal = $('#video-modal');
const player = $('#video-modal-player');
const modalTitle = $('#video-modal-title');

function openVideo(src,title){
  player.src = src;
  modalTitle.textContent = title || 'Video';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  player.play().catch(() => {});
}
function closeVideo(){
  player.pause();
  player.removeAttribute('src');
  player.load();
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}
$$('.video-open').forEach((btn) => btn.addEventListener('click', () => openVideo(btn.dataset.video, btn.dataset.title)));
$$('[data-close-video]').forEach((el) => el.addEventListener('click', closeVideo));
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && modal.classList.contains('open')) closeVideo();
});

/* NY slider */
const viewport = $('#ny-slider');
const track = viewport.querySelector('.slider-track');
const slides = [...track.children];
const prev = $('.slider-arrow.prev');
const next = $('.slider-arrow.next');
let slideIndex = 0;
let timer;

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
  timer = setInterval(() => go(1), 4500);
}
function restartSlider(){
  clearInterval(timer);
  startSlider();
}
startSlider();
viewport.addEventListener('mouseenter', () => clearInterval(timer));
viewport.addEventListener('mouseleave', startSlider);
