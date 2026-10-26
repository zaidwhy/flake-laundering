import { roundTripMs, sleep } from './backend.mjs';

const report = [
  { region: 'North', revenue: 12483 },
  { region: 'South', revenue: 9120 },
  { region: 'West', revenue: 15007 },
];

export async function handle(method, pathname) {
  if (method === 'GET' && pathname === '/api/report') {
    await sleep(roundTripMs());
    return { json: report };
  }
  return null;
}
