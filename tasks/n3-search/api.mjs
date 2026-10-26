import { roundTripMs, sleep } from './backend.mjs';

const MAX_QUERY = 64;
const fruits = [
  'Apple', 'Apricot', 'Banana', 'Blackberry', 'Blueberry', 'Cherry', 'Elderberry', 'Fig',
  'Gooseberry', 'Grape', 'Kiwi', 'Lemon', 'Mango', 'Orange', 'Pear', 'Plum', 'Raspberry', 'Strawberry',
];

export async function handle(method, pathname, body, query) {
  if (method === 'GET' && pathname === '/api/search') {
    const q = (query.get('q') ?? '').toLowerCase();
    if (q.length > MAX_QUERY) return { status: 400, json: { error: `q is limited to ${MAX_QUERY} characters` } };
    await sleep(roundTripMs());
    return { json: { query: q, fruits: q ? fruits.filter((name) => name.toLowerCase().includes(q)) : [] } };
  }
  return null;
}
