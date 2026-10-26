import { roundTripMs, sleep } from './backend.mjs';

const menuLinks = [
  { label: 'Beans', href: '/beans' },
  { label: 'Subscriptions', href: '/subscriptions' },
  { label: 'Pricing', href: '/pricing' },
];

export async function handle(method, pathname) {
  if (method === 'GET' && pathname === '/api/menu') {
    await sleep(roundTripMs());
    return { json: menuLinks };
  }
  return null;
}
