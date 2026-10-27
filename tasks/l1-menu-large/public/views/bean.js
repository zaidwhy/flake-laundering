import { h } from '../lib/dom.js';
import { getJson } from '../lib/http.js';
import { capitalize, formatMoney, formatWeight } from '../lib/format.js';
import { emit } from '../lib/events.js';
import { addToCart } from '../features/cart/cart-state.js';
import { mountBrewGuide } from '../features/products/brew-guide.js';

function renderDetail(host, product) {
  host.replaceChildren(
    h('h1', { text: product.name }),
    h('p', { class: 'lede', text: `${capitalize(product.roast)} roast from ${product.origin}. Tasting notes: ${product.notes}.` }),
    h('p', { class: 'price', text: `${formatMoney(product.pricePence)} for ${formatWeight(product.weightGrams)}` }),
    h('button', {
      type: 'button',
      class: 'primary',
      disabled: !product.inStock,
      onclick: () => {
        addToCart(product);
        emit('toast', { message: `${product.name} added` });
      },
      text: product.inStock ? 'Add this coffee' : 'Sold out',
    }),
    h('p', {}, h('a', { href: '#/', text: 'All beans' })),
  );
  const guide = h('section', { 'aria-label': 'Brew guide' });
  host.append(guide);
  mountBrewGuide(guide);
}

export function renderBean(host, query) {
  const detail = h('div', {}, h('p', { class: 'small-print', text: 'Loading coffee' }));
  host.append(detail);
  getJson('/api/products')
    .then((products) => {
      const product = products.find((candidate) => candidate.id === query.get('id'));
      if (product) renderDetail(detail, product);
      else detail.replaceChildren(h('p', { class: 'empty', text: 'We could not find that coffee.' }), h('a', { href: '#/', text: 'Back to the beans' }));
    })
    .catch(() => detail.replaceChildren(h('p', { class: 'empty', text: 'This coffee could not be loaded.' })));
}
