'use strict';
// Dependency-free, loopback-only preview server. Control requests require a secret.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');
const root = __dirname;
const statePath = path.join(root, '.server-state.json');
const lockPath = path.join(root, '.server-start.lock');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const readState = () => { try { return JSON.parse(fs.readFileSync(statePath, 'utf8')); } catch { return null; } };
function request(state, route, method = 'GET') {
  return new Promise(resolve => {
    if (!state || !Number.isInteger(state.port) || state.port < 1 || state.port > 65535 || typeof state.token !== 'string') return resolve(false);
    const req = http.request({ hostname: '127.0.0.1', port: state.port, path: route, method,
      headers: { 'X-Preview-Token': state.token }, timeout: 1000 }, res => {
      let body = ''; res.on('data', data => { body += data; });
      res.on('end', () => resolve(res.statusCode === 200 && body === 'delegation-map'));
    });
    req.on('timeout', () => req.destroy()); req.on('error', () => resolve(false)); req.end();
  });
}
function openBrowser(port) {
  const url = `http://127.0.0.1:${port}/`;
  console.log(`Preview: ${url}`);
  if (process.env.DELEGATION_NO_BROWSER === '1') return;
  const child = spawn('powershell.exe', ['-NoProfile', '-Command', `Start-Process '${url}'`], { windowsHide: true, stdio: 'ignore' });
  child.on('error', () => console.log('Open the preview URL in your browser.'));
  child.unref();
}
async function start() {
  let lock;
  try { lock = fs.openSync(lockPath, 'wx'); }
  catch { throw new Error('Another launch is in progress. Retry shortly. If a prior launch crashed, remove .server-start.lock from this folder.'); }
  try {
    const state = readState();
    if (await request(state, '/__health')) { console.log('Server is already running.'); openBrowser(state.port); return; }
    const token = crypto.randomBytes(32).toString('hex');
    const child = spawn(process.execPath, [__filename, 'serve'], { detached: true, windowsHide: true,
      stdio: 'ignore', env: { ...process.env, DELEGATION_SERVER_TOKEN: token } });
    let launchError;
    child.on('error', error => { launchError = error; }); child.unref();
    for (let attempt = 0; attempt < 60; attempt++) {
      if (launchError) throw launchError;
      await sleep(100);
      const current = readState();
      if (current?.token === token && await request(current, '/__health')) {
        console.log('Server ready. No npm packages or build step are required.');
        openBrowser(current.port); return;
      }
    }
    child.kill();
    throw new Error('Server did not become ready. Check local networking permissions and retry.');
  } finally { fs.closeSync(lock); fs.unlinkSync(lockPath); }
}
async function stop() {
  const state = readState();
  if (!state) { console.log('No server is recorded for this folder.'); return; }
  if (!await request(state, '/__health')) throw new Error('Recorded server is unreachable. No unrelated process was stopped.');
  if (!await request(state, '/__shutdown', 'POST')) throw new Error('Server did not acknowledge shutdown.');
  for (let attempt = 0; attempt < 30; attempt++) {
    await sleep(100);
    if (!await request(state, '/__health')) { console.log('Server stopped.'); return; }
  }
  throw new Error('Shutdown was requested, but the server still responds.');
}
function serve() {
  const token = process.env.DELEGATION_SERVER_TOKEN;
  if (!token) throw new Error('Use start-server.bat or node server.cjs start.');
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.md': 'text/plain; charset=utf-8' };
  const server = http.createServer((req, res) => {
    const reply = (code, body, type = 'text/plain; charset=utf-8') => { res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(body); };
    if (req.url === '/__health' || req.url === '/__shutdown') {
      if (req.headers['x-preview-token'] !== token) return reply(403, 'Forbidden');
      if (req.url === '/__shutdown' && req.method !== 'POST') return reply(405, 'POST required');
      reply(200, 'delegation-map');
      if (req.url === '/__shutdown') {
        cleanup(); server.close();
        // End existing keep-alive sockets too, after the acknowledgment is flushed.
        setImmediate(() => server.closeAllConnections());
      }
      return;
    }
    if (!['GET', 'HEAD'].includes(req.method)) return reply(405, 'Method not allowed');
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { return reply(400, 'Bad request'); }
    if (pathname.includes('\\') || pathname.includes('\0') || pathname.split('/').some(part => part.startsWith('.'))) return reply(403, 'Forbidden');
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep) || !types[path.extname(file).toLowerCase()]) return reply(403, 'Forbidden');
    if (pathname === '/' && !fs.existsSync(file)) return reply(200, 'The preview server is ready. The delegation map is awaiting scoring-method approval. Open method.md to review the proposal.');
    fs.realpath(file, (realError, realFile) => {
      if (realError || !realFile.startsWith(root + path.sep)) return reply(404, 'Not found');
      fs.readFile(realFile, (error, data) => {
        if (error) return reply(404, 'Not found');
        reply(200, req.method === 'HEAD' ? '' : data, types[path.extname(file).toLowerCase()]);
      });
    });
  });
  function cleanup() { if (readState()?.token === token) fs.unlinkSync(statePath); }
  server.listen(0, '127.0.0.1', () => fs.writeFileSync(statePath, JSON.stringify({ port: server.address().port, token, pid: process.pid }), { mode: 0o600 }));
  process.on('SIGTERM', () => { cleanup(); server.close(); });
  process.on('SIGINT', () => { cleanup(); server.close(); });
  server.on('error', error => { cleanup(); console.error(error.message); process.exitCode = 1; });
}
const action = process.argv[2];
Promise.resolve().then(() => {
  if (action === 'start') return start();
  if (action === 'stop') return stop();
  if (action === 'serve') return serve();
  throw new Error('Usage: node server.cjs start|stop');
}).catch(error => { console.error(error.message); process.exitCode = 1; });
