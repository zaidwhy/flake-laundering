import { on } from '../../lib/events.js';
import { loadJson, saveJson } from '../../lib/storage.js';
import { restoreLines } from './cart-state.js';

const STORAGE_KEY = 'larkspur.cart';

function isValidLine(line) {
  return line && typeof line.id === 'string' && Number.isInteger(line.quantity) && line.quantity > 0
    && Number.isFinite(line.pricePence);
}

export function startCartPersistence() {
  const saved = loadJson(STORAGE_KEY, []);
  const lines = Array.isArray(saved) ? saved.filter(isValidLine) : [];
  if (lines.length > 0) restoreLines(lines);
  on('cart:changed', (current) => saveJson(STORAGE_KEY, current));
}
