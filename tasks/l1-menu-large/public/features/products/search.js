import { h } from '../../lib/dom.js';

export function matchesQuery(product, query) {
  const needle = query.trim().toLowerCase();
  if (needle === '') return true;
  return [product.name, product.origin, product.notes].some((field) => field.toLowerCase().includes(needle));
}

export function renderSearch(value, onChange) {
  const input = h('input', {
    type: 'text',
    id: 'bean-search',
    value,
    autocomplete: 'off',
    oninput: (event) => onChange(event.target.value),
  });
  return h('label', { for: 'bean-search' }, 'Search', input);
}
