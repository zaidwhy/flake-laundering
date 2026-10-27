import { h } from '../lib/dom.js';
import { on } from '../lib/events.js';

const DISPLAY_MS = 3000;

function show(host, { message, tone = 'info' }) {
  const toast = h('div', { class: `toast toast-${tone}`, role: 'status', text: message });
  host.append(toast);
  setTimeout(() => toast.remove(), DISPLAY_MS);
}

export function mountToasts(host) {
  return on('toast', (detail) => show(host, detail));
}
