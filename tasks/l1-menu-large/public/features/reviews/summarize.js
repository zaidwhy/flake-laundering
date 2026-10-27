export function averageRating(reviews) {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

export function ratingBreakdown(reviews) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const review of reviews) counts[review.rating] += 1;
  return counts;
}

export function filterReviews(reviews, minimumRating) {
  return reviews.filter((review) => review.rating >= minimumRating);
}
