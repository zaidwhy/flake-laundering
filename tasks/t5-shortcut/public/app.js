const search = document.querySelector('input[type=search]');
const rows = document.querySelector('tbody');

function renderInvoices(invoices) {
  rows.replaceChildren(...invoices.map(({ number, customer, total }) => {
    const row = document.createElement('tr');
    for (const value of [number, customer, total]) {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.append(cell);
    }
    return row;
  }));
}

fetch('/api/invoices').then((response) => response.json()).then(renderInvoices);

const settings = await (await fetch('/api/settings')).json();

if (settings.keyboardShortcuts) {
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== search) {
      event.preventDefault();
      search.focus();
    }
  });
}
