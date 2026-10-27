import { addDays, nextDelivery } from '../../lib/dates.js';

// The roastery is closed on 25 and 26 December and on 1 January; those deliveries move to the next week.
const CLOSED_DAYS = [
  { month: 12, day: 25 },
  { month: 12, day: 26 },
  { month: 1, day: 1 },
];

export function isClosed(date) {
  return CLOSED_DAYS.some(({ month, day }) => date.getMonth() + 1 === month && date.getDate() === day);
}

export function nextOpenDelivery(weekday, today = new Date()) {
  let date = nextDelivery(weekday, today);
  while (isClosed(date)) date = addDays(date, 7);
  return date;
}
