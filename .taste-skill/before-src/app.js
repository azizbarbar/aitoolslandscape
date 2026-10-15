(() => {
  'use strict';
  const data = window.DELEGATION_DATA;
  const G = window.MapGeometry;
  const $ = id => document.getElementById(id);
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const svg = (tag, attrs = {}) => { const n = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const [k,v] of Object.entries(attrs)) n.setAttribute(k,v); return n; };
  const project = p => [440 + p[0] * 320, 410 - p[1] * 320];
  const byId = new Map(data.tools.map(t => [t.id, t]));
  const params = new URLSearchParams(location.hash.slice(1));
  let category = data.categories.some(c => c.id === params.get('category')) ? params.get('category') : 'general';
  let selected = (params.get('tools') || (category === 'general' ? 'claude' : '')).split(',').filter(id => byId.get(id)?.category === category).slice(0,2);
  let outlines = params.get('outlines') === '1';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const slots = [];
  let categoryButtons = [];
  function syncUrl() {
    const state = new URLSearchParams({ category, tools: selected.join(',') });
    if (outlines) state.set('outlines','1');
    try { history.replaceState(null, '', '#' + state); } catch { /* file:// may restrict History API in some browsers */ }
  }
  function drawGrid() {
    const grid = $('grid');
    grid.append(svg('rect',{x:120,y:90,width:640,height:640,class:'grid-border'}));
    for(let n=-4;n<=4;n++) {
      const v=n/4, x=440+v*320, y=410-v*320;
      if(n !== 0 && Math.abs(n)!==4) {
        grid.append(svg('line',{x1:x,y1:90,x2:x,y2:730,class:'grid-line'}));
        grid.append(svg('line',{x1:120,y1:y,x2:760,y2:y,class:'grid-line'}));
      }
      grid.append(svg('line',{x1:x,y1:405,x2:x,y2:415,class:'tick'}));
      grid.append(svg('line',{x1:435,y1:y,x2:445,y2:y,class:'tick'}));
      if(n % 2 === 0) {
        const text= v===0 ? '0' : v>0 ? '+'+v : String(v).replace('-','−');
        const tx=svg('text',{x,y:752,'text-anchor':'middle',class:'coordinate'});tx.textContent=text;grid.append(tx);
        if(n !== 0) {const ty=svg('text',{x:108,y:y+4,'text-anchor':'end',class:'coordinate'});ty.textContent=text;grid.append(ty);}
      }
    }
    grid.append(svg('path',{d:'M120 410 H760 M440 90 V730',class:'axis-line',fill:'none'}));
  }
  function drawCategories() {
    $('categories').setAttribute('role','tablist');
    $('category-key-max').textContent=data.categories.length;
    categoryButtons=data.categories.map((c,i)=>{
      const button=el('button','category');button.type='button';button.id='category-'+c.id;
      button.setAttribute('role','tab');button.setAttribute('aria-selected',String(c.id===category));
      button.setAttribute('aria-controls','tool-list');button.tabIndex=c.id===category?0:-1;
      button.append(el('span','category-number',String(i+1).padStart(2,'0')),el('span','',c.name));
      button.addEventListener('click',()=>changeCategory(c.id));
      button.addEventListener('keydown',e=>{
        let next;
        if(['ArrowRight','ArrowDown'].includes(e.key))next=(i+1)%data.categories.length;
        if(['ArrowLeft','ArrowUp'].includes(e.key))next=(i+data.categories.length-1)%data.categories.length;
        if(e.key==='Home')next=0;if(e.key==='End')next=data.categories.length-1;
        if(next!=null){e.preventDefault();changeCategory(data.categories[next].id);categoryButtons[next].focus();}
      });
      $('categories').append(button);return button;
    });
  }
  function changeCategory(id) {
    if(category===id)return;
    category=id;selected=[data.tools.find(t=>t.category===id&&t.status==='active').id];
    $('tool-list').scrollTop=0;
    categoryButtons.forEach((b,i)=>{const yes=data.categories[i].id===category;b.setAttribute('aria-selected',String(yes));b.tabIndex=yes?0:-1;});
    render();
  }
  function toggleTool(id) {
    if(selected.includes(id)) selected=selected.filter(x=>x!==id);
    else if(selected.length<2) selected.push(id);
    else selected=[selected[0],id];
    render();
    $('tool-list').querySelector(`[data-tool="${id}"]`)?.focus({preventScroll:true});
  }
  function renderTools() {
    const tools=data.tools.filter(t=>t.category===category), container=$('tool-list'), scroll=container.scrollTop;container.replaceChildren();
    container.setAttribute('aria-labelledby','category-'+category);
    $('tool-count').textContent=String(tools.length).padStart(2,'0');
    tools.forEach((tool,i)=>{
      const pos=selected.indexOf(tool.id), b=el('button','tool'+(pos===1?' secondary':''));b.type='button';b.dataset.tool=tool.id;
      b.setAttribute('aria-pressed',String(pos>=0));b.setAttribute('aria-label',tool.name+(tool.status==='active'?'':tool.status==='discontinued'?' — discontinued':' — profile pending'));
      if(tool.logo){const img=el('img');img.src=tool.logo;img.alt='';img.width=22;img.height=22;b.append(img);}else b.append(el('span','logo-spacer'));
      const label=el('span','tool-name',tool.name);
      if(tool.status!=='active')label.append(el('small','',tool.status==='discontinued'?'Discontinued':'Profile pending'));
      b.append(label,el('span','selection-mark',pos>=0?String(pos+1):'+'));
      b.addEventListener('click',()=>toggleTool(tool.id));
      b.addEventListener('keydown',e=>{
        let target;if(e.key==='ArrowDown'||e.key==='ArrowRight')target=(i+1)%tools.length;
        if(e.key==='ArrowUp'||e.key==='ArrowLeft')target=(i+tools.length-1)%tools.length;
        if(e.key==='Home')target=0;if(e.key==='End')target=tools.length-1;
        if(target!=null){e.preventDefault();container.children[target].focus();}
      });
      container.append(b);
    });
    container.scrollTop=scroll;
  }
  function detail(tool,index) {
    const article=el('article','profile');article.dataset.profile=tool.id;
    article.append(el('span','profile-line'+(index?' secondary':'')));
    const header=el('div','profile-header'),title=el('h2','',tool.name),remove=el('button','remove','×');remove.type='button';remove.setAttribute('aria-label','Remove '+tool.name);remove.addEventListener('click',()=>toggleTool(tool.id));header.append(title,remove);article.append(header);
    if(tool.status!=='active')article.append(el('span','profile-status',tool.status==='discontinued'?'Discontinued / historical profile':'Estimated profile'));
    article.append(el('p','profile-summary',tool.summary));
    const details=el('details'),summary=el('summary','','Scores & sources');details.append(summary);
    if(tool.visualScores){
      const scores=el('div','score-grid');for(const direction of G.directions){const cell=el('div','score');cell.append(el('span','',direction),el('b','',String(tool.visualScores[direction])));scores.append(cell);}details.append(scores);
    }
    details.append(el('p','detail-label','Why this shape'),el('p','',tool.summary),el('p','detail-label','Workflow'),el('p','',tool.scope),el('p','detail-label','Boundary'),el('p','',tool.limitation));
    if(tool.evidence&&Object.keys(tool.evidence).length){
      const low=Object.values(tool.evidence).some(e=>e.confidence==='low');
      details.append(el('span','confidence',(low?'Some evidence is provisional. ':'')+'Scores are interpretive judgments.'));
    }
    const sources=el('ul');for(const source of tool.sources){const li=el('li'),a=el('a','',source.title+' ↗');a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';li.append(a);sources.append(li);}details.append(sources);article.append(details);return article;
  }
  function renderReadout() {
    const open=new Set([...$('readout').querySelectorAll('details[open]')].map(d=>d.closest('article').dataset.profile));
    $('readout').replaceChildren();
    $('readout').classList.toggle('comparing',selected.length===2);
    selected.forEach((id,i)=>{const card=detail(byId.get(id),i);if(open.has(id))card.querySelector('details').open=true;$('readout').append(card);});
  }
  function ensureSlot(index) {
    if(slots[index])return slots[index];
    const group=svg('g',{'data-cloud-slot':index,'data-motion':'idle'}),base=svg('path',{class:'cloud-base'}),fill=svg('path',{fill:index?'url(#dither-secondary)':'url(#dither-primary)'}),outline=svg('path',{class:'cloud-outline'+(index?' secondary':''),pathLength:1000});
    group.append(base,fill,outline);$('clouds').append(group);
    const dot=svg('g',{class:'cloud-dot'+(index?' secondary':'')});dot.append(svg('circle',{r:5}),svg('path',{d:'M-9 0h4 M5 0h4 M0 -9v4 M0 5v4',fill:'none'}));$('dots').append(dot);
    return slots[index]={group,base,fill,outline,dot,points:null,center:null,id:null,raf:0};
  }
  function paint(slot,points,center) {
    const d=G.contour(points,project).path;for(const p of [slot.base,slot.fill,slot.outline])p.setAttribute('d',d);
    const [x,y]=project(center);slot.dot.setAttribute('transform',`translate(${x} ${y})`);slot.points=points;slot.center=center;
  }
  function drawClouds() {
    for(let index=0;index<2;index++){
      const slot=ensureSlot(index),tool=selected[index]?byId.get(selected[index]):null;
      cancelAnimationFrame(slot.raf);
      slot.group.dataset.motion='idle';
      if(!tool?.geometry){slot.group.style.display='none';slot.dot.style.display='none';slot.id=null;slot.points=null;continue;}
      slot.group.style.display='';slot.dot.style.display='';slot.group.setAttribute('aria-label',tool.name+' cloud');
      if(slot.id===tool.id){paint(slot,tool.geometry,tool.center);continue;}
      const startPoints=slot.points,startCenter=slot.center;slot.id=tool.id;
      if(reducedMotion.matches){paint(slot,tool.geometry,tool.center);continue;}
      if(!startPoints){
        paint(slot,tool.geometry,tool.center);
        slot.group.dataset.motion='running';
        const trace=slot.outline.animate([{strokeDasharray:'1000',strokeDashoffset:1000},{strokeDasharray:'1000',strokeDashoffset:0}],{duration:850,easing:'cubic-bezier(.3,0,.2,1)'});
        trace.onfinish=()=>{slot.group.dataset.motion='idle';};
        slot.fill.animate([{opacity:0},{opacity:1}],{duration:900});slot.dot.animate([{opacity:0},{opacity:1}],{duration:900});
      } else {
        slot.group.dataset.motion='running';
        const start=performance.now();
        const frame=now=>{const progress=Math.min(1,(now-start)/650),t=1-(1-progress)**3;paint(slot,startPoints.map((p,i)=>G.mix(p,tool.geometry[i],t)),G.mix(startCenter,tool.center,t));if(progress<1)slot.raf=requestAnimationFrame(frame);else slot.group.dataset.motion='idle';};
        slot.raf=requestAnimationFrame(frame);
      }
    }
    $('map-description').textContent='Generative to faithful horizontally; proposes directions to executes my decisions vertically. '+selected.map(id=>byId.get(id).name+': '+byId.get(id).summary).join(' ');
  }
  function drawOutlines(){
    $('outlines').replaceChildren();$('show-outlines').checked=outlines;if(!outlines)return;
    for(const tool of data.tools.filter(t=>t.category===category&&t.geometry&&!selected.includes(t.id))){$('outlines').append(svg('path',{d:G.contour(tool.geometry,project).path,class:'faint-outline'}));}
  }
  function render(){renderTools();renderReadout();drawOutlines();drawClouds();syncUrl();}
  $('show-outlines').addEventListener('change',e=>{outlines=e.target.checked;drawOutlines();syncUrl();});
  $('clear').addEventListener('click',()=>{selected=[];render();});
  const dialog=$('method-dialog');
  $('method-open').addEventListener('click',()=>dialog.showModal());
  $('method-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  document.addEventListener('keydown',e=>{
    if(dialog.open)return;
    if(e.key==='Escape'){selected=[];render();return;}
    if(e.ctrlKey||e.altKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable)return;
    if(/^[1-9]$/.test(e.key)&&Number(e.key)<=data.categories.length){e.preventDefault();changeCategory(data.categories[Number(e.key)-1].id);categoryButtons[Number(e.key)-1].focus();}
  });
  reducedMotion.addEventListener('change',()=>drawClouds());
  window.addEventListener('hashchange',()=>{
    const route=new URLSearchParams(location.hash.slice(1));
    if(!data.categories.some(c=>c.id===route.get('category')))return;
    category=route.get('category');
    selected=(route.get('tools')||'').split(',').filter(id=>byId.get(id)?.category===category).slice(0,2);
    outlines=route.get('outlines')==='1';
    categoryButtons.forEach((b,i)=>{const yes=data.categories[i].id===category;b.setAttribute('aria-selected',String(yes));b.tabIndex=yes?0:-1;});
    render();
  });
  drawGrid();$('map').append(document.querySelector('.quadrants'));drawCategories();render();
})();
