import { h } from '../../lib/dom.js';
import { getJson } from '../../lib/http.js';
import { formatRating, pluralize } from '../../lib/format.js';
import { mountReviewForm } from './review-form.js';
import { averageRating, filterReviews, ratingBreakdown } from './summarize.js';

function renderReview(review) {
  return h('li', { class: 'review' },
    h('strong', { text: review.author }),
    h('span', { class: 'rating', text: ` - ${formatRating(review.rating)} for ${review.product}` }),
    h('p', { text: review.text }),
  );
}

function renderBreakdown(reviews) {
  const counts = ratingBreakdown(reviews);
  const rows = [5, 4, 3, 2, 1].map((rating) => h('li', { text: `${rating} stars: ${counts[rating]}` }));
  return h('ul', { class: 'small-print' }, rows);
}

export function mountReviews(host) {
  const state = { reviews: [], minimum: 1 };
  const summary = h('p', { role: 'status', text: 'Loading reviews' });
  const breakdown = h('div');
  const list = h('ul', { class: 'review-list' });
  const minimumSelect = h('select', {
    id: 'minimum-rating',
    onchange: (event) => {
      state.minimum = Number(event.target.value);
      draw();
    },
  }, [1, 3, 4, 5].map((value) => h('option', { value: String(value), text: value === 1 ? 'All ratings' : `${value} stars and up` })));

  function draw() {
    const visible = filterReviews(state.reviews, state.minimum);
    summary.textContent = `${averageRating(state.reviews)} average from ${pluralize(state.reviews.length, 'review')}`;
    breakdown.replaceChildren(renderBreakdown(state.reviews));
    list.replaceChildren(...visible.map(renderReview));
  }

  host.append(summary, breakdown, h('label', { for: 'minimum-rating' }, 'Show ', minimumSelect), list);
  mountReviewForm(host, (review) => {
    state.reviews = [review, ...state.reviews];
    draw();
  });

  getJson('/api/reviews')
    .then((reviews) => {
      state.reviews = reviews;
      draw();
    })
    .catch(() => {
      summary.textContent = 'Reviews could not be loaded.';
    });
}
