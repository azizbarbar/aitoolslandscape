const fs = require('node:fs');
const path = require('node:path');
const geo = require('../geometry.js');
const tools = ['anchor-midjourney.json','anchor-research.json','anchor-code.json','anchor-claude.json'].flatMap(f => {
  const item = JSON.parse(fs.readFileSync(path.join(__dirname,f),'utf8')); return Array.isArray(item) ? item : [item];
}).map(t => ({...t,name:t.name.split(' · ')[0]}));
let report = '# Anchor calibration\n\nInterpretive baseline before category expansion. Full per-direction evidence is retained in the anchor JSON files.\n\n| Tool | N | NE | E | SE | S | SW | W | NW | Default x, y |\n|---|---|---|---|---|---|---|---|---|---|\n';
for(const t of tools) report += `| ${t.name} | ${geo.directions.map(d=>t.baseScores[d]).join(' | ')} | ${t.baseCenter.join(', ')} |\n`;
for(const t of tools) report += `\n## ${t.name}\n\n${t.summary}\n\nScope: ${t.scope}\n\nLimit: ${t.limitation}\n\n${t.sources.map(s=>`- [${s.title}](${s.url})`).join('\n')}\n`;
fs.writeFileSync(path.join(__dirname,'anchor-calibration.md'), report);
let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 1500 400"><rect width="1500" height="400" fill="white"/><style>text{font-family:monospace;fill:#111} .title{font-size:16px}</style>';
tools.forEach((t,i)=>{
  const x=i*300+30,y=80,sz=240,project=p=>[x+(p[0]+1)*sz/2,y+(1-p[1])*sz/2];
  svg+=`<text x="${x}" y="34" class="title">${t.name.replace(' / Gemini Notebook','')}</text><rect x="${x}" y="${y}" width="${sz}" height="120" fill="#694191" opacity=".05"/><rect x="${x}" y="${y+120}" width="${sz}" height="120" fill="#0365af" opacity=".05"/><path d="M${x} ${y+120}h240 M${x+120} ${y}v240" stroke="#999" fill="none"/><path d="${geo.contour(geo.derive(t.baseScores,t.baseCenter),project).path}" fill="#111" fill-opacity=".1" stroke="#111" stroke-width="1.5"/><circle cx="${project(t.baseCenter)[0]}" cy="${project(t.baseCenter)[1]}" r="3" fill="#111"/><text x="${x}" y="350" font-size="12">${geo.directions.map(d=>t.baseScores[d]).join(' / ')}</text>`;
});
fs.writeFileSync(path.join(__dirname,'anchor-shapes.svg'),svg+'</svg>');
console.log('Anchor report and shape sheet saved.');
