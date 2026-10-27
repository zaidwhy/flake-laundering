import { emit } from '../../lib/events.js';

export const MAX_PER_LINE = 10;

const lines = new Map();
let promoCode = null;

function publish() {
  emit('cart:changed', cartLines());
}

export function cartLines() {
  return [...lines.values()].map((line) => ({ ...line }));
}

export function cartCount() {
  let count = 0;
  for (const line of lines.values()) count += line.quantity;
  return count;
}

export function addToCart(product, quantity = 1) {
  const existing = lines.get(product.id);
  const next = Math.min(MAX_PER_LINE, (existing?.quantity ?? 0) + quantity);
  lines.set(product.id, {
    id: product.id,
    name: product.name,
    pricePence: product.pricePence,
    weightGrams: product.weightGrams,
    quantity: next,
  });
  publish();
  return next;
}

export function setQuantity(id, quantity) {
  const line = lines.get(id);
  if (!line) return;
  if (quantity <= 0) {
    lines.delete(id);
  } else {
    line.quantity = Math.min(MAX_PER_LINE, quantity);
  }
  publish();
}

export function removeFromCart(id) {
  if (lines.delete(id)) publish();
}

export function activePromoCode() {
  return promoCode;
}

export function setPromoCode(code) {
  promoCode = code;
  publish();
}

export function restoreLines(saved) {
  for (const line of saved) lines.set(line.id, { ...line, quantity: Math.min(MAX_PER_LINE, line.quantity) });
  publish();
}

export function clearCart() {
  lines.clear();
  promoCode = null;
  publish();
}
