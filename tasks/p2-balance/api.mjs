import { roundTripMs, sleep } from './backend.mjs';

const transactions = [
  { payee: 'Corner Grocer', pence: -1840 },
  { payee: 'Salary', pence: 210000 },
  { payee: 'Rail ticket', pence: -4520 },
];

export async function handle(method, pathname) {
  if (method === 'GET' && pathname === '/api/account') {
    await sleep(roundTripMs());
    return { json: { balancePence: 120450 } };
  }
  if (method === 'GET' && pathname === '/api/transactions') {
    await sleep(300);
    return { json: transactions };
  }
  return null;
}
