import { roundTripMs, sleep } from './backend.mjs';

const menuLinks = [
  { label: 'Beans', href: '#/' },
  { label: 'Subscriptions', href: '#/subscription' },
  { label: 'Pricing', href: '#/pricing' },
  { label: 'Reviews', href: '#/reviews' },
];

const products = [
  { id: 'guji', name: 'Ethiopia Guji', origin: 'Ethiopia', roast: 'light', notes: 'Bergamot, peach, jasmine', pricePence: 1150, weightGrams: 250, inStock: true },
  { id: 'huila', name: 'Colombia Huila', origin: 'Colombia', roast: 'medium', notes: 'Red apple, caramel, cocoa', pricePence: 1050, weightGrams: 250, inStock: true },
  { id: 'cerrado', name: 'Brazil Cerrado', origin: 'Brazil', roast: 'dark', notes: 'Hazelnut, dark chocolate', pricePence: 950, weightGrams: 250, inStock: true },
  { id: 'nyeri', name: 'Kenya Nyeri', origin: 'Kenya', roast: 'light', notes: 'Blackcurrant, grapefruit', pricePence: 1290, weightGrams: 250, inStock: true },
  { id: 'antigua', name: 'Guatemala Antigua', origin: 'Guatemala', roast: 'medium', notes: 'Toffee, orange peel', pricePence: 1090, weightGrams: 250, inStock: true },
  { id: 'sumatra', name: 'Sumatra Mandheling', origin: 'Indonesia', roast: 'dark', notes: 'Cedar, molasses, tobacco', pricePence: 1120, weightGrams: 250, inStock: false },
  { id: 'kivu', name: 'Rwanda Lake Kivu', origin: 'Rwanda', roast: 'medium', notes: 'Plum, brown sugar', pricePence: 1180, weightGrams: 250, inStock: true },
  { id: 'yirga', name: 'Ethiopia Yirgacheffe', origin: 'Ethiopia', roast: 'light', notes: 'Lemon, honey, tea rose', pricePence: 1240, weightGrams: 250, inStock: true },
];

const reviews = [
  { id: 1, author: 'Priya', rating: 5, product: 'Ethiopia Guji', text: 'Floral and bright, it tastes like the roaster is next door.' },
  { id: 2, author: 'Tom', rating: 4, product: 'Colombia Huila', text: 'A dependable everyday bag. The caramel sweetness holds up with milk.' },
  { id: 3, author: 'Mei', rating: 5, product: 'Kenya Nyeri', text: 'Juicy and sharp in the best way. I have switched my whole fortnight to it.' },
  { id: 4, author: 'Dan', rating: 3, product: 'Brazil Cerrado', text: 'Pleasant and nutty, a little flat as an espresso for my taste.' },
  { id: 5, author: 'Sofia', rating: 5, product: 'Rwanda Lake Kivu', text: 'Plum jam in a cup. The fortnightly delivery has never missed a Saturday.' },
];

const deliveryDays = [
  { weekday: 5, label: 'Friday' },
  { weekday: 6, label: 'Saturday' },
  { weekday: 1, label: 'Monday' },
];

export async function handle(method, pathname, body, searchParams) {
  if (method === 'GET' && pathname === '/api/session') {
    await sleep(roundTripMs());
    return { json: { name: 'Amara', plan: 'Fortnightly' } };
  }
  if (method === 'GET' && pathname === '/api/menu') {
    await sleep(40);
    return { json: menuLinks };
  }
  if (method === 'GET' && pathname === '/api/products') {
    await sleep(40);
    const roast = searchParams?.get('roast');
    return { json: roast ? products.filter((product) => product.roast === roast) : products };
  }
  if (method === 'GET' && pathname === '/api/reviews') {
    await sleep(40);
    return { json: reviews };
  }
  if (method === 'POST' && pathname === '/api/reviews') {
    await sleep(40);
    if (!body?.author || !body.text) return { status: 422, json: { error: 'author and text required' } };
    return { json: { id: reviews.length + 1, author: body.author, rating: body.rating, product: body.product, text: body.text } };
  }
  if (method === 'GET' && pathname === '/api/delivery-days') {
    await sleep(40);
    return { json: deliveryDays };
  }
  if (method === 'POST' && pathname === '/api/newsletter') {
    await sleep(40);
    if (!body?.email || !body.email.includes('@')) return { status: 422, json: { error: 'invalid email' } };
    return { json: { subscribed: true } };
  }
  if (method === 'POST' && pathname === '/api/subscription') {
    await sleep(40);
    if (!body?.postcode) return { status: 422, json: { error: 'postcode required' } };
    return { json: { saved: true, nextDelivery: body.deliveryDay } };
  }
  if (method === 'POST' && pathname === '/api/checkout') {
    await sleep(40);
    if (!Array.isArray(body?.items) || body.items.length === 0) return { status: 422, json: { error: 'empty cart' } };
    return { json: { orderId: `LK-${1000 + body.items.length}` } };
  }
  return null;
}
