import { h } from '../../lib/dom.js';
import { postJson } from '../../lib/http.js';
import { emit } from '../../lib/events.js';

const MIN_TEXT_LENGTH = 20;

export function validateReview({ author, rating, text }) {
  const errors = {};
  if (author.trim() === '') errors.author = 'Tell us your name';
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = 'Pick a rating from 1 to 5';
  if (text.trim().length < MIN_TEXT_LENGTH) errors.text = `Write at least ${MIN_TEXT_LENGTH} characters`;
  return errors;
}

export function mountReviewForm(host, onPosted) {
  const author = h('input', { type: 'text', id: 'review-author' });
  const rating = h('select', { id: 'review-rating' },
    [5, 4, 3, 2, 1].map((value) => h('option', { value: String(value), text: `${value} out of 5` })));
  const text = h('textarea', { id: 'review-text', rows: '3' });
  const problem = h('p', { class: 'field-error', role: 'alert' });

  async function submit(event) {
    event.preventDefault();
    const draft = { author: author.value, rating: Number(rating.value), text: text.value };
    const errors = validateReview(draft);
    problem.textContent = Object.values(errors)[0] ?? '';
    if (Object.keys(errors).length > 0) return;
    try {
      const saved = await postJson('/api/reviews', { ...draft, product: 'Larkspur subscription' });
      onPosted(saved);
      author.value = '';
      text.value = '';
      emit('toast', { message: 'Thanks for the review' });
    } catch (error) {
      problem.textContent = error.message;
    }
  }

  host.append(h('form', { class: 'settings-form', novalidate: true, onsubmit: submit },
    h('h2', { text: 'Write a review' }),
    h('div', { class: 'field' }, h('label', { for: 'review-author', text: 'Your name' }), author),
    h('div', { class: 'field' }, h('label', { for: 'review-rating', text: 'Rating' }), rating),
    h('div', { class: 'field' }, h('label', { for: 'review-text', text: 'Your review' }), text),
    problem,
    h('button', { type: 'submit', class: 'primary', text: 'Post review' }),
  ));
}
