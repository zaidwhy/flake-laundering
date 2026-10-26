const input = document.querySelector('input[type=search]');
const status = document.querySelector('#search-status');
const results = document.querySelector('#results');
const heading = document.querySelector('#results-heading');
let latestRequest = 0;

function render({ query, fruits }) {
  heading.textContent = `Results for "${query}"`;
  results.replaceChildren(...fruits.map((name) => {
    const item = document.createElement('li');
    item.textContent = name;
    return item;
  }));
}

input.addEventListener('input', async () => {
  const query = input.value.trim();
  const request = ++latestRequest;
  status.textContent = 'Searching...';
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  const answer = await response.json();
  // a slower response to an earlier keystroke must not replace the answer to the latest one
  if (request !== latestRequest) return;
  render(answer);
  status.textContent = `${answer.fruits.length} results`;
});
