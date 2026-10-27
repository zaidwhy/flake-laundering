import { h } from '../../lib/dom.js';
import { nextOpenDelivery } from '../delivery/closures.js';
import { formatDate, formatMoney } from '../../lib/format.js';
import { renderSchedule } from './schedule.js';
import { findBagSize, findFrequency, deliveryPrice, monthlySpend } from './plans.js';

export function renderSummary(values) {
  const size = findBagSize(values.bagGrams);
  const frequency = findFrequency(values.frequency);
  const price = deliveryPrice(values.bagGrams, values.frequency);
  const lines = [];
  if (size && frequency) {
    lines.push(h('p', { text: `${size.label}, ${frequency.label.toLowerCase()}` }));
    lines.push(h('p', { text: `${formatMoney(price)} per delivery, about ${formatMoney(monthlySpend(values.bagGrams, values.frequency))} every four weeks` }));
  }
  if (values.deliveryDay) {
    lines.push(h('p', { text: `First delivery: ${formatDate(nextOpenDelivery(Number(values.deliveryDay)))}` }));
  }
  lines.push(renderSchedule(values));
  if (!size && !values.deliveryDay) lines.push(h('p', { class: 'empty', text: 'Pick your options to see the cost.' }));
  return h('section', { class: 'summary', id: 'subscription-summary' }, h('h2', { text: 'Your plan' }), lines);
}
