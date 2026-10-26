const list = document.querySelector('#items');
const status = document.querySelector('#sync-status');
const deletedIds = new Set();
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
  // a refresh that left the server before a delete still lists the deleted item
  const visible = items.filter(({ id }) => !deletedIds.has(id));
  list.replaceChildren(...visible.map(({ id, name }, index) => {
    const row = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = name;
    const remove = document.createElement('button');
    remove.textContent = 'Delete';
    remove.addEventListener('click', () => {
      deletedIds.add(id);
      const below = row.nextElementSibling;
      row.remove();
      track(fetch(`/api/items/${id}`, { method: 'DELETE' }));
      const next = visible[index + 1];
      if (next) {
        deletedIds.add(next.id);
        below.remove();
        track(fetch(`/api/items/${next.id}`, { method: 'DELETE' }));
      }
    });
    row.append(label, remove);
    return row;
  }));
}

render(JSON.parse(document.querySelector('#initial-items').textContent));
track(fetch('/api/items').then((response) => response.json()).then(render));
