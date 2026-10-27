import { h } from '../../lib/dom.js';
import { capitalize, formatMoney, formatWeight } from '../../lib/format.js';
import { emit } from '../../lib/events.js';
import { addToCart } from '../cart/cart-state.js';

function addButton(product) {
  if (!product.inStock) {
    return h('button', { type: 'button', disabled: true, 'aria-label': `${product.name} is sold out`, text: 'Sold out' });
  }
  return h('button', {
    type: 'button',
    'aria-label': `Add ${product.name} to cart`,
    onclick: () => {
      addToCart(product);
      emit('toast', { message: `${product.name} added` });
    },
    text: 'Add to cart',
  });
}

export function renderProductCard(product) {
  return h('article', { class: 'product-card', 'data-id': product.id },
    h('span', { class: 'badge', text: `${capitalize(product.roast)} roast` }),
    h('h3', { text: product.name }),
    h('p', { class: 'meta', text: `${product.origin} - ${formatWeight(product.weightGrams)}` }),
    h('p', { class: 'meta', text: product.notes }),
    h('p', { class: 'price', text: formatMoney(product.pricePence) }),
    addButton(product),
    h('a', { href: `#/bean?id=${product.id}`, 'aria-label': `Details for ${product.name}`, text: 'Details' }),
  );
}
