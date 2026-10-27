import { h } from '../../lib/dom.js';
import { formatMoney } from '../../lib/format.js';
import { validatePostcode } from '../subscription/validate.js';
import { FLAT_SHIPPING_PENCE } from './totals.js';

const HIGHLAND_AREAS = ['IV', 'KW', 'HS', 'ZE', 'PH'];
const HIGHLAND_SURCHARGE_PENCE = 300;
const NORTHERN_IRELAND_SURCHARGE_PENCE = 200;

export function shippingSurcharge(postcode) {
  const area = postcode.trim().toUpperCase().match(/^[A-Z]{1,2}/)?.[0] ?? '';
  if (HIGHLAND_AREAS.includes(area)) return HIGHLAND_SURCHARGE_PENCE;
  if (area === 'BT') return NORTHERN_IRELAND_SURCHARGE_PENCE;
  return 0;
}

export function estimateShipping(postcode) {
  const problem = validatePostcode(postcode);
  if (problem) return { problem };
  return { pence: FLAT_SHIPPING_PENCE + shippingSurcharge(postcode) };
}

export function renderShippingEstimator() {
  const input = h('input', { type: 'text', id: 'estimate-postcode', 'aria-label': 'Postcode for shipping estimate', placeholder: 'Postcode' });
  const result = h('p', { class: 'small-print', role: 'status' });
  return h('form', {
    onsubmit: (event) => {
      event.preventDefault();
      const estimate = estimateShipping(input.value);
      result.textContent = estimate.problem ?? `Shipping to ${input.value.trim().toUpperCase()}: ${formatMoney(estimate.pence)}, or free on larger orders.`;
    },
  }, h('div', { class: 'row' }, input, h('button', { type: 'submit', text: 'Estimate shipping' })), result);
}
