import { roundTripMs, sleep } from './backend.mjs';

const MAX_TITLE = 120;
let notes = [];

export async function handle(method, pathname, body) {
  if (pathname === '/api/notes' && method === 'GET') {
    await sleep(40);
    return { json: notes };
  }
  if (pathname === '/api/notes' && method === 'POST') {
    const title = String(body?.title ?? '').trim();
    if (!title || title.length > MAX_TITLE) return { status: 400, json: { error: `title must be 1..${MAX_TITLE} characters` } };
    await sleep(roundTripMs());
    const note = { id: notes.length + 1, title };
    notes = [...notes, note];
    return { status: 201, json: note };
  }
  if (pathname === '/api/reset' && method === 'POST') {
    notes = [];
    return { json: { ok: true } };
  }
  return null;
}
