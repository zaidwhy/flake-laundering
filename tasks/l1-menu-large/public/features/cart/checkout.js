import { postJson } from '../../lib/http.js';
import { emit } from '../../lib/events.js';
import { cartLines, clearCart } from './cart-state.js';
import { clearGiftNote, getGiftNote } from './gift-note.js';

export async function checkout() {
  const items = cartLines().map(({ id, quantity }) => ({ id, quantity }));
  try {
    const { orderId } = await postJson('/api/checkout', { items, giftNote: getGiftNote() });
    clearGiftNote();
    clearCart();
    emit('toast', { message: `Order ${orderId} placed` });
    return orderId;
  } catch (error) {
    emit('toast', { message: `Checkout failed: ${error.message}`, tone: 'error' });
    return null;
  }
}
