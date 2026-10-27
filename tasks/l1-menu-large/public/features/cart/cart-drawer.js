import { h } from '../../lib/dom.js';
import { on } from '../../lib/events.js';
import { formatMoney, pluralize } from '../../lib/format.js';
import { cartCount, cartLines, clearCart } from './cart-state.js';
import { computeTotals, shippingHint } from './totals.js';
import { renderLineItem } from './line-item.js';
import { checkout } from './checkout.js';
import { renderGiftNote } from './gift-note.js';
import { renderShippingEstimator } from './shipping-estimator.js';
import { activePromo, renderPromoForm } from './promo.js';
import { confirmAction } from '../../ui/confirm.js';

function totalRow(label, value, className) {
  return [h('dt', { class: className, text: label }), h('dd', { class: className, text: value })];
}

function renderTotals(lines) {
  const totals = computeTotals(lines, activePromo());
  const rows = [...totalRow('Subtotal', formatMoney(totals.subtotalPence))];
  if (totals.discountPence > 0) rows.push(...totalRow('Bundle discount', `-${formatMoney(totals.discountPence)}`));
  if (totals.promoPence > 0) rows.push(...totalRow('Promo code', `-${formatMoney(totals.promoPence)}`));
  rows.push(...totalRow('Shipping', totals.shippingPence === 0 ? 'Free' : formatMoney(totals.shippingPence)));
  rows.push(...totalRow('Total', formatMoney(totals.totalPence), 'grand'));
  return [h('dl', { class: 'totals', id: 'cart-totals' }, rows), h('p', { class: 'small-print', text: shippingHint(totals) })];
}

async function confirmClear() {
  const accepted = await confirmAction({
    title: 'Clear your cart?',
    body: 'Every bag will be removed from this order.',
    confirmLabel: 'Clear it',
  });
  if (accepted) clearCart();
}

function renderDrawer(drawer, lines) {
  const body = lines.length === 0
    ? [h('p', { class: 'empty', text: 'Your cart is empty.' })]
    : [
        h('ul', { class: 'cart-lines' }, lines.map(renderLineItem)),
        renderPromoForm(),
        renderShippingEstimator(),
        renderGiftNote(),
        ...renderTotals(lines),
        h('button', { type: 'button', class: 'primary', id: 'checkout-button', onclick: checkout, text: 'Place order' }),
        h('button', { type: 'button', class: 'link-button', id: 'clear-cart', onclick: confirmClear, text: 'Clear cart' }),
      ];
  drawer.replaceChildren(
    h('div', { class: 'drawer-head' },
      h('h2', { text: 'Your cart' }),
      h('button', { type: 'button', id: 'cart-close', onclick: () => setOpen(false), text: 'Close cart' }),
    ),
    h('p', { class: 'small-print', text: pluralize(cartCount(), 'bag') }),
    ...body,
  );
}

let drawerNode = null;
let buttonNode = null;

function setOpen(open) {
  drawerNode.hidden = !open;
  buttonNode?.setAttribute('aria-expanded', String(open));
}

export function mountCartDrawer(drawer) {
  drawerNode = drawer;
  renderDrawer(drawer, cartLines());
  on('cart:changed', (lines) => renderDrawer(drawer, lines));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !drawer.hidden) setOpen(false);
  });
}

export function mountCartButton(button, countNode) {
  buttonNode = button;
  countNode.textContent = String(cartCount());
  on('cart:changed', () => {
    countNode.textContent = String(cartCount());
  });
  button.addEventListener('click', () => setOpen(drawerNode.hidden));
}
