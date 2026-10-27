const currency = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

export function formatMoney(pence) {
  return currency.format(pence / 100);
}

export function formatWeight(grams) {
  return grams >= 1000 ? `${grams / 1000}kg` : `${grams}g`;
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
}

export function formatRating(rating) {
  return `${rating} out of 5`;
}
