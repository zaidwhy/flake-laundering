const input = document.querySelector('input[type=search]');
const status = document.querySelector('#search-status');
const results = document.querySelector('#results');
const heading = document.querySelector('#results-heading');
let inFlight = 0;

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
  inFlight += 1;
  status.textContent = 'Searching...';
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  render(await response.json());
  inFlight -= 1;
  if (inFlight === 0) status.textContent = `${results.children.length} results`;
});
