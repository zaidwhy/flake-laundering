import { h } from '../lib/dom.js';
import { formatMoney } from '../lib/format.js';
import { BAG_SIZES, FREQUENCIES, deliveryPrice } from '../features/subscription/plans.js';
import { BUNDLE_BAGS, BUNDLE_DISCOUNT, FLAT_SHIPPING_PENCE, FREE_SHIPPING_PENCE } from '../features/cart/totals.js';

function subscriptionTable() {
  const head = h('tr', {}, h('th', { text: 'Bag size' }), FREQUENCIES.map((frequency) => h('th', { text: frequency.label })));
  const rows = BAG_SIZES.map((size) => h('tr', {},
    h('th', { scope: 'row', text: size.label }),
    FREQUENCIES.map((frequency) => h('td', { text: formatMoney(deliveryPrice(size.grams, frequency.id)) })),
  ));
  return h('table', { 'aria-label': 'Subscription prices' }, h('thead', {}, head), h('tbody', {}, rows));
}

export function renderPricing(host) {
  host.append(
    h('h1', { text: 'What it costs' }),
    h('h2', { text: 'Subscriptions' }),
    h('p', { class: 'lede', text: 'Each delivery is priced per bag. Longer gaps between roasts earn a discount.' }),
    subscriptionTable(),
    h('h2', { text: 'One-off orders' }),
    h('ul', {},
      h('li', { text: `Buy ${BUNDLE_BAGS} or more bags and save ${BUNDLE_DISCOUNT * 100}%.` }),
      h('li', { text: `Shipping is ${formatMoney(FLAT_SHIPPING_PENCE)}, free from ${formatMoney(FREE_SHIPPING_PENCE)}.` }),
    ),
  );
}
