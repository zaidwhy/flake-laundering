import { h } from '../../lib/dom.js';
import { capitalize } from '../../lib/format.js';
import { matchesQuery, renderSearch } from './search.js';

export const ROASTS = ['light', 'medium', 'dark'];

export const SORTERS = {
  featured: { label: 'Featured', compare: () => 0 },
  priceLow: { label: 'Price, low to high', compare: (a, b) => a.pricePence - b.pricePence },
  priceHigh: { label: 'Price, high to low', compare: (a, b) => b.pricePence - a.pricePence },
  name: { label: 'Name', compare: (a, b) => a.name.localeCompare(b.name) },
};

export function applyFilters(products, { roast, sort, inStockOnly, query }) {
  return products
    .filter((product) => matchesQuery(product, query))
    .filter((product) => roast === 'all' || product.roast === roast)
    .filter((product) => !inStockOnly || product.inStock)
    .sort(SORTERS[sort].compare);
}

function selectField(id, label, options, value, onChange) {
  const select = h('select', { id, onchange: (event) => onChange(event.target.value) },
    options.map(([optionValue, text]) => h('option', { value: optionValue, selected: optionValue === value, text })));
  return h('label', { for: id }, label, select);
}

export function renderFilters(state, onChange) {
  const roastOptions = [['all', 'All roasts'], ...ROASTS.map((roast) => [roast, capitalize(roast)])];
  const sortOptions = Object.entries(SORTERS).map(([key, { label }]) => [key, label]);
  const stock = h('input', {
    type: 'checkbox',
    id: 'in-stock-only',
    checked: state.inStockOnly,
    onchange: (event) => onChange({ inStockOnly: event.target.checked }),
  });
  return h('div', { class: 'toolbar' },
    renderSearch(state.query, (query) => onChange({ query })),
    selectField('roast-filter', 'Roast', roastOptions, state.roast, (roast) => onChange({ roast })),
    selectField('sort-order', 'Sort by', sortOptions, state.sort, (sort) => onChange({ sort })),
    h('label', { for: 'in-stock-only', class: 'choice' }, stock, 'In stock only'),
  );
}
