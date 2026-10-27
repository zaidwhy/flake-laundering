import { h } from '../../lib/dom.js';
import { formatMoney, formatWeight } from '../../lib/format.js';
import { MAX_PER_LINE, removeFromCart, setQuantity } from './cart-state.js';

function stepperButton(label, symbol, disabled, onClick) {
  return h('button', { type: 'button', 'aria-label': label, disabled, onclick: onClick, text: symbol });
}

export function renderLineItem(line) {
  const lineTotal = line.pricePence * line.quantity;
  return h('li', { class: 'cart-line', 'data-id': line.id },
    h('span', { class: 'name', text: line.name }),
    h('span', { class: 'line-total', text: formatMoney(lineTotal) }),
    h('span', { class: 'stepper' },
      stepperButton(`Decrease ${line.name}`, '-', false, () => setQuantity(line.id, line.quantity - 1)),
      h('output', { 'aria-label': `${line.name} quantity`, text: String(line.quantity) }),
      stepperButton(`Increase ${line.name}`, '+', line.quantity >= MAX_PER_LINE, () => setQuantity(line.id, line.quantity + 1)),
    ),
    h('span', {},
      h('small', { text: `${formatWeight(line.weightGrams)} at ${formatMoney(line.pricePence)} each ` }),
      h('button', { type: 'button', class: 'link-button', 'aria-label': `Remove ${line.name}`, onclick: () => removeFromCart(line.id), text: 'Remove' }),
    ),
  );
}
