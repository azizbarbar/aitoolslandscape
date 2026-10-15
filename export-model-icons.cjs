const fs = require('fs');
const path = require('path');

const root = __dirname;
const source = path.join(root, 'data.js');
const outDir = path.join(root, 'model-icons');
const raw = fs.readFileSync(source, 'utf8');
const data = JSON.parse(raw.replace(/^window\.DELEGATION_DATA\s*=\s*/, '').replace(/;\s*$/, ''));

fs.mkdirSync(outDir, { recursive: true });
const used = new Set();
for (const tool of data.tools) {
  const logoRef = tool.logo;
  const input = path.join(root, logoRef);
  if (!fs.existsSync(input)) continue;
  const ext = path.extname(input).toLowerCase() || '.png';
  const base = tool.name
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  let filename = `${base}${ext}`;
  let n = 2;
  while (used.has(filename) || fs.existsSync(path.join(outDir, filename))) {
    filename = `${base}-${n++}${ext}`;
  }
  used.add(filename);
  fs.copyFileSync(input, path.join(outDir, filename));
}

console.log(`Exported ${used.size} model icons to ${outDir}`);
