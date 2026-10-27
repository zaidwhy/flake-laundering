import { h } from '../../lib/dom.js';
import { addDays } from '../../lib/dates.js';
import { nextOpenDelivery } from '../delivery/closures.js';
import { formatDate } from '../../lib/format.js';
import { findFrequency } from './plans.js';

const UPCOMING_COUNT = 4;

export function upcomingDeliveries(weekday, frequencyId, skipNext) {
  const frequency = findFrequency(frequencyId);
  if (!frequency) return [];
  const first = nextOpenDelivery(weekday);
  const dates = [];
  for (let index = 0; index < UPCOMING_COUNT + (skipNext ? 1 : 0); index += 1) {
    dates.push(addDays(first, index * frequency.intervalDays));
  }
  return skipNext ? dates.slice(1) : dates;
}

export function renderSchedule(values) {
  if (!values.deliveryDay) return null;
  const dates = upcomingDeliveries(Number(values.deliveryDay), values.frequency, values.skipNext);
  return h('div', {},
    h('h3', { text: 'Upcoming deliveries' }),
    h('ol', { id: 'upcoming-deliveries' }, dates.map((date) => h('li', { text: formatDate(date) }))),
  );
}
