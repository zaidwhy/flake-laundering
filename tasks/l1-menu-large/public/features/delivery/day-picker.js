import { h } from '../../lib/dom.js';
import { getJson } from '../../lib/http.js';
import { nextOpenDelivery } from './closures.js';
import { formatDate } from '../../lib/format.js';

function renderOption(day, selected, onSelect) {
  const input = h('input', {
    type: 'radio',
    name: 'delivery-day',
    value: String(day.weekday),
    checked: selected === String(day.weekday),
    onchange: () => onSelect(String(day.weekday)),
  });
  return h('label', { class: 'choice' },
    input,
    day.label,
    h('small', { text: `next on ${formatDate(nextOpenDelivery(day.weekday))}` }),
  );
}

export function createDayPicker({ value = '', onSelect }) {
  const options = h('div', { role: 'radiogroup', 'aria-label': 'Delivery day' },
    h('p', { class: 'small-print', text: 'Loading delivery days' }));
  const root = h('fieldset', { id: 'delivery-day-field' }, h('legend', { text: 'Delivery day' }), options);

  getJson('/api/delivery-days')
    .then((days) => {
      options.replaceChildren(...days.map((day) => renderOption(day, value, onSelect)));
    })
    .catch(() => {
      options.replaceChildren(h('p', { class: 'field-error', text: 'Delivery days are unavailable right now.' }));
    });

  return root;
}
