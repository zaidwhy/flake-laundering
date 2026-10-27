import { h } from '../../lib/dom.js';
import { postJson } from '../../lib/http.js';
import { emit } from '../../lib/events.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(raw) {
  const value = raw.trim();
  if (value === '') return 'Enter your email address';
  if (!EMAIL_PATTERN.test(value)) return 'That email address looks incomplete';
  return null;
}

export function mountNewsletter(host) {
  const input = h('input', { type: 'email', id: 'newsletter-email', name: 'email', autocomplete: 'email' });
  const message = h('p', { class: 'small-print', role: 'status' });
  const button = h('button', { type: 'submit', class: 'primary', text: 'Join the list' });

  async function submit(event) {
    event.preventDefault();
    const problem = validateEmail(input.value);
    message.textContent = problem ?? '';
    if (problem) return;
    button.disabled = true;
    try {
      await postJson('/api/newsletter', { email: input.value.trim() });
      input.value = '';
      message.textContent = 'You are on the list.';
      emit('toast', { message: 'Thanks for subscribing' });
    } catch (error) {
      message.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  }

  host.replaceChildren(
    h('form', { class: 'newsletter', novalidate: true, onsubmit: submit },
      h('label', { for: 'newsletter-email', text: 'Roasting notes in your inbox' }),
      h('div', { class: 'row' }, input, button),
      message,
    ),
  );
}
