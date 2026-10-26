const list = document.querySelector('#items');
const status = document.querySelector('#sync-status');
let pending = 0;

function track(promise) {
  pending += 1;
  status.textContent = 'Syncing...';
  return promise.finally(() => {
    pending -= 1;
    if (pending === 0) status.textContent = 'Up to date';
  });
}

function render(items) {
  list.replaceChildren(...items.map(({ id, name }) => {
    const row = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = name;
    const remove = document.createElement('button');
    remove.textContent = 'Delete';
    remove.addEventListener('click', () => {
      row.remove();
      track(fetch(`/api/items/${id}`, { method: 'DELETE' }));
    });
    row.append(label, remove);
    return row;
  }));
}

// paint the list shipped with the page right away, then refresh it from the server
render(JSON.parse(document.querySelector('#initial-items').textContent));
track(fetch('/api/items').then((response) => response.json()).then(render));
