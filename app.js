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
  // Stable slots: the active tool is solid; the locked reference is always dotted.
  let selected = readSelection(params, category === 'general' ? 'claude' : '');
  let outlines = params.get('outlines') === '1';
  let viewMode = params.get('view') === 'tendency' ? 'tendency' : 'balanced';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const slots = [];
  let categoryButtons = [];
  let gridOrigins = null;
  let gridRaf = 0;
  let fieldToolId = selected[0];
  let fieldState = null;
  const fieldCorners = [
    {id:'nw',x:120,y:90}, {id:'ne',x:760,y:90},
    {id:'sw',x:120,y:730}, {id:'se',x:760,y:730}
  ];
  const fieldPalette = [[220,231,239],[242,241,243],[229,223,240]];
  const balancedPalette = [[202,223,239],[239,237,245],[218,202,237]];
  function paintField(state) {
    fieldState=state;
    const [ox,oy]=state.origin,gradient=$('agency-gradient');
    // Amplify the diagonal shift, while the four soft corner washes follow the actual origin.
    gradient.setAttribute('gradientTransform',`translate(${(ox-440)*2.5} ${(oy-410)*2.5})`);
    [...gradient.children].forEach((stop,i)=>{
      const rgb=fieldPalette[i].map((value,c)=>Math.round(value+(balancedPalette[i][c]-value)*state.strength));
      stop.setAttribute('stop-color',`rgb(${rgb.join(',')})`);
    });
    $('balanced-field').setAttribute('opacity',state.strength);
    fieldCorners.forEach((corner,i)=>{
      const width=Math.abs(ox-corner.x),height=Math.abs(oy-corner.y);
      $('field-'+corner.id).setAttribute('gradientTransform',`translate(${corner.x} ${corner.y}) scale(${width*1.45} ${height*1.45})`);
      $('wash-'+corner.id).setAttribute('opacity',.025+state.emphasis[i]*.155);
    });
  }
  function readSelection(route, fallback = '') {
    const ids=[...new Set((route.get('tools') ?? fallback).split(','))].filter(id=>byId.get(id)?.category===category).slice(0,2);
    const lockId=route.has('locked')?route.get('locked'):ids[1];
    const locked=byId.get(lockId)?.category===category?lockId:null;
    return [ids.find(id=>id!==locked)||null,locked];
  }
  function syncUrl() {
    const state = new URLSearchParams({ category, tools: selected.filter(Boolean).join(',') });
    if(selected[1])state.set('locked',selected[1]);
    if (outlines) state.set('outlines','1');
    if (viewMode === 'tendency') state.set('view','tendency');
    try { history.replaceState(null, '', '#' + state); } catch { /* file:// may restrict History API in some browsers */ }
  }
  function drawGrid() {
    $('map').classList.toggle('hide-clouds',viewMode==='balanced');
    $('map').closest('.map-panel').classList.toggle('balanced-view',viewMode==='balanced');
    const originFor = center => {
      if(!center) return [440,410];
      const sx=center[0]===0?1:Math.sign(center[0]),sy=center[1]===0?1:Math.sign(center[1]);
      const dx=Math.min(.14,.04+Math.abs(center[0])*.24),dy=Math.min(.14,.04+Math.abs(center[1])*.24);
      return project([-sx*dx,-sy*dy]);
    };
    let origins=[];
    if(viewMode==='balanced') origins=selected.map(id=>id?originFor(byId.get(id).center):null);
    else origins=[[440,410]];
    // Locking freezes the last selection's field; comparison tools never steer its color.
    if(selected[0]||!selected[1])fieldToolId=selected[0];
    const hasField=viewMode==='balanced'&&Boolean(fieldToolId);
    const fieldOrigin=hasField?originFor(byId.get(fieldToolId).center):[440,410];
    const areas=fieldCorners.map(c=>Math.abs(fieldOrigin[0]-c.x)*Math.abs(fieldOrigin[1]-c.y));
    const largest=areas.indexOf(Math.max(...areas));
    const targetField={origin:fieldOrigin,strength:hasField?1:0,emphasis:areas.map((_,i)=>hasField&&i===largest?1:0)};
    const fromField=fieldState||targetField;
    const start=gridOrigins||origins;
    cancelAnimationFrame(gridRaf);
    const paint=(points)=>{
      gridOrigins=points;
      $('grid').replaceChildren();
      points.forEach((point,index)=>{
        if(!point)return;
        const [ox,oy]=point;
        const axisClass='axis-line'+(index===1?' secondary':'');
        $('grid').append(svg('path',{d:`M96 ${oy} H784`,class:axisClass,fill:'none','marker-start':'url(#axis-arrow)','marker-end':'url(#axis-arrow)'}));
        $('grid').append(svg('path',{d:`M${ox} 748 V72`,class:axisClass,fill:'none','marker-start':'url(#axis-arrow)','marker-end':'url(#axis-arrow)'}));
      });
    };
    if(reducedMotion.matches||!gridOrigins){paint(origins);paintField(targetField);$('balanced-field').dataset.motion='idle';return;}
    $('balanced-field').dataset.motion='running';
    const from=origins.map((p,i)=>start[i]||p), began=performance.now();
    const frame=now=>{
      const progress=Math.min(1,(now-began)/650),t=1-(1-progress)**3;
      paint(origins.map((p,i)=>p?G.mix(from[i],p,t):null));
      paintField({origin:G.mix(fromField.origin,targetField.origin,t),strength:fromField.strength+(targetField.strength-fromField.strength)*t,emphasis:fromField.emphasis.map((value,i)=>value+(targetField.emphasis[i]-value)*t)});
      if(progress<1)gridRaf=requestAnimationFrame(frame);
      else $('balanced-field').dataset.motion='idle';
    };
    gridRaf=requestAnimationFrame(frame);
  }
  function drawCategories() {
    $('categories').setAttribute('role','tablist');
    $('category-key-max').textContent=data.categories.length;
    categoryButtons=data.categories.map((c,i)=>{
      const button=el('button','category');button.type='button';button.id='category-'+c.id;
      button.setAttribute('role','tab');button.setAttribute('aria-selected',String(c.id===category));
      button.setAttribute('aria-controls','tool-list');button.tabIndex=c.id===category?0:-1;
      button.append(el('span','',c.name));
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
    category=id;selected=[data.tools.find(t=>t.category===id&&t.status==='active').id,null];
    $('tool-list').scrollTop=0;
    categoryButtons.forEach((b,i)=>{const yes=data.categories[i].id===category;b.setAttribute('aria-selected',String(yes));b.tabIndex=yes?0:-1;});
    render();
  }
  function selectTool(id) {
    if(selected.includes(id))return;
    selected=[id,selected[1]];
    render();
    $('tool-list').querySelector(`[data-tool="${id}"]`)?.focus({preventScroll:true});
  }
  function lockTool(id) {
    if(selected[0]!==id)return;
    // Transfer the current shape without moving the new reference or leaving an old lock behind.
    const active=slots[0],locked=ensureSlot(1);
    cancelAnimationFrame(locked.raf);
    for(const node of [locked.outline,locked.fill,locked.dot])node.getAnimations().forEach(animation=>animation.cancel());
    if(active?.points){paint(locked,active.points,active.center);locked.id=id;}
    if(gridOrigins?.[0])gridOrigins=[null,gridOrigins[0]];
    selected=[null,id];
    render();
    $('tool-list').querySelector(`[data-tool="${id}"]`)?.focus({preventScroll:true});
  }
  function unlockTool(id) {
    if(selected[1]!==id)return;
    selected=[selected[0]||id,null];
    render();
    $('tool-list').querySelector(`[data-tool="${id}"]`)?.focus({preventScroll:true});
  }
  function removeTool(id) { selected=selected.map(value=>value===id?null:value); render(); }
  function clearSelection() { selected=[null,null];render(); }
  function renderTools() {
    const tools=data.tools.filter(t=>t.category===category), container=$('tool-list'), scroll=container.scrollTop;container.replaceChildren();
    container.setAttribute('aria-labelledby','category-'+category);
    $('tool-count').textContent=tools.length+' tools';
    tools.forEach((tool,i)=>{
      const pos=selected.indexOf(tool.id), row=el('div','tool-row'), b=el('button','tool tool-main'+(pos===1?' secondary':''));b.type='button';b.dataset.tool=tool.id;
      b.setAttribute('aria-pressed',String(pos>=0));b.setAttribute('aria-label',tool.name+(tool.status==='active'?'':tool.status==='discontinued'?' — discontinued':' — profile pending'));
      if(tool.logo){const img=el('img');img.src=tool.logo;img.alt='';img.width=22;img.height=22;b.append(img);}else b.append(el('span','logo-spacer'));
      const label=el('span','tool-name',tool.name);
      if(tool.status!=='active')label.append(el('small','',tool.status==='discontinued'?'Discontinued':'Profile pending'));
      const mark=el('span','selection-mark'+(pos===1?' locked':pos===0?' active':''));mark.setAttribute('aria-hidden','true');
      b.append(label,mark);
      b.addEventListener('click',()=>selectTool(tool.id));
      const lock=el('button','lock-tool',pos===1?'Unlock':'Lock on');lock.type='button';lock.hidden=pos<0;
      lock.setAttribute('aria-label',pos===1?'Unlock '+tool.name:'Lock '+tool.name+' as comparison');
      lock.addEventListener('click',()=>pos===1?unlockTool(tool.id):lockTool(tool.id));
      b.addEventListener('keydown',e=>{
        let target;if(e.key==='ArrowDown'||e.key==='ArrowRight')target=(i+1)%tools.length;
        if(e.key==='ArrowUp'||e.key==='ArrowLeft')target=(i+tools.length-1)%tools.length;
        if(e.key==='Home')target=0;if(e.key==='End')target=tools.length-1;
        if(target!=null){e.preventDefault();container.children[target].querySelector('.tool-main')?.focus();}
      });
      row.append(b,lock);container.append(row);
    });
    container.scrollTop=scroll;
  }
  function detail(tool,index) {
    const article=el('article','profile');article.dataset.profile=tool.id;
    article.append(el('span','profile-line'+(index?' secondary':'')));
    const header=el('div','profile-header'),title=el('h2','',tool.name),remove=el('button','remove','×');remove.type='button';remove.setAttribute('aria-label','Remove '+tool.name);remove.addEventListener('click',()=>removeTool(tool.id));header.append(title,remove);article.append(header);
    if(tool.status!=='active')article.append(el('span','profile-status',tool.status==='discontinued'?'Discontinued / historical profile':'Estimated profile'));
    article.append(el('p','profile-summary',tool.summary));
    const details=el('details'),summary=el('summary','','Scores & sources');details.append(summary);
    if(tool.visualScores){
      const scores=el('div','score-grid');for(const direction of G.directions){const cell=el('div','score');cell.append(el('span','',direction),el('b','',String(tool.visualScores[direction])));scores.append(cell);}details.append(scores);
    }
    details.append(el('h3','detail-label','Why this shape'),el('p','',tool.summary),el('h3','detail-label','Workflow'),el('p','',tool.scope),el('h3','detail-label','Boundary'),el('p','',tool.limitation));
    if(tool.evidence&&Object.keys(tool.evidence).length){
      const low=Object.values(tool.evidence).some(e=>e.confidence==='low');
      details.append(el('span','confidence',(low?'Some evidence is provisional. ':'')+'Scores are interpretive judgments.'));
    }
    const sources=el('ul');for(const source of tool.sources){const li=el('li'),a=el('a','',source.title+' ↗');a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';li.append(a);sources.append(li);}details.append(sources);article.append(details);return article;
  }
  function renderReadout() {
    const open=new Set([...$('readout').querySelectorAll('details[open]')].map(d=>d.closest('article').dataset.profile));
    $('readout').replaceChildren();
    $('readout').classList.toggle('comparing',selected.every(Boolean));
    selected.forEach((id,i)=>{if(!id)return;const card=detail(byId.get(id),i);if(open.has(id))card.querySelector('details').open=true;$('readout').append(card);});
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
      slot.group.classList.toggle('tendency-outline',viewMode==='tendency');
      if(slot.id===tool.id){paint(slot,tool.geometry,tool.center);continue;}
      const startPoints=slot.points,startCenter=slot.center;slot.id=tool.id;
      if(reducedMotion.matches){paint(slot,tool.geometry,tool.center);continue;}
      if(!startPoints){
        paint(slot,tool.geometry,tool.center);
        slot.group.dataset.motion='running';
        const frames=index?[{opacity:0},{opacity:1}]:[{strokeDasharray:'1000',strokeDashoffset:1000},{strokeDasharray:'1000',strokeDashoffset:0}];
        const trace=slot.outline.animate(frames,{duration:850,easing:'cubic-bezier(.3,0,.2,1)'});
        trace.onfinish=()=>{slot.group.dataset.motion='idle';};
        slot.fill.animate([{opacity:0},{opacity:1}],{duration:900});slot.dot.animate([{opacity:0},{opacity:1}],{duration:900});
      } else {
        slot.group.dataset.motion='running';
        const start=performance.now();
        const frame=now=>{const progress=Math.min(1,(now-start)/650),t=1-(1-progress)**3;paint(slot,startPoints.map((p,i)=>G.mix(p,tool.geometry[i],t)),G.mix(startCenter,tool.center,t));if(progress<1)slot.raf=requestAnimationFrame(frame);else slot.group.dataset.motion='idle';};
        slot.raf=requestAnimationFrame(frame);
      }
    }
    $('map-description').textContent='Generative to faithful horizontally; undirected to directed vertically. '+selected.map((id,i)=>id?byId.get(id).name+(i?' (locked, dotted)':' (selected, solid)')+': '+byId.get(id).summary:'').filter(Boolean).join(' ');
  }
  function drawOutlines(){
    $('outlines').replaceChildren();$('show-outlines').checked=outlines;
    if(viewMode==='balanced'||!outlines)return;
    for(const tool of data.tools.filter(t=>t.category===category&&t.geometry&&!selected.includes(t.id))){$('outlines').append(svg('path',{d:G.contour(tool.geometry,project).path,class:'faint-outline'}));}
  }
  function render(){renderTools();renderReadout();drawGrid();drawOutlines();drawClouds();syncUrl();}
  function setView(mode){viewMode=mode==='tendency'?'tendency':'balanced';drawGrid();drawOutlines();drawClouds();syncUrl();}
  $('map-view-select').addEventListener('change',e=>setView(e.target.value));
  $('show-outlines').addEventListener('change',e=>{outlines=e.target.checked;drawOutlines();syncUrl();});
  $('clear').addEventListener('click',clearSelection);
  const dialog=$('method-dialog');
  $('method-open').addEventListener('click',()=>dialog.showModal());
  $('method-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  document.addEventListener('keydown',e=>{
    if(dialog.open)return;
    if(e.key==='Escape'){clearSelection();return;}
    if(e.ctrlKey||e.altKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable)return;
    if(/^[1-9]$/.test(e.key)&&Number(e.key)<=data.categories.length){e.preventDefault();changeCategory(data.categories[Number(e.key)-1].id);categoryButtons[Number(e.key)-1].focus();}
  });
  reducedMotion.addEventListener('change',()=>drawClouds());
  window.addEventListener('hashchange',()=>{
    const route=new URLSearchParams(location.hash.slice(1));
    if(!data.categories.some(c=>c.id===route.get('category')))return;
    category=route.get('category');
    selected=readSelection(route);
    fieldToolId=selected[0];
    outlines=route.get('outlines')==='1';
    viewMode=route.get('view')==='tendency'?'tendency':'balanced';
    $('map-view-select').value=viewMode;
    categoryButtons.forEach((b,i)=>{const yes=data.categories[i].id===category;b.setAttribute('aria-selected',String(yes));b.tabIndex=yes?0:-1;});
    render();
  });
  $('map-view-select').value=viewMode;
  drawGrid();$('map').append(document.querySelector('.quadrants'));drawCategories();render();
})();
