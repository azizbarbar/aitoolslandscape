const fs=require('node:fs');const d=require('../scores.json');
const s=d.tools.find(t=>t.id==='sora'),dirs=d.directions;
Object.assign(s,{historical:true,summary:'A historical video cloud: cinematic invention and prompted motion, with a narrower reach for exact preservation.',scope:'Historical Sora 2 app workflow before discontinuation: prompted video/audio, remixing and character references.',limitation:'Discontinued. This cloud describes its former workflow and is an editorial reconstruction, not a currently available service.',baseScores:{N:2.75,NE:1.5,E:2,SE:1.5,S:3.25,SW:3.25,W:4,NW:2.5},baseCenter:[-.35,-.27],center:[-.35,-.27]});
s.visualScores={...s.baseScores};
s.sources=s.sources.filter(x=>x.id!=='sora-history');s.sources.push({id:'sora-history',title:'Sora 2 launch and capabilities',url:'https://openai.com/index/sora-2/',checked:'2026-10-15',finding:'Historical description of video/audio generation, multi-shot prompting, remixing and character references. The page now notes discontinuation.'});
s.centerEvidence={claim:'Historical prompt-and-remix workflow emphasizes generative scene proposals.',sourceIds:['sora-history'],confidence:'low',inferred:true};
const claims=['Prompts directed shots and motion with imperfect control.','Character references could be combined with scene instructions.','References retained some appearance without exact reconstruction.','Source characters could seed alternative scenes.','Briefs and remixes invited creative scene directions.','Novel scenes and motion dominated the generative workflow.','Video and audio generation supplied broad invention.','Multi-shot instructions guided novel cinematic output.'];
s.evidence=Object.fromEntries(dirs.map((x,i)=>[x,{claim:claims[i],sourceIds:['sora-history'],confidence:'low',inferred:true}]));
const marks={
 scite:'<text x="12" y="21" text-anchor="middle" font-family="Georgia,serif" font-size="27" font-weight="bold">s</text><circle cx="21" cy="4" r="2"/>',
 gamma:'<text x="12" y="22" text-anchor="middle" font-family="Arial,sans-serif" font-size="27" font-weight="bold">G</text>',
 newarc:'<path d="M4 22V3h4l12 16V3h4v23h-4L8 10v12z"/>',
 leonardo:'<text x="12" y="23" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="29">L</text>',
 'ltx-studio':'<text x="14" y="19" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="900" letter-spacing="-1">LTX</text>'
};
for(const [id,mark] of Object.entries(marks)){fs.writeFileSync('logos/'+id+'.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="#111">'+mark+'</svg>\n');d.tools.find(t=>t.id===id).logo='logos/'+id+'.svg';}
fs.writeFileSync('scores.json',JSON.stringify(d,null,2)+'\n');
