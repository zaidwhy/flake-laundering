export const FREE_SHIPPING_PENCE = 3000;
export const FLAT_SHIPPING_PENCE = 395;
export const BUNDLE_BAGS = 3;
export const BUNDLE_DISCOUNT = 0.05;

function promoValue(promo, amountPence) {
  if (promo.percentOff) return Math.round(amountPence * promo.percentOff);
  return promo.amountOffPence ?? 0;
}

export function computeTotals(lines, promo = null) {
  const bags = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotalPence = lines.reduce((sum, line) => sum + line.pricePence * line.quantity, 0);
  const discountPence = bags >= BUNDLE_BAGS ? Math.round(subtotalPence * BUNDLE_DISCOUNT) : 0;
  const promoPence = promo ? Math.min(promoValue(promo, subtotalPence - discountPence), subtotalPence - discountPence) : 0;
  const discounted = subtotalPence - discountPence - promoPence;
  const freeShipping = promo?.freeShipping === true || discounted >= FREE_SHIPPING_PENCE;
  const shippingPence = bags === 0 || freeShipping ? 0 : FLAT_SHIPPING_PENCE;
  return {
    bags,
    subtotalPence,
    discountPence,
    promoPence,
    shippingPence,
    totalPence: discounted + shippingPence,
  };
}

export function shippingHint(totals) {
  if (totals.bags === 0) return '';
  if (totals.shippingPence === 0) return 'Shipping is free on this order.';
  const missing = FREE_SHIPPING_PENCE - (totals.subtotalPence - totals.discountPence - totals.promoPence);
  return `Add ${(missing / 100).toFixed(2)} more for free shipping.`;
}
