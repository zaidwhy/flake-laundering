export const FREQUENCIES = [
  { id: 'weekly', label: 'Every week', intervalDays: 7, discount: 0 },
  { id: 'fortnightly', label: 'Every two weeks', intervalDays: 14, discount: 0.05 },
  { id: 'monthly', label: 'Every four weeks', intervalDays: 28, discount: 0.1 },
];

export const BAG_SIZES = [
  { grams: 250, label: '250g bag', pricePence: 1100 },
  { grams: 1000, label: '1kg bag', pricePence: 3800 },
];

export function findFrequency(id) {
  return FREQUENCIES.find((frequency) => frequency.id === id);
}

export function findBagSize(grams) {
  return BAG_SIZES.find((size) => size.grams === Number(grams));
}

export function deliveryPrice(grams, frequencyId) {
  const size = findBagSize(grams);
  const frequency = findFrequency(frequencyId);
  if (!size || !frequency) return null;
  return Math.round(size.pricePence * (1 - frequency.discount));
}

export function monthlySpend(grams, frequencyId) {
  const price = deliveryPrice(grams, frequencyId);
  const frequency = findFrequency(frequencyId);
  if (price === null) return null;
  return Math.round((price * 28) / frequency.intervalDays);
}
