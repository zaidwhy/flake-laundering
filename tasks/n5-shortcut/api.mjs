import { roundTripMs, sleep } from './backend.mjs';

const invoices = [
  { number: 'INV-1041', customer: 'Halden Bakery', total: '412.00' },
  { number: 'INV-1042', customer: 'Osei Joinery', total: '1,980.50' },
  { number: 'INV-1043', customer: 'Marlow Print', total: '76.20' },
];

export async function handle(method, pathname) {
  if (method === 'GET' && pathname === '/api/settings') {
    await sleep(roundTripMs());
    return { json: { keyboardShortcuts: true, currency: 'GBP' } };
  }
  if (method === 'GET' && pathname === '/api/invoices') {
    await sleep(300);
    return { json: invoices };
  }
  return null;
}
