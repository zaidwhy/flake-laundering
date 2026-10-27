import { h } from '../lib/dom.js';
import { mountReviews } from '../features/reviews/reviews.js';

export function renderReviews(host) {
  const section = h('section', { 'aria-label': 'Customer reviews' });
  host.append(h('h1', { text: 'What drinkers say' }), section);
  mountReviews(section);
}
