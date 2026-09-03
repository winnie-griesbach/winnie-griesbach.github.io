
const state={area:'All',system:'All',query:'',limit:10,data:[]};
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function systemMatches(record, system){if(system==='All')return true; return record.system.toLowerCase().includes(system.toLowerCase())}
function filtered(){return state.data.filter(r=>{const area=state.area==='All'||r.areas.includes(state.area);const sys=systemMatches(r,state.system);const hay=[r.milestone,r.project,r.system,r.problem,r.solution,r.insight,...r.areas].join(' ').toLowerCase();return area&&sys&&(!state.query||hay.includes(state.query));});}
function badges(record){return record.areas.slice(0,4).map(a=>`<span class="area-badge">${escapeHtml(a)}</span>`).join('')}
function render(){const items=filtered();const visible=items.slice(0,state.limit);$('#evidence-count').textContent=`${items.length} matching work ${items.length===1?'story':'stories'}`;$('#evidence-total').textContent=`${state.data.length}`;$('#evidence-body').innerHTML=visible.map(r=>`<tr><td>${escapeHtml(r.milestone)}<div>${badges(r)}</div></td><td><span class="system-badge">${escapeHtml(r.system)}</span></td><td>${escapeHtml(r.problem)}</td><td>${escapeHtml(r.solution)}</td><td>${escapeHtml(r.insight)}</td></tr>`).join('');$('#evidence-cards').innerHTML=visible.map(r=>`<article class="evidence-card"><div class="mobile-system">${escapeHtml(r.system)} · ${escapeHtml(r.project)}</div><h3>${escapeHtml(r.milestone)}</h3><div>${badges(r)}</div><dl><div><dt>Problem</dt><dd>${escapeHtml(r.problem)}</dd></div><div><dt>What I did</dt><dd>${escapeHtml(r.solution)}</dd></div><div><dt>What I learned</dt><dd>${escapeHtml(r.insight)}</dd></div></dl></article>`).join('');$('#evidence-empty').hidden=items.length>0;$('#load-more').hidden=items.length<=state.limit;}
function reset(){state.area='All';state.system='All';state.query='';state.limit=10;$$('.filter').forEach((b,i)=>b.classList.toggle('active',i===0));$$('.system-chip').forEach((b,i)=>b.classList.toggle('active',i===0));$('#evidence-search').value='';render();}
fetch('assets/data/work-evidence.json').then(r=>{if(!r.ok)throw new Error('Could not load evidence');return r.json()}).then(data=>{state.data=data;render()}).catch(()=>{$('#evidence-count').textContent='Evidence could not be loaded. Please refresh the page.'});
$$('.filter').forEach(btn=>btn.addEventListener('click',()=>{state.area=btn.dataset.filter;state.limit=10;$$('.filter').forEach(b=>b.classList.toggle('active',b===btn));render()}));
$$('.system-chip').forEach(btn=>btn.addEventListener('click',()=>{state.system=btn.dataset.system;state.limit=10;$$('.system-chip').forEach(b=>b.classList.toggle('active',b===btn));render()}));
$('#evidence-search').addEventListener('input',e=>{state.query=e.target.value.trim().toLowerCase();state.limit=10;render()});
$('#reset-filters').addEventListener('click',reset);$('#load-more').addEventListener('click',()=>{state.limit+=10;render()});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});$$('.reveal').forEach(el=>observer.observe(el));


document.querySelectorAll('[data-jump-filter]').forEach(link => {
  link.addEventListener('click', () => {
    const target = link.dataset.jumpFilter;
    setTimeout(() => {
      const button = [...document.querySelectorAll('#area-filters .filter')].find(b => b.dataset.filter === target);
      if (button) button.click();
    }, 350);
  });
});
