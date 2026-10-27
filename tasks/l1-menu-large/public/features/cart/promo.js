import { h } from '../../lib/dom.js';
import { emit } from '../../lib/events.js';
import { activePromoCode, setPromoCode } from './cart-state.js';

const PROMOS = {
  LARK10: { code: 'LARK10', label: '10% off', percentOff: 0.1 },
  WELCOME5: { code: 'WELCOME5', label: '5 pounds off', amountOffPence: 500 },
  SHIPFREE: { code: 'SHIPFREE', label: 'free shipping', freeShipping: true },
};

export function lookupPromo(code) {
  if (!code) return null;
  return PROMOS[code.trim().toUpperCase()] ?? null;
}

export function activePromo() {
  return lookupPromo(activePromoCode());
}

export function renderPromoForm() {
  const active = activePromo();
  if (active) {
    return h('p', { class: 'small-print' },
      `Code ${active.code} applied: ${active.label}. `,
      h('button', { type: 'button', class: 'link-button', onclick: () => setPromoCode(null), text: 'Remove code' }),
    );
  }
  const input = h('input', { type: 'text', id: 'promo-code', 'aria-label': 'Promo code', placeholder: 'Promo code' });
  return h('form', {
    class: 'row',
    onsubmit: (event) => {
      event.preventDefault();
      const promo = lookupPromo(input.value);
      if (!promo) {
        emit('toast', { message: 'That code is not valid', tone: 'error' });
        return;
      }
      setPromoCode(promo.code);
    },
  }, input, h('button', { type: 'submit', text: 'Apply code' }));
}
