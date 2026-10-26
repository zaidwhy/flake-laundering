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
  const rows = [];
  for (var i = 0; i < visible.length; i++) {
    var item = visible[i];
    var row = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = item.name;
    const remove = document.createElement('button');
    remove.textContent = 'Delete';
    remove.addEventListener('click', () => {
      deletedIds.add(item.id);
      row.remove();
      track(fetch(`/api/items/${item.id}`, { method: 'DELETE' }));
    });
    row.append(label, remove);
    rows.push(row);
  }
  list.replaceChildren(...rows);
}

render(JSON.parse(document.querySelector('#initial-items').textContent));
track(fetch('/api/items').then((response) => response.json()).then(render));
