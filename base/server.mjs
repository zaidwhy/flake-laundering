import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { handle } from './api.mjs';

const port = Number(process.env.PORT ?? 4173);
const publicDir = path.join(import.meta.dirname, 'public');
const contentTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
const MAX_BODY_BYTES = 64 * 1024;

async function readJson(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY_BYTES) throw new Error(`request body over ${MAX_BODY_BYTES} bytes`);
  }
  return raw ? JSON.parse(raw) : null;
}

async function serveFile(pathname, res) {
  const file = path.join(publicDir, pathname === '/' ? 'index.html' : pathname);
  if (!file.startsWith(publicDir)) return send(res, 403, 'text/plain', 'forbidden');
  try {
    send(res, 200, contentTypes[path.extname(file)] ?? 'application/octet-stream', await readFile(file));
  } catch {
    send(res, 404, 'text/plain', 'not found');
  }
}

function send(res, status, type, body) {
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' });
  res.end(body);
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith('/api/')) return serveFile(url.pathname, res);
  try {
    const reply = await handle(req.method, url.pathname, await readJson(req), url.searchParams);
    if (!reply) return send(res, 404, 'application/json', '{"error":"not found"}');
    send(res, reply.status ?? 200, 'application/json', JSON.stringify(reply.json ?? null));
  } catch (err) {
    send(res, 400, 'application/json', JSON.stringify({ error: err.message }));
  }
}).listen(port, '127.0.0.1', () => console.log(`listening on http://127.0.0.1:${port}`));
