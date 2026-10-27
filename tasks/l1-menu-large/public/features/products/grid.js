import { h } from '../../lib/dom.js';
import { getJson } from '../../lib/http.js';
import { pluralize } from '../../lib/format.js';
import { emit } from '../../lib/events.js';
import { renderProductCard } from './card.js';
import { applyFilters, renderFilters } from './filters.js';

export function mountProductGrid(host) {
  const state = { roast: 'all', sort: 'featured', inStockOnly: false, query: '', products: [] };
  const filters = h('div');
  const status = h('p', { class: 'small-print', role: 'status', text: 'Loading beans' });
  const grid = h('div', { class: 'product-grid' });

  function draw() {
    const visible = applyFilters([...state.products], state);
    status.textContent = pluralize(visible.length, 'coffee');
    grid.replaceChildren(...visible.map(renderProductCard));
    if (visible.length === 0) grid.replaceChildren(h('p', { class: 'empty', text: 'No coffees match these filters.' }));
  }

  function update(change) {
    Object.assign(state, change);
    draw();
  }

  filters.append(renderFilters(state, update));
  host.append(filters, status, grid);

  getJson('/api/products')
    .then((products) => {
      state.products = products;
      draw();
    })
    .catch((error) => {
      status.textContent = 'The beans could not be loaded.';
      emit('toast', { message: error.message, tone: 'error' });
    });
}
