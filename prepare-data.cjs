'use strict';
// scores.json is the editable source of truth. Research files retain provenance.
const fs=require('node:fs'),path=require('node:path'),geo=require('./geometry.js');
const file=name=>path.join(__dirname,name);
const data=JSON.parse(fs.readFileSync(file('scores.json'),'utf8'));
fs.writeFileSync(file('roster.json'),JSON.stringify({source:'../../day-1-research/02-tool-landscape-matrix.md',amendment:'Grok and Meta AI plus 14 Multi-Model Platform profiles requested by the user. Shared brands have distinct workflow profiles. No Llama.',tools:data.tools.map(t=>({name:t.name,category:t.category,id:t.id}))},null,2)+'\n');
if(!process.argv.includes('--roster-only')){
 data.tools.forEach(t=>{t.geometry=geo.derive(t.visualScores,t.center);});
 fs.writeFileSync(file('scores.json'),JSON.stringify(data,null,2)+'\n');
 fs.writeFileSync(file('data.js'),'window.DELEGATION_DATA = '+JSON.stringify(data)+';\n');
 console.log(`Prepared ${data.tools.length} profiles in ${data.categories.length} categories.`);
}
