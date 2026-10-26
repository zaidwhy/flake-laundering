import { roundTripMs, sleep } from './backend.mjs';

const messages = [
  { from: 'Priya', subject: 'Q3 numbers', read: false },
  { from: 'Tomasz', subject: 'Lunch Thursday?', read: true },
  { from: 'Ines', subject: 'Contract draft v2', read: false },
  { from: 'Kwame', subject: 'Re: offsite venue', read: false },
];

export async function handle(method, pathname) {
  if (method === 'GET' && pathname === '/api/me') {
    await sleep(roundTripMs());
    return { json: { name: 'Sam' } };
  }
  if (method === 'GET' && pathname === '/api/messages') {
    await sleep(300);
    return { json: messages };
  }
  return null;
}
