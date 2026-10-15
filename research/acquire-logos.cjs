// Fetch public brand icons for local, offline display. Never executes remote code.
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const sites = {
 elicit:'https://elicit.com', consensus:'https://consensus.app', scite:'https://scite.ai', researchrabbit:'https://www.researchrabbit.ai', gamma:'https://gamma.app', 'canva-ai':'https://www.canva.com', magnific:'https://www.magnific.com', vizcom:'https://www.vizcom.ai', newarc:'https://www.newarc.ai', clo:'https://www.clo3d.com', emergent:'https://emergent.sh', bolt:'https://bolt.new', blotato:'https://www.blotato.com', higgsfield:'https://higgsfield.ai', 'figma-weave':'https://www.weavy.ai', leonardo:'https://leonardo.ai', openart:'https://openart.ai', 'ltx-studio':'https://ltx.io/studio', 'google-flow':'https://flow.google.com'
};
const attr = (s,n) => s.match(new RegExp('\\b'+n+'=["\x27]([^"\x27]+)["\x27]','i'))?.[1];
async function get(url) { const r = await fetch(url, {signal:AbortSignal.timeout(18000),headers:{'User-Agent':'Mozilla/5.0'}}); if(!r.ok)throw Error(r.status);return r; }
async function icon(id,site){
 try {
  const page=await get(site),html=await page.text();
  const candidates=[...html.matchAll(/<link\b[^>]+>/gi)].map(m=>({tag:m[0],rel:attr(m[0],'rel'),href:attr(m[0],'href')})).filter(x=>x.href&&/icon/i.test(x.rel||'')).sort((a,b)=>Number(b.href.includes('.svg'))-Number(a.href.includes('.svg')));
  fs.writeFileSync(path.join(__dirname,`brand-${id}.html`),html);
  for(const c of candidates){
   try{
    const url=new URL(c.href.replaceAll('&amp;','&'),page.url).href;
    const r=await get(url),type=r.headers.get('content-type')||'',bytes=Buffer.from(await r.arrayBuffer());
    const ext=type.includes('svg')?'svg':type.includes('png')?'png':type.includes('webp')?'webp':type.includes('icon')?'ico':null;
    if(!ext||bytes.length>300000)continue;
    const file=`logos/${id}.${ext}`;fs.writeFileSync(path.join(root,file),bytes);
    return {id,file,url,site,kind:'Official website icon'};
   }catch{}
  }
  return {id,site,error:'No downloadable icon',candidates:candidates.map(c=>c.href)};
 }catch(e){return {id,site,error:e.message};}
}
(async()=>{const results=[];for(let i=0;i<Object.entries(sites).length;i+=4){results.push(...await Promise.all(Object.entries(sites).slice(i,i+4).map(([id,url])=>icon(id,url))));}fs.writeFileSync(path.join(__dirname,'logo-acquisition.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));})();
