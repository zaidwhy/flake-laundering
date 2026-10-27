const DAY_MS = 24 * 60 * 60 * 1000;

// Orders placed on Friday or later ship the following week.
const CUTOFF_WEEKDAY = 4;

export function nextDelivery(weekday, today = new Date()) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const leadDays = start.getDay() > CUTOFF_WEEKDAY || start.getDay() === 0 ? 7 : 0;
  let offset = (weekday - start.getDay() + 7) % 7;
  if (offset === 0) offset = 7;
  return new Date(start.getTime() + (offset + leadDays) * DAY_MS);
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS);
}
