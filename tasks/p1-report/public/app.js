const body = document.querySelector('tbody');
const format = new Intl.NumberFormat('en-GB');

const regions = await (await fetch('/api/report')).json();

body.replaceChildren(...regions.map(({ region, revenue }) => {
  const row = document.createElement('tr');
  for (const value of [region, format.format(revenue)]) {
    const cell = document.createElement('td');
    cell.textContent = value;
    row.append(cell);
  }
  return row;
}));
