import { roundTripMs, sleep } from './backend.mjs';

const seedItems = [
  { id: 1, name: 'Eggs' }, { id: 2, name: 'Milk' }, { id: 3, name: 'Rice' }, { id: 4, name: 'Spinach' },
];
let items = [...seedItems];

export async function handle(method, pathname) {
  if (method === 'GET' && pathname === '/api/items') {
    const snapshot = [...items];
    await sleep(roundTripMs());
    return { json: snapshot };
  }
  const match = pathname.match(/^\/api\/items\/(\d+)$/);
  if (method === 'DELETE' && match) {
    await sleep(40);
    items = items.filter((item) => item.id !== Number(match[1]));
    return { status: 204, json: null };
  }
  if (method === 'POST' && pathname === '/api/reset') {
    items = [...seedItems];
    return { json: { ok: true } };
  }
  return null;
}
