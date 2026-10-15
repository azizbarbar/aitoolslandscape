'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const geo = require('./geometry.js');
const read = name => JSON.parse(fs.readFileSync(path.join(__dirname, name), 'utf8'));
const data = read('scores.json');
const roster = read('roster.json').tools;
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8'), context);
assert.equal(JSON.stringify(context.window.DELEGATION_DATA), JSON.stringify(data), 'Browser data differs from editable JSON');
const ids = new Set();
const quarter = x => Number.isFinite(x) && x >= 0 && x <= 4 && Math.abs(x * 4 - Math.round(x * 4)) < 1e-9;
const caps = { NE: ['N', 'E'], SE: ['S', 'E'], SW: ['S', 'W'], NW: ['N', 'W'] };
// Independent numeric fixture checks the coordinate convention, not just regeneration parity.
const fixture = geo.derive({N:3,NE:1,E:2,SE:.5,S:1,SW:1,W:4,NW:2},[.1,.2]);
const expected = [[.1,.75],[.2,.3375],[.5,.2],[.15,.14375],[.1,-.25],[-.175,.0875],[-1,.2],[-.45,.475]];
fixture.forEach((p,i)=>p.forEach((v,k)=>assert(Math.abs(v-expected[i][k])<1e-9,'Independent geometry fixture')));
assert.equal(data.tools.length, roster.length, 'Roster count');
assert.deepEqual(data.categories.map(c => c.id), ['general', 'research', 'design', 'builders', 'platforms']);
function evidence(entry, sourceIds, label) {
  assert(entry && typeof entry.claim === 'string' && entry.claim.length > 8, `${label}: claim`);
  assert(['high', 'medium', 'low'].includes(entry.confidence), `${label}: confidence`);
  assert.equal(typeof entry.inferred, 'boolean', `${label}: inferred classification`);
  assert(entry.sourceIds?.length > 0, `${label}: sources missing`);
  for (const id of entry.sourceIds) assert(sourceIds.has(id), `${label}: missing source ${id}`);
}
data.tools.forEach((tool, index) => {
  const label = tool.name;
  assert.equal(tool.name, roster[index].name, `Inventory name ${index}`);
  assert.equal(tool.category, roster[index].category, `${label}: category`);
  assert(!ids.has(tool.id), `Duplicate ${tool.id}`); ids.add(tool.id);
  assert(tool.scope && tool.summary && tool.limitation, `${label}: descriptive content`);
  const sourceIds = new Set(tool.sources.map(s => s.id));
  for (const s of tool.sources) {
    assert(/^https:\/\//.test(s.url) && s.title && s.finding, `${label}: source metadata`);
  }
  if (tool.status !== 'active') {
    assert.equal(tool.status, 'discontinued');
    assert(tool.historical && tool.statusEvidence && tool.sources.length, `${label}: historical status evidence`);
  }
  evidence(tool.centerEvidence, sourceIds, `${label} center`);
  for (const dir of geo.directions) {
    assert(quarter(tool.baseScores[dir]), `${label} ${dir}: base quarter-point score`);
    assert(quarter(tool.visualScores[dir]), `${label} ${dir}: visual quarter-point score`);
    assert(Math.abs(tool.visualScores[dir] - tool.baseScores[dir]) <= 0.5 + 1e-9, `${label} ${dir}: editorial limit`);
    evidence(tool.evidence[dir], sourceIds, `${label} ${dir}`);
    if (tool.visualScores[dir] !== tool.baseScores[dir]) assert(tool.adjustments.some(a => a.field === dir && a.from === tool.baseScores[dir] && a.to === tool.visualScores[dir] && a.reason), `${label} ${dir}: adjustment log`);
  }
  for (const scores of [tool.baseScores, tool.visualScores]) for (const [d, adjacent] of Object.entries(caps)) assert(scores[d] <= Math.min(...adjacent.map(k => scores[k])), `${label} ${d}: diagonal cap`);
  for (let k = 0; k < 2; k++) {
    assert(Number.isFinite(tool.center[k]) && Number.isFinite(tool.baseCenter[k]));
    assert(Math.abs(tool.center[k] - tool.baseCenter[k]) <= .100000001, `${label}: center adjustment`);
  }
  for (const [scores, center] of [[tool.baseScores, tool.baseCenter], [tool.visualScores, tool.center]]) {
    assert(center[0] >= -scores.W / 4 && center[0] <= scores.E / 4, `${label}: center x`);
    assert(center[1] >= -scores.S / 4 && center[1] <= scores.N / 4, `${label}: center y`);
  }
  const derived = geo.derive(tool.visualScores, tool.center);
  assert.equal(tool.geometry.length, 8);
  derived.forEach((p, i) => p.forEach((v, k) => assert(Math.abs(v - tool.geometry[i][k]) <= 1e-9, `${label}: geometry mismatch`)));
  assert(!geo.selfIntersects(derived), `${label}: crossing polygon`);
  const curve = geo.contour(derived);
  assert(!geo.selfIntersects(curve.samples), `${label}: crossing curve`);
  assert(curve.samples.every(p => geo.contains(derived, p)), `${label}: curve exceeds envelope`);
  assert(tool.logo && fs.existsSync(path.join(__dirname, tool.logo)), `${label}: missing logo`);
});
// Verify the source inventory independently rather than merely trusting roster.json.
const matrix = fs.readFileSync(path.join(__dirname, '../../day-1-research/02-tool-landscape-matrix.md'), 'utf8');
const matrixNames = [...matrix.matchAll(/^\| ([^|]+?) · /gm)].map(m => m[1].trim());
assert.equal(matrixNames.length, 42);
const platformNames=['Magnific','Higgsfield','Krea','Adobe Firefly','ComfyUI','Figma Weave','FLORA','Leonardo','OpenArt','LTX Studio','Lovart','Google Flow','fal','Replicate'];
assert.deepEqual(data.tools.filter(t=>t.category==='platforms').map(t=>t.name),platformNames);
assert.deepEqual([...data.tools.map(t => t.name)].sort(), [...matrixNames, 'Grok', 'Meta AI', ...platformNames].sort());
const rabbit=data.tools.find(t=>t.id==='researchrabbit');
assert(geo.contour(rabbit.geometry).samples.every(p=>p[0]>=rabbit.center[0]-1e-9),'Zero-area ResearchRabbit spur must be removed');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(!/<(?:script|link|img)[^>]+(?:src|href)=["']https?:/i.test(html), 'External runtime asset');
for (const file of ['app.js', 'geometry.js', 'style.css']) assert(!/\bfetch\s*\(|@import\s+url/.test(fs.readFileSync(path.join(__dirname, file), 'utf8')), `Runtime network code in ${file}`);
assert.equal(fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8').trim().split(/\r?\n/).length, 5, 'README must have five lines');
console.log(`PASS: ${data.tools.length} unique profiles in 5 categories; all logos and clouds, sources, scoring, editorial bounds, geometry, curves, offline assets, and data parity.`);
