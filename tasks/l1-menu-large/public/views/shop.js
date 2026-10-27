import { h } from '../lib/dom.js';
import { mountProductGrid } from '../features/products/grid.js';

export function renderShop(host) {
  const catalog = h('section', { 'aria-label': 'Coffees' });
  host.append(
    h('h1', { text: 'Single-origin beans, roasted weekly' }),
    h('p', { class: 'lede', text: 'Order by Thursday for Saturday delivery. Every bag is roasted the day it ships.' }),
    catalog,
  );
  mountProductGrid(catalog);
}
