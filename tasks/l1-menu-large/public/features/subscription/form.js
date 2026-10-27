import { h } from '../../lib/dom.js';
import { postJson } from '../../lib/http.js';
import { emit } from '../../lib/events.js';
import { capitalize, formatMoney } from '../../lib/format.js';
import { createDayPicker } from '../delivery/day-picker.js';
import { BAG_SIZES, FREQUENCIES, deliveryPrice } from './plans.js';
import { hasErrors, normalizePostcode, validateSubscription } from './validate.js';
import { renderSummary } from './summary.js';

const ROAST_OPTIONS = ['light', 'medium', 'dark', 'surprise'];

function errorLine(name) {
  return h('p', { class: 'field-error', id: `error-${name}`, role: 'alert' });
}

function radioChoice(name, value, label, checked, onChange, note) {
  return h('label', { class: 'choice' },
    h('input', { type: 'radio', name, value: String(value), checked, onchange: () => onChange(String(value)) }),
    label,
    note ? h('small', { text: note }) : null,
  );
}

export function mountSubscriptionForm(host) {
  const values = { bagGrams: '250', frequency: 'fortnightly', roast: 'medium', postcode: '', deliveryDay: '', skipNext: false };
  const summary = h('div');
  const errorNodes = {
    postcode: errorLine('postcode'),
    deliveryDay: errorLine('deliveryDay'),
  };

  function drawSummary() {
    summary.replaceChildren(renderSummary(values));
  }

  function set(name) {
    return (value) => {
      values[name] = value;
      drawSummary();
    };
  }

  function showErrors(errors) {
    for (const [name, node] of Object.entries(errorNodes)) node.textContent = errors[name] ?? '';
  }

  async function submit(event) {
    event.preventDefault();
    const errors = validateSubscription(values);
    showErrors(errors);
    if (hasErrors(errors)) return;
    try {
      const postcode = normalizePostcode(values.postcode);
      await postJson('/api/subscription', { ...values, postcode });
      emit('toast', { message: 'Subscription settings saved' });
    } catch (error) {
      emit('toast', { message: error.message, tone: 'error' });
    }
  }

  const sizeField = h('fieldset', {}, h('legend', { text: 'Bag size' }),
    BAG_SIZES.map((size) => radioChoice('bag-size', size.grams, size.label, values.bagGrams === String(size.grams), set('bagGrams'), formatMoney(size.pricePence))));

  const frequencyField = h('fieldset', {}, h('legend', { text: 'How often' }),
    FREQUENCIES.map((frequency) => radioChoice('frequency', frequency.id, frequency.label, values.frequency === frequency.id, set('frequency'),
      frequency.discount > 0 ? `${frequency.discount * 100}% off, ${formatMoney(deliveryPrice(250, frequency.id))} for 250g` : null)));

  const roastSelect = h('select', { id: 'roast', onchange: (event) => set('roast')(event.target.value) },
    ROAST_OPTIONS.map((roast) => h('option', { value: roast, selected: roast === values.roast, text: capitalize(roast) })));

  const postcodeInput = h('input', {
    type: 'text',
    id: 'postcode',
    name: 'postcode',
    autocomplete: 'postal-code',
    oninput: (event) => {
      values.postcode = event.target.value;
    },
  });

  const form = h('form', { class: 'settings-form', novalidate: true, onsubmit: submit },
    sizeField,
    frequencyField,
    h('div', { class: 'field' }, h('label', { for: 'roast', text: 'Roast' }), roastSelect),
    h('div', { class: 'field' }, h('label', { for: 'postcode', text: 'Postcode' }), postcodeInput, errorNodes.postcode),
    createDayPicker({ value: values.deliveryDay, onSelect: set('deliveryDay') }),
    errorNodes.deliveryDay,
    h('label', { class: 'choice' },
      h('input', { type: 'checkbox', id: 'skip-next', onchange: (event) => set('skipNext')(event.target.checked) }),
      'Skip my next delivery'),
    h('button', { type: 'submit', class: 'primary', text: 'Save settings' }),
  );

  drawSummary();
  host.append(form, summary);
}
